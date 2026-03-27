# AI Sound Companion - Project Overview

## 📋 What You've Created

A speculative design website that simulates an intelligent audio assistant for creative video production. The AI Sound Companion watches videos and generates subjective interpretations with voice-over suggestions and sound design ideas.

---

## 📂 File Structure

```
sound-companion/
│
├── index.html                 # Main interface
├── README.md                  # Full documentation
├── QUICKSTART.md             # Quick setup & usage guide
├── ADVANCED.md               # Advanced configuration
├── PROJECT_OVERVIEW.md       # This file
│
└── assets/
    ├── css/
    │   └── style.css         # Dark minimal styling
    │
    └── js/
        ├── app.js            # Main app logic (500+ lines)
        └── api.js            # AI & TTS integration (300+ lines)
```

---

## 🎮 How It Works

### User Flow

```
User Opens App
    ↓
Uploads Video (MP4/MOV/WebM)
    ↓
Video Preview Appears
    ↓
Clicks "Generate Sound Ideas"
    ↓
API Query to Generate Text Responses
    ↓
Response Displayed (Scene, Narration, Sounds, Direction)
    ↓
User Clicks "Play Voice" (TTS)
    ↓
Narration Plays with Waveform Animation
    ↓
User Can Switch Moods & Regenerate
    ↓
Download Text or Upload New Video
```

### Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│              Browser (Client)                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────┐         ┌──────────────┐       │
│  │  HTML/CSS UI  │         │ JavaScript   │       │
│  │  (index.html) │         │ (app.js)     │       │
│  └───────────────┘         └──────────────┘       │
│                                                     │
│         ↓          ↓           ↓         ↓         │
│                                                     │
│  ┌────────────────────────────────────────┐       │
│  │  API Integration (api.js)               │       │
│  │  ├─ Groq API (LLM)                     │       │
│  │  └─ Web Speech API (TTS)               │       │
│  └────────────────────────────────────────┘       │
│                                                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
          ┌─────────────────────────┐
          │   External APIs         │
          │                         │
          │  ├─ Groq API           │
          │  │  (Text Generation)  │
          │  │                     │
          │  └─ Web Speech API     │
          │     (Browser native)   │
          │                        │
          └─────────────────────────┘
```

---

## 🔌 APIs & Services

### 1. Groq API (LLM)
- **Purpose**: Generate AI interpretations
- **Model**: Mixtral-8x7b-32768
- **Input**: Video filename + mood style
- **Output**: JSON with interpretations
- **Cost**: Free tier available
- **Fallback**: Built-in mock responses

### 2. Web Speech API (TTS)
- **Purpose**: Convert text to speech
- **Browser**: Native implementation
- **Voices**: System voices
- **Features**: Rate, pitch, volume control
- **Fallback**: Dialog saying synthesis unavailable

---

## 🎨 Key Features Explained

### Video Upload
- Accepts MP4, MOV, WebM formats
- Uses File API to read local files
- Creates blob URLs for preview
- No server upload (local only)

### AI Interpretation
- Analyzes filename to infer context
- Uses zero-shot prompting
- Generates structured JSON response
- Fallback mock data for demo mode

### Mood Modes
- 5 predefined styles (cinematic, doc, horror, poetic, experimental)
- Each generates different prompt
- Fast regeneration (reuses existing video)
- User toggles between moods

### Text-to-Speech
- Web Speech API for narration
- Waveform animation during playback
- Customizable voice parameters
- Works in all modern browsers

### Download Feature
- Exports all interpretations as text
- Formatted with headers and structure
- Timestamp included
- Ready for spreadsheets/documents

---

## ⚙️ Core Technologies

### Frontend
- **HTML5**: Semantic structure, video element
- **CSS3**: Modern styling, animations, gradients
- **JavaScript ES6+**: Classes, async/await, Fetch API

### APIs
- **Groq API**: Cloud-based LLM inference
- **Web Speech API**: Browser-native TTS
- **File API**: Local video handling
- **LocalStorage**: Key persistence

### Browser APIs Used
- Fetch API (HTTP requests)
- File API (video upload)
- Blob API (file handling)
- SpeechSynthesis API (audio)
- localStorage (client storage)

---

## 🎯 Main Classes & Methods

### SoundCompanionApp Class
```javascript
class SoundCompanionApp {
    // Core methods
    handleVideoUpload()        // Process uploaded video
    generateInterpretation()   // Query API for response
    changeMood()              // Switch between moods
    playVoice()               // Generate speech
    downloadResponse()         // Export as text
    resetApp()                // Start over
}
```

### AIApiManager Class
```javascript
class AIApiManager {
    // AI methods
    generateInterpretation()   // Query Groq API
    buildPrompt()             // Create mood-specific prompt
    generateMockInterpretation() // Fallback responses
    
