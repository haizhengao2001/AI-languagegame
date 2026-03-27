/**
 * API Configuration and Integration
 * Handles Music Generation
 */

class AIApiManager {
    constructor() {
        try {
            // Replace with your actual API key
            this.groqApiKey = localStorage.getItem('groqApiKey') || '';
            this.groqModel = 'mixtral-8x7b-32768';
            this.baseUrl = 'https://api.groq.com/openai';
            console.log('AIApiManager initialized successfully');
        } catch (error) {
            console.error('Error initializing AIApiManager:', error);
        }
    }

    /**
     * Generate AI interpretation of video
     * @param {string} videoFileName - Name of the uploaded video
     * @param {string} mood - The mood/style to use
     * @returns {Promise<Object>} AI response with interpretations
     */
    async generateInterpretation(videoFileName, mood = 'cinematic') {
        try {
            console.log('generateInterpretation called with:', videoFileName, mood);
            
            // Always use mock data (reliable fallback)
            const mockData = this.generateMockInterpretation(videoFileName, mood);
            console.log('Mock data generated successfully:', mockData);
            return mockData;

        } catch (error) {
            console.error('Error in generateInterpretation:', error);
            console.error('Error message:', error.message);
            console.error('Stack trace:', error.stack);
            throw error;
        }
    }

    /**
     * Build the prompt for video interpretation
     */
    buildPrompt(videoName, mood) {
        const moodDescriptions = {
            cinematic: 'cinematic, dramatic, with sweeping emotional arcs',
            documentary: 'documentary-style, informative, grounded in reality',
            horror: 'dark, tense, with unsettling undertones',
            poetic: 'poetic, metaphorical, with lyrical sensibility',
            experimental: 'avant-garde, experimental, pushing boundaries'
        };

        const moodStyle = moodDescriptions[mood] || moodDescriptions.cinematic;

        return `I'm looking at a video called "${videoName}". Please suggest what kind of music would accompany this video in a ${moodStyle} style. 

Respond ONLY with valid JSON (no markdown, no code blocks) in this exact format:
{
    "sceneInterpretation": "Your creative interpretation of what's happening in the video (2-3 sentences)",
    "musicDescription": "A detailed description of the perfect music for this video, including instruments, mood, tempo, dynamics, and emotional quality (3-4 sentences)",
    "musicElements": ["element 1", "element 2", "element 3", "element 4"],
    "creativeDirection": "A creative suggestion for how the composer could evolve the music to deepen the impact (2-3 sentences)"
}

Focus on musicality - instruments, tempo, mood, emotional tone. Be subjective and visionary.`;
    }

