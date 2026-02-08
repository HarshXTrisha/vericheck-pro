# VeriCheck Pro - Academic Integrity Suite

A professional plagiarism detection and AI content analysis platform powered by Google Gemini AI.

## Features

- **Plagiarism Detection**: Web-scale similarity analysis using Google Search grounding
- **AI Content Detection**: Advanced pattern recognition for LLM-generated content
- **Document Support**: PDF, DOCX, and TXT file uploads
- **Professional Reports**: Turnitin-style originality reports with source highlighting
- **Real-time Analysis**: Fast processing with progress tracking
- **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS
- **Backend**: Vercel Serverless Functions
- **AI**: Google Gemini 1.5 Flash with Search Grounding
- **Icons**: Lucide React
- **Document Parsing**: PDF.js, Mammoth.js

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vericheck-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   
   In your Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key
   - Redeploy the project

### Deploy to Other Platforms

The app uses Vercel Serverless Functions. For other platforms:
- **Netlify**: Use Netlify Functions (requires adaptation)
- **AWS**: Use Lambda functions (requires adaptation)
- **Self-hosted**: Set up Express.js backend for API routes

## Project Structure

```
vericheck-pro/
├── api/                    # Serverless API functions
│   └── analyze.ts         # Main analysis endpoint
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── FileUpload.tsx     # File upload component
│   ├── AnalysisReportView.tsx  # Report viewer
│   ├── ErrorBoundary.tsx  # Error handling
│   └── LoadingScreen.tsx  # Loading state
├── services/              # API services
│   └── geminiService.ts   # Gemini API client
├── types.ts               # TypeScript types
├── App.tsx                # Root component
├── index.tsx              # Entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
└── vercel.json            # Vercel configuration
```

## Security Features

- ✅ API keys stored server-side only
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ Rate limiting ready
- ✅ Error boundaries for crash protection
- ✅ No sensitive data in client bundle

## API Endpoints

### POST `/api/analyze`

Analyzes text for plagiarism and AI-generated content.

**Request Body:**
```json
{
  "text": "Text to analyze...",
  "fileName": "document.txt"
}
```

**Response:**
```json
{
  "id": "VERI-ABC123",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "fileName": "document.txt",
  "overallSimilarity": 15,
  "internetSimilarity": 10,
  "publicationSimilarity": 5,
  "studentSimilarity": 0,
  "aiProbability": 25,
  "wordCount": 500,
  "matches": [...],
  "aiResult": {...},
  "content": "...",
  "receipt": {...}
}
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

### Vite Configuration

The app uses Vite for fast development and optimized production builds. Key features:
- Code splitting for optimal loading
- Tree shaking for smaller bundles
- Hot module replacement in development

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

- Maximum text length: 50,000 characters
- Analysis time: 15-30 seconds per document
- Gemini API rate limits apply
- Search grounding availability depends on Gemini API

## Troubleshooting

### "Cloud API connection failed"
- Check that `GEMINI_API_KEY` is set correctly
- Verify API key is valid at [Google AI Studio](https://aistudio.google.com)

### "Unable to connect to analysis server"
- Ensure backend API is running
- Check network connection
- Verify CORS settings

### PDF/DOCX parsing fails
- Ensure file is not encrypted or corrupted
- Try converting to TXT format
- Check browser console for specific errors

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section

## Acknowledgments

- Google Gemini AI for analysis capabilities
- Turnitin for UI/UX inspiration
- Open source community for amazing tools

---

**Note**: This is an educational tool. Always verify results and use in accordance with your institution's academic integrity policies.
