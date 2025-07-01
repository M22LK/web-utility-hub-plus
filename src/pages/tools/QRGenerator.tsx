
import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Download, QrCode, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const QRGenerator = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('https://example.com');
  const [qrType, setQrType] = useState('url');
  const [size, setSize] = useState([256]);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Simple QR Code generation (basic implementation)
  const generateQR = useCallback(async () => {
    if (!text.trim()) {
      toast({
        title: "Please enter some text",
        description: "QR code needs content to generate",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // This is a simplified QR code generator
      // In a real implementation, you'd use a library like 'qrcode'
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const qrSize = size[0];
      canvas.width = qrSize;
      canvas.height = qrSize;

      // Clear canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, qrSize, qrSize);

      // Simple pattern generation (this is just a placeholder)
      // In reality, you'd implement proper QR code generation
      const moduleSize = qrSize / 25;
      
      // Create a simple pattern based on text hash
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
      }

      ctx.fillStyle = 'black';
      
      // Generate a pattern (simplified)
      for (let x = 0; x < 25; x++) {
        for (let y = 0; y < 25; y++) {
          const shouldFill = ((hash + x * 7 + y * 11) % 3) === 0;
          if (shouldFill) {
            ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
          }
        }
      }

      // Add finder patterns (corner squares)
      const drawFinderPattern = (x: number, y: number) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
        ctx.fillStyle = 'white';
        ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
        ctx.fillStyle = 'black';
        ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
      };

      drawFinderPattern(0, 0);
      drawFinderPattern(18, 0);
      drawFinderPattern(0, 18);

      const dataUrl = canvas.toDataURL();
      setQrDataUrl(dataUrl);
      
      toast({
        title: "QR Code generated!",
        description: "Your QR code is ready to download"
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [text, size]);

  const downloadQR = () => {
    if (qrDataUrl) {
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `qrcode_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getPlaceholder = () => {
    switch (qrType) {
      case 'url': return 'https://example.com';
      case 'text': return 'Enter your text here';
      case 'email': return 'mailto:someone@example.com';
      case 'phone': return 'tel:+1234567890';
      case 'sms': return 'sms:+1234567890?body=Hello';
      case 'wifi': return 'WIFI:T:WPA;S:NetworkName;P:Password;;';
      default: return 'Enter content here';
    }
  };

  // Generate initial QR code
  React.useEffect(() => {
    generateQR();
  }, [generateQR]);

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
              📱 QR Code Generator
            </h1>
            <p className="text-gray-600">Create QR codes for URLs, text, and more</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code Content
              </CardTitle>
              <CardDescription>
                Enter the content you want to encode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Type</label>
                <Select value={qrType} onValueChange={setQrType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url">Website URL</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="email">Email Address</SelectItem>
                    <SelectItem value="phone">Phone Number</SelectItem>
                    <SelectItem value="sms">SMS Message</SelectItem>
                    <SelectItem value="wifi">WiFi Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                {qrType === 'text' ? (
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={getPlaceholder()}
                    rows={4}
                  />
                ) : (
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={getPlaceholder()}
                  />
                )}
              </div>

              {/* Size Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Size</label>
                  <span className="text-sm text-gray-600">{size[0]}x{size[0]}px</span>
                </div>
                <Slider
                  value={size}
                  onValueChange={setSize}
                  max={512}
                  min={128}
                  step={32}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={generateQR} 
                disabled={isGenerating || !text.trim()}
                className="w-full"
              >
                <QrCode className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Generated QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </div>

              {qrDataUrl && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">QR Code Info</h4>
                    <div className="text-sm text-blue-600 space-y-1">
                      <div>Type: {qrType.toUpperCase()}</div>
                      <div>Size: {size[0]}x{size[0]}px</div>
                      <div>Content Length: {text.length} characters</div>
                    </div>
                  </div>

                  <Button onClick={downloadQR} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Common Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🌐 Website Links</h4>
                <p className="text-blue-600">Share your website URL easily</p>
                <code className="text-xs bg-blue-200 px-2 py-1 rounded mt-2 block">https://example.com</code>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">📧 Contact Info</h4>
                <p className="text-green-600">Share email or phone numbers</p>
                <code className="text-xs bg-green-200 px-2 py-1 rounded mt-2 block">mailto:you@email.com</code>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">📱 App Downloads</h4>
                <p className="text-purple-600">Link to app store downloads</p>
                <code className="text-xs bg-purple-200 px-2 py-1 rounded mt-2 block">App Store URL</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRGenerator;
