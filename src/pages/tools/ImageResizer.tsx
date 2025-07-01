
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Download, Maximize, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const ImageResizer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [resizedImage, setResizedImage] = useState<string>('');
  const [isResizing, setIsResizing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setResizedImage('');
      
      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
      img.src = url;
    }
  }, []);

  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      const newHeight = Math.round(parseInt(value) * aspectRatio);
      setHeight(newHeight.toString());
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(parseInt(value) * aspectRatio);
      setWidth(newWidth.toString());
    }
  };

  const resizeImage = useCallback(async () => {
    if (!file || !width || !height) return;

    setIsResizing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const newWidth = parseInt(width);
        const newHeight = parseInt(height);
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          const resizedUrl = canvas.toDataURL(file.type);
          setResizedImage(resizedUrl);
          
          toast({
            title: "Image resized!",
            description: `Resized to ${newWidth}x${newHeight}px`
          });
        }
        setIsResizing(false);
      };
      
      img.src = previewUrl;
    } catch (error) {
      toast({
        title: "Resizing failed",
        description: "Please try again",
        variant: "destructive"
      });
      setIsResizing(false);
    }
  }, [file, width, height, previewUrl]);

  const downloadImage = () => {
    if (resizedImage) {
      const a = document.createElement('a');
      a.href = resizedImage;
      a.download = `resized-${file?.name || 'image.jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const presetSizes = [
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Cover', width: 1200, height: 630 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'LinkedIn Banner', width: 1584, height: 396 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  ];

  const applyPreset = (preset: { width: number; height: number }) => {
    setWidth(preset.width.toString());
    setHeight(preset.height.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              📐 Image Resizer
            </h1>
            <p className="text-gray-600">Resize images to any dimensions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload & Resize
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-700">Click to upload image</p>
                </label>
              </div>

              {file && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Width (px)</label>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Height (px)</label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        placeholder="Height"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="aspect-ratio"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    />
                    <label htmlFor="aspect-ratio" className="text-sm">
                      Maintain aspect ratio
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Quick Presets</label>
                    <div className="grid grid-cols-1 gap-2">
                      {presetSizes.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset(preset)}
                          className="justify-start text-xs"
                        >
                          {preset.name} ({preset.width}x{preset.height})
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={resizeImage} 
                    disabled={isResizing || !width || !height}
                    className="w-full"
                  >
                    <Maximize className="w-4 h-4 mr-2" />
                    {isResizing ? 'Resizing...' : 'Resize Image'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview & Download</CardTitle>
            </CardHeader>
            <CardContent>
              {previewUrl && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Original ({originalDimensions.width}x{originalDimensions.height})</h4>
                    <img 
                      src={previewUrl} 
                      alt="Original" 
                      className="w-full max-h-40 object-contain rounded border bg-gray-50"
                    />
                  </div>
                  
                  {resizedImage && (
                    <div>
                      <h4 className="font-medium mb-2">Resized ({width}x{height})</h4>
                      <img 
                        src={resizedImage} 
                        alt="Resized" 
                        className="w-full max-h-40 object-contain rounded border bg-gray-50"
                      />
                      <Button onClick={downloadImage} className="w-full mt-4">
                        <Download className="w-4 h-4 mr-2" />
                        Download Resized Image
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;