    // TTS methods
    generateSpeech()          // Convert text to audio
    generateSpeechWithWebAPI() // Browser speech synthesis
}
```

---

## 🎨 Design Principles

### Visual Language
- **Minimal**: Remove unnecessary elements
- **Dark theme**: Cyberware/tech aesthetic
- **Cyan accents**: Tech/digital feel (#00d9ff)
- **Speaker-inspired**: Waveform animations, circular icons
- **Smooth interactions**: Transitions and animations

### User Experience
- **Clear workflow**: Upload → Generate → Explore → Share
- **Responsive design**: Works mobile and desktop
- **Accessibility**: Keyboard navigation, focus states
- **Progressive enhancement**: Works without JavaScript (fallback)

### Typography
- **Segoe UI/system fonts**: Clean, modern
- **Generous sizing**: Large headings, readable text
- **Letter spacing**: Adds sophistication
- **All-caps labels**: Visual hierarchy

---

## 📊 Data Flow

### Interpretation Generation
```
User uploads video "sunset_beach.mp4"
    ↓
App extracts filename: "sunset_beach"
    ↓
User selects mood: "poetic"
    ↓
buildPrompt() creates:
    "Interpret 'sunset_beach' in poetic style..."
    ↓
Groq API receives prompt
    ↓
Returns JSON:
{
    "sceneInterpretation": "...",
    "narrativeText": "...",
    "soundSuggestions": [...],
    "creativeDirection": "..."
}
    ↓
displayResponse() populates UI with results
```

### Text-to-Speech Flow
```
User clicks "Play Voice"
    ↓
playVoice() extracts narrative text
    ↓
Show waveform animation
    ↓
generateSpeech() creates SpeechSynthesisUtterance
    ↓
Browser reads text aloud
    ↓
Hide waveform when done
```

---

## 🚀 How to Run

### Locally
1. Clone or download the project
2. Open `index.html` in a web browser
3. Start uploading and generating!

### With Live Server (VS Code)
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### With Python
```bash
cd sound-companion
python -m http.server 8000
# Visit http://localhost:8000
```

### With Node.js
```bash
cd sound-companion
npx http-server
```

---

## 🔑 Configuration Options

### Set API Key
```javascript
// Browser console
apiManager.setApiKey('gsk_your_key_here');

// Or in HTML
<script>
    apiManager.setApiKey('gsk_your_key_here');
