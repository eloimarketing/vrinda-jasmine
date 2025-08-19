'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRODUCT_CATEGORIES } from '@/utils/constant/product-categories';

interface FormData {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  description: string;
  productImage: string;
  [key: string]: string | boolean | number;
}

export default function UnifiedProductForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    price: '',
    description: '',
    productImage: '',
  });

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);

  // Update form fields when category/subcategory changes
  useEffect(() => {
    if (formData.category && formData.subcategory) {
      const category = PRODUCT_CATEGORIES.find(cat => cat.name === formData.category);
      const subcategory = category?.subcategories.find(sub => sub.id === formData.subcategory);
      
      setSelectedCategory(category);
      setSelectedSubcategory(subcategory);

      // Initialize dynamic fields
      const newFormData = { ...formData };
      subcategory?.formFields.forEach((field: string) => {
        if (!(field in newFormData)) {
          newFormData[field] = '';
        }
      });
      setFormData(newFormData);
    }
  }, [formData.category, formData.subcategory]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // Add basic fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('subcategory', formData.subcategory);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('productImage', formData.productImage);

    // Add dynamic attributes
    const attributes: { [key: string]: any } = {};
    selectedSubcategory?.formFields.forEach((field: string) => {
      if (formData[field] !== undefined && formData[field] !== '') {
        attributes[field] = formData[field];
      }
    });
    formDataToSend.append('attributes', JSON.stringify(attributes));

    try {
      const response = await fetch('/api/products/create', {
        method: 'POST',
        body: formDataToSend,
      });

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
        });
        setSelectedCategory(null);
        setSelectedSubcategory(null);
      } else {
        const error = await response.json();
        alert(`Failed to create product: ${error.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating product');
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
          required={['Product Name', 'Price', 'Product Image', 'Description'].includes(fieldName)}
        />
      </div>
    );
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select 
                onValueChange={(value) => handleInputChange('subcategory', value)}
                disabled={!formData.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.subcategories.map((sub: any) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div>
              <Label htmlFor="productImage">Product Image URL</Label>
              <Input
                id="productImage"
                value={formData.productImage}
                onChange={(e) => handleInputChange('productImage', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Dynamic Fields */}
          {selectedSubcategory && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <Button type="submit" className="w-full">
            Create Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}