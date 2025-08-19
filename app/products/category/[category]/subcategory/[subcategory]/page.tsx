import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma/prisma';
import ProductCard from '@/components/product-card';
import { PRODUCT_CATEGORIES } from '@/utils/constant/product-categories';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

interface SubcategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
  searchParams: Promise<{
    search?: string;
  }>;
}

async function getProductsBySubcategory(category: string, subcategory: string, search?: string) {
  // Map category names to enum values
  const categoryMap: { [key: string]: string } = {
    'refrigeration': 'REFRIGERATION',
    'cooking-appliances': 'COOKING_APPLIANCES',
    'appliances': 'APPLIANCES',
    'kitchenware-equipment': 'KITCHENWARE_EQUIPMENT',
    'consumables': 'CONSUMABLES',
    'kitchen-furniture': 'KITCHEN_FURNITURE',
    'cleaning': 'CLEANING',
    'graded-equipment': 'GRADED_EQUIPMENT',
    'barware': 'BARWARE',
    'tableware': 'TABLEWARE',
    'kitchen-accessories': 'KITCHEN_ACCESSORIES',
    'catering-supplies': 'CATERING_SUPPLIES',
  };
  
  const categoryEnum = categoryMap[category];
  if (!categoryEnum) {
    return null;
  }

  const where: any = { 
    isApproved: true,
    category: categoryEnum,
    subcategory: subcategory
  };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
    ];
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
    orderBy: {
      createdAt: 'desc'
    }
  });

  return products;
}

function formatCategoryName(categorySlug: string): string {
  const categoryMap: { [key: string]: string } = {
    'refrigeration': 'Refrigeration',
    'cooking-appliances': 'Cooking Appliances',
    'appliances': 'Appliances',
    'kitchenware-equipment': 'Kitchenware & Equipment',
    'consumables': 'Consumables',
    'kitchen-furniture': 'Kitchen Furniture',
    'cleaning': 'Cleaning',
    'graded-equipment': 'Graded Equipment',
    'barware': 'Barware',
    'tableware': 'Tableware',
    'kitchen-accessories': 'Kitchen Accessories',
    'catering-supplies': 'Catering Supplies',
  };
  
  return categoryMap[categorySlug] || categorySlug;
}

function formatSubcategoryName(subcategorySlug: string): string {
  // Convert slug to readable name (e.g., "wine-glasses" -> "Wine Glasses")
  return subcategorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const { category, subcategory } = await params;
  const { search } = await searchParams;
  
  const products = await getProductsBySubcategory(category, subcategory, search);
  
  if (products === null) {
    notFound();
  }

  const categoryName = formatCategoryName(category);
  const subcategoryName = formatSubcategoryName(subcategory);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href={`/products/category/${category}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to {categoryName}
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {subcategoryName}
        </h1>
        {search && (
          <p className="text-gray-600">
            Search results for: &quot;{search}&quot;
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
            {search ? 'Try adjusting your search terms' : 'Check back later for new products'}
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