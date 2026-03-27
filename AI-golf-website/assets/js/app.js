// Main Application
let currentRoundData = null;
let currentOptions = {
    palette: 'fossil',
    style: 'fossil-trace',
    density: 50,
    complexity: 50
};

let cameraStream = null;
let isTrackingGesture = false;
let gesturePath = [];
let trackingStartTime = 0;
let lastTrackedPoint = null;
let gestureAnimationId = null;
let handsTracker = null;
let handsReady = false;
let handSendInFlight = false;
let latestFingerTip = null;
let latestFingerTipTs = 0;
let lastHandDetectionTs = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeHeroAnimation();
    initializeStepVisualizations();
    attachEventListeners();
});

// Hero Canvas Animation
function initializeHeroAnimation() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrame = 0;
    
    function animateHero() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(45, 95, 63, 0.05)');
        gradient.addColorStop(1, 'rgba(26, 40, 71, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw animated trajectories
        const time = animationFrame * 0.01;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + time;
            const offset = Math.sin(time + i) * 20;

            ctx.strokeStyle = `hsla(${120 + i * 30}, 70%, 60%, ${0.3 + Math.sin(time + i * 0.5) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';

            ctx.beginPath();
            const startX = centerX + Math.cos(angle) * 100;
            const startY = centerY + Math.sin(angle) * 100;
            ctx.moveTo(startX, startY);

            // Draw arc
            for (let j = 0; j <= 100; j++) {
                const progress = j / 100;
                const arcAngle = angle + progress * Math.PI * 1.5;
                const arcRadius = 100 + progress * 80 + offset;
                const x = centerX + Math.cos(arcAngle) * arcRadius;
                const y = centerY + Math.sin(arcAngle) * arcRadius + Math.sin(time + progress * Math.PI) * 30;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Draw central circles
        for (let i = 0; i < 3; i++) {
            const radius = 30 + i * 30 + Math.sin(time + i) * 10;
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.2 - i * 0.05 - Math.sin(time + i) * 0.1})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        animationFrame++;
        requestAnimationFrame(animateHero);
    }

    animateHero();
}

// Initialize Step Visualizations
function initializeStepVisualizations() {
    setTimeout(() => {
        ArtGenerator.renderStepVisualization('step1-viz', 1);
        ArtGenerator.renderStepVisualization('step2-viz', 2);
        ArtGenerator.renderStepVisualization('step3-viz', 3);
    }, 100);
}

// Attach Event Listeners
function attachEventListeners() {
    const preview = document.getElementById('cameraPreview');
    if (preview) {
        preview.addEventListener('click', () => {
            if (!cameraStream && !isTrackingGesture) {
                initializeCamera();
            }
        });
    }

    const downloadPngBtn = document.getElementById('downloadPngBtn');
    if (downloadPngBtn) {
        downloadPngBtn.addEventListener('click', downloadArtwork);
    }

    const downloadJsonBtn = document.getElementById('downloadJsonBtn');
    if (downloadJsonBtn) {
        downloadJsonBtn.addEventListener('click', downloadJSON);
    }
}

// Load Demo Data
function loadDemoData() {
    const roundType = 'realistic';
    
    hideLoading();
    showLoading();

    setTimeout(() => {
        currentRoundData = ArtGenerator.generateSampleData(roundType);
        visualizeTrajectories();
        generateAndDisplayArtwork();
    }, 800);
}

// Generate Artwork
function generateArtwork() {
    const courseName = document.getElementById('courseInput').value || 'Unknown Course';
    const roundType = 'realistic';

    hideLoading();
    showLoading();

    // Simulate data generation
    setTimeout(() => {
        currentRoundData = ArtGenerator.generateSampleData(roundType);
        currentRoundData.metadata.course = courseName;
        currentRoundData.metadata.score = 'Auto-tracked';
        currentRoundData.metadata.holes = 18;

        visualizeTrajectories();
        generateAndDisplayArtwork();
    }, 800);
}

// Visualize Trajectories First
function visualizeTrajectories(canvasId = 'demoCanvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !currentRoundData) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#111829';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw trajectory lines
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const trajectories = currentRoundData.trajectories;

    trajectories.forEach((traj, index) => {
        const angle = (index / trajectories.length) * Math.PI * 2;
        ctx.strokeStyle = `hsla(${index * 20}, 70%, 60%, 0.5)`;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        let firstPoint = true;

        traj.points.forEach((point, i) => {
            const x = centerX + Math.cos(angle) * (50 + point.z / 10) + (point.x - 100) * 0.5;
            const y = centerY + Math.sin(angle) * (50 + point.z / 10) + point.y * 5;

            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else if (i % 2 === 0) {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
    });

    // Update info
    if (canvasId === 'demoCanvas') {
        const infoElement = document.getElementById('canvasInfo');
        if (infoElement) {
            infoElement.innerHTML = `<p class="info-text">📊 Round loaded with ${trajectories.length} trajectories</p>`;
        }
    }
}

// Generate and Display Artwork
function generateAndDisplayArtwork(canvasId = 'demoCanvas') {
    if (!currentRoundData) return;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const curatedOptions = ArtGenerator.chooseCuratedSettings(currentRoundData);
    currentOptions = {
        palette: curatedOptions.palette,
        style: curatedOptions.style,
        density: curatedOptions.density,
        complexity: curatedOptions.complexity
    };

    const options = { ...currentOptions };

    // Generate artwork with animation transition
    const startTime = Date.now();
    const duration = 2000; // 2 second transition

    function animateTransition() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Regenerate with current progress
        ArtGenerator.generateArtwork(canvas, currentRoundData, options);

        if (progress < 1) {
            requestAnimationFrame(animateTransition);
        } else {
            hideLoading();
            if (canvasId === 'demoCanvas') {
                const infoElement = document.getElementById('canvasInfo');
                if (infoElement) {
                    infoElement.innerHTML = '<p class="info-text">Artwork complete. This is your round.</p>';
                }
            } else {
                const status = document.getElementById('gestureStatus');
                if (status) {
                    status.textContent = 'Artwork complete. This is your round.';
                }
            }
        }
    }

    animateTransition();
}

// Show/Hide Loading Indicator
function showLoading() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.display = 'flex';
    }
}

function hideLoading() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Show Customization Panel
// Download Artwork as Image
function downloadArtwork() {
    if (!currentRoundData) {
        alert('Please generate artwork first');
        return;
    }

    const canvas = document.getElementById('gestureCanvas') || document.getElementById('demoCanvas');
    if (!canvas) {
        alert('Artwork canvas not found. Please generate again.');
        return;
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `abstract-golf-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Download Data as JSON
function downloadJSON() {
    if (!currentRoundData) {
        alert('Please generate artwork first');
        return;
    }

    const dataStr = JSON.stringify({
        roundData: currentRoundData,
        options: currentOptions,
        exportDate: new Date().toISOString()
    }, null, 2);

    const link = document.createElement('a');
    link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    link.download = `abstract-golf-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Share Artwork (Social media simulation)
function shareArtwork() {
    if (!currentRoundData) {
        alert('Please generate artwork first');
        return;
    }

    const title = ArtGenerator.generateTitle(currentRoundData);
    const shareText = `Check out my round: "${title}" - Turn your game into art with Abstract Golf! 🎨⛳`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Abstract Golf Artwork',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Share text copied to clipboard!');
        });
    }
}

// Scroll to demo section
function scrollToDemo() {
    const demoSection = document.getElementById('gesture-tracking');
    demoSection.scrollIntoView({ behavior: 'smooth' });
}

async function initializeCamera() {
    const video = document.getElementById('cameraVideo');
    const status = document.getElementById('gestureStatus');
    const startBtn = document.getElementById('startCameraBtn');
    const trackBtn = document.getElementById('startTrackingBtn');
    const generateBtn = document.getElementById('generateFromGestureBtn');

    if (!video || !status) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status.textContent = 'Camera API is not supported in this browser.';
        return;
    }

    status.textContent = 'Requesting camera permission...';

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        video.srcObject = cameraStream;
        await video.play();

        status.textContent = 'Camera ready. Tracing starts now...';
        if (startBtn) {
            startBtn.textContent = 'Camera Enabled';
            startBtn.disabled = true;
        }
        if (trackBtn) {
            trackBtn.style.display = 'none';
        }
        if (generateBtn) {
            generateBtn.style.display = 'none';
        }

        prepareGestureCanvas();
        setupHandsTracking();
        startGestureTracking();
    } catch (err) {
        if (err && err.name === 'NotAllowedError') {
            status.textContent = 'Camera permission denied. Please allow access and try again.';
        } else if (err && err.name === 'NotFoundError') {
            status.textContent = 'No camera found on this device.';
        } else {
            status.textContent = 'Failed to start camera. Please retry.';
        }
    }
}

function setupHandsTracking() {
    if (handsReady || typeof Hands === 'undefined') {
        return;
    }

    handsTracker = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    handsTracker.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.35,
        minTrackingConfidence: 0.35
    });

    handsTracker.onResults((results) => {
        const canvas = document.getElementById('gestureCanvas');
        const video = document.getElementById('cameraVideo');
        if (!canvas) return;

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const indexTip = results.multiHandLandmarks[0][8];
            const mappedPoint = mapLandmarkToVisibleBox(indexTip, video, canvas);
            latestFingerTip = {
                x: mappedPoint.x,
                y: mappedPoint.y,
                t: Date.now()
            };
            latestFingerTipTs = Date.now();
            lastHandDetectionTs = latestFingerTipTs;

            if (isTrackingGesture) {
                commitGesturePoint(latestFingerTip, 'hand');
            }
        } else {
            latestFingerTip = null;
        }
    });

    handsReady = true;
}

function prepareGestureCanvas() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('gestureCanvas');
    const preview = document.getElementById('cameraPreview');
    if (!video || !canvas) return;

    const width = Math.floor(preview?.clientWidth || video.clientWidth || video.videoWidth || 0);
    const height = Math.floor(preview?.clientHeight || video.clientHeight || video.videoHeight || 0);

    if (!width || !height) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startGestureTracking() {
    const video = document.getElementById('cameraVideo');
    const timer = document.getElementById('gestureTimer');
    const timerText = document.getElementById('timerText');
    const status = document.getElementById('gestureStatus');
    const startBtn = document.getElementById('startTrackingBtn');
    const stopBtn = document.getElementById('stopTrackingBtn');
    const generateBtn = document.getElementById('generateFromGestureBtn');

    if (!video || !cameraStream || !timer || !timerText || !status) {
        return;
    }

    prepareGestureCanvas();
    isTrackingGesture = true;
    gesturePath = [];
    trackingStartTime = Date.now();
    lastTrackedPoint = null;
    latestFingerTip = null;
    latestFingerTipTs = 0;
    lastHandDetectionTs = 0;

    timer.style.display = 'block';
    if (startBtn) startBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'block';
    if (generateBtn) generateBtn.style.display = 'none';
    status.textContent = 'Recording fingertip movement...';

    const countdownInterval = setInterval(() => {
        const remaining = Math.max(0, 5 - Math.floor((Date.now() - trackingStartTime) / 1000));
        timerText.textContent = String(remaining);

        if (remaining <= 0 || !isTrackingGesture) {
            clearInterval(countdownInterval);
        }
    }, 150);

    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    let previousFrame = null;

    function trackFrame() {
        if (!isTrackingGesture) return;

        const canvas = document.getElementById('gestureCanvas');
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        if (!offscreen.width || !offscreen.height) {
            offscreen.width = canvas.width;
            offscreen.height = canvas.height;
        }

        offCtx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
        const frame = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);

        if (handsReady && handsTracker && !handSendInFlight) {
            handSendInFlight = true;
            handsTracker.send({ image: video }).finally(() => {
                handSendInFlight = false;
            });
        }

        if (previousFrame && Date.now() - lastHandDetectionTs > 120) {
            const point = getMotionFingerTip(frame.data, previousFrame.data, offscreen.width, offscreen.height, lastTrackedPoint);
            if (point) {
                commitGesturePoint(point, 'motion');
            }
        }

        previousFrame = frame;

        if (Date.now() - trackingStartTime >= 5000) {
            stopGestureTracking(true);
            return;
        }

        gestureAnimationId = requestAnimationFrame(trackFrame);
    }

    gestureAnimationId = requestAnimationFrame(trackFrame);
}

function commitGesturePoint(point, source = 'hand') {
    const canvas = document.getElementById('gestureCanvas');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !isTrackingGesture || !point) {
        return false;
    }

    const normalizedPoint = source === 'hand'
        ? smoothTrackedPoint(lastTrackedPoint, point)
        : point;

    if (!isValidFingerPoint(normalizedPoint, lastTrackedPoint, canvas.width, canvas.height)) {
        return false;
    }

    if (lastTrackedPoint) {
        const jump = Math.hypot(normalizedPoint.x - lastTrackedPoint.x, normalizedPoint.y - lastTrackedPoint.y);
        if (jump < 2) {
            return false;
        }
    }

    gesturePath.push(normalizedPoint);
    if (!lastTrackedPoint) {
        drawGestureDot(ctx, normalizedPoint);
    } else {
        drawGestureLine(ctx, lastTrackedPoint, normalizedPoint, true);
    }
    lastTrackedPoint = normalizedPoint;
    return true;
}

function stopGestureTracking(autoGenerate = true) {
    const timer = document.getElementById('gestureTimer');
    const status = document.getElementById('gestureStatus');
    const startBtn = document.getElementById('startTrackingBtn');
    const stopBtn = document.getElementById('stopTrackingBtn');
    const generateBtn = document.getElementById('generateFromGestureBtn');

    isTrackingGesture = false;
    if (gestureAnimationId) {
        cancelAnimationFrame(gestureAnimationId);
        gestureAnimationId = null;
    }

    if (timer) timer.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'none';
    if (startBtn) startBtn.style.display = 'none';

    if (status) {
        if (gesturePath.length < 8) {
            status.textContent = 'Low movement detected. Building artwork from subtle motion...';
        } else {
            status.textContent = `Captured ${gesturePath.length} movement points.`;
        }
    }

    if (autoGenerate) {
        generateFromGestureData();
    }
}

function showGestureDownloadActions() {
    const actions = document.getElementById('gestureDownloadActions');
    if (actions) {
        actions.style.display = 'flex';
    }
}

function drawGestureLine(ctx, prevPoint, point, glow) {
    if (!prevPoint || !point) return;

    ctx.lineWidth = 24;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.98)';

    if (glow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 2;
    }

    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    // Keep a bold cap at the newest position so fingertip tracking is obvious.
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
}

function drawGestureDot(ctx, point) {
    if (!point) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
    ctx.fill();
}

function isValidFingerPoint(point, lastPoint, width, height) {
    const marginX = 0;
    const marginY = 0;

    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
        return false;
    }

    if (point.x < marginX || point.x > width - marginX || point.y < marginY || point.y > height - marginY) {
        return false;
    }

    if (lastPoint) {
        const jump = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
        if (jump > 320) {
            return false;
        }
    }

    return true;
}

function smoothTrackedPoint(lastPoint, nextPoint) {
    if (!lastPoint) return nextPoint;
    return {
        x: lastPoint.x * 0.5 + nextPoint.x * 0.5,
        y: lastPoint.y * 0.5 + nextPoint.y * 0.5,
        t: Date.now()
    };
}

function mapLandmarkToVisibleBox(landmark, video, canvas) {
    const srcW = video?.videoWidth || canvas.width;
    const srcH = video?.videoHeight || canvas.height;
    const dstW = canvas.width;
    const dstH = canvas.height;

    const scale = Math.max(dstW / srcW, dstH / srcH);
    const drawnW = srcW * scale;
    const drawnH = srcH * scale;
    const cropX = (drawnW - dstW) / 2;
    const cropY = (drawnH - dstH) / 2;

    const x = landmark.x * drawnW - cropX;
    const y = landmark.y * drawnH - cropY;

    return {
        x: Math.max(0, Math.min(dstW, x)),
        y: Math.max(0, Math.min(dstH, y))
    };
}

function getMotionFingerTip(current, previous, width, height, lastPoint) {
    const stride = 4;
    const threshold = 16;
    let count = 0;
    let sumX = 0;
    let sumY = 0;
    let minY = height;
    let topSumX = 0;
    let topCount = 0;

    for (let y = 0; y < height; y += stride) {
        for (let x = 0; x < width; x += stride) {
            const i = (y * width + x) * 4;
            const dr = Math.abs(current[i] - previous[i]);
            const dg = Math.abs(current[i + 1] - previous[i + 1]);
            const db = Math.abs(current[i + 2] - previous[i + 2]);
            const delta = (dr + dg + db) / 3;

            if (delta > threshold) {
                count++;
                sumX += x;
                sumY += y;
                if (y < minY) minY = y;
            }
        }
    }

    if (count < 8) return null;

    // Estimate fingertip by averaging points near the top edge of detected motion.
    const topBand = minY + 30;
    for (let y = minY; y <= topBand && y < height; y += stride) {
        for (let x = 0; x < width; x += stride) {
            const i = (y * width + x) * 4;
            const dr = Math.abs(current[i] - previous[i]);
            const dg = Math.abs(current[i + 1] - previous[i + 1]);
            const db = Math.abs(current[i + 2] - previous[i + 2]);
            const delta = (dr + dg + db) / 3;
            if (delta > threshold) {
                topSumX += x;
                topCount++;
            }
        }
    }

    let tipX = topCount > 0 ? topSumX / topCount : sumX / count;
    let tipY = minY;

    // Avoid locking to noisy top-left corner on first detection.
    if (!lastPoint && tipX < width * 0.2 && tipY < height * 0.2) {
        return null;
    }

    if (lastPoint) {
        // Smooth movement to reduce jitter while still following fingertip.
        tipX = lastPoint.x * 0.55 + tipX * 0.45;
        tipY = lastPoint.y * 0.45 + tipY * 0.55;
    }

    return {
        x: tipX,
        y: tipY,
        t: Date.now()
    };
}

function getMotionCentroid(current, previous, width, height) {
    const stride = 5;
    const threshold = 18;
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (let y = 0; y < height; y += stride) {
        for (let x = 0; x < width; x += stride) {
            const i = (y * width + x) * 4;
            const dr = Math.abs(current[i] - previous[i]);
            const dg = Math.abs(current[i + 1] - previous[i + 1]);
            const db = Math.abs(current[i + 2] - previous[i + 2]);
            const delta = (dr + dg + db) / 3;

            if (delta > threshold) {
                sumX += x;
                sumY += y;
                count++;
            }
        }
    }

    if (count < 6) return null;

    return {
        x: sumX / count,
        y: sumY / count,
        t: Date.now()
    };
}

function generateFromGestureData() {
    const status = document.getElementById('gestureStatus');
    if (!gesturePath.length) {
        if (status) status.textContent = 'No movement data found. Please enable camera again.';
        return;
    }

    if (gesturePath.length < 24) {
        gesturePath = densifyGesturePath(gesturePath, 24);
    }

    const downsampleStep = Math.max(1, Math.floor(gesturePath.length / 160));
    const points = [];

    for (let i = 0; i < gesturePath.length; i += downsampleStep) {
        const p = gesturePath[i];
        points.push({
            x: p.x,
            y: p.y,
            z: i
        });
    }

    const trajectories = [];
    const sliceSize = Math.max(12, Math.floor(points.length / 12));

    for (let i = 0; i < points.length; i += sliceSize) {
        const slice = points.slice(i, i + sliceSize);
        if (slice.length < 8) continue;
        trajectories.push({
            id: trajectories.length,
            points: slice,
            accuracy: 55 + Math.random() * 40,
            speed: 60 + Math.random() * 35,
            distance: 140 + Math.random() * 120,
            isKeyMoment: Math.random() > 0.75
        });
    }

    if (!trajectories.length) {
        if (status) status.textContent = 'Rebuilding artwork from captured trace...';
        const fallbackTrajectories = buildFallbackTrajectories(points);
        if (!fallbackTrajectories.length) {
            return;
        }
        trajectories.push(...fallbackTrajectories);
    }

    currentRoundData = {
        holes: trajectories.length,
        trajectories,
        timestamp: new Date(),
        metadata: {
            avgAccuracy: trajectories.reduce((sum, t) => sum + t.accuracy, 0) / trajectories.length,
            avgSpeed: trajectories.reduce((sum, t) => sum + t.speed, 0) / trajectories.length,
            consistency: ArtGenerator.calculateConsistency(trajectories),
            keyMoments: ArtGenerator.identifyKeyMoments(trajectories),
            course: 'Hand Motion Capture',
            score: 'Gesture Round'
        }
    };

    if (status) status.textContent = 'Transforming your captured movement into artwork...';
    showLoading();
    setTimeout(() => {
        visualizeTrajectories('gestureCanvas');
        generateAndDisplayArtwork('gestureCanvas');
        showGestureDownloadActions();
        if (status) status.textContent = 'Artwork generated from your movement trace.';
    }, 350);
}

function densifyGesturePath(path, targetLength) {
    if (!path.length || path.length >= targetLength) return path;
    const result = [...path];

    while (result.length < targetLength) {
        const next = [];
        for (let i = 0; i < result.length - 1; i++) {
            const a = result[i];
            const b = result[i + 1];
            next.push(a);
            next.push({
                x: (a.x + b.x) / 2,
                y: (a.y + b.y) / 2,
                t: Date.now()
            });
        }
        next.push(result[result.length - 1]);
        result.splice(0, result.length, ...next.slice(0, targetLength));
    }

    return result;
}

function buildFallbackTrajectories(points) {
    if (!points.length) return [];
    const center = points[Math.floor(points.length / 2)];
    const generated = [];
    const count = 6;

    for (let i = 0; i < count; i++) {
        const local = [];
        for (let j = 0; j < 14; j++) {
            const angle = (Math.PI * 2 * j) / 14 + i * 0.32;
            const radius = 8 + i * 5 + j * 1.4;
            local.push({
                x: center.x + Math.cos(angle) * radius,
                y: center.y + Math.sin(angle) * radius,
                z: j
            });
        }

        generated.push({
            id: i,
            points: local,
            accuracy: 62 + Math.random() * 22,
            speed: 60 + Math.random() * 18,
            distance: 130 + Math.random() * 90,
            isKeyMoment: i === 2 || i === 4
        });
    }

    return generated;
}
