# Unused/Extra Items List

## Pages/Routes (Potentially Unused)

1. **`/app/calculators/page.jsx`**
   - Status: Not linked in navigation anymore
   - Reason: Calculators tab removed from header, calculators moved to collections
   - Action: Can be deleted or kept as fallback route

2. **`/app/collections/page.jsx`**
   - Status: Still accessible but collections now shown on home page
   - Reason: Separate collections page exists, but collections are on homepage
   - Note: Still linked from various places (hero CTAs, product pages)
   - Action: Consider keeping for direct URL access, or remove if not needed

## Empty Folders

3. **`/public/assets/cards/`** - Empty folder
4. **`/public/assets/images/`** - Only contains README.md
5. **`/public/assets/videos/`** - Only contains README.md

## Brand References (Need Update)

6. **"Stara" references** (old project name):
   - `app/dealer-locator/page.jsx` - metadata mentions "Stara"
   - `app/faq/page.jsx` - metadata mentions "Stara"
   - `components/ValueProps.jsx` - mentions "Stara door" and "Stara began"
   - `data/dealers.json` - dealer names mention "Stara Depot", "Stara Home", etc.

## Unused Assets (Need Verification)

7. **Stara Logo Files**:
   - `/public/assets/Stara Logo Transparent.png`
   - `/public/assets/Stara Logo White.png`
   - Status: Should be replaced with Shiv Hardware logos

8. **`/public/assets/og-stara.jpg`**
   - Status: OpenGraph image, might need updating for Shiv Hardware branding

## Documentation Files (Potentially Outdated)

9. **Various .md files** that reference old project:
   - `ASSET_USAGE.md` - mentions Stara assets
   - `PROJECT_MAP.md` - titled "Stara Site"
   - `IMPLEMENTATION_SUMMARY.md` - mentions Stara
   - `SHOPIFY_VS_CUSTOM.md` - references Stara design
   - `CUSTOM_ECOMMERCE_ROADMAP.md` - references Stara

## Scraping Folder (Archive)

10. **`/scraping/` folder** - Contains all scraping scripts and data
    - Status: Likely not needed for production
    - Note: User requested to keep this organized

## Unused Imports/Variables

11. **`useRouter` in Header.jsx** - Currently used but could be optimized
    - Status: Actually being used for navigation, keep it

## Summary

**Can be safely removed:**
- Empty folders: `/public/assets/cards/`, `/public/assets/images/`, `/public/assets/videos/` (if not needed)
- `/app/calculators/page.jsx` (if not needed as fallback)

**Should be updated:**
- All "Stara" references → "Shiv Hardware Store"
- Stara logo files → Shiv Hardware logos
- Documentation files to reflect Shiv Hardware branding

**Keep but verify:**
- `/app/collections/page.jsx` - Still linked from multiple places
- Scraping folder - User may want to keep for reference

