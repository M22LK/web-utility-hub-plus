
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Copy, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const ColorPalette = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState<string[]>([]);

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  };

  const generatePalette = () => {
    const newColors = Array.from({ length: 8 }, generateRandomColor);
    setColors(newColors);
    toast({
      title: "Palette generated!",
      description: "New color palette is ready"
    });
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Copied!",
      description: `Color ${color} copied to clipboard`
    });
  };

  const copyAllColors = () => {
    const colorString = colors.join(', ');
    navigator.clipboard.writeText(colorString);
    toast({
      title: "Copied!",
      description: "All colors copied to clipboard"
    });
  };

  React.useEffect(() => {
    generatePalette();
  }, []);

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
              🎨 Color Palette Generator
            </h1>
            <p className="text-gray-600">Generate beautiful color palettes</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Palette
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={generatePalette}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Palette
              </Button>
              {colors.length > 0 && (
                <Button variant="outline" onClick={copyAllColors}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Colors
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {colors.map((color, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-full h-24 rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                  />
                  <div className="mt-2">
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {color}
                    </code>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => copyColor(color)}
                    className="mt-1 text-xs"
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Click to Copy</h4>
                <p className="text-blue-600">Click on any color to copy its hex code</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Generate New</h4>
                <p className="text-green-600">Create fresh palettes with the generate button</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Copy All</h4>
                <p className="text-purple-600">Copy the entire palette for easy sharing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColorPalette;
