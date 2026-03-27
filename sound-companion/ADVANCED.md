# Advanced Configuration Guide

## 🔌 API Integration

### Groq API Setup

The app is pre-configured to use Groq's Mixtral model, but you can customize it.

#### Free Tier Benefits
- 1000 requests/month free
- Fast inference (5-10 tokens/sec)
- No credit card required initially

#### Configuration in `assets/js/api.js`

```javascript
class AIApiManager {
    constructor() {
        this.groqApiKey = localStorage.getItem('groqApiKey') || '';
        this.groqModel = 'mixtral-8x7b-32768'; // Can change model
        this.baseUrl = 'https://api.groq.com/openai';
    }
}
```

#### Alternative Models

```javascript
// Faster, less capable
this.groqModel = 'gemma-7b-it';

// Better reasoning (slightly slower)
this.groqModel = 'mixtral-8x7b-32768';

// Smaller, faster
this.groqModel = 'llama2-70b-4096';
```

---

## 🎤 Text-to-Speech Options

### Option 1: Web Speech API (Built-in)
Currently used by default. Works in all modern browsers.

**Limitations:**
- Voice quality varies by browser
- No custom voice selection
- Can't download audio directly

**Configuration** in `assets/js/api.js`:
```javascript
generateSpeechWithWebAPI(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Adjust these values
    utterance.rate = 0.95;      // 0.1 to 2 (1 = normal)
    utterance.pitch = 1;        // 0 to 2 (1 = normal)
    utterance.volume = 1;       // 0 to 1 (1 = max)

    // Select specific voice
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0]; // Change index for different voice
}
```

### Option 2: OpenAI TTS API

For higher quality voices and better customization.

**Setup:**
1. Get OpenAI API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add to `assets/js/api.js`:

```javascript
async generateSpeechWithOpenAI(text) {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'tts-1-hd',           // hd for better quality
            input: text,
            voice: 'nova',               // nova, alloy, echo, fable, onyx, shimmer
            speed: 1.0,                  // 0.25 to 4.0
        })
    });

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
}
```

**OpenAI Voice Options:**
- `nova` - Engaging, dynamic
- `alloy` - Clear, balanced
- `echo` - Warm, intimate
- `fable` - Storytelling
- `onyx` - Deep, authoritative
- `shimmer` - Bright, energetic

### Option 3: ElevenLabs API

Premium AI voices with most natural sound.

**Setup:**
1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Get API key from settings
3. Add to `assets/js/api.js`:

```javascript
async generateSpeechWithElevenLabs(text) {
    const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Replace with your voice ID
    
    const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
            method: 'POST',
            headers: {
                'xi-api-key': this.elevenLabsKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                }
            })
        }
    );

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
}
```

---

## 🎨 Styling Customization

### Color Scheme

Edit CSS variables in `assets/css/style.css`:

```css
:root {
    --primary-color: #00d9ff;      /* Main accent color */
    --secondary-color: #1a1a1a;    /* Secondary accent */
    --background: #0a0a0a;         /* Main bg */
    --surface: #1a1a1a;            /* Card bg */
    --surface-light: #2a2a2a;      /* Hover bg */
    --text-primary: #ffffff;       /* Main text */
    --text-secondary: #b3b3b3;     /* Secondary text */
    --accent: #00d9ff;             /* Accent color */
    --border: #333333;             /* Border color */
    --success: #00ff88;            /* Success state */
    --danger: #ff3366;             /* Error state */
}
```

### Light Mode

```css
:root {
    --primary-color: #0066cc;
    --background: #ffffff;
    --surface: #f5f5f5;
    --surface-light: #eeeeee;
    --text-primary: #000000;
    --text-secondary: #666666;
    --border: #dddddd;
}

body {
    background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
}
```

### Custom Theme

```css
/* Cyberpunk theme */
:root {
    --primary-color: #ff00ff;
    --secondary-color: #00ffff;
    --background: #0a0e27;
    --surface: #1a1f38;
}

/* Warm/organic theme */
:root {
    --primary-color: #ff6b35;
    --secondary-color: #f7931e;
    --background: #1a120b;
    --surface: #3d2817;
}
```

---

## 🎯 Prompt Engineering

### Customize Mood Prompts

In `assets/js/api.js`, modify `buildPrompt()`:

```javascript
buildPrompt(videoName, mood) {
    const moodDescriptions = {
        cinematic: 'cinematic, dramatic, with sweeping emotional arcs',
        documentary: 'documentary-style, informative, grounded in reality',
        horror: 'dark, tense, with unsettling undertones',
        poetic: 'poetic, metaphorical, with lyrical sensibility',
        experimental: 'avant-garde, experimental, pushing boundaries',
        // Add your own moods
        noir: 'noir, mysterious, with shadows and intrigue',
        uplifting: 'uplifting, hopeful, with positive energy',
        absurd: 'absurd, humorous, embracing chaos',
    };

    // Customize the prompt template
    return `[Your custom prompt here]`;
}
```

