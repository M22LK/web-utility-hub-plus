import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, ArrowLeft, Shrink, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const ImageCompressor = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState([80]);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, WebP)",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setCompressedFile(null);
      setCompressedUrl('');
    }
  }, []);

  const compressImage = useCallback(async () => {
    if (!file) return;

    setIsCompressing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now()
                });
                
                setCompressedFile(compressedFile);
                setCompressedSize(blob.size);
                setCompressedUrl(URL.createObjectURL(blob));
                
                toast({
                  title: "Image compressed successfully!",
                  description: `Size reduced by ${((1 - blob.size / file.size) * 100).toFixed(1)}%`
                });
              }
              setIsCompressing(false);
            },
            file.type,
            quality[0] / 100
          );
        }
      };
      
      img.src = previewUrl;
    } catch (error) {
      toast({
        title: "Compression failed",
        description: "Please try again with a different image",
        variant: "destructive"
      });
      setIsCompressing(false);
    }
  }, [file, quality, previewUrl]);

  const downloadCompressed = () => {
    if (compressedFile && compressedUrl) {
      const a = document.createElement('a');
      a.href = compressedUrl;
      a.download = `compressed_${file?.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              🗜️ Image Compressor
            </h1>
            <p className="text-gray-600">Compress your images without losing quality</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image
              </CardTitle>
              <CardDescription>
                Select an image file to compress (JPEG, PNG, WebP)
              </CardDescription>
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
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </label>
              </div>

              {file && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Compression Quality</span>
                    <Badge variant="outline">{quality[0]}%</Badge>
                  </div>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  
                  <Button 
                    onClick={compressImage} 
                    disabled={isCompressing || !file}
                    className="w-full"
                  >
                    <Shrink className="w-4 h-4 mr-2" />
                    {isCompressing ? 'Compressing...' : 'Compress Image'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preview & Results</CardTitle>
            </CardHeader>
            <CardContent>
              {previewUrl && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Original</h4>
                      <img 
                        src={previewUrl} 
                        alt="Original" 
                        className="w-full h-40 object-cover rounded border"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Size: {formatFileSize(originalSize)}
                      </p>
                    </div>
                    
                    {compressedUrl && (
                      <div>
                        <h4 className="font-medium mb-2">Compressed</h4>
                        <img 
                          src={compressedUrl} 
                          alt="Compressed" 
                          className="w-full h-40 object-cover rounded border"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Size: {formatFileSize(compressedSize)}
                        </p>
                      </div>
                    )}
                  </div>

                  {compressedFile && (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-green-800">Compression Results</span>
                          <Badge className="bg-green-100 text-green-800">
                            {((1 - compressedSize / originalSize) * 100).toFixed(1)}% smaller
                          </Badge>
                        </div>
                        <div className="text-sm text-green-700">
                          Saved: {formatFileSize(originalSize - compressedSize)}
                        </div>
                      </div>

                      <Button onClick={downloadCompressed} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Compressed Image
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                <div>
                  <h4 className="font-medium">Upload Image</h4>
                  <p className="text-gray-600">Select your image file from your device</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">2</div>
                <div>
                  <h4 className="font-medium">Adjust Quality</h4>
                  <p className="text-gray-600">Choose compression level (10-100%)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">3</div>
                <div>
                  <h4 className="font-medium">Download</h4>
                  <p className="text-gray-600">Get your compressed image instantly</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageCompressor;
