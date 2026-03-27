/**
 * AI Sound Companion - Main Application Logic
 */

class SoundCompanionApp {
    constructor() {
        this.currentVideoFile = null;
        this.currentResponse = null;
        this.currentMood = 'cinematic';
        this.isGenerating = false;
        this.isSpeaking = false;
        this.audioContext = null;
        this.activeOscillators = [];
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Upload
        this.uploadArea = document.getElementById('uploadArea');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.videoInput = document.getElementById('videoInput');

        // Preview
        this.previewSection = document.getElementById('previewSection');
        this.videoPreview = document.getElementById('videoPreview');
        this.videoFileName = document.getElementById('videoFileName');

        // Controls
        this.controlsSection = document.getElementById('controlsSection');
        this.generateBtn = document.getElementById('generateBtn');

        // Mood
        this.moodSection = document.getElementById('moodSection');
        this.moodButtons = document.querySelectorAll('.mood-btn');

        // Response
        this.responseSection = document.getElementById('responseSection');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.responseContent = document.getElementById('responseContent');

        // Response elements
        this.sceneInterpretation = document.getElementById('sceneInterpretation');
        this.musicDescription = document.getElementById('musicDescription');
        this.playMusicBtn = document.getElementById('playMusicBtn');
        this.soundList = document.getElementById('soundList');
        this.creativeDirection = document.getElementById('creativeDirection');
        this.musicInfo = document.getElementById('musicInfo');

        // Action buttons
        this.regenerateBtn = document.getElementById('regenerateBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.changeVideoSection = document.getElementById('changeVideoSection');
        this.uploadNewBtn = document.getElementById('uploadNewBtn');

        // Audio
        this.audioPlayer = document.getElementById('audioPlayer');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Upload handlers
        this.uploadBtn.addEventListener('click', () => this.videoInput.click());
        this.videoInput.addEventListener('change', (e) => this.handleVideoUpload(e));
        this.uploadArea.addEventListener('click', () => this.videoInput.click());
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Generate button
        this.generateBtn.addEventListener('click', () => this.generateInterpretation());

        // Mood buttons
        this.moodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.changeMood(e.target));
        });

        // Action buttons
        this.playMusicBtn.addEventListener('click', () => this.generateMusic());
        this.regenerateBtn.addEventListener('click', () => this.generateInterpretation());
        this.downloadBtn.addEventListener('click', () => this.downloadResponse());
        this.uploadNewBtn.addEventListener('click', () => this.resetApp());
    }

    /**
     * Load available voices for speech synthesis
     */
    loadVoices() {
        if ('onvoiceschanged' in window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                console.log('Voices loaded');
            };
        }
    }

    /**
     * Handle video file upload
     */
    handleVideoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.loadVideo(file);
    }

    /**
     * Handle drag over event
     */
    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.uploadArea.style.borderColor = 'var(--primary-color)';
        this.uploadArea.style.backgroundColor = 'rgba(0, 217, 255, 0.1)';
    }

    /**
     * Handle drop event
     */
    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.uploadArea.style.borderColor = '';
        this.uploadArea.style.backgroundColor = '';

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('video/')) {
                this.loadVideo(file);
            } else {
                alert('Please upload a valid video file');
            }
        }
    }

    /**
     * Load and display video
     */
    loadVideo(file) {
        // Validate file type
        const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload an MP4, MOV, or WebM file');
            return;
        }

        this.currentVideoFile = file;
        const fileURL = URL.createObjectURL(file);

        // Update video element
        this.videoPreview.src = fileURL;
        this.videoFileName.textContent = file.name;

        // Update UI
        this.uploadArea.style.display = 'none';
        this.previewSection.style.display = 'block';
        this.controlsSection.style.display = 'block';
        this.moodSection.style.display = 'block';
        this.changeVideoSection.style.display = 'block';

        // Reset response
        this.responseSection.style.display = 'none';
        this.currentResponse = null;
    }

    /**
     * Change mood/style
     */
    changeMood(button) {
        // Update active state
        this.moodButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update mood
        this.currentMood = button.dataset.mood;

        // Regenerate if we have a response
        if (this.currentResponse) {
            this.generateInterpretation();
        }
    }

    /**
     * Generate AI interpretation
     */
    async generateInterpretation() {
        if (!this.currentVideoFile || this.isGenerating) return;

        // Stop any playing music immediately
        this.stopMusic();

        this.isGenerating = true;
        this.generateBtn.disabled = true;
        this.regenerateBtn.disabled = true;

        // Show loading state
        this.responseSection.style.display = 'block';
        this.loadingSpinner.style.display = 'block';
        this.responseContent.style.display = 'none';

        try {
            console.log('Starting interpretation for:', this.currentVideoFile.name, 'with mood:', this.currentMood);
            
            // Get AI response
            const response = await apiManager.generateInterpretation(
                this.currentVideoFile.name,
                this.currentMood
            );

            console.log('Response received:', response);
            
            this.currentResponse = response;
            this.displayResponse(response);

            // Show response content
            this.loadingSpinner.style.display = 'none';
            this.responseContent.style.display = 'block';

            // Show generate music button
            this.playMusicBtn.style.display = 'inline-block';

        } catch (error) {
            console.error('Error generating interpretation:', error);
            console.error('Error details:', error.message);
            console.error('Stack:', error.stack);
            alert('Error generating interpretation. Check browser console for details.');
            this.responseSection.style.display = 'none';
        } finally {
            this.isGenerating = false;
            this.generateBtn.disabled = false;
            this.regenerateBtn.disabled = false;
        }
    }

    /**
     * Display AI response
     */
    displayResponse(response) {
        // Ensure response has required properties
        if (!response) {
            console.error('Response is undefined');
            return;
        }

        // Scene interpretation
        this.sceneInterpretation.textContent = response.sceneInterpretation || 'No interpretation available';

        // Music description
        this.musicDescription.textContent = response.musicDescription || 'No music description available';

        // Music elements (was sound suggestions)
        this.soundList.innerHTML = '';
        if (Array.isArray(response.musicElements)) {
            response.musicElements.forEach(element => {
                const li = document.createElement('li');
                li.textContent = element;
                this.soundList.appendChild(li);
            });
        } else {
            console.warn('musicElements is not an array:', response.musicElements);
        }

        // Creative direction
        this.creativeDirection.textContent = response.creativeDirection || 'No creative direction available';
    }

    /**
     * Stop any playing music immediately
     */
    stopMusic() {
        // Stop audio context if it exists
        if (this.audioContext && this.audioContext.state === 'running') {
            // Stop all oscillators
            this.activeOscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Already stopped
                }
            });
            this.activeOscillators = [];
            
            // Close and recreate audio context
            this.audioContext.close();
            this.audioContext = null;
        }
        
        // Reset speaking flag
        this.isSpeaking = false;
        
        // Reset button state
        if (this.playMusicBtn) {
            this.playMusicBtn.disabled = false;
            this.playMusicBtn.querySelector('span').textContent = '🎵 Generate Music';
        }
        
        // Hide music info
        if (this.musicInfo) {
            this.musicInfo.style.display = 'none';
        }
    }

    /**
     * Generate and visualize music
     */
    async generateMusic() {
        if (!this.currentResponse) return;

        try {
            // Stop any currently playing music immediately
            this.stopMusic();
            
            this.isSpeaking = true;
            this.playMusicBtn.disabled = true;
            this.playMusicBtn.querySelector('span').textContent = '🎵 Playing...';

            // Show music visualization
            this.musicInfo.style.display = 'block';

            // Get video duration
            const videoDuration = this.videoPreview.duration || 8; // Default 8 seconds if not available
            
            // Generate and play music based on current mood and video duration
            await apiManager.generateMusic(this.currentMood, videoDuration);

            this.playMusicBtn.querySelector('span').textContent = '🎵 Generate Music';
            this.musicInfo.style.display = 'none';

        } catch (error) {
            console.error('Error generating music:', error);
            alert('Error generating music. Please check your browser audio settings.');
            this.musicInfo.style.display = 'none';
            this.playMusicBtn.querySelector('span').textContent = '🎵 Generate Music';

        } finally {
            this.isSpeaking = false;
            this.playMusicBtn.disabled = false;
        }
    }

    /**
     * Download response as text
     */
    downloadResponse() {
        if (!this.currentResponse) return;

        const text = `AI Sound Companion - ${this.currentMood.toUpperCase()} Music Interpretation
Video: ${this.currentVideoFile.name}
Generated: ${new Date().toLocaleString()}

=== SCENE INTERPRETATION ===
${this.currentResponse.sceneInterpretation}

=== MUSIC DESCRIPTION ===
${this.currentResponse.musicDescription}

=== MUSIC ELEMENTS ===
${this.currentResponse.musicElements.map(e => `• ${e}`).join('\n')}

=== CREATIVE DIRECTION ===
${this.currentResponse.creativeDirection}
`;

        // Create blob and download
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sound-companion-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Reset app for new video
     */
    resetApp() {
        // Stop any ongoing music immediately
        this.stopMusic();

        // Reset variables
        this.currentVideoFile = null;
        this.currentResponse = null;
        this.isSpeaking = false;

        // Update UI
        this.uploadArea.style.display = 'block';
        this.previewSection.style.display = 'none';
        this.controlsSection.style.display = 'none';
        this.moodSection.style.display = 'none';
        this.responseSection.style.display = 'none';
        this.changeVideoSection.style.display = 'none';

        // Reset video input
        this.videoInput.value = '';

        // Reset mood
        this.currentMood = 'cinematic';
        this.moodButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mood === 'cinematic') {
                btn.classList.add('active');
            }
        });

        // Reset buttons
        this.playMusicBtn.style.display = 'none';
        this.generateBtn.disabled = false;
        this.regenerateBtn.disabled = false;
    }
}

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check for API key in localStorage
    const savedKey = localStorage.getItem('groqApiKey');
    
    if (!savedKey) {
        // Optionally show a dialog to set API key
        // For now, the app will work with mock data as fallback
        console.log('No API key set. Using mock data for demonstrations.');
    }

    // Initialize the app
    const app = new SoundCompanionApp();
    app.initializeElements();
    app.attachEventListeners();
    app.loadVoices();
    console.log('AI Sound Companion initialized');
});
