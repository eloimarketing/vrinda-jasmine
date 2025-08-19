'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, Video, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaUploadProps {
  onUpload: (url: string, type: 'image' | 'video') => void;
  onRemove?: () => void;
  currentUrl?: string;
  currentType?: 'image' | 'video';
  className?: string;
  label?: string;
  required?: boolean;
}

export default function MediaUpload({
  onUpload,
  onRemove,
  currentUrl,
  currentType,
  className,
  label = "Media Upload",
  required = false
}: MediaUploadProps) {
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
        onUpload(result.url, isImage ? 'image' : 'video');
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

  const getFileIcon = (type?: 'image' | 'video') => {
    if (type === 'image') return <Image className="w-8 h-8" />;
    if (type === 'video') return <Video className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const getFileTypeText = (type?: 'image' | 'video') => {
    if (type === 'image') return 'Image';
    if (type === 'video') return 'Video';
    return 'File';
  };

  return (
    <div className={cn("space-y-2", className)}>
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

      {currentUrl ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {getFileIcon(currentType)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {getFileTypeText(currentType)} uploaded
                </p>
                <p className="text-xs text-gray-500 truncate">{currentUrl}</p>
              </div>
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
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
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 