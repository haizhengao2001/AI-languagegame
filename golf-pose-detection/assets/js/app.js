/**
 * AI Golf • Main Application
 * Coordinates pose detection with UI feedback
 */

class GolfPoseApp {
    constructor() {
        this.poseDetector = null;
        this.elements = {};
        this.uiState = {
            currentState: 'DETECTING',
            lastMessage: '',
            holdProgress: 0
        };

        this.messages = {
            DETECTING: {
                default: 'Prepare your stance.',
                holding: 'Hold your finish…'
            },
            VALID: {
                success: 'Good posture!'
            },
            INVALID: {
                feedback: 'Not detected.'
            }
        };

        this.initialize();
    }

    initialize() {
        this.cacheElements();
        this.setupEventListeners();
        this.startPoseDetection();
    }

    cacheElements() {
        this.elements = {
            statusMessage: document.getElementById('statusMessage'),
            statusInfo: document.getElementById('statusInfo'),
            poseState: document.getElementById('poseState'),
            stateLabel: document.getElementById('stateLabel'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            messageBox: document.querySelector('.message-box'),
            toggleSkeleton: document.getElementById('toggleSkeleton')
        };
    }

    setupEventListeners() {
        // Pose state change events
        window.addEventListener('poseStateChanged', (e) => {
            this.handlePoseStateChange(e.detail.state, e.detail.info);
        });

        // Skeleton toggle
        this.elements.toggleSkeleton.addEventListener('click', () => {
            const isVisible = this.poseDetector.toggleSkeleton();
            this.elements.toggleSkeleton.textContent = `Skeleton: ${isVisible ? 'ON' : 'OFF'}`;
        });

        // Error handling
        window.addEventListener('error', (e) => {
            console.error('App error:', e.error);
            this.showError('An error occurred. Please refresh.');
        });
    }

    async startPoseDetection() {
        try {
            this.poseDetector = new PoseDetector();
            const initialized = await this.poseDetector.initialize();

            if (!initialized) {
                throw new Error('Failed to initialize pose detector');
            }

            // Hide loading indicator
            this.elements.loadingIndicator.classList.add('hidden');

            // Start camera
            await this.poseDetector.start();

            console.log('✓ Pose detection started');
            this.updateMessage('Prepare your stance.', '');
        } catch (error) {
            console.error('Failed to start pose detection:', error);
            this.showError('Camera or pose detection failed. Please check permissions.');
        }
    }

    handlePoseStateChange(state, info) {
        this.uiState.currentState = state;

        // Update message and styling
        let message = '';
        let infoText = info || '';

        switch (state) {
            case 'DETECTING':
                message = info ? this.messages.DETECTING.holding : this.messages.DETECTING.default;
                this.elements.poseState.classList.remove('valid', 'invalid');
                this.elements.messageBox.classList.remove('pose-valid', 'pose-invalid');
                this.elements.stateLabel.textContent = 'DETECTING';
                break;

            case 'VALID':
                message = this.messages.VALID.success;
                this.elements.poseState.classList.add('valid');
                this.elements.poseState.classList.remove('invalid');
                this.elements.messageBox.classList.add('pose-valid');
                this.elements.messageBox.classList.remove('pose-invalid');
                this.elements.stateLabel.textContent = 'VALID';
                this.playSuccessAnimation();
                break;

            case 'INVALID':
                message = this.messages.INVALID.feedback;
                this.elements.poseState.classList.add('invalid');
                this.elements.poseState.classList.remove('valid');
                this.elements.messageBox.classList.add('pose-invalid');
                this.elements.messageBox.classList.remove('pose-valid');
                this.elements.stateLabel.textContent = 'INVALID';
                break;
        }

        this.updateMessage(message, infoText);
    }

    updateMessage(message, info) {
        if (message !== this.uiState.lastMessage) {
            this.elements.statusMessage.textContent = message;
            this.uiState.lastMessage = message;
        }

        if (info) {
            this.elements.statusInfo.textContent = info;
        } else {
            this.elements.statusInfo.textContent = '';
        }
    }

    playSuccessAnimation() {
        // Brief flash animation
        this.elements.messageBox.style.animation = 'none';
        setTimeout(() => {
            this.elements.messageBox.style.animation = 'fadeIn 0.3s ease';
        }, 10);
    }

    showError(message) {
        this.elements.loadingIndicator.classList.remove('hidden');
        this.elements.loadingIndicator.querySelector('p').textContent = message;
        this.elements.loadingIndicator.querySelector('.spinner').style.display = 'none';
    }
}

/**
 * Start the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏌️ AI Golf • Pose Detection System');
    console.log('Initializing...');

    // Check for camera permissions warning
    navigator.permissions.query({ name: 'camera' }).then(
        (result) => {
            if (result.state === 'denied') {
                console.warn('Camera permission denied');
            }
        }
    ).catch(() => {
        // Fallback for browsers that don't support permissions API
        console.log('Permissions API not supported');
    });

    // Initialize the app
    window.app = new GolfPoseApp();
});
