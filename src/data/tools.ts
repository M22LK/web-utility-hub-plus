
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  route: string;
  featured?: boolean;
  popular?: boolean;
}

export const tools: Tool[] = [
  // Image Tools
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress JPEG, PNG, WebP images without losing quality',
    category: 'image',
    icon: '🗜️',
    route: '/tools/image-compressor',
    featured: true,
    popular: true
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to any dimensions',
    category: 'image',
    icon: '📐',
    route: '/tools/image-resizer'
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop images to perfect size',
    category: 'image',
    icon: '✂️',
    route: '/tools/image-cropper'
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert between PNG, JPEG, WebP, GIF formats',
    category: 'image',
    icon: '🔄',
    route: '/tools/image-converter'
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    description: 'Remove background from images using AI',
    category: 'image',
    icon: '🖼️',
    route: '/tools/background-remover'
  },
  {
    id: 'image-filter',
    name: 'Image Filter',
    description: 'Apply filters and effects to images',
    category: 'image',
    icon: '🎨',
    route: '/tools/image-filter'
  },
  {
    id: 'image-metadata',
    name: 'Image Metadata Viewer',
    description: 'View and remove EXIF data from images',
    category: 'image',
    icon: '📊',
    route: '/tools/image-metadata'
  },

  // PDF Tools
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    description: 'Merge multiple PDF files into one',
    category: 'pdf',
    icon: '📋',
    route: '/tools/pdf-merger',
    popular: true
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    description: 'Split PDF into separate pages or ranges',
    category: 'pdf',
    icon: '📄',
    route: '/tools/pdf-splitter'
  },
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    description: 'Reduce PDF file size',
    category: 'pdf',
    icon: '🗜️',
    route: '/tools/pdf-compressor'
  },
  {
    id: 'pdf-to-images',
    name: 'PDF to Images',
    description: 'Convert PDF pages to PNG/JPEG images',
    category: 'pdf',
    icon: '🖼️',
    route: '/tools/pdf-to-images'
  },
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    description: 'Create PDF from multiple images',
    category: 'pdf',
    icon: '📸',
    route: '/tools/images-to-pdf'
  },
  {
    id: 'pdf-password-remover',
    name: 'PDF Password Remover',
    description: 'Remove password protection from PDF',
    category: 'pdf',
    icon: '🔓',
    route: '/tools/pdf-password-remover'
  },
  {
    id: 'pdf-password-protector',
    name: 'PDF Password Protector',
    description: 'Add password protection to PDF',
    category: 'pdf',
    icon: '🔒',
    route: '/tools/pdf-password-protector'
  },

  // Text Tools
  {
    id: 'text-counter',
    name: 'Text Counter',
    description: 'Count words, characters, paragraphs',
    category: 'text',
    icon: '🔢',
    route: '/tools/text-counter'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to uppercase, lowercase, title case',
    category: 'text',
    icon: '🔤',
    route: '/tools/case-converter'
  },
  {
    id: 'text-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text',
    category: 'text',
    icon: '📝',
    route: '/tools/text-generator'
  },
  {
    id: 'text-diff',
    name: 'Text Diff',
    description: 'Compare two texts and find differences',
    category: 'text',
    icon: '⚖️',
    route: '/tools/text-diff'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions',
    category: 'text',
    icon: '🔍',
    route: '/tools/regex-tester'
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs',
    category: 'text',
    icon: '🔗',
    route: '/tools/url-encoder'
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    category: 'text',
    icon: '🔐',
    route: '/tools/base64-encoder'
  },

  // Converters
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate JSON data',
    category: 'converter',
    icon: '📊',
    route: '/tools/json-formatter'
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    description: 'Convert CSV files to JSON format',
    category: 'converter',
    icon: '🔄',
    route: '/tools/csv-to-json'
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Format and validate XML data',
    category: 'converter',
    icon: '📋',
    route: '/tools/xml-formatter'
  },
  {
    id: 'markdown-to-html',
    name: 'Markdown to HTML',
    description: 'Convert Markdown to HTML',
    category: 'converter',
    icon: '📄',
    route: '/tools/markdown-to-html'
  },
  {
    id: 'html-to-markdown',
    name: 'HTML to Markdown',
    description: 'Convert HTML to Markdown',
    category: 'converter',
    icon: '📝',
    route: '/tools/html-to-markdown'
  },
  {
    id: 'yaml-to-json',
    name: 'YAML to JSON',
    description: 'Convert YAML to JSON format',
    category: 'converter',
    icon: '⚡',
    route: '/tools/yaml-to-json'
  },

  // Generators
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords',
    category: 'generator',
    icon: '🔑',
    route: '/tools/password-generator',
    popular: true
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate unique identifiers',
    category: 'generator',
    icon: '🆔',
    route: '/tools/uuid-generator'
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs',
    category: 'generator',
    icon: '📱',
    route: '/tools/qr-generator'
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    description: 'Generate various types of barcodes',
    category: 'generator',
    icon: '📊',
    route: '/tools/barcode-generator'
  },
  {
    id: 'color-palette',
    name: 'Color Palette Generator',
    description: 'Generate beautiful color palettes',
    category: 'generator',
    icon: '🎨',
    route: '/tools/color-palette'
  },
  {
    id: 'gradient-generator',
    name: 'Gradient Generator',
    description: 'Create CSS gradients',
    category: 'generator',
    icon: '🌈',
    route: '/tools/gradient-generator'
  },

  // Utilities
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256 hashes',
    category: 'utility',
    icon: '#️⃣',
    route: '/tools/hash-generator'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units',
    category: 'utility',
    icon: '📏',
    route: '/tools/unit-converter'
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps to dates',
    category: 'utility',
    icon: '⏰',
    route: '/tools/timestamp-converter'
  },
  {
    id: 'ip-lookup',
    name: 'IP Address Lookup',
    description: 'Get information about IP addresses',
    category: 'utility',
    icon: '🌐',
    route: '/tools/ip-lookup'
  },
  {
    id: 'url-shortener',
    name: 'URL Shortener',
    description: 'Create short URLs',
    category: 'utility',
    icon: '🔗',
    route: '/tools/url-shortener'
  },
  {
    id: 'website-screenshot',
    name: 'Website Screenshot',
    description: 'Take screenshots of websites',
    category: 'utility',
    icon: '📸',
    route: '/tools/website-screenshot'
  },
  {
    id: 'dns-lookup',
    name: 'DNS Lookup',
    description: 'Query DNS records',
    category: 'utility',
    icon: '🔍',
    route: '/tools/dns-lookup'
  },
  {
    id: 'whois-lookup',
    name: 'WHOIS Lookup',
    description: 'Get domain registration information',
    category: 'utility',
    icon: '📋',
    route: '/tools/whois-lookup'
  },
  {
    id: 'ssl-checker',
    name: 'SSL Certificate Checker',
    description: 'Check SSL certificate details',
    category: 'utility',
    icon: '🔒',
    route: '/tools/ssl-checker'
  },
  {
    id: 'port-scanner',
    name: 'Port Scanner',
    description: 'Scan open ports on servers',
    category: 'utility',
    icon: '🔍',
    route: '/tools/port-scanner'
  },
  {
    id: 'website-analyzer',
    name: 'Website Analyzer',
    description: 'Analyze website performance and SEO',
    category: 'utility',
    icon: '📊',
    route: '/tools/website-analyzer'
  },
  {
    id: 'credit-card-validator',
    name: 'Credit Card Validator',
    description: 'Validate credit card numbers',
    category: 'utility',
    icon: '💳',
    route: '/tools/credit-card-validator'
  },
  {
    id: 'email-validator',
    name: 'Email Validator',
    description: 'Validate email addresses',
    category: 'utility',
    icon: '📧',
    route: '/tools/email-validator'
  },
  {
    id: 'phone-validator',
    name: 'Phone Number Validator',
    description: 'Validate and format phone numbers',
    category: 'utility',
    icon: '📞',
    route: '/tools/phone-validator'
  },
  {
    id: 'random-number',
    name: 'Random Number Generator',
    description: 'Generate random numbers',
    category: 'utility',
    icon: '🎲',
    route: '/tools/random-number'
  },
  {
    id: 'file-hash',
    name: 'File Hash Calculator',
    description: 'Calculate file checksums',
    category: 'utility',
    icon: '📁',
    route: '/tools/file-hash'
  },
  {
    id: 'speed-test',
    name: 'Internet Speed Test',
    description: 'Test your internet connection speed',
    category: 'utility',
    icon: '⚡',
    route: '/tools/speed-test'
  }
];
