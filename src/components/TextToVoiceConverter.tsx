
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Volume2, Play, Pause, Square, Mic } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceOption {
  voice: SpeechSynthesisVoice;
  label: string;
  lang: string;
  gender: 'male' | 'female' | 'unknown';
  accent: string;
}

const TextToVoiceConverter = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [volume, setVolume] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      
      const voiceOptions: VoiceOption[] = availableVoices.map(voice => {
        // Determine gender based on voice name patterns
        const name = voice.name.toLowerCase();
        let gender: 'male' | 'female' | 'unknown' = 'unknown';
        
        if (name.includes('female') || name.includes('woman') || 
            name.includes('sara') || name.includes('zira') || name.includes('hazel') ||
            name.includes('susan') || name.includes('anna') || name.includes('karen') ||
            name.includes('samantha') || name.includes('victoria') || name.includes('fiona') ||
            name.includes('tessa') || name.includes('moira') || name.includes('paulina') ||
            name.includes('luciana') || name.includes('amelie') || name.includes('audrey')) {
          gender = 'female';
        } else if (name.includes('male') || name.includes('man') || 
                   name.includes('david') || name.includes('mark') || name.includes('daniel') ||
                   name.includes('thomas') || name.includes('alex') || name.includes('fred') ||
                   name.includes('jorge') || name.includes('diego') || name.includes('carlos') ||
                   name.includes('nicolas') || name.includes('antonio') || name.includes('rishi')) {
          gender = 'male';
        }

        // Extract accent/region from language code
        const langParts = voice.lang.split('-');
        const accent = langParts.length > 1 ? langParts[1] : langParts[0];
        
        return {
          voice,
          label: `${voice.name} (${voice.lang})`,
          lang: voice.lang,
          gender,
          accent: accent.toUpperCase()
        };
      });

      // Sort voices by language, then by gender, then by name
      voiceOptions.sort((a, b) => {
        if (a.lang !== b.lang) return a.lang.localeCompare(b.lang);
        if (a.gender !== b.gender) return a.gender.localeCompare(b.gender);
        return a.voice.name.localeCompare(b.voice.name);
      });

      setVoices(voiceOptions);
      
      // Set default voice (prefer English female voice)
      const defaultVoice = voiceOptions.find(v => 
        v.lang.startsWith('en') && v.gender === 'female'
      ) || voiceOptions.find(v => v.lang.startsWith('en')) || voiceOptions[0];
      
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.voice);
      }
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also listen for voiceschanged event (some browsers load voices asynchronously)
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) {
      toast({
        title: "No text to speak",
        description: "Please enter some text first",
        variant: "destructive"
      });
      return;
    }

    if (isPlaying && !isPaused) {
      handleStop();
      return;
    }

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = rate[0];
    utterance.pitch = pitch[0];
    utterance.volume = volume[0];

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
      toast({
        title: "Speech error",
        description: `Failed to convert text to speech: ${event.error}`,
        variant: "destructive"
      });
    };

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentUtterance(null);
  };

  const handlePause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  // Group voices by language for better organization
  const groupedVoices = voices.reduce((acc, voiceOption) => {
    const langCode = voiceOption.lang.split('-')[0];
    const languageName = new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode) || langCode;
    
    if (!acc[languageName]) {
      acc[languageName] = [];
    }
    acc[languageName].push(voiceOption);
    return acc;
  }, {} as Record<string, VoiceOption[]>);

  return (
    <Card className="w-full max-w-5xl mx-auto mb-8 shadow-lg border-2 border-blue-200">
      <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <Volume2 className="w-12 h-12 text-blue-600" />
            <Mic className="w-6 h-6 text-purple-600 absolute -bottom-1 -right-1" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎤 Advanced Text to Voice Converter
          </CardTitle>
        </div>
        <CardDescription className="text-lg text-gray-600">
          Convert text to natural speech with {voices.length} voices across multiple languages and accents
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Enter Text</label>
          <Textarea
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] text-base resize-none"
            maxLength={5000}
          />
          <div className="text-xs text-gray-500 text-right">
            {text.length}/5000 characters
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Voice Selection ({voices.length} available)
            </label>
            <Select 
              value={selectedVoice?.name || ''} 
              onValueChange={(value) => {
                const voice = voices.find(v => v.voice.name === value)?.voice;
                setSelectedVoice(voice || null);
              }}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select a voice..." />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(groupedVoices).map(([language, voiceOptions]) => (
                  <div key={language}>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                      {language} ({voiceOptions.length})
                    </div>
                    {voiceOptions.map((voiceOption, index) => (
                      <SelectItem 
                        key={`${language}-${index}`} 
                        value={voiceOption.voice.name}
                        className="pl-4"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{voiceOption.voice.name}</span>
                          <div className="flex gap-1 ml-2">
                            <span className={`text-xs px-1 py-0.5 rounded ${
                              voiceOption.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                              voiceOption.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {voiceOption.gender === 'female' ? '♀' : 
                               voiceOption.gender === 'male' ? '♂' : '?'}
                            </span>
                            <span className="text-xs px-1 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {voiceOption.accent}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            {selectedVoice && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <strong>Selected:</strong> {selectedVoice.name} ({selectedVoice.lang})
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Speed: {rate[0].toFixed(1)}x
              </label>
              <Slider
                value={rate}
                onValueChange={setRate}
                min={0.1}
                max={3}
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
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Volume: {Math.round(volume[0] * 100)}%
              </label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button 
            onClick={handleSpeak}
            size="lg"
            className="px-8"
            disabled={!text.trim() || voices.length === 0}
          >
            {isPlaying && !isPaused ? (
              <>
                <Square className="w-5 h-5 mr-2" />
                Stop
              </>
            ) : isPaused ? (
              <>
                <Play className="w-5 h-5 mr-2" />
                Resume
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
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">🌍 Multi-Language Support:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
            {Object.keys(groupedVoices).slice(0, 8).map(lang => (
              <div key={lang} className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                {lang}
              </div>
            ))}
            {Object.keys(groupedVoices).length > 8 && (
              <div className="text-blue-600 font-medium">
                +{Object.keys(groupedVoices).length - 8} more...
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">💡 Pro Tips:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Use punctuation for natural pauses and intonation</li>
            <li>• Different voices have unique characteristics - experiment!</li>
            <li>• Adjust speed and pitch for better clarity</li>
            <li>• Some languages may have limited voice options</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextToVoiceConverter;
