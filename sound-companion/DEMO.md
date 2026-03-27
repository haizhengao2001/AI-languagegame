# AI Sound Companion - Demo & Testing Guide

## 🎬 Getting Started with Your First Demo

This guide helps you understand how to use the AI Sound Companion and what to expect.

---

## 🚀 Launch the App

### Step 1: Open in Browser
1. Navigate to the `sound-companion` folder
2. Open `index.html` in your web browser
3. You should see the AI Sound Companion interface with:
   - Logo with animated speaker icon
   - "Upload Video" button
   - Dark minimal design

### Step 2: Verify Everything Works
- Look for "Upload Video" button
- Try hovering over the upload area (should light up)
- Check that both mood buttons and controls are visible below

---

## 📹 First Demo: Upload a Video

### Video Requirements
- **Format**: MP4, MOV, or WebM
- **Size**: Any size (larger files take longer to load)
- **Duration**: Any length (the app analyzes filename, not content)
- **Content**: Anything works (landscape, portrait, abstract, etc.)

### Upload Methods
1. **Click Method**: Click "Upload Video" button
2. **Drag Method**: Drag video file onto the upload area
3. **File Dialog**: Click the upload area directly

### What Happens
```
You upload "sunset_at_beach.mp4"
     ↓
Video preview appears
     ↓
"Generate Sound Ideas" button becomes active
     ↓
Mood selection buttons appear below
```

---

## 🤖 Demo 1: Basic Generation (Cinematic Mood)

### Steps
1. Upload a video (any video)
2. Make sure "Cinematic" is selected (default)
3. Click "Generate Sound Ideas"
4. Watch the loading spinner for 1-3 seconds

### What You'll See
```
Scene Interpretation:
"A quiet moment suspended in time. Light filters through, creating shadows 
that dance with intention."

Voice-over Narration:
"In the spaces between moments, we find the truth. The world exhales slowly..."

Sound Design Suggestions:
• distant orchestral swell
• subtle ambient pad
• delicate piano notes
• soft room tone with air

Creative Direction:
"Push deeper into the emotional ambiguity. Consider adding an unexpected 
sound element..."
```

### Try the Features
- **Play Voice**: Click "🔊 Play Voice" to hear narration (waveform animates)
- **Regenerate**: Click "Regenerate Ideas" to get different suggestions
- **Download**: Click "Download Text" to save as file

---

## 🎨 Demo 2: Explore Different Moods

### Steps to Compare Moods

1. **Cinematic** (already generated)
   - Dramatic, emotional, sweeping
   - Watch for words like: "emotional", "intention", "sweeps"

2. **Switch to Documentary**
   - Click "Documentary" button
   - Click "Regenerate Ideas"
   - Watch for: "authentic", "grounded", "everyday"

3. **Switch to Horror**
   - Click "Horror" button
   - Click "Regenerate Ideas"
   - Watch for: "dread", "unease", "unsettling"

4. **Switch to Poetic**
   - Click "Poetic" button
   - Click "Regenerate Ideas"
   - Watch for: "metaphorical", "lyrical", "symbolic"

5. **Switch to Experimental**
   - Click "Experimental" button
   - Click "Regenerate Ideas"
   - Watch for: "unconventional", "avant-garde", "boundary"

### Observation
Notice how the SAME video gets completely different interpretations based on the mood selected. This shows the AI's subjective "taste" in action!

---

## 🔊 Demo 3: Text-to-Speech Playback

### Steps
1. Click "Play Voice" after generating ideas
2. Watch the waveform animation (5 vertical bars moving)
3. Listen as narration is read aloud
4. Button shows "⏸ Playing..." while audio plays

### Voice Parameters
- **Speed**: Normal/steady pace
- **Pitch**: Natural voice
- **Volume**: Full volume (adjust system volume if needed)

### Multi-Playback
- Click "Play Voice" multiple times to hear it again
- Each click restarts the narration
- Waveform animates each time

---

## 📊 Demo 4: Mood Comparison Workflow

### Full Workflow
```
1. Upload: "forest_walk.mp4"
2. Generate (Cinematic mode)
   → Read response
   → Play voice
3. Switch to Horror
   → Regenerate
   → Play voice
   → Notice dramatic difference!
4. Switch to Poetic
   → Regenerate
   → Notice artistic interpretation
5. Download all ideas as text file
```

### Expected Differences

| Mood | Focus | Sound Suggestions |
|------|-------|-------------------|
| Cinematic | Drama, emotion | Orchestral, sweeping |
| Documentary | Facts, reality | Ambient, natural |
| Horror | Fear, tension | Unsettling, eerie |
| Poetic | Meaning, beauty | Lyrical, ethereal |
| Experimental | Innovation | Unconventional, digital |

---

## 💾 Demo 5: Download & Share

### Download Text
1. Click "Download Text" button
2. File downloads: `sound-companion-[timestamp].txt`
3. Open in any text editor
4. Contains all interpretations for this mood

### File Format
```
AI Sound Companion - CINEMATIC Interpretation
Video: sunset_at_beach.mp4
Generated: 3/13/2026, 2:45 PM

=== SCENE INTERPRETATION ===
[Response text here]

=== VOICE-OVER NARRATION ===
[Narration text here]

=== SOUND DESIGN SUGGESTIONS ===
• Sound 1
• Sound 2
• Sound 3
• Sound 4

=== CREATIVE DIRECTION ===
[Creative suggestion here]
```

### Use Downloaded Text
- Copy narration into your screenplay
- Use sound suggestions as reference
- Share creative direction with team
- Combine multiple moods into one document

---

## 🎬 Demo 6: Multi-Video Test

### Test with Different Video Types

