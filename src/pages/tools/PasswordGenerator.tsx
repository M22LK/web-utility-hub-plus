
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RefreshCw, Copy, Key, Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const PasswordGenerator = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const generatePassword = useCallback(() => {
    let charset = '';
    let similar = 'il1Lo0O';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similar.includes(char)).join('');
    }
    
    if (charset === '') {
      toast({
        title: "No character types selected",
        description: "Please select at least one character type",
        variant: "destructive"
      });
      return;
    }
    
    let result = '';
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(result);
    toast({
      title: "Password generated!",
      description: "Your new secure password is ready"
    });
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied to clipboard!",
      description: "Password has been copied to your clipboard"
    });
  };

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    if (score <= 2) return { strength: 'Weak', color: 'bg-red-500', textColor: 'text-red-600' };
    if (score <= 4) return { strength: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { strength: 'Strong', color: 'bg-green-500', textColor: 'text-green-600' };
  };

  // Generate initial password
  React.useEffect(() => {
    generatePassword();
  }, []);

  const strength = password ? getPasswordStrength(password) : null;

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
              🔑 Password Generator
            </h1>
            <p className="text-gray-600">Generate secure passwords with customizable options</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generator Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Password Settings
              </CardTitle>
              <CardDescription>
                Customize your password requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Length Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Password Length</span>
                  <Badge variant="outline">{length[0]} characters</Badge>
                </div>
                <Slider
                  value={length}
                  onValueChange={setLength}
                  max={100}
                  min={4}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Character Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Include Characters</h4>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={setIncludeUppercase}
                  />
                  <label htmlFor="uppercase" className="text-sm font-medium">
                    Uppercase Letters (A-Z)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={setIncludeLowercase}
                  />
                  <label htmlFor="lowercase" className="text-sm font-medium">
                    Lowercase Letters (a-z)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={setIncludeNumbers}
                  />
                  <label htmlFor="numbers" className="text-sm font-medium">
                    Numbers (0-9)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={setIncludeSymbols}
                  />
                  <label htmlFor="symbols" className="text-sm font-medium">
                    Symbols (!@#$%^&*)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="exclude-similar"
                    checked={excludeSimilar}
                    onCheckedChange={setExcludeSimilar}
                  />
                  <label htmlFor="exclude-similar" className="text-sm font-medium">
                    Exclude Similar Characters (il1Lo0O)
                  </label>
                </div>
              </div>

              <Button onClick={generatePassword} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Password
              </Button>
            </CardContent>
          </Card>

          {/* Password Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Generated Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {password && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Your Password</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        readOnly
                        className="font-mono text-sm pr-10"
                      />
                    </div>
                  </div>

                  {/* Strength Indicator */}
                  {strength && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Password Strength</span>
                        <Badge className={strength.textColor} variant="outline">
                          {strength.strength}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${strength.color} transition-all duration-300`}
                          style={{ 
                            width: strength.strength === 'Weak' ? '33%' : 
                                   strength.strength === 'Medium' ? '66%' : '100%' 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <Button onClick={copyToClipboard} className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Password
                  </Button>

                  {/* Password Info */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Length:</span>
                      <span className="font-mono">{password.length} characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entropy:</span>
                      <span className="font-mono">{Math.floor(Math.log2(Math.pow(
                        (includeUppercase ? 26 : 0) + 
                        (includeLowercase ? 26 : 0) + 
                        (includeNumbers ? 10 : 0) + 
                        (includeSymbols ? 32 : 0), 
                        password.length
                      )))} bits</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Password Security Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Use Unique Passwords</h4>
                <p className="text-blue-600">Never reuse passwords across multiple accounts</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Enable 2FA</h4>
                <p className="text-green-600">Add two-factor authentication when available</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Use a Password Manager</h4>
                <p className="text-purple-600">Store passwords securely with a trusted manager</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">Regular Updates</h4>
                <p className="text-orange-600">Change passwords regularly, especially for important accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordGenerator;
