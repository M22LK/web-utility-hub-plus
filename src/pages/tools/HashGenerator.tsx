
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Hash, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const HashGenerator = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [hashType, setHashType] = useState('md5');
  const [hash, setHash] = useState('');

  // Simple hash functions (for demonstration - in production use crypto libraries)
  const generateHash = async () => {
    if (!input.trim()) {
      toast({
        title: "Please enter some text",
        description: "Hash generator needs input text",
        variant: "destructive"
      });
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      
      let hashBuffer;
      switch (hashType) {
        case 'sha1':
          hashBuffer = await crypto.subtle.digest('SHA-1', data);
          break;
        case 'sha256':
          hashBuffer = await crypto.subtle.digest('SHA-256', data);
          break;
        case 'sha384':
          hashBuffer = await crypto.subtle.digest('SHA-384', data);
          break;
        case 'sha512':
          hashBuffer = await crypto.subtle.digest('SHA-512', data);
          break;
        default:
          // Simple MD5-like hash (not actual MD5)
          let hash = 0;
          for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
          }
          setHash(Math.abs(hash).toString(16).padStart(8, '0'));
          toast({
            title: "Hash generated!",
            description: `${hashType.toUpperCase()} hash created`
          });
          return;
      }
      
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
      
      toast({
        title: "Hash generated!",
        description: `${hashType.toUpperCase()} hash created`
      });
    } catch (error) {
      toast({
        title: "Hash generation failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const copyHash = () => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied!",
      description: "Hash copied to clipboard"
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
              #️⃣ Hash Generator
            </h1>
            <p className="text-gray-600">Generate MD5, SHA1, SHA256 hashes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Input & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Hash Algorithm</label>
                <Select value={hashType} onValueChange={setHashType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="md5">MD5 (Simplified)</SelectItem>
                    <SelectItem value="sha1">SHA-1</SelectItem>
                    <SelectItem value="sha256">SHA-256</SelectItem>
                    <SelectItem value="sha384">SHA-384</SelectItem>
                    <SelectItem value="sha512">SHA-512</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Input Text</label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text to hash..."
                  className="min-h-[200px]"
                />
              </div>

              <Button onClick={generateHash} disabled={!input.trim()} className="w-full">
                Generate Hash
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Hash</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded border min-h-[200px] mb-4">
                <pre className="text-sm break-all whitespace-pre-wrap font-mono">
                  {hash || 'Generated hash will appear here...'}
                </pre>
              </div>
              {hash && (
                <Button onClick={copyHash} className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Hash
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;
