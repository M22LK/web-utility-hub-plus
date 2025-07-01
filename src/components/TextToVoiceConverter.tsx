
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Volume2, Play, Pause, Square } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TextToVoiceConverter = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('');
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const voices = [
    { name: 'Google US English (Female)', lang: 'en-US', gender: 'female' },
    { name: 'Google US English (Male)', lang: 'en-US', gender: 'male' },
    { name: 'Google UK English (Female)', lang: 'en-GB', gender: 'female' },
    { name: 'Google UK English (Male)', lang: 'en-GB', gender: 'male' },
    { name: 'Microsoft Zira (Female)', lang: 'en-US', gender: 'female' },
    { name: 'Microsoft David (Male)', lang: 'en-US', gender: 'male' },
    { name: 'Apple Samantha (Female)', lang: 'en-US', gender: 'female' },
    { name: 'Apple Alex (Male)', lang: 'en-US', gender: 'male' },
  ];

  const handleSpeak = () => {
    if (!text.trim()) {
      toast({
        title: "No text to speak",
        description: "Please enter some text first",
        variant: "destructive"
      });
      return;
    }

    if (isPlaying) {
      handleStop();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const availableVoices = speechSynthesis.getVoices();
    
    if (voice && availableVoices.length > 0) {
      const selectedVoice = availableVoices.find(v => 
        v.name.includes(voice.split(' ')[0]) || 
        v.lang === voice
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.rate = rate[0];
    utterance.pitch = pitch[0];

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
      toast({
        title: "Speech error",
        description: "Failed to convert text to speech",
        variant: "destructive"
      });
    };

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentUtterance(null);
  };

  const handlePause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8 shadow-lg border-2 border-blue-200">
      <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Volume2 className="w-12 h-12 text-blue-600" />
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎤 Text to Voice Converter
          </CardTitle>
        </div>
        <CardDescription className="text-lg text-gray-600">
          Convert your text to natural speech with multiple voice options
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Enter Text</label>
          <Textarea
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] text-base"
            maxLength={5000}
          />
          <div className="text-xs text-gray-500 text-right">
            {text.length}/5000 characters
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Voice</label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v, index) => (
                  <SelectItem key={index} value={v.name}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Speed: {rate[0].toFixed(1)}x
            </label>
            <Slider
              value={rate}
              onValueChange={setRate}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Pitch: {pitch[0].toFixed(1)}
            </label>
            <Slider
              value={pitch}
              onValueChange={setPitch}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button 
            onClick={handleSpeak}
            size="lg"
            className="px-8"
            disabled={!text.trim()}
          >
            {isPlaying ? (
              <>
                <Square className="w-5 h-5 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Speak
              </>
            )}
          </Button>

          {isPlaying && (
            <Button 
              onClick={handlePause}
              variant="outline"
              size="lg"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use punctuation for natural pauses</li>
            <li>• Experiment with different voices and speeds</li>
            <li>• Maximum 5000 characters per conversion</li>
            <li>• Works best with modern browsers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextToVoiceConverter;
