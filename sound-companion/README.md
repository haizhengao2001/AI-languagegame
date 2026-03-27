# AI Sound Companion

A speculative design project that simulates an intelligent audio assistant for creative video production. The AI Sound Companion watches uploaded videos and provides subjective interpretations, voice-over suggestions, and sound design ideas.

## 🎯 Concept

The AI Sound Companion is imagined as a small smart speaker that functions as a creative collaborator. Rather than providing technical instructions, it offers subjective artistic interpretations and suggestions based on its own "taste" and creative perspective.

## ✨ Features

### Core Functionality

1. **Video Upload**
   - Support for MP4, MOV, and WebM formats
   - Drag-and-drop interface
   - Video preview display

2. **AI Interpretation**
   - Scene interpretation: What the AI "sees" in the video
   - Voice-over narration suggestions
   - Sound design recommendations
   - Creative direction guidance

3. **AI Voice Playback**
   - Text-to-speech narration generation
   - Waveform visualization during playback
   - Browser-native speech synthesis with fallback options

4. **Sound Mood Modes**
   - **Cinematic**: Dramatic, sweeping emotional arcs
   - **Documentary**: Informative, grounded in reality
   - **Horror**: Dark, tense, unsettling
   - **Poetic**: Lyrical, metaphorical, artistic
   - **Experimental**: Avant-garde, boundary-pushing

5. **Additional Features**
   - Download interpretation as text file
   - Regenerate ideas with different moods
   - Minimal, speaker-like interface design

## 🚀 Getting Started

### Basic Setup

1. Open `index.html` in a modern web browser
2. Click "Upload Video" or drag a video onto the upload area
3. Click "Generate Sound Ideas" to get AI interpretations
4. Switch between mood modes to see different creative directions
5. Click "Play Voice" to hear the narration read aloud

### No API Key Required (Demo Mode)

The app works out of the box with built-in mock data. You'll get realistic AI-generated content for demonstrations without any API keys.

### With Real AI Integration (Optional)

To use real AI interpretations, you'll need a Groq API key:

1. Sign up at [Groq](https://console.groq.com)
2. Get your API key from the dashboard
3. The app will securely store it in browser localStorage
4. When ready, add an API key input to `index.html` or use browser console:
   ```javascript
   apiManager.setApiKey('your-groq-api-key-here');
   ```

## 📁 Project Structure

```
sound-companion/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css      # Styling and animations
│   └── js/
│       ├── app.js         # Main application logic
│       └── api.js         # API integration and AI calls
└── README.md              # This file
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Video**: HTML5 Video API
- **Speech**: Web Speech API (for narration playback)
- **AI/LLM**: Groq API with Mixtral-8x7b model (optional, mocked by default)
- **Storage**: Browser localStorage for API key

## 🎨 Design Features

### Visual Design
- **Minimal dark interface** inspired by smart speaker control panels
- **Cyan accent color** (#00d9ff) for visual hierarchy
- **Speaker-inspired waveform animations** during audio playback
- **Smooth transitions and interactions**
- **Responsive design** for mobile and desktop

### User Flow
1. Upload section appears first
2. Upon video upload, preview and controls appear
3. User generates interpretation
4. Full AI response displayed with mood options
5. Can regenerate with different moods or upload new video

## 🔧 Configuration

### Modifying API Settings

In `assets/js/api.js`, you can modify:

```javascript
this.groqModel = 'mixtral-8x7b-32768'; // Change to different model
this.temperature = 0.8; // Creativity level (0-2)
```

### Speech Synthesis Settings

In `assets/js/api.js`, adjust voice parameters:

```javascript
utterance.rate = 0.95;      // Speech speed
utterance.pitch = 1;        // Voice pitch
utterance.volume = 1;       // Volume level
```

### Styling

Edit `assets/css/style.css` to customize:
- Colors via CSS variables (`:root`)
- Font styles and sizes
- Animation speeds
- Layout dimensions

## 📱 Browser Support

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Speech synthesis support varies by browser. All modern browsers support the Web Speech API.

## 🎬 Example Use Cases

1. **Video Creators** - Get quick creative inspiration for sound design
2. **Students** - Explore narrative and audio concepts for projects
3. **Editors** - Break creative blocks with AI suggestions
4. **Sound Designers** - Generate mood boards and concept references
5. **Educators** - Teach students about audio storytelling and mood

## 🔐 Privacy & Data

- No video data is sent to external servers in mock mode
- API keys are stored only in browser localStorage
- Videos are processed locally in the browser
- No cookies or tracking

## 🚧 Advanced Features (Optional)

### Adding Real Text-to-Speech APIs

Replace Web Speech API with:
- **ElevenLabs API** - Premium AI voices
- **Google Cloud Text-to-Speech** - High-quality synthesis
- **OpenAI TTS** - Natural-sounding narration

### Video Analysis

The current implementation uses filename analysis. To add real video analysis:
- Extract frames using Canvas API
- Use vision models for scene understanding
- Generate descriptions from visual content

### Cloud Backend

For production use:
- Backend server for secure API key handling
- Session management
- Result storage and sharing
- Advanced video processing

## 📝 Example Outputs

### Cinematic Mode
```
Scene: A quiet moment suspended in time
Voice: "In the spaces between moments, we find the truth."
Sounds: distant orchestral swell, subtle ambient pad, delicate piano notes
```

### Horror Mode
```
Scene: An ordinary scene charged with unease
Voice: "Beneath the surface, dread takes root..."
Sounds: low frequency hum, unsettling silence, distorted ambient sounds
```

## 🐛 Troubleshooting

### Speech Synthesis Not Working
- Check browser compatibility (enable in settings if needed)
- Try a different browser
- Ensure volume is not muted
- Clear browser cache and reload

### Video Upload Issues
- Verify file format (MP4, MOV, or WebM)
- Check file size (large files may load slowly)
- Try a different video file
- Ensure sufficient browser storage space

### API Integration Issues
- Verify API key is correct
- Check browser console for error messages
- Ensure API quota hasn't been exceeded
- Try mock mode (no API key required)

## 📖 Documentation

### Adding Custom Moods

To add a new mood style, edit `buildPrompt()` in `assets/js/api.js`:

```javascript
const moodDescriptions = {
    myNewMood: 'description of the style here',
    // ... existing moods
};
```

Then add to HTML:
```html
<button class="mood-btn" data-mood="myNewMood">My New Mood</button>
```

## 🎓 Educational Use

This project demonstrates:
- Web API integration
- Audio/video processing in browsers
- Prompt engineering for creative AI
- UI/UX design principles
- Responsive web design
- JavaScript event handling and state management

## 📄 License

Speculative design project. Feel free to modify and use for educational and creative purposes.

## 🙏 Credits

Inspired by critical design thinking, speculative futures, and the intersection of AI and creative practice.

## 💡 Future Enhancements

- Real-time video frame analysis
- Custom voice selection
- Music generation based on mood
- Collaborative features
- History/favorites system
- Export video with AI narration
- Multi-language support

---

**Created with:** Creative coding, speculative design, and a splash of AI imagination.
