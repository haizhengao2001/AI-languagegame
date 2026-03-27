/**
 * AI Golf • Pose Detector Module
 * Handles MediaPipe Pose detection and golf finish pose validation
 */

class PoseDetector {
    constructor() {
        this.pose = null;
        this.camera = null;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.webcam = document.getElementById('webcam');
        
        // Pose data
        this.currentLandmarks = [];
        this.poseHistory = [];
        this.maxHistoryLength = 3; // Keep last 3 frames for stability check
        
        // State tracking
        this.state = 'DETECTING'; // DETECTING, VALID, INVALID
        this.holdStartTime = null;
        this.holdDuration = 1500; // 1.5 seconds in milliseconds
        this.showSkeleton = true;
        
        // Pose thresholds
        this.armRaisedThreshold = 0.3; // Arm raised if wrist Y < shoulder Y - 30%
        this.rotationThreshold = 0.1; // Body rotation detection threshold
        this.confidenceThreshold = 0.5; // Landmark confidence
    }

    async initialize() {
        try {
            // Create Pose detector
            this.pose = new Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });

            this.pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                smoothSegmentation: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.pose.onResults(this.onResults.bind(this));

            // Set up canvas size
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());

            // Set up camera
            const video = this.webcam;
            this.camera = new Camera(video, {
                onFrame: async () => {
                    await this.pose.send({ image: video });
                },
                width: window.innerWidth,
                height: window.innerHeight
            });

            await this.camera.initialize();
            return true;
        } catch (error) {
            console.error('Failed to initialize pose detector:', error);
            return false;
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    onResults(results) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Process landmarks
        if (results.landmarks && results.landmarks.length > 0) {
            this.currentLandmarks = results.landmarks;
            this.analyzeGolfPose();

            // Draw skeleton if enabled
            if (this.showSkeleton) {
                this.drawSkeleton(results.landmarks);
            }
        }
    }

    analyzeGolfPose() {
        const landmarks = this.currentLandmarks;
        if (landmarks.length === 0) {
            this.setState('DETECTING');
            return;
        }

        // Key landmarks
        // 11, 12 = shoulders (left, right)
        // 13, 14 = elbows (left, right)
        // 15, 16 = wrists (left, right)
        // 23, 24 = hips (left, right)

        const landmarks_map = {
            L_SHOULDER: 11,
            R_SHOULDER: 12,
            L_ELBOW: 13,
            R_ELBOW: 14,
            L_WRIST: 15,
            R_WRIST: 16,
            L_HIP: 23,
            R_HIP: 24,
            L_KNEE: 25,
            R_KNEE: 26
        };

        // Get positions
        const lShoulder = landmarks[landmarks_map.L_SHOULDER];
        const rShoulder = landmarks[landmarks_map.R_SHOULDER];
        const lWrist = landmarks[landmarks_map.L_WRIST];
        const rWrist = landmarks[landmarks_map.R_WRIST];
        const lHip = landmarks[landmarks_map.L_HIP];
        const rHip = landmarks[landmarks_map.R_HIP];

        // Check confidence
        if (lShoulder.visibility < this.confidenceThreshold ||
            rShoulder.visibility < this.confidenceThreshold) {
            this.setState('DETECTING');
            return;
        }

        // 1. Check if at least one arm is raised above shoulder
        const shoulderMidY = (lShoulder.y + rShoulder.y) / 2;
        const lArmRaised = lWrist.y < (shoulderMidY - this.armRaisedThreshold);
        const rArmRaised = rWrist.y < (shoulderMidY - this.armRaisedThreshold);
        const armRaised = lArmRaised || rArmRaised;

        // 2. Check body rotation (shoulder to hip alignment)
        const shoulderAngle = Math.atan2(
            rShoulder.y - lShoulder.y,
            rShoulder.x - lShoulder.x
        );
        const hipAngle = Math.atan2(
            rHip.y - lHip.y,
            rHip.x - lHip.x
        );
        const rotationDiff = Math.abs(shoulderAngle - hipAngle);
        const bodyRotated = rotationDiff > this.rotationThreshold;

        // 3. Validate pose
        const poseValid = armRaised && bodyRotated;

        // Add to history
        this.poseHistory.push(poseValid);
        if (this.poseHistory.length > this.maxHistoryLength) {
            this.poseHistory.shift();
        }

        // Check if pose is stable (consistent for multiple frames)
        const poseStable = this.poseHistory.length >= 2 &&
            this.poseHistory.every(p => p === true);

        if (poseStable) {
            // Start timing or continue timing
            if (!this.holdStartTime) {
                this.holdStartTime = Date.now();
            }

            const holdElapsed = Date.now() - this.holdStartTime;
            if (holdElapsed >= this.holdDuration) {
                this.setState('VALID');
            } else {
                const percentComplete = (holdElapsed / this.holdDuration) * 100;
                this.setState('DETECTING', `Hold pose: ${percentComplete.toFixed(0)}%`);
            }
        } else {
            // Reset hold timer
            this.holdStartTime = null;
            this.setState(poseValid ? 'DETECTING' : 'INVALID');
        }
    }

    setState(newState, info = '') {
        if (this.state !== newState) {
            this.state = newState;
            window.dispatchEvent(new CustomEvent('poseStateChanged', {
                detail: { state: newState, info }
            }));
        }
    }

    drawSkeleton(landmarks) {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        // Draw connections
        const connections = [
            // Torso
            [11, 12], [11, 23], [12, 24], [23, 24],
            // Left arm
            [11, 13], [13, 15],
            // Right arm
            [12, 14], [14, 16],
            // Left leg
            [23, 25], [25, 27],
            // Right leg
            [24, 26], [26, 28]
        ];

        this.ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
        this.ctx.lineWidth = 2;

        for (const connection of connections) {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];

            if (start.visibility > 0.3 && end.visibility > 0.3) {
                // Mirror for selfie view (scaleX(-1) applied via CSS)
                const startX = canvasWidth - (start.x * canvasWidth);
                const startY = start.y * canvasHeight;
                const endX = canvasWidth - (end.x * canvasWidth);
                const endY = end.y * canvasHeight;

                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
            }
        }

        // Draw key landmarks (shoulders, elbows, wrists)
        const keyLandmarks = [11, 12, 13, 14, 15, 16];
        this.ctx.fillStyle = 'rgba(0, 217, 255, 0.7)';

        for (const idx of keyLandmarks) {
            const landmark = landmarks[idx];
            if (landmark.visibility > 0.3) {
                const x = canvasWidth - (landmark.x * canvasWidth);
                const y = landmark.y * canvasHeight;

                this.ctx.beginPath();
                this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }

    toggleSkeleton() {
        this.showSkeleton = !this.showSkeleton;
        return this.showSkeleton;
    }

    async start() {
        if (this.camera) {
            await this.camera.start();
        }
    }

    stop() {
        if (this.camera) {
            this.camera.stop();
        }
    }

    getState() {
        return {
            state: this.state,
            holdStartTime: this.holdStartTime,
            holdDuration: this.holdDuration,
            showSkeleton: this.showSkeleton
        };
    }
}
