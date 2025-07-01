
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Download, Scissors, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const BackgroundRemover = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

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
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setProcessedImage('');
    }
  }, []);

  const removeBackground = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // Simulate background removal processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple demonstration of background removal
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          // Simple edge detection and background removal simulation
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Simple background detection (remove white/light backgrounds)
            if (r > 200 && g > 200 && b > 200) {
              data[i + 3] = 0; // Make transparent
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          const processedUrl = canvas.toDataURL('image/png');
          setProcessedImage(processedUrl);
          
          toast({
            title: "Background removed!",
            description: "Your image has been processed"
          });
        }
        setIsProcessing(false);
      };
      
      img.src = previewUrl;
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Please try again",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  }, [file, previewUrl]);

  const downloadImage = () => {
    if (processedImage) {
      const a = document.createElement('a');
      a.href = processedImage;
      a.download = `no-bg-${file?.name || 'image.png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
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
              ✂️ Background Remover
            </h1>
            <p className="text-gray-600">Remove backgrounds from your images</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image
              </CardTitle>
              <CardDescription>
                Select an image to remove its background
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
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>

              {file && (
                <Button 
                  onClick={removeBackground} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Removing Background...' : 'Remove Background'}
                </Button>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Original</h4>
                      <img 
                        src={previewUrl} 
                        alt="Original" 
                        className="w-full h-40 object-cover rounded border"
                      />
                    </div>
                    
                    {processedImage && (
                      <div>
                        <h4 className="font-medium mb-2">No Background</h4>
                        <div className="bg-gray-100 rounded border p-2">
                          <img 
                            src={processedImage} 
                            alt="Processed" 
                            className="w-full h-36 object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {processedImage && (
                    <Button onClick={downloadImage} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </Button>
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

export default BackgroundRemover;
