# CHANGELOG

## 2026-07-14

### Fixed

- Resolved the root runtime crash caused by empty component files and malformed UTF-8 assets.
- Implemented a functioning `Navbar` and `Footer` for the app layout.
- Replaced empty home page component stubs with completed landing page sections.
- Added reusable UI primitives: `Button`, `Container`, `Card`, `Badge`, `Input`, and `Section`.
- Added a JSON mock product database and product loading utilities.

### Improvements

- Built a premium homepage with hero, category cards, featured products, trending section, benefits, and newsletter callout.
- Configured Next.js remote image handling and converted key image sections to `next/image` for optimized loading.
- Verified build and lint pass, and confirmed `npm run dev` serves the app successfully.
