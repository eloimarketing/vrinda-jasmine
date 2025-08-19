import { Suspense } from 'react';
import { prisma } from '@/lib/prisma/prisma';
import ProductCard from '@/components/product-card';
import ProductSearchFilters from '@/components/product-search-filters';
import { PRODUCT_CATEGORIES } from '@/utils/constant/product-categories';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    brand?: string;
    sortBy?: string;
  }>;
}

async function getProducts(searchParams: Awaited<ProductsPageProps['searchParams']>) {
  const { category, subcategory, search, minPrice, maxPrice, brand, sortBy } = searchParams;
  
  const where: any = { isApproved: true };
  
  if (category) {
    // Map category names to enum values
    const categoryMap: { [key: string]: string } = {
      'Refrigeration': 'REFRIGERATION',
      'Cooking Appliances': 'COOKING_APPLIANCES',
      'Appliances': 'APPLIANCES',
      'Kitchenware & Equipment': 'KITCHENWARE_EQUIPMENT',
      'Consumables': 'CONSUMABLES',
      'Kitchen Furniture': 'KITCHEN_FURNITURE',
      'Cleaning': 'CLEANING',
      'Graded Equipment': 'GRADED_EQUIPMENT',
      'Barware': 'BARWARE',
      'Tableware': 'TABLEWARE',
      'Kitchen Accessories': 'KITCHEN_ACCESSORIES',
      'Catering Supplies': 'CATERING_SUPPLIES',
    };
    
    where.category = categoryMap[category];
  }
  
  if (subcategory) {
    where.subcategory = subcategory;
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (brand) {
    where.brand = brand;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      where.price.gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      where.price.lte = parseFloat(maxPrice);
    }
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: 'desc' }; // default
  
  if (sortBy) {
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'price-low-high':
        orderBy = { price: 'asc' };
        break;
      case 'price-high-low':
        orderBy = { price: 'desc' };
        break;
      case 'name-a-z':
        orderBy = { name: 'asc' };
        break;
      case 'name-z-a':
        orderBy = { name: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      owner: {
        select: {
          firstName: true,
          lastName: true,
        }
      },
      attributes: true,
    },
    orderBy
  });

  return products;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);

  // Get category and subcategory names for display
  const categoryName = resolvedSearchParams.category || 'All Products';
  const subcategoryName = resolvedSearchParams.subcategory ? 
    PRODUCT_CATEGORIES
      .find(cat => cat.name === resolvedSearchParams.category)
      ?.subcategories.find(sub => sub.id === resolvedSearchParams.subcategory)?.name : 
    null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <ProductSearchFilters />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {subcategoryName || categoryName}
        </h1>
        {resolvedSearchParams.search && (
          <p className="text-gray-600">
            Search results for: &quot;{resolvedSearchParams.search}&quot;
          </p>
        )}
        <p className="text-gray-600">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">
            {resolvedSearchParams.search ? 'Try adjusting your search terms' : 'Check back later for new products'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Suspense fallback={<div>Loading products...</div>}>
            {products.map((product) => {
              // Convert attributes array to object for easier access
              const attributes = product.attributes.reduce((acc: any, attr: any) => {
                acc[attr.attributeName] = attr.attributeValue;
                return acc;
              }, {});

              return (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.productImage,
                    images: (product as any).images,
                    videos: (product as any).videos,
                    description: product.description,
                    brand: product.brand,
                    category: product.category,
                    attributes,
                    owner: product.owner,
                  }}
                />
              );
            })}
          </Suspense>
        </div>
      )}
    </div>
  );
} 