#### Simple Video (Landscape)
- Upload landscape video
- Generate ideas
- Should get grounded interpretations

#### Abstract/Artistic Video
- Upload abstract content
- Generate ideas
- Should get more creative/poetic suggestions

#### Action Video
- Upload fast-paced content
- Generate ideas
- Should get energetic descriptions

#### Quiet/Minimal Video
- Upload minimal content
- Generate ideas
- Should get introspective suggestions

### Observation
The AI generates different ideas based on what it infers from the filename and context!

---

## 🔧 Demo 7: UI Interactions

### Test These Features

#### Video Preview
- ✅ Video appears after upload
- ✅ Can play/pause using video controls
- ✅ Timeline scrubber works
- ✅ Can watch any part of video

#### Buttons
- ✅ "Generate Sound Ideas" - disabled until video uploaded
- ✅ Mood buttons - only one can be active at a time
- ✅ "Play Voice" - shows after generation
- ✅ "Regenerate Ideas" - works multiple times
- ✅ "Download Text" - creates text file
- ✅ "Upload New Video" - resets everything

#### Visual Feedback
- ✅ Loading spinner shows during generation
- ✅ Waveform animates during playback
- ✅ Button text changes (e.g., "⏸ Playing...")
- ✅ Hover effects on all interactive elements
- ✅ Active mood button has cyan highlight

#### Responsive Design
- ✅ Works on desktop (full width)
- ✅ Works on tablet (medium width)
- ✅ Works on mobile (responsive layout)
- ✅ Touch-friendly button sizes

---

## 🐛 Testing & Troubleshooting

### Test Scenarios

#### Scenario 1: Speech Not Playing
```
❌ Problem: Clicked "Play Voice" but no sound
✅ Solution:
   - Check system volume (not muted)
   - Try refreshing page
   - Try different browser (Chrome, Safari, Firefox)
   - Check browser microphone permissions
```

#### Scenario 2: Generation Doesn't Work
```
❌ Problem: Clicked "Generate Sound Ideas" but nothing happens
✅ Solution:
   - Check that video is actually selected
   - Look at browser console (F12) for errors
   - Try different video file
   - Clear browser cache and refresh
```

#### Scenario 3: Video Won't Upload
```
❌ Problem: Video file won't upload
✅ Solution:
   - Verify file format (MP4, MOV, WebM only)
   - Try dragging instead of clicking
   - Check file isn't corrupted
   - Try with different video file
```

#### Scenario 4: Mood Buttons Unresponsive
```
❌ Problem: Mood buttons not working
✅ Solution:
   - Make sure video is loaded first
   - Click more precisely on button text
   - Refresh page
   - Try different browser
```

---

## 🎯 Demo Checklist

### Before Presenting/Using

- [ ] Open `index.html` in browser
- [ ] Test video upload (drag or click)
- [ ] Click "Generate Sound Ideas"
- [ ] Verify response appears
- [ ] Click "Play Voice" and listen
- [ ] Switch to different mood
- [ ] Click "Regenerate Ideas"
- [ ] Notice difference from first response
- [ ] Try "Download Text"
- [ ] Click "Upload New Video"
- [ ] Verify UI resets properly

### Performance Check

- [ ] Upload takes <5 seconds
- [ ] Generation takes <3 seconds  
- [ ] Voice plays smoothly
- [ ] Waveform animates smoothly
- [ ] No console errors (F12)
- [ ] Responsive on mobile browser

---

## 📝 Example Test Videos

### Recommended for First Demo
Use these descriptions to test different interpretations:

1. **Simple/Calm** - `peaceful_garden.mp4`
   - Documentary mood gets realistic suggestions
   - Poetic mood gets artistic suggestions

2. **Dark/Moody** - `dark_alley_night.mp4`
   - Horror mood thrives
   - Documentary still finds truth

3. **Abstract** - `geometric_patterns.mp4`
   - Experimental mood gets wild ideas
   - Poetic mood gets philosophical

4. **Action** - `fast_dance.mp4`
   - Cinematic mood adds drama
   - Experimental mood adds weirdness

---

## 🎓 Learning Objectives

After testing, you should understand:

### How the App Works
- [ ] How to upload videos
- [ ] How to generate AI responses
- [ ] How moods affect responses
- [ ] How to play narration
- [ ] How to export results

### How the AI Works
- [ ] Different moods = different prompts
- [ ] AI generates subjective interpretations
- [ ] Same video, different moods = different ideas
- [ ] AI inspiration vs. automation

### How to Use It Creatively
- [ ] Generate sound effects ideas
- [ ] Create voiceover narration
- [ ] Explore creative directions
- [ ] Break creative blocks
- [ ] Collaborate with AI

---

## 💡 Pro Tips

1. **Generate Multiple Times** - Click regenerate several times to get variety
2. **Compare Moods** - See how same video gets different interpretations
3. **Download Everything** - Save multiple interpretations of same video
4. **Share Creative** - Screenshot interesting interpretations
5. **Use as Reference** - Build upon AI suggestions, don't just copy

---

## 🎊 You're Ready!

Now that you understand how the AI Sound Companion works:

1. **Launch** it now: Open `sound-companion/index.html`
2. **Upload** your first video
3. **Generate** some sound ideas
4. **Explore** different moods
5. **Have fun** being creative!

---

## 📞 Need Help?

- **How to use?** → Read QUICKSTART.md
- **Technical details?** → Check PROJECT_OVERVIEW.md
- **Customize it?** → See ADVANCED.md
- **Troubleshoot?** → Look at README.md

---

**Ready to create with AI?** 🎬🎵✨

Open `sound-companion/index.html` and start exploring!