</script>
```

### Customize Colors
Edit CSS variables in `style.css`:
```css
--primary-color: #00d9ff;    /* Change accent color */
--background: #0a0a0a;      /* Change background */
```

### Adjust Speech Settings
Edit in `api.js`:
```javascript
utterance.rate = 0.95;       /* Speech speed */
utterance.pitch = 1;         /* Voice pitch */
utterance.volume = 1;        /* Volume level */
```

### Add Custom Moods
1. Edit `buildPrompt()` in `api.js`
2. Add mood to `moodDescriptions` object
3. Add button to `index.html`

---

## 📈 Customization Possibilities

### Easy Customizations
- Colors and fonts
- Mood styles and prompts
- Speech parameters
- Landing page text

### Medium Customizations
- Add new API integrations
- Implement different TTS services
- Add video analysis features
- Create user accounts

### Advanced Customizations
- Backend API proxy
- Database for saving generations
- Video frame extraction
- Real video analysis
- Multi-user collaboration

---

## 🐞 Common Issues & Solutions

### Issue: "Generate button not working"
**Solution**: Check browser console for errors, reload page

### Issue: "Speech not playing"
**Solution**: Check volume, enable speech synthesis in browser settings

### Issue: "API errors"
**Solution**: Verify API key is correct, check API quota

### Issue: "Video won't upload"
**Solution**: Use supported format (MP4, MOV, WebM), check file size

See [README.md](README.md) for more troubleshooting.

---

## 📚 Learning Resources

### For Understanding This Project
- [Web APIs on MDN](https://developer.mozilla.org/en-US/docs/Web/API)
- [JavaScript Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [CSS Grid & Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### For Extending This Project
- [Groq API Docs](https://console.groq.com/docs)
- [TTS Services](https://platform.openai.com/docs/guides/text-to-speech)
- [Web APIs Reference](https://developer.mozilla.org/en-US/docs/Web/API)

---

## 🎓 Educational Value

### Concepts Demonstrated
- **Prompt Engineering**: How to craft prompts for AI
- **API Integration**: Calling external services
- **State Management**: Managing app state with classes
- **Event Handling**: Responding to user interactions
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Fallbacks and graceful degradation
- **User Experience**: Flow and feedback
- **Creative AI**: AI as creative tool, not just utility

### Use Cases
- Teaching AI integration
- Understanding creative AI
- Learning web development
- Experimenting with prompts
- Design inspiration tool
- Speculative design project

---

## 📊 Project Statistics

- **HTML**: ~350 lines (clean semantic structure)
- **CSS**: ~600+ lines (minimal dark design)
- **JavaScript**: ~800+ lines (core logic + API integration)
- **Supported Formats**: 3 video types (MP4, MOV, WebM)
- **Mood Modes**: 5 creative styles
- **AI Models**: Mixtral-8x7b (primary), with mock fallback
- **TTS Options**: Web Speech API (built-in) + extensible for others

---

## 🚀 Next Steps

### To Use It Now
1. Open `index.html` in browser
2. Upload a video
3. Click "Generate Sound Ideas"
4. Explore different moods!

### To Customize It
1. Check [QUICKSTART.md](QUICKSTART.md) for API setup
2. Edit CSS for colors/styling
3. Modify prompts in `api.js`
4. See [ADVANCED.md](ADVANCED.md) for deep customization

### To Deploy It
1. Host on GitHub Pages, Netlify, or any static host
2. Use backend proxy for API key management
3. Set up analytics and monitoring
4. Share with creators and enthusiasts!

---

## 💡 Design Philosophy

This project embodies **speculative design** thinking:
- AI as creative collaborator, not just tool
- Subjective interpretation over objective analysis
- Exploring how AI "sees" and "interprets" content
- Using technology to inspire human creativity
- Questioning assumptions about automation

The AI Sound Companion isn't meant to replace human creativity—it's meant to augment it, offer perspectives, and break creative blocks through AI-generated inspiration.

---

## 📝 License & Credits

Created as a speculative design exploration of AI and creativity.

**Inspired by:**
- Critical design practices
- Futures thinking
- Creative AI applications
- Interactive storytelling

Feel free to modify, extend, and use this for educational and creative purposes!

---

## 🎯 Key Takeaway

The **AI Sound Companion** demonstrates how technology can serve as a creative muse—generating unexpected ideas, offering new perspectives, and helping creators explore possibilities they might not have considered otherwise.

Start exploring! 🚀

---

**Questions?** Check the README.md, QUICKSTART.md, or ADVANCED.md files for more details!