### Advanced Prompting

For better results, structure prompts like:

```javascript
const prompt = `CONTEXT: This is a video called "${videoName}"
STYLE: ${moodStyle}
TASK: Generate creative audio suggestions

RESPONSE FORMAT:
{
    "sceneInterpretation": "...",
    "narrativeText": "...",
    "soundSuggestions": [...],
    "creativeDirection": "..."
}

CONSTRAINTS:
- Be subjective and opinionated
- Suggest specific, actionable ideas
- Match the ${mood} style consistently
- Think like a creative professional`;
```

---

## 🔐 Security Best Practices

### Protecting API Keys

```javascript
// ❌ DON'T: Hardcode keys in code
const key = 'gsk_1234567890';

// ✅ DO: Use environment variables or localStorage
const key = process.env.GROQ_API_KEY;

// ✅ DO: Load from secure backend
const key = await fetch('/api/config').then(r => r.json()).then(d => d.key);
```

### Server-Side Proxy

For production, use a backend proxy:

```javascript
// Instead of direct API call
const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt: userInput })
});
```

Backend (Node.js example):
```javascript
app.post('/api/generate', async (req, res) => {
    const response = await fetch('https://api.groq.com/...', {
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify(req.body)
    });
    res.json(await response.json());
});
```

---

## 📊 Performance Optimization

### Code Splitting

For large deployments, separate files:

```html
<script src="assets/js/api.js"></script>
<script src="assets/js/app.js"></script>
<!-- Lazy load optional features -->
<script type="module">
    import { AdvancedFeatures } from './assets/js/advanced.js';
    // Load only when needed
</script>
```

### Image Optimization

Compress and optimize:
- Use WebP format where possible
- Optimize SVG icons
- Lazy load heavy assets

### Caching Strategy

```javascript
// Cache API responses to reduce API calls
class CacheManager {
    constructor() {
        this.cache = new Map();
    }

    set(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    get(key, maxAge = 3600000) { // 1 hour default
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > maxAge) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }
}

const cache = new CacheManager();
```

---

## 🧪 Testing & Debugging

### Enable Debug Mode

```javascript
// In console
localStorage.setItem('debugMode', 'true');

// In app.js
if (localStorage.getItem('debugMode')) {
    console.log('DEBUG MODE ENABLED');
    window.app = app; // Make app accessible globally
    window.apiManager = apiManager;
}
```

### Mock Different Responses

```javascript
// Override mock data for testing
apiManager.generateMockInterpretation = (fileName, mood) => {
    return {
        sceneInterpretation: "Custom test response",
        // ... rest of response
    };
};
```

### Performance Monitoring

```javascript
class PerformanceMonitor {
    static measure(label, fn) {
        const start = performance.now();
        const result = fn();
        const duration = performance.now() - start;
        console.log(`${label}: ${duration.toFixed(2)}ms`);
        return result;
    }
}

// Usage
PerformanceMonitor.measure('Generate interpretation', 
    () => apiManager.generateInterpretation(fileName, mood)
);
```

---

## 🚀 Deployment

### Local Server

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

### Production Checklist

- [ ] Remove debug logging
- [ ] Minify CSS and JavaScript
- [ ] Add HTTPS
- [ ] Set up backend for API key management
- [ ] Enable CORS if needed
- [ ] Add error tracking (Sentry, etc.)
- [ ] Monitor API usage
- [ ] Set up rate limiting

### Docker Deployment

```dockerfile
FROM nginx:latest
COPY . /usr/share/nginx/html
EXPOSE 80
```

---

## 📈 Analytics Integration

```javascript
// Track user interactions
function trackEvent(eventName, data) {
    if (window.gtag) {
        gtag('event', eventName, data);
    }
}

// Usage
generateBtn.addEventListener('click', () => {
    trackEvent('generate_clicked', {
        mood: currentMood,
        videoFormat: currentVideoFile.type
    });
});
```

---

## 🔄 Continuous Improvement

### A/B Testing

```javascript
class ABTest {
    constructor(testName, variantA, variantB) {
        this.testName = testName;
        this.variant = Math.random() > 0.5 ? 'A' : 'B';
    }

    getVariant() {
        return this.variant === 'A' ? this.variantA : this.variantB;
    }

    log(outcome) {
        console.log(`${this.testName}: ${this.variant} - ${outcome}`);
    }
}
```

---

## 📞 Support & Troubleshooting

Check [main README.md](README.md) for common issues and solutions.

For advanced issues, check browser console for detailed error messages.

---

## 🎓 Learning Resources

- [Groq API Documentation](https://console.groq.com/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech)
- [MDN Web Docs](https://developer.mozilla.org/)

---

Happy customizing! 🚀
