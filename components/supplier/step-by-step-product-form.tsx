'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRODUCT_CATEGORIES } from '@/utils/constant/product-categories';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MultipleMediaUpload from '@/components/ui/multiple-media-upload';

interface FormData {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  description: string;
  productImage: string;
  productVideo?: string;
  mediaType?: 'image' | 'video';
  images: string[];
  videos: string[];
  [key: string]: string | boolean | number | undefined | string[];
}

type Step = 'category' | 'subcategory' | 'form';

export default function StepByStepProductForm() {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    price: '',
    description: '',
    productImage: '',
    productVideo: '',
    mediaType: 'image',
    images: [],
    videos: [],
  });

  // Update form fields when subcategory is selected
  useEffect(() => {
    if (selectedSubcategory) {
      const newFormData = { ...formData };
      selectedSubcategory.formFields.forEach((field: string) => {
        if (!(field in newFormData)) {
          newFormData[field] = '';
        }
      });
      setFormData(newFormData);
    }
  }, [selectedSubcategory]);

  const handleCategorySelect = (categoryName: string) => {
    const category = PRODUCT_CATEGORIES.find(cat => cat.name === categoryName);
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, category: categoryName }));
    setCurrentStep('subcategory');
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    const subcategory = selectedCategory.subcategories.find((sub: any) => sub.id === subcategoryId);
    setSelectedSubcategory(subcategory);
    setFormData(prev => ({ ...prev, subcategory: subcategoryId }));
    setCurrentStep('form');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: urls,
      productImage: urls[0] || '', // Keep legacy field for backward compatibility
    }));
  };

  const handleVideosChange = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      videos: urls,
      productVideo: urls[0] || '', // Keep legacy field for backward compatibility
    }));
  };

  const handleBack = () => {
    if (currentStep === 'form') {
      setCurrentStep('subcategory');
      setSelectedSubcategory(null);
      setFormData(prev => ({ ...prev, subcategory: '' }));
    } else if (currentStep === 'subcategory') {
      setCurrentStep('category');
      setSelectedCategory(null);
      setFormData(prev => ({ ...prev, category: '', subcategory: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      alert('Please log in to create a product');
      return;
    }
    
    // Validate required fields
    if (!formData.name || !formData.price || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate media upload
    if (formData.images.length === 0 && formData.videos.length === 0) {
      alert('Please upload at least one product image or video');
      return;
    }
    
    const formDataToSend = new FormData();
    
    // Add basic fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('subcategory', formData.subcategory);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('description', formData.description);
    
    // Add multiple media fields
    formData.images.forEach((imageUrl, index) => {
      formDataToSend.append('images', imageUrl);
    });
    
    formData.videos.forEach((videoUrl, index) => {
      formDataToSend.append('videos', videoUrl);
    });
    
    // Add legacy media fields for backward compatibility
    if (formData.images.length > 0) {
      formDataToSend.append('productImage', formData.images[0]);
    }
    if (formData.videos.length > 0) {
      formDataToSend.append('productVideo', formData.videos[0]);
    }

    // Add dynamic attributes
    const attributes: { [key: string]: any } = {};
    selectedSubcategory?.formFields.forEach((field: string) => {
      if (formData[field] !== undefined && formData[field] !== '') {
        attributes[field] = formData[field];
      }
    });
    formDataToSend.append('attributes', JSON.stringify(attributes));

    // Debug: Log form data and session
    console.log('Session status:', status);
    console.log('Session data:', session);
    console.log('Submitting form data:', {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      subcategory: formData.subcategory,
      price: formData.price,
      description: formData.description,
      images: formData.images,
      videos: formData.videos,
      productImage: formData.productImage,
      productVideo: formData.productVideo,
      attributes
    });

    try {
      const response = await fetch('/api/products/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (response.ok) {
        alert('Product created successfully!');
        // Reset form
        setFormData({
          name: '',
          brand: '',
          category: '',
          subcategory: '',
          price: '',
          description: '',
          productImage: '',
          productVideo: '',
          mediaType: 'image',
          images: [],
          videos: [],
        });
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setCurrentStep('category');
      } else {
        alert(`Failed to create product: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating product. Please check the console for details.');
    }
  };

  const renderField = (fieldName: string) => {
    const value = formData[fieldName] || '';

    // Handle different field types
    if (fieldName.toLowerCase().includes('safe') || fieldName.toLowerCase().includes('disposable') || fieldName.toLowerCase().includes('compostable')) {
      return (
        <div key={fieldName} className="flex items-center space-x-2">
          <Checkbox
            id={fieldName}
            checked={value === true || value === 'true'}
            onCheckedChange={(checked) => handleInputChange(fieldName, checked as boolean)}
          />
          <Label htmlFor={fieldName}>{fieldName}</Label>
        </div>
      );
    }

    if (fieldName.toLowerCase().includes('material')) {
      return (
        <div key={fieldName}>
          <Label htmlFor={fieldName}>{fieldName}</Label>
          <Select onValueChange={(value) => handleInputChange(fieldName, value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${fieldName.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {/* Barware Materials */}
              {formData.category === 'Barware' && (
                <>
                  <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                  <SelectItem value="Glass">Glass</SelectItem>
                  <SelectItem value="Copper">Copper</SelectItem>
                  <SelectItem value="Plastic">Plastic</SelectItem>
                  <SelectItem value="Wood">Wood</SelectItem>
                  <SelectItem value="Silicone">Silicone</SelectItem>
                  <SelectItem value="Aluminum">Aluminum</SelectItem>
                  <SelectItem value="Brass">Brass</SelectItem>
                  <SelectItem value="Ceramic">Ceramic</SelectItem>
                  <SelectItem value="Bamboo">Bamboo</SelectItem>
                </>
              )}
              {/* Tableware Materials */}
              {formData.category === 'Tableware' && (
                <>
                  <SelectItem value="Porcelain">Porcelain</SelectItem>
                  <SelectItem value="Bone China">Bone China</SelectItem>
                  <SelectItem value="Stoneware">Stoneware</SelectItem>
                  <SelectItem value="Glass">Glass</SelectItem>
                  <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                  <SelectItem value="Melamine">Melamine</SelectItem>
                  <SelectItem value="Ceramic">Ceramic</SelectItem>
                  <SelectItem value="Plastic">Plastic</SelectItem>
                </>
              )}
              {/* Kitchen Accessories Materials */}
              {formData.category === 'Kitchen Accessories' && (
                <>
                  <SelectItem value="Silicone">Silicone</SelectItem>
                  <SelectItem value="Wood">Wood</SelectItem>
                  <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                  <SelectItem value="Plastic">Plastic</SelectItem>
                  <SelectItem value="Glass">Glass</SelectItem>
                  <SelectItem value="Aluminum">Aluminum</SelectItem>
                  <SelectItem value="Bamboo">Bamboo</SelectItem>
                </>
              )}
              {/* Catering Supplies Materials */}
              {formData.category === 'Catering Supplies' && (
                <>
                  <SelectItem value="Plastic">Plastic</SelectItem>
                  <SelectItem value="Paper">Paper</SelectItem>
                  <SelectItem value="Bamboo">Bamboo</SelectItem>
                  <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                  <SelectItem value="Aluminum">Aluminum</SelectItem>
                  <SelectItem value="Glass">Glass</SelectItem>
                  <SelectItem value="Cardboard">Cardboard</SelectItem>
                </>
              )}
              {/* Default Materials for other categories */}
              {!['Barware', 'Tableware', 'Kitchen Accessories', 'Catering Supplies'].includes(formData.category) && (
                <>
                  <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                  <SelectItem value="Plastic">Plastic</SelectItem>
                  <SelectItem value="Glass">Glass</SelectItem>
                  <SelectItem value="Metal">Metal</SelectItem>
                  <SelectItem value="Wood">Wood</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (fieldName.toLowerCase().includes('type')) {
      return (
        <div key={fieldName}>
          <Label htmlFor={fieldName}>{fieldName}</Label>
          <Select onValueChange={(value) => handleInputChange(fieldName, value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${fieldName.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {/* Barware Types */}
              {formData.category === 'Barware' && (
                <>
                  <SelectItem value="Shaker">Shaker</SelectItem>
                  <SelectItem value="Strainer">Strainer</SelectItem>
                  <SelectItem value="Jigger">Jigger</SelectItem>
                  <SelectItem value="Muddler">Muddler</SelectItem>
                  <SelectItem value="Spoon">Spoon</SelectItem>
                  <SelectItem value="Measure">Measure</SelectItem>
                  <SelectItem value="Opener">Opener</SelectItem>
                  <SelectItem value="Pourer">Pourer</SelectItem>
                  <SelectItem value="Mixing Glass">Mixing Glass</SelectItem>
                  <SelectItem value="Bottle">Bottle</SelectItem>
                  <SelectItem value="Crusher">Crusher</SelectItem>
                  <SelectItem value="Tray">Tray</SelectItem>
                  <SelectItem value="Mat">Mat</SelectItem>
                  <SelectItem value="Caddy">Caddy</SelectItem>
                  <SelectItem value="Dispenser">Dispenser</SelectItem>
                  <SelectItem value="Bucket">Bucket</SelectItem>
                  <SelectItem value="Corkscrew">Corkscrew</SelectItem>
                  <SelectItem value="Sealer">Sealer</SelectItem>
                  <SelectItem value="Hanger">Hanger</SelectItem>
                  <SelectItem value="Game">Game</SelectItem>
                  <SelectItem value="Gift Set">Gift Set</SelectItem>
                  <SelectItem value="Cleaning Tool">Cleaning Tool</SelectItem>
                </>
              )}
              {/* Tableware Types */}
              {formData.category === 'Tableware' && (
                <>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                  <SelectItem value="Side">Side</SelectItem>
                  <SelectItem value="Dessert">Dessert</SelectItem>
                  <SelectItem value="Soup">Soup</SelectItem>
                  <SelectItem value="Salad">Salad</SelectItem>
                  <SelectItem value="Bread">Bread</SelectItem>
                  <SelectItem value="Cup">Cup</SelectItem>
                  <SelectItem value="Mug">Mug</SelectItem>
                  <SelectItem value="Bowl">Bowl</SelectItem>
                  <SelectItem value="Fork">Fork</SelectItem>
                  <SelectItem value="Knife">Knife</SelectItem>
                  <SelectItem value="Spoon">Spoon</SelectItem>
                  <SelectItem value="Glass">Glass</SelectItem>
                  <SelectItem value="Tray">Tray</SelectItem>
                  <SelectItem value="Platter">Platter</SelectItem>
                </>
              )}
              {/* Kitchen Accessories Types */}
              {formData.category === 'Kitchen Accessories' && (
                <>
                  <SelectItem value="Utensils">Utensils</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Gadgets">Gadgets</SelectItem>
                  <SelectItem value="Spatula">Spatula</SelectItem>
                  <SelectItem value="Whisk">Whisk</SelectItem>
                  <SelectItem value="Tongs">Tongs</SelectItem>
                  <SelectItem value="Container">Container</SelectItem>
                  <SelectItem value="Organizer">Organizer</SelectItem>
                  <SelectItem value="Timer">Timer</SelectItem>
                  <SelectItem value="Scale">Scale</SelectItem>
                </>
              )}
              {/* Catering Supplies Types */}
              {formData.category === 'Catering Supplies' && (
                <>
                  <SelectItem value="Disposable">Disposable</SelectItem>
                  <SelectItem value="Serving">Serving</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Display">Display</SelectItem>
                </>
              )}
              {/* Default Types for other categories */}
              {!['Barware', 'Tableware', 'Kitchen Accessories', 'Catering Supplies'].includes(formData.category) && (
                <>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      );
    }

    // Default text input
    return (
      <div key={fieldName}>
        <Label htmlFor={fieldName}>{fieldName}</Label>
        <Input
          id={fieldName}
          value={value as string}
          onChange={(e) => handleInputChange(fieldName, e.target.value)}
          placeholder={`Enter ${fieldName.toLowerCase()}`}
          required={['Product Name', 'Price', 'Description'].includes(fieldName)}
        />
      </div>
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6 md:mb-8">
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className={`flex items-center ${currentStep === 'category' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 text-xs md:text-sm ${currentStep === 'category' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
            1
          </div>
          <span className="ml-1 md:ml-2 font-medium text-sm md:text-base">Category</span>
        </div>
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        <div className={`flex items-center ${currentStep === 'subcategory' ? 'text-blue-600' : currentStep === 'form' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 text-xs md:text-sm ${currentStep === 'subcategory' ? 'border-blue-600 bg-blue-600 text-white' : currentStep === 'form' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
            2
          </div>
          <span className="ml-1 md:ml-2 font-medium text-sm md:text-base">Subcategory</span>
        </div>
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        <div className={`flex items-center ${currentStep === 'form' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 text-xs md:text-sm ${currentStep === 'form' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
            3
          </div>
          <span className="ml-1 md:ml-2 font-medium text-sm md:text-base">Details</span>
        </div>
      </div>
    </div>
  );

  const renderCategoryStep = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Choose Product Category</h2>
        <p className="text-gray-600 text-sm md:text-base">Select the category that best describes your product</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {PRODUCT_CATEGORIES.map((category) => (
          <Card 
            key={category.name} 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
            onClick={() => handleCategorySelect(category.name)}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <h3 className="font-semibold text-base md:text-lg mb-2">{category.name}</h3>
              <p className="text-xs md:text-sm text-gray-600">
                {category.subcategories.length} subcategory{category.subcategories.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSubcategoryStep = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Choose Subcategory</h2>
        <p className="text-gray-600 text-sm md:text-base">
          Selected Category: <span className="font-semibold">{selectedCategory?.name}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {selectedCategory?.subcategories.map((subcategory: any) => (
          <Card 
            key={subcategory.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
            onClick={() => handleSubcategorySelect(subcategory.id)}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <h3 className="font-semibold text-base md:text-lg mb-2">{subcategory.name}</h3>
              <p className="text-xs md:text-sm text-gray-600">
                {subcategory.formFields.length} fields required
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFormStep = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Product Details</h2>
        <p className="text-gray-600 text-sm md:text-base">
          {selectedCategory?.name} → {selectedSubcategory?.name}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Media Upload */}
        <div className="col-span-full">
          <MultipleMediaUpload
            onImagesChange={handleImagesChange}
            onVideosChange={handleVideosChange}
            currentImages={formData.images}
            currentVideos={formData.videos}
            label="Product Media"
            maxImages={5}
            maxVideos={3}
            required
          />
        </div>

        {/* Dynamic Fields */}
        {selectedSubcategory && (
          <div className="border-t pt-4 md:pt-6">
            <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {selectedSubcategory.formFields
                .filter((field: string) => !['Product Name', 'Brand', 'Price', 'Product Image', 'Description'].includes(field))
                .map((field: string) => renderField(field))
              }
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button type="button" variant="outline" onClick={handleBack} className="w-full sm:w-auto">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show login required message if not authenticated
  if (!session?.user?.email) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-lg font-semibold mb-4">Authentication Required</p>
            <p className="text-gray-600 mb-4">You need to be logged in to create products.</p>
            <Button onClick={() => window.location.href = '/auth/login'}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
        <p className="text-sm text-gray-600">
          Logged in as: {session.user.email}
        </p>
      </CardHeader>
      <CardContent>
        {renderStepIndicator()}
        
        {currentStep === 'category' && renderCategoryStep()}
        {currentStep === 'subcategory' && renderSubcategoryStep()}
        {currentStep === 'form' && renderFormStep()}
      </CardContent>
    </Card>
  );
}