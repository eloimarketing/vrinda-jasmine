import { Suspense } from 'react';
import { prisma } from '@/lib/prisma/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PRODUCT_CATEGORIES } from '@/utils/constant/product-categories';
import ApprovalActions from '@/components/admin/approval-actions';

async function getPendingProducts() {
  return await prisma.product.findMany({
    where: { isApproved: false },
    include: {
      owner: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        }
      },
      attributes: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

async function getApprovedProducts() {
  return await prisma.product.findMany({
    where: { isApproved: true },
    include: {
      owner: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        }
      },
      attributes: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 20 // Limit to recent 20
  });
}

export default async function AdminProductsPage() {
  const [pendingProducts, approvedProducts] = await Promise.all([
    getPendingProducts(),
    getApprovedProducts()
  ]);

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'REFRIGERATION': 'Refrigeration',
      'COOKING_APPLIANCES': 'Cooking Appliances',
      'APPLIANCES': 'Appliances',
      'KITCHENWARE_EQUIPMENT': 'Kitchenware & Equipment',
      'CONSUMABLES': 'Consumables',
      'KITCHEN_FURNITURE': 'Kitchen Furniture',
      'CLEANING': 'Cleaning',
      'GRADED_EQUIPMENT': 'Graded Equipment',
      'BARWARE': 'Barware',
      'TABLEWARE': 'Tableware',
      'KITCHEN_ACCESSORIES': 'Kitchen Accessories',
      'CATERING_SUPPLIES': 'Catering Supplies',
    };
    return categoryMap[category] || category;
  };

  const getSubcategoryDisplayName = (category: string, subcategory: string) => {
    const categoryObj = PRODUCT_CATEGORIES.find(cat => cat.name === getCategoryDisplayName(category));
    return categoryObj?.subcategories.find(sub => sub.name === subcategory)?.name || subcategory;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Management</h1>
        <p className="text-gray-600">
          Manage and approve products from suppliers
        </p>
      </div>

      {/* Pending Products */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Pending Approval
            <Badge variant="secondary">{pendingProducts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingProducts.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No products pending approval</p>
          ) : (
            <div className="space-y-4">
              {pendingProducts.map((product) => {
                const attributes = product.attributes.reduce((acc: any, attr: any) => {
                  acc[attr.attributeName] = attr.attributeValue;
                  return acc;
                }, {});

                return (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge variant="outline">
                            {getCategoryDisplayName(product.category)}
                          </Badge>
                          {product.subcategory && (
                            <Badge variant="outline">
                              {getSubcategoryDisplayName(product.category, product.subcategory)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{product.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Brand:</span> {product.brand}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> £{product.price}
                          </div>
                          <div>
                            <span className="font-medium">Supplier:</span> {product.owner.firstName} {product.owner.lastName}
                          </div>
                          <div>
                            <span className="font-medium">Submitted:</span> {new Date(product.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {Object.keys(attributes).length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium text-sm">Specifications:</span>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1 text-sm text-gray-600">
                              {Object.entries(attributes).slice(0, 6).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span> {String(value)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <ApprovalActions productId={product.id} category={product.category} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recently Approved Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Approved</CardTitle>
        </CardHeader>
        <CardContent>
          {approvedProducts.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No approved products yet</p>
          ) : (
            <div className="space-y-4">
              {approvedProducts.map((product) => {
                const attributes = product.attributes.reduce((acc: any, attr: any) => {
                  acc[attr.attributeName] = attr.attributeValue;
                  return acc;
                }, {});

                return (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge variant="outline">
                            {getCategoryDisplayName(product.category)}
                          </Badge>
                          {product.subcategory && (
                            <Badge variant="outline">
                              {getSubcategoryDisplayName(product.category, product.subcategory)}
                            </Badge>
                          )}
                          <Badge variant="default">Approved</Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{product.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Brand:</span> {product.brand}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> £{product.price}
                          </div>
                          <div>
                            <span className="font-medium">Supplier:</span> {product.owner.firstName} {product.owner.lastName}
                          </div>
                          <div>
                            <span className="font-medium">Approved:</span> {product.approvedAt ? new Date(product.approvedAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 