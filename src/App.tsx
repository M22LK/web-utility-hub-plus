
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import ImageCompressor from '@/pages/tools/ImageCompressor';
import PasswordGenerator from '@/pages/tools/PasswordGenerator';
import QRGenerator from '@/pages/tools/QRGenerator';
import TextCounter from '@/pages/tools/TextCounter';
import CaseConverter from '@/pages/tools/CaseConverter';
import JSONFormatter from '@/pages/tools/JSONFormatter';
import UUIDGenerator from '@/pages/tools/UUIDGenerator';
import ColorPalette from '@/pages/tools/ColorPalette';
import HashGenerator from '@/pages/tools/HashGenerator';
import Base64Encoder from '@/pages/tools/Base64Encoder';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
          <Route path="/tools/password-generator" element={<PasswordGenerator />} />
          <Route path="/tools/qr-generator" element={<QRGenerator />} />
          <Route path="/tools/text-counter" element={<TextCounter />} />
          <Route path="/tools/case-converter" element={<CaseConverter />} />
          <Route path="/tools/json-formatter" element={<JSONFormatter />} />
          <Route path="/tools/uuid-generator" element={<UUIDGenerator />} />
          <Route path="/tools/color-palette" element={<ColorPalette />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/base64-encoder" element={<Base64Encoder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