    /**
     * Generate mock interpretation (fallback)
     */
    generateMockInterpretation(videoFileName, mood = 'cinematic') {
        try {
            const mockResponses = {
                cinematic: {
                    sceneInterpretation: "A quiet moment suspended in time. Light filters through, creating shadows that dance with intention. There's a sense of anticipation, as if something significant is about to unfold.",
                    musicDescription: "Lush orchestral strings begin with a subtle tremolo, creating an ethereal foundation. A solo cello enters, weeping melodically over swelling horns. The pace builds gradually with layered violas and violins, while a delicate piano traces arpeggios in the upper register. The overall effect is emotionally cinematic—yearning, beautiful, and tinged with subtle melancholy.",
                    musicElements: [
                        "tremolo strings with ethereal quality",
                        "solo cello melody line",
                        "swelling french horns",
                        "delicate piano arpeggios"
                    ],
                    creativeDirection: "Deepen the orchestration by adding a timpani roll underneath the strings to suggest danger or weight. Layer in a high string section tremolo to create tension beneath the beauty, making the music simultaneously gorgeous and unsettling."
                },
                documentary: {
                    sceneInterpretation: "A straightforward scene documenting daily activity. The composition is clear and observational, showing people and spaces interacting naturally.",
                    musicDescription: "Minimalist ambient music with field recordings embedded throughout. A gentle vibraphone plays sparse, meditative notes. Underneath, subtle environmental sounds—distant traffic, wind, room tone. A soft acoustic guitar occasionally punctuates the texture. The music is understated, allowing the visual narrative to breathe and speak for itself.",
                    musicElements: [
                        "minimal vibraphone melody",
                        "field recordings of environment",
                        "soft acoustic guitar motif",
                        "ambient pad underneath"
                    ],
                    creativeDirection: "Ground this further by letting silence become part of the composition. Strategic moments of pure ambient space, with the music pulsing in and out like breathing. This honors the authenticity of the documentary approach."
                },
                horror: {
                    sceneInterpretation: "An ordinary scene charged with unease. Something feels slightly wrong—the composition creates subtle psychological discomfort.",
                    musicDescription: "Unsettling drone music with microtonal string clusters. A low, barely audible cello drone rumbles underneath. High, distorted string harmonics create dissonance. Sparse, irregular piano notes drop like water dripping in a cave. The music never resolves, creating persistent tension. There's an almost organic quality to the unease—like something breathing wrongly.",
                    musicElements: [
                        "low cello drone foundation",
                        "microtonal string clusters",
                        "distorted high harmonics",
                        "irregular sparse piano strikes"
                    ],
                    creativeDirection: "Push further by introducing a barely perceptible rhythmic pulse underneath the drones—something almost subliminal that the listener feels rather than hears. This creates visceral unease without being obvious."
                },
                poetic: {
                    sceneInterpretation: "A visual metaphor waiting to be interpreted. Objects and light speak in symbolic language, inviting emotional projection.",
                    musicDescription: "Lyrical and contemplative, built around a simple, haunting melody on solo violin. Underneath, a rich orchestral pad of cellos and violas creates emotional depth. A harp occasionally shimmers in the background. The music is spare but lush, allowing space for reflection. There's an elegance to the composition—each note feels considered and meaningful.",
                    musicElements: [
                        "solo violin with lyrical melody",
                        "warm cello and viola pad",
                        "shimmering harp textures",
                        "breathing-like dynamic swells"
                    ],
                    creativeDirection: "Introduce a subtle counter-melody in the second violin that mirrors and answers the main melody. This creates a conversation, deepening the poetic dimension and suggesting hidden connections between elements."
                },
                experimental: {
                    sceneInterpretation: "An unfamiliar perspective on reality. Rules are bent, expectations challenged. It exists in a space between categories.",
                    musicDescription: "Avant-garde soundscape built from processed and transformed instruments. Pitch-shifted strings glitch and stutter. Granular synthesis creates crystalline textures that shift like sand. A heavily processed electric guitar drones with spectral overtones. Industrial percussion elements puncture the texture unexpectedly. The music doesn't follow traditional harmonic or rhythmic logic—it exists in its own sonic universe.",
                    musicElements: [
                        "granular synthesis textures",
                        "pitch-shifted glitching strings",
                        "spectral electric guitar drone",
                        "unexpected industrial percussion"
                    ],
                    creativeDirection: "Embrace complete abstraction. Introduce 8-bit video game sounds mixed with classical orchestration, or layer in morse code patterns with ambient drones. Push until the listener questions whether what they're hearing is music or found sound."
                }
            };

            const response = mockResponses[mood] || mockResponses.cinematic;
            
            if (!response) {
                throw new Error(`No mock data for mood: ${mood}`);
            }

            return response;
        } catch (error) {
            console.error('Error in generateMockInterpretation:', error);
            throw error;
        }
    }

    /**
     * Generate music based on mood
     * @param {string} mood - The mood/style to use
     * @param {number} duration - Duration of music in seconds
     * @returns {Promise<void>}
     */
    async generateMusic(mood = 'cinematic', duration = 8) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            console.log(`Generating ${mood} music for ${duration} seconds`);

            let musicPromise;
            
            switch (mood.toLowerCase()) {
                case 'documentary':
                    musicPromise = this.generateVintageSynthMusic(audioContext, duration);
                    break;
                case 'horror':
                    musicPromise = this.generateHorrorMusic(audioContext, duration);
                    break;
                case 'poetic':
                    musicPromise = this.generatePoeticMusic(audioContext, duration);
                    break;
                case 'experimental':
                    musicPromise = this.generateExperimentalMusic(audioContext, duration);
                    break;
                case 'cinematic':
                default:
                    musicPromise = this.generateOrchestraMusic(audioContext, duration);
            }

