# Product Data

This folder contains all product data scraped from HomeRun collections.

## Structure

```
data/
├── collections/              # Individual collection JSON files
│   ├── plywood-mdf-hdhmr.json
│   ├── fevicol.json
│   ├── kitchen-systems-accessories.json
│   ├── hinges-channels-handles.json
│   ├── wardrobe-bed-fittings.json
│   ├── door-locks-hardware.json
│   └── general-hardware-tools.json
└── all-collections.json     # Consolidated file with all collections
```

## Collections

1. **Plywood, MDF & HDHMR** (`plywood-mdf-hdhmr.json`) - 11 products
2. **Fevicol** (`fevicol.json`) - 8 products
3. **Kitchen Systems & Accessories** (`kitchen-systems-accessories.json`) - 24 products
4. **Hinges, Channels & Handles** (`hinges-channels-handles.json`) - 23 products
5. **Wardrobe & Bed Fittings** (`wardrobe-bed-fittings.json`) - 21 products
6. **Door Locks & Hardware** (`door-locks-hardware.json`) - 15 products
7. **General Hardware & Tools** (`general-hardware-tools.json`) - 12 products

**Total: 114 products across 7 collections**

## JSON Format

Each collection file contains an array of products:

```json
[
  {
    "name": "Product Name",
    "slug": "product-slug",
    "imageUrl": "https://home-run.co/..."
  }
]
```

## Images

All product images are stored in:
- `public/scraped-images/[collection-name]/[product-slug].[ext]`

## Usage

### Individual Collection
```javascript
import collectionData from '@/data/collections/plywood-mdf-hdhmr.json';
```

### All Collections
```javascript
import allCollections from '@/data/all-collections.json';

// Access a collection
const plywood = allCollections.collections['plywood-mdf-hdhmr'];

// Get all products
const allProducts = Object.values(allCollections.collections)
  .flatMap(c => c.products);
```

## Last Updated

December 5, 2025

