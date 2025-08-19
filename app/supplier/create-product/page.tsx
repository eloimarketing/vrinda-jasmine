import { Suspense } from 'react';
import StepByStepProductForm from '@/components/supplier/step-by-step-product-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Product</h1>
        <p className="text-gray-600">
          Add your products to our marketplace. Follow the steps to create your product listing.
        </p>
      </div>

      <Suspense fallback={<div>Loading form...</div>}>
        <StepByStepProductForm />
      </Suspense>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Provide clear, high-quality product images</li>
              <li>• Include accurate specifications and dimensions</li>
              <li>• Set competitive pricing</li>
              <li>• Write detailed descriptions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approval Process</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Products are reviewed within 24-48 hours</li>
              <li>• Admin approval required before listing</li>
              <li>• You&apos;ll be notified of approval status</li>
              <li>• Rejected products can be resubmitted</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories Available</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Barware & Tableware</li>
              <li>• Kitchen Accessories</li>
              <li>• Catering Supplies</li>
              <li>• Commercial Equipment</li>
              <li>• And many more...</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}