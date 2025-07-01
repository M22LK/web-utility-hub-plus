
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, RefreshCw, Copy, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const UUIDGenerator = () => {
  const navigate = useNavigate();
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState('1');
  const [version, setVersion] = useState('4');

  const generateUUID = () => {
    // Simple UUID v4 generator
    const generateV4 = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const numUUIDs = Math.min(parseInt(count) || 1, 100);
    const newUUIDs = Array.from({ length: numUUIDs }, generateV4);
    setUuids(newUUIDs);
    
    toast({
      title: "UUIDs generated!",
      description: `Generated ${numUUIDs} UUID${numUUIDs > 1 ? 's' : ''}`
    });
  };

  const copyUUID = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    toast({
      title: "Copied!",
      description: "UUID copied to clipboard"
    });
  };

  const copyAllUUIDs = () => {
    const allUUIDs = uuids.join('\n');
    navigator.clipboard.writeText(allUUIDs);
    toast({
      title: "Copied!",
      description: `All ${uuids.length} UUIDs copied to clipboard`
    });
  };

  React.useEffect(() => {
    generateUUID();
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
              🆔 UUID Generator
            </h1>
            <p className="text-gray-600">Generate unique identifiers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Generator Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">UUID Version</label>
                <Select value={version} onValueChange={setVersion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">Version 4 (Random)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Number of UUIDs</label>
                <Input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  min="1"
                  max="100"
                  placeholder="1"
                />
              </div>

              <Button onClick={generateUUID} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate UUIDs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated UUIDs</CardTitle>
              {uuids.length > 1 && (
                <Button size="sm" onClick={copyAllUUIDs}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {uuids.map((uuid, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
                    <code className="flex-1 text-sm font-mono">{uuid}</code>
                    <Button size="sm" variant="outline" onClick={() => copyUUID(uuid)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UUIDGenerator;
