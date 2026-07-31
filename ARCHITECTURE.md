# UniSport Marketplace — Architecture

## Overview

A campus-first sports marketplace built with Next.js 16 (App Router), Tailwind CSS v4, and TypeScript. Features mock authentication, real-time cart/wishlist, multi-step checkout, a server-side API layer over a JSON file store, and pluggable payment providers (mock, Paystack, Flutterwave).

---

## Folder Structure

```
app/
  (marketing)/          # Public-facing pages (homepage)
  (shop)/               # Shopping experience (shop, cart, product, order-success)
  (account)/            # Authenticated pages (login, register, profile, orders, wishlist, sell, dashboard)
  (checkout)/           # Protected checkout flow
  api/
    auth/register       # POST — create user (validates .edu email, stores hashed password)
    auth/login          # POST — authenticate user, returns user + signed token
    orders/             # GET by email, POST create
    orders/[id]         # GET order detail
    payments/initialize # POST — provider.initialize (mock/paystack/flutterwave)
    payments/verify     # POST — provider.verify by reference
    products/           # GET all products
    products/[slug]     # GET single product
    health              # GET — runtime status + active payment provider
  layout.tsx            # Root layout (AuthProvider → CartProvider → Navbar → Footer → ToastProvider)
  globals.css           # Tailwind v4 CSS-first config

components/
  auth/                 # AuthGuard, LoginForm, RegisterForm
  cart/                 # CartDrawer, CartPage
  checkout/             # CheckoutPage, StepIndicator, CustomerDetailsStep, DeliveryStep, PaymentStep, ReviewStep, ConfirmationStep, CouponInput
  home/                 # Hero, FeaturedProducts, CategoryGrid, BenefitsSection, Newsletter
  layout/               # Navbar, Footer, UserMenu, ToastProvider
  product/              # ProductPageClient, ImageGallery, SizeSelector, QuantitySelector, RelatedProducts
  reviews/              # ReviewCard
  seller/               # SellerCard
  shop/                 # ShopPage, ProductCard, ProductGrid, FilterSidebar, SearchFilters, SortDropdown, ActiveFilters, ShopStates
  ui/                   # Button, Card, Badge, Container, Input (shared primitives)

context/
  AuthContext.tsx        # Auth state (useSyncExternalStore + localStorage)
  CartContext.tsx        # Cart state (useSyncExternalStore + localStorage)

hooks/
  useShopFilters.ts     # URL-synced filter/sort state for shop page
  useWishlist.ts        # Wishlist state (useSyncExternalStore + localStorage)

lib/
  auth/config.ts        # Approved university domains, campus/faculty/level constants
  auth/password.ts      # Salted SHA-256 password hashing helpers (node crypto)
  checkout/coupons.ts   # Coupon definitions, validation, discount calculation
  checkout/types.ts     # Checkout step types, delivery/payment types, constants
  orders/api.ts         # Client fetch helpers for /api/orders + /api/payments
  orders/mock.ts        # Mock order generation and persistence
  products/index.ts     # Product data, search, filter, sort, formatPrice
  reviews/index.ts      # Review and seller data access
  utils/index.ts        # cn() utility for className merging

services/
  store/
    db.ts               # JSON file store (reads/writes data/store/<name>.json)
    users.ts            # User CRUD + auth over JSON store
    orders.ts           # Order create/list/get/update over JSON store
    products.ts         # Product reads from data/products.json
  payments/
    types.ts            # PaymentProvider contract (initialize/verify)
    index.ts            # Provider factory via PAYMENT_PROVIDER env + reference generator
    mock.ts             # No-op "always success" provider
    paystack.ts         # Paystack transaction/initialize + verify adapter
    flutterwave.ts      # Flutterwave v3 payments + verify_by_reference adapter

types/
  product.ts            # Product, CartItem, CartTotals, WishlistItem, Seller, Review
  user.ts               # User, Order, OrderStatus

data/
  products.json         # 20 products with images, features, sizes
  reviews.json          # 12 mock student reviews
  sellers.json          # 14 mock seller profiles
  store/                # Runtime JSON store: users.json, orders.json (auto-created)

constants/              # (Available for future shared constants)
providers/              # (Available for future provider components)
```

