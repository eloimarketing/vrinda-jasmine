# Implementation Guide: Adding Barware & Tableware to Vrinda Jasmine

## Quick Start Implementation

### 1. Database Schema Updates

#### Option A: Add New Tables (Recommended for Quick Start)

```sql
-- Add to your existing Prisma schema
model Barware {
  id              String   @id @default(cuid())
  productName     String
  brand           String
  material        String
  capacity        String
  type            String
  finish          String?
  dishwasherSafe  Boolean
  dimensions      String
  weight          String?
  price           Float
  productImage    String
  description     String
  ownerId         String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  isApproved      Boolean  @default(false)
  approvedAt      DateTime?
  approvedBy      String?

  owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  @@map("Barware")
}

model Tableware {
  id              String   @id @default(cuid())
  productName     String
  brand           String
  material        String
  patternDesign   String?
  size            String
  piecesInSet     Int?
  microwaveSafe   Boolean
  dishwasherSafe  Boolean
  dimensions      String
  price           Float
  productImage    String
  description     String
  ownerId         String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  isApproved      Boolean  @default(false)
  approvedAt      DateTime?
  approvedBy      String?

  owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  @@map("Tableware")
}

model KitchenAccessories {
  id              String   @id @default(cuid())
  productName     String
  brand           String
  material        String
  type            String
  heatResistance  String?
  nonStickSafe    Boolean
  dishwasherSafe  Boolean
  piecesInSet     Int?
  dimensions      String
  storageType     String?
  price           Float
  productImage    String
  description     String
  ownerId         String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  isApproved      Boolean  @default(false)
  approvedAt      DateTime?
  approvedBy      String?

  owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  @@map("KitchenAccessories")
}

model CateringSupplies {
  id              String   @id @default(cuid())
  productName     String
  brand           String
  material        String
  capacity        String
  quantityPerPack Int
  disposable      Boolean
  compostable     Boolean?
  temperatureRating String?
  dimensions      String
  price           Float
  productImage    String
  description     String
  ownerId         String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  isApproved      Boolean  @default(false)
  approvedAt      DateTime?
  approvedBy      String?

  owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  @@map("CateringSupplies")
}
```

### 2. Update Product Categories Configuration

```typescript
// utils/constant/product-categories.ts
export const PRODUCT_CATEGORIES = [
  // ... existing categories ...
  {
    name: 'Barware',
    subcategories: [
      { 
        id: 'shakers-strainers',
        name: 'Shakers & Strainers', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'jiggers-measures',
        name: 'Jiggers & Measures', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'muddlers-tools',
        name: 'Muddlers & Tools', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'ice-tools',
        name: 'Ice Tools', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Finish', 'Dishwasher Safe', 'Dimensions', 'Weight', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Tableware',
    subcategories: [
      { 
        id: 'plates-bowls',
        name: 'Plates & Bowls', 
        formFields: ['Product Name', 'Brand', 'Material', 'Pattern/Design', 'Size', 'Pieces in Set', 'Microwave Safe', 'Dishwasher Safe', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'cutlery',
        name: 'Cutlery', 
        formFields: ['Product Name', 'Brand', 'Material', 'Pattern/Design', 'Type', 'Pieces in Set', 'Dishwasher Safe', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'glassware',
        name: 'Glassware', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Type', 'Dishwasher Safe', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'serving-ware',
        name: 'Serving Ware', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Capacity', 'Microwave Safe', 'Dishwasher Safe', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Kitchen Accessories',
    subcategories: [
      { 
        id: 'utensils',
        name: 'Utensils', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Heat Resistance', 'Non-Stick Safe', 'Dishwasher Safe', 'Pieces in Set', 'Dimensions', 'Storage Type', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'storage',
        name: 'Storage', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Capacity', 'Microwave Safe', 'Dishwasher Safe', 'Dimensions', 'Storage Type', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'gadgets',
        name: 'Gadgets', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Power Supply', 'Features', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
  {
    name: 'Catering Supplies',
    subcategories: [
      { 
        id: 'disposables',
        name: 'Disposables', 
        formFields: ['Product Name', 'Brand', 'Material', 'Capacity', 'Quantity per Pack', 'Disposable', 'Compostable', 'Temperature Rating', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
      { 
        id: 'serving-equipment',
        name: 'Serving Equipment', 
        formFields: ['Product Name', 'Brand', 'Material', 'Type', 'Capacity', 'Dishwasher Safe', 'Dimensions', 'Price', 'Product Image', 'Description'] 
      },
    ]
  },
];
```

### 3. Create API Routes

```typescript
// app/api/supplier/barware/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await request.formData();
    
    const barwareData = {
      productName: formData.get('productName') as string,
      brand: formData.get('brand') as string,
      material: formData.get('material') as string,
      capacity: formData.get('capacity') as string,
      type: formData.get('type') as string,
      finish: formData.get('finish') as string || null,
      dishwasherSafe: formData.get('dishwasherSafe') === 'true',
      dimensions: formData.get('dimensions') as string,
      weight: formData.get('weight') as string || null,
      price: parseFloat(formData.get('price') as string),
      productImage: formData.get('productImage') as string,
      description: formData.get('description') as string,
      ownerId: user.id,
    };

    const barware = await prisma.barware.create({
      data: barwareData
    });

    return NextResponse.json({
      message: 'Barware product created successfully',
      product: barware
    });

  } catch (error) {
    console.error('Error creating barware product:', error);
    return NextResponse.json(
      { error: 'Failed to create barware product' },
      { status: 500 }
    );
  }
}
```

