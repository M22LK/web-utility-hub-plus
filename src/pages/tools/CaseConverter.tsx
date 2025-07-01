
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Type, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const CaseConverter = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const conversions = {
    uppercase: text.toUpperCase(),
    lowercase: text.toLowerCase(),
    titleCase: text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
    sentenceCase: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
    camelCase: text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    ).replace(/\s+/g, ''),
    pascalCase: text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
      word.toUpperCase()
    ).replace(/\s+/g, ''),
    snakeCase: text.toLowerCase().replace(/\s+/g, '_'),
    kebabCase: text.toLowerCase().replace(/\s+/g, '-')
  };

  const copyText = (convertedText: string, type: string) => {
    navigator.clipboard.writeText(convertedText);
    toast({
      title: "Copied!",
      description: `${type} text copied to clipboard`
    });
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
              🔤 Case Converter
            </h1>
            <p className="text-gray-600">Convert text to different cases</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Enter Your Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here..."
              className="min-h-[150px]"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(conversions).map(([key, value]) => (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-3 rounded border min-h-[100px] mb-3">
                  <p className="text-sm break-words">{value || 'Converted text will appear here...'}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyText(value, key)}
                  disabled={!value}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;