---

## State Management

### Cart (`context/CartContext.tsx`)
- Uses `useSyncExternalStore` with module-level cached snapshots to avoid SSR infinite loops
- Persists to `localStorage` under `unisport-cart`
- Provides: `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`, `applyCoupon`, `removeCoupon`, `openDrawer`, `closeDrawer`
- Computed: `totals` (subtotal, shipping, tax, discount, grandTotal), `itemCount`

### Wishlist (`hooks/useWishlist.ts`)
- Same `useSyncExternalStore` pattern as Cart
- Persists to `localStorage` under `unisport-wishlist`
- Provides: `toggleWishlist`, `isWishlisted`, `count`

### Auth (`context/AuthContext.tsx`)
- Same `useSyncExternalStore` pattern
- Persists current user to `unisport-auth-user`, all users to `unisport-auth-users`
- Provides: `login`, `register`, `logout`, `updateProfile`, `isAuthenticated`, `currentUser`
- University email validation via `lib/auth/config.ts`

### Shop Filters (`hooks/useShopFilters.ts`)
- URL query param sync (`?q=`, `?sport=`, `?brand=`, `?condition=`, `?size=`, `?pickup=1`, `?sort=`, `?maxPrice=`)
- Uses `useState` + `useEffect` to bidirectionally sync state with URL
- Filtered URLs are shareable and bookmarkable

---

## Routing

Route groups organize features without affecting URLs:

| Route Group | URL Paths | Purpose |
|------------|-----------|---------|
| `(marketing)` | `/` | Public landing page |
| `(shop)` | `/shop`, `/cart`, `/product/[slug]`, `/checkout`, `/order-success` | Shopping experience |
| `(account)` | `/login`, `/register`, `/forgot-password`, `/profile`, `/orders`, `/wishlist`, `/sell`, `/dashboard` | User accounts |
| `(checkout)` | `/checkout` | Protected checkout |

---

## Data Flow

### Client state (localStorage)
```
User Action → Component → Context/Hook → localStorage → useSyncExternalStore → Re-render
```

1. User interacts with UI (add to cart, toggle wishlist, etc.)
2. Component calls context function (e.g., `addToCart`)
3. Context updates localStorage and emits change notification
4. `useSyncExternalStore` detects change, triggers re-render
5. All subscribed components receive updated state

### Server API layer (JSON file store)
```
Client (lib/orders/api.ts) → Route Handler (app/api) → Service (services/store) → data/store/*.json
```

1. Checkout calls `POST /api/payments/initialize` to start a payment session
2. Mock provider returns immediately; Paystack/Flutterwave return a `redirectUrl` the user is sent to
3. On return (`/checkout?verify=<reference>`), the page calls `POST /api/payments/verify`
4. `POST /api/orders` validates products from `data/products.json`, recomputes shipping/tax/discount server-side, and persists the order to `data/store/orders.json`

### Payment providers

Configured via environment variables (see `.env.example`):

| Env | Purpose |
|-----|---------|
| `PAYMENT_PROVIDER` | `mock` (default), `paystack`, or `flutterwave` |
| `PAYSTACK_SECRET_KEY` | Paystack secret key |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave secret key |
| `NEXT_PUBLIC_APP_URL` | Base URL used for payment redirects |
| `AUTH_SECRET` | Secret used to sign login tokens |

- Users/orders persist to JSON files under `data/store/` (auto-created on first write)
- Passwords are salted + hashed (`lib/auth/password.ts`) — never stored in plaintext
- The provider is resolved once by `services/payments/index.ts` and exposed by `/api/health`

---

## Key Patterns

- **`"use client"` directive**: All components using hooks/state/browser APIs
- **Module-level cached references**: Avoids `useSyncExternalStore` SSR infinite loops
- **URL as state**: Shop filters sync bidirectionally with URL params
- **Route groups**: Feature-based organization without URL changes
- **`@/` path alias**: All imports use `@/` alias for clean, absolute imports
- **Zod validation**: Form validation with Zod schemas (available via `react-hook-form`)
- **Framer Motion**: Animations for page transitions, product grids, cart drawer
- **react-hot-toast**: Global notification system via `ToastProvider`
