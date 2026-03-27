# AI Sound Companion - Quick Start Guide

## 🚀 Launch in 30 Seconds

### Option 1: Demo Mode (No API Key Needed)
1. Open `index.html` in your web browser
2. Upload a video (MP4, MOV, or WebM)
3. Click "Generate Sound Ideas"
4. Toggle between moods and enjoy AI interpretations!

The app generates realistic mock responses automatically.

---

## 🔑 Option 2: With Real AI (Optional)

### Get a Groq API Key

1. **Sign Up**
   - Visit [Groq Console](https://console.groq.com/keys)
   - Create a free account

2. **Get Your API Key**
   - Go to the API Keys section
   - Create a new key
   - Copy the key (you'll only see it once!)

3. **Enable in the App**

   **Method A - Browser Console:**
   ```javascript
   apiManager.setApiKey('gsk_your_actual_key_here');
   ```

   **Method B - Add to HTML (not recommended for production):**
   ```html
   <script>
     document.addEventListener('DOMContentLoaded', () => {
       apiManager.setApiKey('gsk_your_actual_key_here');
     });
   </script>
   ```

   The key is stored in browser localStorage, so you only need to set it once per browser.

---

## 📖 How to Use

### 1. Upload Video
- Click the upload area or drag a video file
- Supported formats: MP4, MOV, WebM
- Video will appear in preview

### 2. Generate Ideas
- Click "Generate Sound Ideas"
- Watch the AI listen and interpret your video
- Responses appear in about 1-5 seconds

### 3. Explore Moods
- Click mood buttons to regenerate with different styles
- Each mood has its own creative interpretation
- Fast regeneration (no need to re-upload)

### 4. Hear the Narration
- Click "Play Voice" to hear the narration read aloud
- Waveform animates while audio plays
- Works in all modern browsers

### 5. Download & Share
- Click "Download Text" to save all ideas as a text file
- Share with collaborators or use as script base

### 6. Try Another Video
- Click "Upload New Video" to start over
- All previous content will be cleared

---

## 🎨 Mood Modes Explained

| Mood | Style | Best For |
|------|-------|----------|
| **Cinematic** | Dramatic, emotional, sweeping | Films, trailers, dramatic content |
| **Documentary** | Grounded, informative, authentic | Educational, real-world content |
| **Horror** | Dark, tense, unsettling | Scary content, suspense, thriller |
| **Poetic** | Lyrical, metaphorical, artistic | Abstract, emotional, experimental |
| **Experimental** | Avant-garde, boundary-pushing | Digital art, unconventional content |

---

## ⚙️ Customization

### Change Speech Rate
Open browser console and run:
```javascript
// Make speech faster (1.5x speed)
apiManager.utterance.rate = 1.5;
```

### Change Voice Pitch
```javascript
// Make voice higher pitched
apiManager.utterance.pitch = 1.5;
```

### Add Custom Mood
Edit `assets/js/api.js`, update the `moodDescriptions` object:
```javascript
moodDescriptions: {
  yourMood: 'description of your mood style',
}
```

Then add button to `index.html`:
```html
<button class="mood-btn" data-mood="yourMood">Your Mood</button>
```

---

## 🔧 Troubleshooting

### "Speech synthesis not working"
- **Chrome/Edge**: Enable "Speech synthesis" in chrome://flags
- **Safari**: Reload the page
- **Firefox**: Try a different mood
- **All**: Check your system volume

### "API calls failing"
- Check your internet connection
- Verify API key is correct
- Ensure API quota not exceeded
- Try demo mode instead (no API needed)

### "Video won't upload"
- Check file format (must be MP4, MOV, or WebM)
- Try a smaller file
- Refresh the page
- Try a different browser

### "Generate button disabled"
- Wait for current generation to complete
- Refresh the page
- Clear browser cache

---

## 📱 Mobile Use

The app works on mobile browsers (iOS Safari, Chrome Mobile, etc.).

**Best experience on:**
- Landscape orientation (more screen space)
- 5G or WiFi (video upload can be slow on cellular)
- Modern browsers (Chrome, Safari, Edge)

---

## 🔒 Privacy & Security

- **No video storage**: Videos stay in your browser only
- **No tracking**: We don't track you
- **API key**: Stored only in YOUR browser's localStorage
- **No data sharing**: Nothing leaves your machine (except API calls if enabled)

---

## 💡 Tips & Tricks

1. **Experiment with fast-paced vs slow videos** - AI interprets them differently
2. **Try abstract/artistic videos** - Generates more creative suggestions
3. **Use dark videos** - Horror mode gives great results
4. **Combine with other tools** - Export text and use with music production software
5. **Share combinations** - Share screenshots of cinematic + horror interpretations

---

## 🎯 Project Ideas

1. **Create a storyboard** - Generate narration for each scene
2. **Explore AI taste** - See how AI interprets different genres
3. **Sound design reference** - Use suggestions as starting points
4. **Teaching tool** - Show students how AI can inspire creativity
5. **Speculative design** - Document AI's aesthetic choices

---

## 📚 Learn More

- **Prompt Engineering**: See how different moods change AI responses
- **Speech Synthesis**: Experiment with voice parameters
- **Video Analysis**: AI interprets based on filename and description
- **Creative AI**: Use this as base for your own AI-assisted tools

---

## ❓ FAQ

**Q: Do I need an API key?**  
A: No! The app works perfectly in demo mode with realistic mock data.

**Q: Can I use this commercially?**  
A: Yes, for your own projects. Check the license for details.

**Q: How long does generation take?**  
A: Usually 1-3 seconds with real API, instant with mock data.

**Q: Can I download the narration as audio?**  
A: Currently plays via browser. Export via your browser's recording tools.

**Q: Is my video data private?**  
A: Yes! Videos never leave your browser in demo mode.

---

## 🎉 Ready to Start?

1. Open `index.html` in your browser
2. Upload a video
3. Click "Generate Sound Ideas"
4. Enjoy AI creativity!

Have fun exploring creative possibilities with AI! 🎬🎵✨