### 4. Create Product Forms

```typescript
// components/supplier/barware-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function BarwareForm() {
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    material: '',
    capacity: '',
    type: '',
    finish: '',
    dishwasherSafe: false,
    dimensions: '',
    weight: '',
    price: '',
    description: '',
    productImage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value.toString());
    });

    try {
      const response = await fetch('/api/supplier/barware/create', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Product created successfully!');
        // Reset form or redirect
      } else {
        alert('Failed to create product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            value={formData.productName}
            onChange={(e) => setFormData({...formData, productName: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="material">Material</Label>
          <Select onValueChange={(value) => setFormData({...formData, material: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
              <SelectItem value="Glass">Glass</SelectItem>
              <SelectItem value="Copper">Copper</SelectItem>
              <SelectItem value="Plastic">Plastic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
            placeholder="e.g., 750ml"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Select onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Shaker">Shaker</SelectItem>
              <SelectItem value="Strainer">Strainer</SelectItem>
              <SelectItem value="Jigger">Jigger</SelectItem>
              <SelectItem value="Muddler">Muddler</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="finish">Finish (Optional)</Label>
          <Input
            id="finish"
            value={formData.finish}
            onChange={(e) => setFormData({...formData, finish: e.target.value})}
            placeholder="e.g., Polished, Brushed"
          />
        </div>

        <div>
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={formData.dimensions}
            onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
            placeholder="e.g., H: 20cm, D: 8cm"
            required
          />
        </div>

        <div>
          <Label htmlFor="weight">Weight (Optional)</Label>
          <Input
            id="weight"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
            placeholder="e.g., 250g"
          />
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="productImage">Product Image URL</Label>
          <Input
            id="productImage"
            value={formData.productImage}
            onChange={(e) => setFormData({...formData, productImage: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="dishwasherSafe"
          checked={formData.dishwasherSafe}
          onCheckedChange={(checked) => setFormData({...formData, dishwasherSafe: checked as boolean})}
        />
        <Label htmlFor="dishwasherSafe">Dishwasher Safe</Label>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Create Barware Product
      </Button>
    </form>
  );
}
```

### 5. Update Navigation

```typescript
// components/navbar.tsx - Add new categories to navigation
const navigationItems = [
  // ... existing items ...
  {
    name: 'Barware',
    href: '/products/barware',
    subcategories: [
      { name: 'Shakers & Strainers', href: '/products/barware/shakers-strainers' },
      { name: 'Jiggers & Measures', href: '/products/barware/jiggers-measures' },
      { name: 'Muddlers & Tools', href: '/products/barware/muddlers-tools' },
      { name: 'Ice Tools', href: '/products/barware/ice-tools' },
    ]
  },
  {
    name: 'Tableware',
    href: '/products/tableware',
    subcategories: [
      { name: 'Plates & Bowls', href: '/products/tableware/plates-bowls' },
      { name: 'Cutlery', href: '/products/tableware/cutlery' },
      { name: 'Glassware', href: '/products/tableware/glassware' },
      { name: 'Serving Ware', href: '/products/tableware/serving-ware' },
    ]
  },
  // ... other categories
];
```

### 6. Create Product Listing Pages

```typescript
// app/products/barware/page.tsx
import { prisma } from '@/lib/prisma/prisma';
import ProductCard from '@/components/product-card';

export default async function BarwarePage() {
  const barwareProducts = await prisma.barware.findMany({
    where: { isApproved: true },
    include: { owner: true }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Barware</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {barwareProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.productName,
              price: product.price,
              image: product.productImage,
              description: product.description,
              brand: product.brand,
              category: 'barware'
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### 7. Enhanced Search & Filter Component

```typescript
// components/search-filter.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface SearchFilterProps {
  onFilterChange: (filters: any) => void;
  categories: string[];
}

export default function SearchFilter({ onFilterChange, categories }: SearchFilterProps) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    material: '',
    priceRange: [0, 1000],
    dishwasherSafe: false,
    brand: ''
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold">Search & Filter</h3>
      
      <div>
        <Input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange('material', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
            <SelectItem value="Glass">Glass</SelectItem>
            <SelectItem value="Porcelain">Porcelain</SelectItem>
            <SelectItem value="Silicone">Silicone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Price Range</label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => handleFilterChange('priceRange', value)}
          max={1000}
          step={10}
          className="mt-2"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>£{filters.priceRange[0]}</span>
          <span>£{filters.priceRange[1]}</span>
        </div>
      </div>

      <Button 
        onClick={() => setFilters({
          search: '',
          category: '',
          material: '',
          priceRange: [0, 1000],
          dishwasherSafe: false,
          brand: ''
        })}
        variant="outline"
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  );
}
```

## Deployment Checklist

1. **Database Migration**
   ```bash
   npx prisma migrate dev --name add_barware_tableware
   npx prisma generate
   ```

2. **Environment Variables**
   - Ensure all database connections are configured
   - Set up image upload service (if using external storage)

3. **Testing**
   - Test product creation forms
   - Test search and filter functionality
   - Test admin approval workflow

4. **SEO Optimization**
   - Add meta tags for new category pages
   - Implement structured data for products
   - Create sitemap for new categories

This implementation guide provides a complete roadmap for adding barware and tableware categories to your existing Vrinda Jasmine platform, leveraging your current architecture while expanding into new market segments.