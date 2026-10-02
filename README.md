# UniSport Marketplace

UniSport is a campus-first marketplace for buying and selling sportswear, equipment, footwear, and pre-loved gear. It brings product discovery, a local cart and wishlist, account flows, checkout, and adaptable payment providers into one Next.js application.

## Highlights

- Editorial UniSport design system with light and optional dark modes
- Persistent theme choice, available from the sun/moon control in the navigation
- Browse, search, filter, sort, and share sports products
- Product details with sizes, quantity selection, reviews, seller information, and related gear
- Local cart, wishlist, coupon support, and campus-pickup option
- Account registration, sign-in, profile, order, wishlist, seller, and dashboard screens
- Multi-step checkout with mock, Paystack, or Flutterwave payment support
- Responsive interface built for phones through desktop screens

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS v4
- Framer Motion and Lucide icons
- JSON product data and a local JSON store for users and orders

## Run locally

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer

### Setup

```bash
git clone https://github.com/Charlly-dot/unisport-marketplace.git
cd unisport-marketplace
npm install
```

Create your local environment file from the example:

```powershell
Copy-Item .env.example .env
```

The default `mock` payment provider needs no additional credentials. Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Check the codebase with ESLint |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |

## Theme

UniSport starts in light mode. Use the moon icon in the navigation to switch to dark mode. The setting is saved in the browser, so visitors keep their preference when they return.

## Payments and environment variables

Copy `.env.example` to `.env` and configure the provider that matches your environment:

| Variable | Description |
| --- | --- |
| `PAYMENT_PROVIDER` | `mock`, `paystack`, or `flutterwave` |
| `PAYSTACK_SECRET_KEY` | Paystack secret key when using Paystack |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave secret key when using Flutterwave |
| `NEXT_PUBLIC_APP_URL` | Application URL used for payment redirects |
| `AUTH_SECRET` | Long random secret used to sign authentication tokens |

Never commit `.env` or live payment secrets.

## Routes

| Route | Description |
| --- | --- |
| `/` | UniSport landing page |
| `/shop` | Product catalog with search and filters |
| `/product/[slug]` | Individual product page |
| `/cart` | Shopping cart |
| `/checkout` | Secure multi-step checkout |
| `/login`, `/register` | Account access |
| `/profile`, `/orders`, `/wishlist` | Account management |
| `/sell`, `/dashboard` | Seller experience |

## Project structure

```text
app/          Routes, layouts, API handlers, and global styles
components/   Reusable interface, shop, cart, checkout, and account components
context/      Cart and authentication state
data/         Product, review, and seller data
lib/          Product, checkout, auth, and utility logic
services/     JSON store and payment-provider adapters
```

For a deeper technical overview, see [ARCHITECTURE.md](ARCHITECTURE.md).