            await musicPromise;
            console.log('Music generation complete');
        } catch (error) {
            console.error('Error generating music:', error);
            throw error;
        }
    }

    /**
     * Generate rich, multi-layered music using Web Audio API
     * @param {string} mood - The mood/style to generate music for
     * @param {number} duration - Duration of the video in seconds
     * @returns {Promise<void>}
     */
    async generateMusic(mood = 'cinematic', duration = 8) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const musicDuration = Math.min(duration, 60); // Cap at 60 seconds to avoid long waits
        
        switch(mood) {
            case 'cinematic':
                return this.generateOrchestraMusic(audioContext, musicDuration);
            case 'documentary':
                return this.generateVintageSynthMusic(audioContext, musicDuration);
            case 'horror':
                return this.generateHorrorMusic(audioContext, musicDuration);
            case 'poetic':
                return this.generatePoeticMusic(audioContext, musicDuration);
            case 'experimental':
                return this.generateExperimentalMusic(audioContext, musicDuration);
            default:
                return this.generateOrchestraMusic(audioContext, musicDuration);
        }
    }

    /**
     * Orchestral cinematic music with lush harmonies
     */
    generateOrchestraMusic(audioContext, duration) {
        return new Promise((resolve) => {
            const now = audioContext.currentTime;
            const endTime = now + duration;

            // Create multiple string layers for fullness
            const createStringSection = (baseFreq, startTime, endTime, delayOffset = 0) => {
                const frequencies = [baseFreq, baseFreq * 1.25, baseFreq * 1.5]; // Harmony
                frequencies.forEach((freq, idx) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    const filter = audioContext.createBiquadFilter();
                    
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    filter.type = 'lowpass';
                    filter.frequency.value = 2000 + (idx * 500);
                    
                    gain.gain.setValueAtTime(0, startTime);
                    gain.gain.linearRampToValueAtTime(0.08, startTime + 0.5);
                    gain.gain.linearRampToValueAtTime(0.05, endTime - 0.5);
                    gain.gain.linearRampToValueAtTime(0, endTime);
                    
                    osc.start(startTime + delayOffset);
                    osc.stop(endTime);
                });
            };

            // Brass section
            const createBrass = (freq, startTime, endTime) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.type = 'square';
                osc.frequency.value = freq * 2;
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.06, startTime + 0.3);
                gain.gain.linearRampToValueAtTime(0.03, endTime - 0.5);
                gain.gain.linearRampToValueAtTime(0, endTime);
                
                osc.start(startTime);
                osc.stop(endTime);
            };

            // Piano accompaniment
            const createPiano = (freq, startTime, noteDuration) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.type = 'triangle';
                osc.frequency.value = freq;
                
                gain.gain.setValueAtTime(0.15, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
                
                osc.start(startTime);
                osc.stop(startTime + noteDuration);
            };

            // Main melodic progression (C major: C-E-G-C-D-E-F-G)
            const melody = [261.63, 329.63, 392.00, 523.25, 293.66, 329.63, 349.23, 392.00];
            const noteLength = duration / (melody.length * 2);

            // Layer 1: Strings
            createStringSection(261.63, now, endTime); // C3

            // Layer 2: Brass at different times
            melody.forEach((freq, idx) => {
                const startTime = now + (idx * noteLength);
                if (startTime < endTime) {
                    createBrass(freq, startTime, Math.min(startTime + noteLength * 1.5, endTime));
                }
            });

            // Layer 3: Piano progression
            melody.forEach((freq, idx) => {
                const startTime = now + (idx * noteLength);
                if (startTime < endTime) {
                    createPiano(freq, startTime, noteLength * 0.8);
                }
            });

            setTimeout(() => resolve(), duration * 1000);
        });
    }

    /**
     * Vintage synthesizer sound for documentary
     */
    generateVintageSynthMusic(audioContext, duration) {
        return new Promise((resolve) => {
            const now = audioContext.currentTime;
            const endTime = now + duration;

            // Create warm analog-like pad
            const createVintagePad = (baseFreq, startTime, endTime) => {
                const osc = audioContext.createOscillator();
                const lfo = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                const lfoGain = audioContext.createGain();
                
                // LFO modulation
                lfo.frequency.value = 0.7; // Slow wobble
                lfoGain.gain.value = 20; // Frequency modulation amount
                
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                
                osc.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                osc.type = 'sawtooth';
                osc.frequency.value = baseFreq;
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.8);
                gainNode.gain.linearRampToValueAtTime(0.08, endTime - 0.8);
                gainNode.gain.linearRampToValueAtTime(0, endTime);
                
                osc.start(startTime);
                lfo.start(startTime);
                
                return () => {
                    osc.stop(endTime);
                    lfo.stop(endTime);
                };
            };

            // Warm bass progression (G-A-B-G)
            const bassNotes = [196.00, 220.00, 246.94, 196.00];
            const noteLength = duration / (bassNotes.length * 1.5);

            // Create vintage pads for each bass note
            bassNotes.forEach((freq, idx) => {
                const startTime = now + (idx * noteLength);
                if (startTime < endTime) {
                    createVintagePad(freq, startTime, Math.min(startTime + noteLength * 2, endTime));
                }
            });

            // Add upper harmonic pad
            createVintagePad(392.00, now, endTime);

            setTimeout(() => resolve(), duration * 1000);
        });
    }

    /**
     * Horror music with diminished chords and unsettling textures
     */
    generateHorrorMusic(audioContext, duration) {
        return new Promise((resolve) => {
            const now = audioContext.currentTime;
            const endTime = now + duration;

            // Create diminished chord (C-Eb-Gb-Bbb pattern, creates tension)
            const createDiminishedChord = (baseFreq, startTime, endTime) => {
                const diminishedFreqs = [
                    baseFreq,           // C
                    baseFreq * 1.189,   // Eb (diminished 3rd)
                    baseFreq * 1.414,   // Gb (diminished 5th)
                    baseFreq * 1.682    // B (diminished 7th)
                ];

                diminishedFreqs.forEach((freq) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.type = 'sawtooth'; // Harsh for horror
                    osc.frequency.value = freq;
                    
                    gain.gain.setValueAtTime(0.1, startTime);
                    gain.gain.linearRampToValueAtTime(0.08, endTime - 0.5);
                    gain.gain.linearRampToValueAtTime(0, endTime);
                    
                    osc.start(startTime);
                    osc.stop(endTime);
                });
            };

            // Deep unsettling drone
            const createDrone = (freq, startTime, endTime) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                filter.type = 'highpass';
                filter.frequency.value = 50;
                
                gain.gain.setValueAtTime(0.15, startTime);
                gain.gain.linearRampToValueAtTime(0.1, endTime - 0.5);
                gain.gain.linearRampToValueAtTime(0, endTime);
                
                osc.start(startTime);
                osc.stop(endTime);
            };

            // Heavy bass drone
            createDrone(65.41, now, endTime); // C1

            // Diminished chord progression
            const chordProgression = [130.81, 146.83, 164.81, 130.81]; // C2, D2, E2, C2
            const noteLength = duration / (chordProgression.length * 1.2);

            chordProgression.forEach((freq, idx) => {
                const startTime = now + (idx * noteLength);
                if (startTime < endTime) {
                    createDiminishedChord(freq, startTime, Math.min(startTime + noteLength * 1.8, endTime));
                }
            });

            setTimeout(() => resolve(), duration * 1000);
        });
    }

    /**
     * Poetic, ethereal music
     */
    generatePoeticMusic(audioContext, duration) {
        return new Promise((resolve) => {
            const now = audioContext.currentTime;
            const endTime = now + duration;

            // Soft, sustained notes
            const createPoeticNote = (freq, startTime, noteDuration) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                filter.type = 'lowpass';
                filter.frequency.value = 3000;
                
                // Soft attack and release
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.1, startTime + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.02, startTime + noteDuration - 0.2);
                gain.gain.linearRampToValueAtTime(0, startTime + noteDuration);
                
                osc.start(startTime);
                osc.stop(startTime + noteDuration);
            };

            // Harmonic pad underneath
            const createPad = (freq, startTime, endTime) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.type = 'sine';
                osc.frequency.value = freq * 0.5;
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.06, startTime + 1);
                gain.gain.linearRampToValueAtTime(0.04, endTime - 1);
                gain.gain.linearRampToValueAtTime(0, endTime);
                
                osc.start(startTime);
                osc.stop(endTime);
            };

            // Ascending melodic line
            const melody = [261.63, 293.66, 329.63, 369.99, 392.00, 440.00];
            const noteLength = duration / (melody.length * 2);

            // Pad layer
            createPad(261.63, now, endTime);

            // Melodic notes
            melody.forEach((freq, idx) => {
                const startTime = now + (idx * noteLength);
                if (startTime < endTime) {
                    createPoeticNote(freq, startTime, noteLength * 1.5);
                }
            });

            setTimeout(() => resolve(), duration * 1000);
        });
    }

    /**
     * Experimental, avant-garde music
     */
    generateExperimentalMusic(audioContext, duration) {
        return new Promise((resolve) => {
            const now = audioContext.currentTime;
            const endTime = now + duration;

            // Granular synthesis effect
            const createGranularNote = (baseFreq, startTime, endTime) => {
                const grainLength = 0.05;
                let currentTime = startTime;

                while (currentTime < endTime) {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.type = 'sine';
                    // Random pitch variation for granular effect
                    osc.frequency.value = baseFreq * (Math.random() * 2 + 0.5);
                    
                    gain.gain.setValueAtTime(0, currentTime);
                    gain.gain.linearRampToValueAtTime(0.08, currentTime + 0.01);
                    gain.gain.linearRampToValueAtTime(0, currentTime + grainLength);
                    
                    osc.start(currentTime);
                    osc.stop(currentTime + grainLength);
                    
                    currentTime += grainLength * 0.7;
                }
            };

            // Pitch-shifted layers
            const frequencies = [200, 250, 300, 350, 275];
            frequencies.forEach((freq) => {
                createGranularNote(freq, now, endTime);
            });

            setTimeout(() => resolve(), duration * 1000);
        });
    }


    /**
     * Generate music based on mood
     * @param {string} mood - The mood/style to use
     * @param {number} duration - Duration of music in seconds
     * @returns {Promise<void>}
     */
    async generateMusic(mood = 'cinematic', duration = 8) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            console.log(`Generating ${mood} music for ${duration} seconds`);

            let musicPromise;
            
            switch (mood.toLowerCase()) {
                case 'documentary':
                    musicPromise = this.generateVintageSynthMusic(audioContext, duration);
                    break;
                case 'horror':
                    musicPromise = this.generateHorrorMusic(audioContext, duration);
                    break;
                case 'poetic':
                    musicPromise = this.generatePoeticMusic(audioContext, duration);
                    break;
                case 'experimental':
                    musicPromise = this.generateExperimentalMusic(audioContext, duration);
                    break;
                case 'cinematic':
                default:
                    musicPromise = this.generateOrchestraMusic(audioContext, duration);
            }

            await musicPromise;
            console.log('Music generation complete');
        } catch (error) {
            console.error('Error generating music:', error);
            throw error;
        }
    }

    /**
     * Generate speech using Web Speech API (browser built-in)
     */
    generateSpeechWithWebAPI(text) {
        return new Promise((resolve, reject) => {
            // This method is kept for reference but not actively used
            resolve(true);
        });
    }

    /**
     * Generate speech using TTS API (if available)
     */
    async generateSpeechWithAPI(text) {
        try {
            // This method is kept for reference but not actively used
            return true;
        } catch (error) {
            console.error('TTS API error:', error);
            throw error;
        }
    }

    /**
     * Stop any ongoing speech
     */
    stopMusic() {
        const speechSynthesis = window.speechSynthesis;
        if (speechSynthesis) {
            speechSynthesis.cancel();
        }
    }

    /**
     * Set API key
     */
    setApiKey(key) {
        this.groqApiKey = key;
        localStorage.setItem('groqApiKey', key);
    }

    /**
     * Get API key
     */
    getApiKey() {
        return this.groqApiKey;
    }
}

// Export for use in other modules
const apiManager = new AIApiManager();
