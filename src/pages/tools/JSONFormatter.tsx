
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Code, Copy, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const JSONFormatter = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormatted(formatted);
      setIsValid(true);
      setError('');
      toast({
        title: "JSON formatted successfully!",
        description: "Your JSON is valid and formatted"
      });
    } catch (e) {
      setIsValid(false);
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setFormatted('');
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setFormatted(minified);
      setIsValid(true);
      setError('');
      toast({
        title: "JSON minified successfully!",
        description: "Your JSON has been compressed"
      });
    } catch (e) {
      setIsValid(false);
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setFormatted('');
    }
  };

  const copyFormatted = () => {
    navigator.clipboard.writeText(formatted);
    toast({
      title: "Copied!",
      description: "Formatted JSON copied to clipboard"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              📊 JSON Formatter
            </h1>
            <p className="text-gray-600">Format, validate, and minify JSON data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Input JSON
              </CardTitle>
              <CardDescription>
                Paste your JSON data here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"name": "John", "age": 30, "city": "New York"}'
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={formatJSON} disabled={!input.trim()}>
                  Format JSON
                </Button>
                <Button variant="outline" onClick={minifyJSON} disabled={!input.trim()}>
                  Minify
                </Button>
              </div>
              {isValid !== null && (
                <div className={`flex items-center gap-2 mt-2 text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isValid ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {isValid ? 'Valid JSON' : `Invalid JSON: ${error}`}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formatted Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded border min-h-[300px] mb-4">
                <pre className="text-sm overflow-auto whitespace-pre-wrap">
                  {formatted || 'Formatted JSON will appear here...'}
                </pre>
              </div>
              {formatted && (
                <Button onClick={copyFormatted} className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Formatted JSON
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;
