
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Code, Copy, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Base64Encoder = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const processText = () => {
    if (!input.trim()) {
      toast({
        title: "Please enter some text",
        description: "Base64 tool needs input text",
        variant: "destructive"
      });
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(input);
        setOutput(encoded);
        toast({
          title: "Text encoded!",
          description: "Text has been encoded to Base64"
        });
      } else {
        const decoded = atob(input);
        setOutput(decoded);
        toast({
          title: "Text decoded!",
          description: "Base64 has been decoded to text"
        });
      }
    } catch (error) {
      toast({
        title: "Processing failed",
        description: mode === 'decode' ? "Invalid Base64 input" : "Encoding failed",
        variant: "destructive"
      });
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Output copied to clipboard"
    });
  };

  const switchMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
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
              🔐 Base64 Encoder/Decoder
            </h1>
            <p className="text-gray-600">Encode and decode Base64 strings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Input ({mode === 'encode' ? 'Plain Text' : 'Base64'})
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={mode === 'encode' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('encode')}
                >
                  Encode
                </Button>
                <Button 
                  variant={mode === 'decode' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('decode')}
                >
                  Decode
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter plain text to encode...' : 'Enter Base64 to decode...'}
                className="min-h-[200px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={processText} disabled={!input.trim()}>
                  {mode === 'encode' ? 'Encode' : 'Decode'}
                </Button>
                {output && (
                  <Button variant="outline" onClick={switchMode}>
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Switch Mode
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output ({mode === 'encode' ? 'Base64' : 'Plain Text'})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded border min-h-[200px] mb-4">
                <pre className="text-sm break-all whitespace-pre-wrap font-mono">
                  {output || `${mode === 'encode' ? 'Encoded' : 'Decoded'} text will appear here...`}
                </pre>
              </div>
              {output && (
                <Button onClick={copyOutput} className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Output
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Base64Encoder;
