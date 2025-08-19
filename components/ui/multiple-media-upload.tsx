'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, Video, File, Loader2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaFile {
  url: string;
  type: 'image' | 'video';
  id: string;
}

interface MultipleMediaUploadProps {
  onImagesChange: (urls: string[]) => void;
  onVideosChange: (urls: string[]) => void;
  currentImages?: string[];
  currentVideos?: string[];
  className?: string;
  label?: string;
  maxImages?: number;
  maxVideos?: number;
  required?: boolean;
}

export default function MultipleMediaUpload({
  onImagesChange,
  onVideosChange,
  currentImages = [],
  currentVideos = [],
  className,
  label = "Media Upload",
  maxImages = 5,
  maxVideos = 3,
  required = false
}: MultipleMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    // Check limits
    if (isImage && currentImages.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }
    if (isVideo && currentVideos.length >= maxVideos) {
      alert(`Maximum ${maxVideos} videos allowed`);
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', isImage ? 'image' : 'video');

      const response = await fetch('/api/cloudinary/image-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        if (isImage) {
          onImagesChange([...currentImages, result.url]);
        } else {
          onVideosChange([...currentVideos, result.url]);
        }
        setUploadProgress(100);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const removeVideo = (index: number) => {
    const newVideos = currentVideos.filter((_, i) => i !== index);
    onVideosChange(newVideos);
  };

  const getFileIcon = (type: 'image' | 'video') => {
    if (type === 'image') return <Image className="w-4 h-4" />;
    if (type === 'video') return <Video className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />

      {/* Images Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Images ({currentImages.length}/{maxImages})</Label>
          {currentImages.length < maxImages && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={isUploading}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Image
            </Button>
          )}
        </div>
        
        {currentImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {currentImages.map((url, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-2">
                  <div className="aspect-square relative">
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Videos Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Videos ({currentVideos.length}/{maxVideos})</Label>
          {currentVideos.length < maxVideos && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={isUploading}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Video
            </Button>
          )}
        </div>
        
        {currentVideos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {currentVideos.map((url, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-2">
                  <div className="aspect-square relative">
                    <video
                      src={url}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-8 h-8 text-white opacity-80" />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVideo(index)}
                      className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Area */}
      {(currentImages.length < maxImages || currentVideos.length < maxVideos) && (
        <Card
          className={cn(
            "border-2 border-dashed cursor-pointer transition-colors",
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
            isUploading && "pointer-events-none opacity-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <CardContent className="p-6 text-center">
            {isUploading ? (
              <div className="space-y-3">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Uploading...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Images (JPG, PNG, GIF, WebP) or Videos (MP4, AVI, MOV, WebM)
                  </p>
                  <p className="text-xs text-gray-500">
                    Maximum file size: 10MB
                  </p>
                  <p className="text-xs text-gray-500">
                    Up to {maxImages} images and {maxVideos} videos
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 