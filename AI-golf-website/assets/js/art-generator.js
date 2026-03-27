// Art Generator Module
const ArtGenerator = {
    // Color palettes mapped to different themes
    colorPalettes: {
        minimalist: {
            colors: ['#ffffff', '#f5f5f5', '#d0d0d0'],
            background: '#1a1a1a',
            primary: '#ffffff'
        },
        ocean: {
            colors: ['#1e90ff', '#00bfff', '#87ceeb', '#4169e1'],
            background: '#001a33',
            primary: '#1e90ff'
        },
        sunset: {
            colors: ['#ff6b35', '#f7931e', '#fdc830', '#f37335'],
            background: '#1a0f05',
            primary: '#ff6b35'
        },
        forest: {
            colors: ['#2d5f3f', '#52b788', '#74c69d', '#95d5b2'],
            background: '#0b2818',
            primary: '#2d5f3f'
        },
        neon: {
            colors: ['#00ff00', '#ff00ff', '#00ffff', '#ffff00'],
            background: '#0a0a0a',
            primary: '#00ff00'
        },
        'mono-gold': {
            colors: ['#d4af37', '#e0c77f', '#b8960f', '#f4d03f'],
            background: '#0a0a0a',
            primary: '#d4af37'
        },
        fossil: {
            colors: ['#d9ba63', '#cfa04f', '#b28334', '#f2d688'],
            background: '#070a16',
            primary: '#d9ba63'
        },
        contour: {
            colors: ['#00ffd5', '#ff5aa5', '#6db6ff', '#ffd166', '#9b6dff', '#37f2b2', '#ff8c42', '#eaf9ff'],
            background: '#1f5a39',
            primary: '#00ffd5'
        }
    },

    chooseCuratedSettings: function(roundData) {
        const consistency = roundData?.metadata?.consistency || 60;
        const avgSpeed = roundData?.metadata?.avgSpeed || 60;
        const keyMoments = roundData?.metadata?.keyMoments?.length || 0;

        const density = Math.max(72, Math.min(98, Math.round((100 - consistency) * 0.48 + keyMoments * 5 + 64)));
        const complexity = Math.max(70, Math.min(99, Math.round(avgSpeed * 0.64 + keyMoments * 6)));

        const style = 'contour-course';
        const palette = 'contour';

        let complexityLabel = 'Balanced';
        if (complexity < 55) complexityLabel = 'Minimal';
        if (complexity > 74) complexityLabel = 'Intricate';

        return {
            style,
            palette,
            density,
            complexity,
            styleLabel: 'Contour Drift',
            paletteLabel: 'Emerald Line Field',
            complexityLabel
        };
    },

    // Generate sample golf round data
    generateSampleData: function(type = 'realistic') {
        const holes = 18;
        const trajectories = [];

        for (let i = 0; i < holes; i++) {
            let trajectory;

            if (type === 'realistic') {
                const accuracy = 60 + Math.random() * 35;
                const speed = 70 + Math.random() * 30;
                trajectory = this.generateRealisticTrajectory(accuracy, speed, i);
            } else if (type === 'chaotic') {
                trajectory = this.generateChaoticTrajectory(i);
            } else if (type === 'perfect') {
                trajectory = this.generatePerfectTrajectory(i);
            }

            trajectories.push(trajectory);
        }

        return {
            holes: holes,
            trajectories: trajectories,
            timestamp: new Date(),
            metadata: {
                avgAccuracy: trajectories.reduce((sum, t) => sum + t.accuracy, 0) / holes,
                avgSpeed: trajectories.reduce((sum, t) => sum + t.speed, 0) / holes,
                consistency: this.calculateConsistency(trajectories),
                keyMoments: this.identifyKeyMoments(trajectories)
            }
        };
    },

    // Generate realistic trajectory
    generateRealisticTrajectory: function(accuracy, speed, holeIndex) {
        const numPoints = 30 + Math.floor(Math.random() * 20);
        const points = [];

        for (let i = 0; i < numPoints; i++) {
            const progress = i / numPoints;
            const apexHeight = 20 + Math.random() * 10;
            const height = Math.sin(progress * Math.PI) * apexHeight;
            const deviation = (Math.random() - 0.5) * (100 - accuracy) / 50;

            points.push({
                x: progress * 200 + deviation,
                y: height,
                z: 150 + (200 - 150) * progress
            });
        }

        return {
            id: holeIndex,
            points: points,
            accuracy: accuracy,
            speed: speed,
            distance: 150 + Math.random() * 200,
            isKeyMoment: Math.random() > 0.85
        };
    },

    // Generate chaotic trajectory
    generateChaoticTrajectory: function(holeIndex) {
        const numPoints = 50 + Math.floor(Math.random() * 30);
        const points = [];

        for (let i = 0; i < numPoints; i++) {
            const progress = i / numPoints;
            const angle = Math.sin(progress * Math.PI * 4 + Math.random() * 2) * 30;
            const radius = progress * 100 + Math.sin(progress * Math.PI * 6) * 30;

            points.push({
                x: Math.cos(angle * Math.PI / 180) * radius,
                y: Math.sin(angle * Math.PI / 180 + progress * Math.PI) * 15,
                z: 100 + progress * 300
            });
        }

        return {
            id: holeIndex,
            points: points,
            accuracy: 30 + Math.random() * 20,
            speed: 40 + Math.random() * 30,
            distance: 100 + Math.random() * 150,
            isKeyMoment: Math.random() > 0.7
        };
    },

    // Generate perfect trajectory
    generatePerfectTrajectory: function(holeIndex) {
        const numPoints = 25 + Math.floor(Math.random() * 5);
        const points = [];

        for (let i = 0; i < numPoints; i++) {
            const progress = i / numPoints;
            const apexHeight = 22;
            const height = Math.sin(progress * Math.PI) * apexHeight;
            const smoothDeviation = Math.sin(progress * Math.PI * 2) * 2;

            points.push({
                x: progress * 200 + smoothDeviation,
                y: height,
                z: 150 + (250 - 150) * progress
            });
        }

        return {
            id: holeIndex,
            points: points,
            accuracy: 95 + Math.random() * 5,
            speed: 90 + Math.random() * 10,
            distance: 200 + Math.random() * 50,
            isKeyMoment: holeIndex % 3 === 0 || Math.random() > 0.9
        };
    },

    // Calculate consistency metric
    calculateConsistency: function(trajectories) {
        if (trajectories.length === 0) return 0;
        const speeds = trajectories.map(t => t.speed);
        const mean = speeds.reduce((a, b) => a + b) / speeds.length;
        const variance = speeds.reduce((sum, sp) => sum + Math.pow(sp - mean, 2), 0) / speeds.length;
        const stdDev = Math.sqrt(variance);
        return Math.max(0, 100 - stdDev);
    },

    // Identify key moments (holes-in-one, long drives, etc.)
    identifyKeyMoments: function(trajectories) {
        const moments = [];
        for (let i = 0; i < trajectories.length; i++) {
            const traj = trajectories[i];
            if (traj.isKeyMoment || traj.accuracy > 90 || traj.distance > 250) {
                moments.push({
                    hole: i + 1,
                    type: traj.distance > 250 ? 'long-drive' : 'precise-shot',
                    intensity: (traj.accuracy / 100) * (traj.distance / 300)
                });
            }
        }
        return moments;
    },

    // Main art generation function
    generateArtwork: function(canvas, roundData, options = {}) {
        const ctx = canvas.getContext('2d');
        const palette = this.colorPalettes[options.palette || 'minimalist'];
        const style = options.style || 'minimal';
        const density = (options.density || 50) / 100;
        const complexity = (options.complexity || 50) / 100;

        // Setup canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Fill background
        ctx.fillStyle = palette.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Generate artwork based on style
        if (style === 'minimal') {
            this.renderMinimalArt(ctx, roundData, palette, density, complexity);
        } else if (style === 'expressive') {
            this.renderExpressiveArt(ctx, roundData, palette, density, complexity);
        } else if (style === 'chaotic') {
            this.renderChaoticArt(ctx, roundData, palette, density, complexity);
        } else if (style === 'geometric') {
            this.renderGeometricArt(ctx, roundData, palette, density, complexity);
        } else if (style === 'fossil-trace') {
            this.renderFossilTraceArt(ctx, roundData, palette, density, complexity);
        } else if (style === 'contour-course') {
            this.renderContourCourseArt(ctx, roundData, palette, density, complexity);
        }
    },

    renderContourCourseArt: function(ctx, roundData, palette, density, complexity) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const seed = this.createSeedFromRound(roundData);
        const random = this.createSeededRandom(seed);
        const projectedTrajectories = this.projectTraceTrajectories(roundData, width, height);
        const anchorPath = this.combineTrajectorySkeleton(projectedTrajectories);
        const contourCount = Math.round(12 + density * 18);
        const echoCount = Math.round(8 + complexity * 12);
        const maxOffset = Math.min(width, height) * (0.035 + density * 0.04);

        ctx.fillStyle = palette.background;
        ctx.fillRect(0, 0, width, height);

        this.paintWatercolorField(ctx, width, height, random);
        this.paintChromaticMist(ctx, width, height, random, density + complexity);
        this.drawColorSplines(ctx, anchorPath, random, palette, density, complexity);
        this.paintPaperBorder(ctx, width, height, random);
        this.drawDriftLines(ctx, width, height, random, density, complexity);

        const hazeRings = Math.round(4 + complexity * 5);
        const center = this.calculatePathCentroid(anchorPath);
        for (let i = hazeRings; i >= 0; i--) {
            ctx.save();
            ctx.globalAlpha = 0.08 - i * 0.01;
            ctx.strokeStyle = this.pickContourInk(i, palette, random, 0.35);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(
                center.x,
                center.y,
                Math.min(width, height) * (0.08 + i * 0.03),
                Math.min(width, height) * (0.05 + i * 0.018),
                random() * 0.7,
                0,
                Math.PI * 2
            );
            ctx.stroke();
            ctx.restore();
        }

        for (let i = contourCount; i >= 1; i--) {
            const signed = (i - contourCount / 2) / Math.max(1, contourCount / 2);
            const offset = signed * maxOffset;
            const contourPath = this.buildOffsetPath(anchorPath, offset, 0.7 + complexity * 1.4);
            this.strokePathStack(ctx, contourPath, {
                copies: 5,
                spread: 3.8,
                baseLineWidth: Math.abs(signed) < 0.2 ? 1.75 : 1.05,
                alpha: 0.22 + (1 - Math.abs(signed)) * 0.42,
                colorIndex: i * 3,
                random,
                palette,
                blendMode: 'screen'
            });
        }

        projectedTrajectories.forEach((trajectory, trajectoryIndex) => {
            for (let echo = 0; echo < echoCount; echo++) {
                const echoProgress = echo / Math.max(1, echoCount - 1);
                const offset = (echoProgress - 0.5) * maxOffset * 0.9;
                const path = this.buildOffsetPath(
                    trajectory,
                    offset,
                    0.5 + trajectoryIndex * 0.21 + echoProgress * (0.9 + complexity)
                );
                this.strokePathStack(ctx, path, {
                    copies: 6,
                    spread: 4.8,
                    baseLineWidth: echo === Math.floor(echoCount / 2)
                        ? 1.95 + density * 1.1
                        : 0.75 + echoProgress * 0.7,
                    alpha: echo === Math.floor(echoCount / 2)
                        ? 0.82
                        : 0.2 + (1 - Math.abs(echoProgress - 0.5) * 2) * 0.36,
                    colorIndex: trajectoryIndex * 7 + echo * 5,
                    random,
                    palette,
                    blendMode: 'lighter'
                });
            }
        });

        const veilLayers = Math.round(3 + density * 5);
        for (let v = 0; v < veilLayers; v++) {
            const veilPath = this.buildOffsetPath(
                anchorPath,
                (v - veilLayers / 2) * (maxOffset * 0.45),
                1.2 + v * 0.9
            );
            const veilRibbon = this.buildRibbonOutline(veilPath, Math.min(width, height) * (0.012 + random() * 0.016));
            ctx.save();
            ctx.globalAlpha = 0.05 + random() * 0.08;
            ctx.fillStyle = this.pickContourInk(v + 11, palette, random, 0.5);
            this.tracePolygon(ctx, veilRibbon);
            ctx.fill();
            ctx.restore();
        }

        for (let weave = 0; weave < 5 + Math.round(complexity * 4); weave++) {
            const weaveOffset = (random() - 0.5) * maxOffset * 1.2;
            const weavePath = this.buildOffsetPath(anchorPath, weaveOffset, 2 + weave * 0.8);
            this.strokePathStack(ctx, weavePath, {
                copies: 5,
                spread: 3.4,
                baseLineWidth: 0.8 + random() * 1.4,
                alpha: 0.18 + random() * 0.24,
                colorIndex: weave + 27,
                random,
                palette,
                blendMode: 'screen'
            });
        }

        const gestureEnergy = Math.min(1, (roundData?.trajectories?.length || 1) / 12);
        if (roundData?.metadata?.keyMoments?.length) {
            const pulsePoint = anchorPath[Math.floor(anchorPath.length * 0.66)] || center;
            for (let i = 0; i < 3 + roundData.metadata.keyMoments.length; i++) {
                ctx.save();
                ctx.globalAlpha = 0.12 - i * 0.014;
                ctx.strokeStyle = '#f4f0e4';
                ctx.lineWidth = 0.9;
                ctx.beginPath();
                ctx.ellipse(
                    pulsePoint.x,
                    pulsePoint.y,
                    18 + i * 12 * (1 + gestureEnergy),
                    12 + i * 8 * (1 + gestureEnergy),
                    random() * 0.35,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
                ctx.restore();
            }
        }

        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = '#132d1f';
        ctx.lineWidth = 2.2;
        this.strokePath(ctx, anchorPath);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = 0.48;
        ctx.strokeStyle = this.pickContourInk(99, palette, random, 0.9);
        ctx.lineWidth = 1.25;
        this.strokePath(ctx, anchorPath);
        ctx.restore();

        this.strokePathStack(ctx, anchorPath, {
            copies: 8,
            spread: 6.2,
            baseLineWidth: 1.65,
            alpha: 0.68,
            colorIndex: 121,
            random,
            palette,
            blendMode: 'lighter'
        });
    },

    renderFossilTraceArt: function(ctx, roundData, palette, density, complexity) {
        const trajectories = roundData.trajectories;
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const maxRadius = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.42;
        const rings = Math.max(18, Math.floor(24 + complexity * 18));

        for (let r = 0; r < rings; r++) {
            const ringProgress = r / Math.max(1, rings - 1);
            const radius = maxRadius * Math.pow(ringProgress, 1.15);
            const color = palette.colors[r % palette.colors.length];
            const jitter = (1 - ringProgress) * (12 + density * 8);

            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.08 + density * 0.35 * (1 - ringProgress * 0.7);
            ctx.lineWidth = 0.35 + ringProgress * 0.9;
            ctx.beginPath();

            for (let a = 0; a <= 360; a += 3) {
                const theta = (a * Math.PI) / 180;
                const traj = trajectories[(r + a) % trajectories.length];
                const p = traj.points[(a + r) % traj.points.length];
                const wave = Math.sin(theta * (2 + complexity * 2) + (p.x + p.y) * 0.01) * jitter;
                const dr = Math.cos(theta * (1.6 + density * 2.2)) * (p.y * 0.35) + wave;
                const x = centerX + Math.cos(theta) * (radius + dr);
                const y = centerY + Math.sin(theta) * (radius + dr);

                if (a === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.closePath();
            ctx.stroke();
        }

        trajectories.forEach((traj, idx) => {
            const traceColor = palette.colors[idx % palette.colors.length];
            ctx.strokeStyle = traceColor;
            ctx.globalAlpha = 0.16 + density * 0.22;
            ctx.lineWidth = 0.45 + (traj.accuracy / 100) * 1.4;
            ctx.beginPath();

            const startAngle = (idx / trajectories.length) * Math.PI * 2;
            for (let i = 0; i < traj.points.length; i++) {
                const p = traj.points[i];
                const orbit = maxRadius * 0.22 + i * (maxRadius * 0.6 / traj.points.length);
                const drift = (p.x - 100) * 0.55;
                const angle = startAngle + i * (0.03 + complexity * 0.03);
                const x = centerX + Math.cos(angle) * orbit + drift;
                const y = centerY + Math.sin(angle) * orbit + p.y * 2.8;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        });

        ctx.globalAlpha = 1;
    },

    // Render minimal line-based art
    renderMinimalArt: function(ctx, roundData, palette, density, complexity) {
        const trajectories = roundData.trajectories;
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const scale = Math.min(ctx.canvas.width, ctx.canvas.height) / 3;

        trajectories.forEach((traj, index) => {
            const angle = (index / trajectories.length) * Math.PI * 2;
            const radiusOffset = index % 2 === 0 ? 1 : 1.5;

            // Draw trajectory as curved line
            ctx.strokeStyle = palette.colors[index % palette.colors.length];
            ctx.lineWidth = 0.5 + traj.accuracy / 100 * 2;
            ctx.globalAlpha = 0.3 + density * 0.5;

            ctx.beginPath();
            traj.points.forEach((point, i) => {
                const x = centerX + Math.cos(angle) * (50 + point.z / 10) * radiusOffset + (point.x - 100) * 0.5;
                const y = centerY + Math.sin(angle) * (50 + point.z / 10) * radiusOffset + point.y * 5;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else if (i % Math.ceil(complexity + 1) === 0) {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();

            // Add key moment emphasis
            if (traj.isKeyMoment) {
                this.drawKeyMomentMarker(ctx, centerX, centerY, angle, scale, palette);
            }
        });

        ctx.globalAlpha = 1;
    },

    // Render expressive brush-stroke art
    renderExpressiveArt: function(ctx, roundData, palette, density, complexity) {
        const trajectories = roundData.trajectories;
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        // Create flowing paths
        trajectories.forEach((traj, index) => {
            const intensity = (traj.accuracy + traj.speed) / 2 / 100;
            const hue = (index / trajectories.length) * 360;

            // Base stroke
            ctx.strokeStyle = palette.colors[index % palette.colors.length];
            ctx.lineWidth = 1 + intensity * 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = 0.4 + density * 0.4;

            // Draw flowing path
            ctx.beginPath();
            const startX = centerX + Math.cos((index / trajectories.length) * Math.PI * 2) * 100;
            const startY = centerY + Math.sin((index / trajectories.length) * Math.PI * 2) * 100;

            ctx.moveTo(startX, startY);

            // Create smooth curves through trajectory points
            for (let i = 0; i < traj.points.length; i += Math.max(1, Math.floor(2 / complexity))) {
                const point = traj.points[i];
                const x = startX + point.x * 2;
                const y = startY + point.y * 3;
                ctx.lineTo(x, y);
            }

            ctx.stroke();

            // Add glow for key moments
            if (traj.isKeyMoment) {
                ctx.shadowColor = palette.colors[index % palette.colors.length];
                ctx.shadowBlur = 15;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        });

        ctx.globalAlpha = 1;
    },

    // Render chaotic generative art
    renderChaoticArt: function(ctx, roundData, palette, density, complexity) {
        const trajectories = roundData.trajectories;
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        // Create chaotic overlapping paths
        trajectories.forEach((traj, index) => {
            const baseColor = palette.colors[index % palette.colors.length];

            for (let layer = 0; layer < Math.ceil(complexity * 3); layer++) {
                const offsets = {
                    x: (Math.random() - 0.5) * 100 * complexity,
                    y: (Math.random() - 0.5) * 100 * complexity
                };

                ctx.strokeStyle = baseColor;
                ctx.lineWidth = 0.3 + Math.random() * 1.5;
                ctx.globalAlpha = (0.1 + density * 0.3) / (layer + 1);

                ctx.beginPath();
                traj.points.forEach((point, i) => {
                    const x = centerX + point.x + offsets.x;
                    const y = centerY + point.y + offsets.y;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else if (Math.random() > 0.3) {
                        ctx.lineTo(x, y);
                    }
                });
                ctx.stroke();
            }
        });

        ctx.globalAlpha = 1;
    },

    // Render geometric composition
    renderGeometricArt: function(ctx, roundData, palette, density, complexity) {
        const trajectories = roundData.trajectories;
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        trajectories.forEach((traj, index) => {
            const angle = (index / trajectories.length) * Math.PI * 2;
            const color = palette.colors[index % palette.colors.length];
            const accuracy = traj.accuracy / 100;

            // Create geometric shapes based on trajectory
            const shapeSize = 20 + accuracy * 40;
            const x = centerX + Math.cos(angle) * 150;
            const y = centerY + Math.sin(angle) * 150;

            // Draw primary shape
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.2 + density * 0.3;
            this.drawGeometricShape(ctx, x, y, shapeSize, traj.points.length % 4, complexity);

            // Draw accent shapes
            ctx.globalAlpha = 0.1 + density * 0.2;
            for (let i = 1; i < Math.ceil(complexity * 3); i++) {
                const subAngle = angle + (Math.PI * 2 / 18) * i;
                const subX = centerX + Math.cos(subAngle) * (150 + i * 30);
                const subY = centerY + Math.sin(subAngle) * (150 + i * 30);
                this.drawGeometricShape(ctx, subX, subY, shapeSize / (i + 1), (traj.points.length + i) % 4, complexity * 0.5);
            }
        });

        ctx.globalAlpha = 1;
    },

    // Helper: draw geometric shapes
    drawGeometricShape: function(ctx, x, y, size, type, complexity) {
        const sides = 3 + type;
        const rotation = Math.random() * Math.PI * 2;

        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2 + rotation;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fill();
    },

    // Helper: draw key moment markers
    drawKeyMomentMarker: function(ctx, centerX, centerY, angle, scale, palette) {
        const x = centerX + Math.cos(angle) * 200;
        const y = centerY + Math.sin(angle) * 200;

        ctx.fillStyle = palette.primary;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1;
    },

    createSeedFromRound: function(roundData) {
        const trajectories = roundData?.trajectories || [];
        let seed = 2166136261;
        trajectories.forEach((traj, index) => {
            seed ^= ((traj.accuracy || 0) * 31 + (traj.speed || 0) * 17 + index * 101) | 0;
            seed = Math.imul(seed, 16777619);
            traj.points.slice(0, 6).forEach((point, pointIndex) => {
                seed ^= (((point.x || 0) * 13 + (point.y || 0) * 7 + pointIndex * 19) | 0);
                seed = Math.imul(seed, 16777619);
            });
        });
        return seed >>> 0;
    },

    createSeededRandom: function(seed) {
        let state = seed || 1;
        return function() {
            state = (state * 1664525 + 1013904223) >>> 0;
            return state / 4294967296;
        };
    },

    buildCourseSkeleton: function(roundData, width, height) {
        const trajectories = (roundData?.trajectories || []).filter(traj => traj.points && traj.points.length);
        const allPoints = trajectories.flatMap(traj => traj.points);

        if (!allPoints.length) {
            return [
                { x: width * 0.5, y: height * 0.82 },
                { x: width * 0.48, y: height * 0.63 },
                { x: width * 0.52, y: height * 0.44 },
                { x: width * 0.5, y: height * 0.24 }
            ];
        }

        const minX = Math.min(...allPoints.map(point => point.x));
        const maxX = Math.max(...allPoints.map(point => point.x));
        const minY = Math.min(...allPoints.map(point => point.y));
        const maxY = Math.max(...allPoints.map(point => point.y));
        const spanX = Math.max(1, maxX - minX);
        const spanY = Math.max(1, maxY - minY);
        const steps = 10;
        const skeleton = [];

        for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            const slice = [];
            trajectories.forEach((traj) => {
                const index = Math.min(traj.points.length - 1, Math.floor(t * (traj.points.length - 1)));
                slice.push(traj.points[index]);
            });

            const avgX = slice.reduce((sum, point) => sum + point.x, 0) / slice.length;
            const avgY = slice.reduce((sum, point) => sum + point.y, 0) / slice.length;
            const normX = (avgX - minX) / spanX;
            const normY = (avgY - minY) / spanY;

            skeleton.push({
                x: width * (0.22 + normX * 0.56),
                y: height * (0.82 - t * 0.58) + (normY - 0.5) * height * 0.08
            });
        }

        return skeleton.map((point, index, points) => {
            const prev = points[Math.max(0, index - 1)];
            const next = points[Math.min(points.length - 1, index + 1)];
            return {
                x: (prev.x + point.x * 2 + next.x) / 4,
                y: (prev.y + point.y * 2 + next.y) / 4
            };
        });
    },

    buildRibbonOutline: function(points, baseWidth) {
        const left = [];
        const right = [];

        points.forEach((point, index) => {
            const prev = points[Math.max(0, index - 1)];
            const next = points[Math.min(points.length - 1, index + 1)];
            const dx = next.x - prev.x;
            const dy = next.y - prev.y;
            const length = Math.max(1, Math.hypot(dx, dy));
            const nx = -dy / length;
            const ny = dx / length;
            const taper = Math.sin((index / Math.max(1, points.length - 1)) * Math.PI);
            const width = baseWidth * (0.72 + taper * 0.52);

            left.push({ x: point.x + nx * width, y: point.y + ny * width });
            right.push({ x: point.x - nx * width, y: point.y - ny * width });
        });

        return left.concat(right.reverse());
    },

    projectTraceTrajectories: function(roundData, width, height) {
        const trajectories = (roundData?.trajectories || []).filter(traj => traj.points && traj.points.length > 1);
        if (!trajectories.length) return [];

        const allPoints = trajectories.flatMap(traj => traj.points);
        const minX = Math.min(...allPoints.map(point => point.x));
        const maxX = Math.max(...allPoints.map(point => point.x));
        const minY = Math.min(...allPoints.map(point => point.y));
        const maxY = Math.max(...allPoints.map(point => point.y));
        const spanX = Math.max(1, maxX - minX);
        const spanY = Math.max(1, maxY - minY);
        const scale = Math.min(width * 0.62 / spanX, height * 0.62 / spanY);
        const offsetX = width * 0.5 - (minX + spanX / 2) * scale;
        const offsetY = height * 0.56 - (minY + spanY / 2) * scale;

        return trajectories.map((traj, trajIndex) => this.smoothPathPoints(traj.points.map((point, pointIndex) => ({
            x: point.x * scale + offsetX + Math.sin(pointIndex * 0.28 + trajIndex * 0.8) * (8 + trajIndex * 0.8),
            y: point.y * scale + offsetY + Math.cos(pointIndex * 0.22 + trajIndex * 0.5) * (10 + trajIndex * 1.2)
        })), 2));
    },

    combineTrajectorySkeleton: function(trajectories) {
        if (!trajectories.length) return [];
        const longest = Math.max(...trajectories.map(traj => traj.length));
        const skeleton = [];

        for (let i = 0; i < longest; i++) {
            let sumX = 0;
            let sumY = 0;
            let count = 0;
            trajectories.forEach((traj) => {
                const point = traj[Math.min(traj.length - 1, i)];
                if (!point) return;
                sumX += point.x;
                sumY += point.y;
                count += 1;
            });
            if (count) {
                skeleton.push({ x: sumX / count, y: sumY / count });
            }
        }

        return this.smoothPathPoints(skeleton, 3);
    },

    smoothPathPoints: function(points, passes = 1) {
        let result = points.slice();
        for (let pass = 0; pass < passes; pass++) {
            result = result.map((point, index, array) => {
                const prev = array[Math.max(0, index - 1)];
                const next = array[Math.min(array.length - 1, index + 1)];
                return {
                    x: (prev.x + point.x * 2 + next.x) / 4,
                    y: (prev.y + point.y * 2 + next.y) / 4
                };
            });
        }
        return result;
    },

    buildOffsetPath: function(points, offsetAmount, phase) {
        return points.map((point, index, array) => {
            const prev = array[Math.max(0, index - 1)];
            const next = array[Math.min(array.length - 1, index + 1)];
            const dx = next.x - prev.x;
            const dy = next.y - prev.y;
            const length = Math.max(1, Math.hypot(dx, dy));
            const nx = -dy / length;
            const ny = dx / length;
            const taper = Math.sin((index / Math.max(1, array.length - 1)) * Math.PI);
            const modulation = Math.sin(index * 0.34 + phase) * offsetAmount * 0.16;
            return {
                x: point.x + nx * (offsetAmount * (0.55 + taper * 0.45) + modulation),
                y: point.y + ny * (offsetAmount * (0.55 + taper * 0.45) + modulation)
            };
        });
    },

    strokePath: function(ctx, points) {
        if (!points.length) return;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    },

    strokePathStack: function(ctx, points, options) {
        const copies = options?.copies || 1;
        const spread = options?.spread || 0;
        const baseLineWidth = options?.baseLineWidth || 1;
        const alpha = options?.alpha || 0.3;
        const colorIndex = options?.colorIndex || 0;
        const random = options?.random || Math.random;
        const palette = options?.palette || this.colorPalettes.contour;
        const blendMode = options?.blendMode || 'source-over';

        for (let copy = 0; copy < copies; copy++) {
            const offset = (copy - (copies - 1) / 2) * spread;
            const phase = copy * 0.9 + random() * 1.7;
            const copyPath = Math.abs(offset) < 0.01
                ? points
                : this.buildOffsetPath(points, offset, phase);

            ctx.save();
            ctx.globalCompositeOperation = blendMode;
            ctx.globalAlpha = Math.max(0.05, alpha * (1 - Math.abs(copy - (copies - 1) / 2) / Math.max(1, copies)));
            ctx.strokeStyle = this.pickContourInk(colorIndex + copy, palette, random, Math.min(1, alpha + 0.15));
            ctx.lineWidth = Math.max(0.45, baseLineWidth * (1 - copy * 0.06));
            this.strokePath(ctx, copyPath);

            // Add an additive glow duplicate to make layered color visibly stronger.
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = Math.max(0.03, alpha * 0.28);
            ctx.strokeStyle = this.pickContourInk(colorIndex + copy + 17, palette, random, Math.min(1, alpha + 0.3));
            ctx.lineWidth = Math.max(0.8, baseLineWidth + 1.4);
            this.strokePath(ctx, copyPath);
            ctx.restore();
        }
    },

    calculatePathCentroid: function(points) {
        if (!points.length) return { x: 0, y: 0 };
        const sum = points.reduce((acc, point) => {
            acc.x += point.x;
            acc.y += point.y;
            return acc;
        }, { x: 0, y: 0 });
        return {
            x: sum.x / points.length,
            y: sum.y / points.length
        };
    },

    tracePolygon: function(ctx, points) {
        if (!points.length) return;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
    },

    pickContourInk: function(index, palette, random, alpha = 0.5) {
        const paletteSize = palette.colors.length;
        let colorIndex = Math.abs(index) % paletteSize;
        // Avoid overusing the lightest swatch for non-highlight lines.
        if (colorIndex === paletteSize - 1 && alpha < 0.8) {
            colorIndex = (colorIndex + 2) % paletteSize;
        }
        const color = palette.colors[colorIndex] || palette.primary;
        const hex = color.replace('#', '');
        const fullHex = hex.length === 3
            ? hex.split('').map(ch => ch + ch).join('')
            : hex;

        const rBase = parseInt(fullHex.slice(0, 2), 16);
        const gBase = parseInt(fullHex.slice(2, 4), 16);
        const bBase = parseInt(fullHex.slice(4, 6), 16);
        const jitter = 34;
        const r = Math.max(0, Math.min(255, rBase + Math.floor((random() - 0.5) * jitter)));
        const g = Math.max(0, Math.min(255, gBase + Math.floor((random() - 0.5) * jitter)));
        const b = Math.max(0, Math.min(255, bBase + Math.floor((random() - 0.5) * jitter)));
        return `rgba(${r}, ${g}, ${b}, ${Math.max(0.04, Math.min(1, alpha))})`;
    },

    paintWatercolorField: function(ctx, width, height, random) {
        const washes = 12;
        for (let i = 0; i < washes; i++) {
            const x = random() * width;
            const y = random() * height;
            const radius = Math.min(width, height) * (0.12 + random() * 0.24);
            const gradient = ctx.createRadialGradient(x, y, radius * 0.08, x, y, radius);
            gradient.addColorStop(0, `rgba(${70 + Math.floor(random() * 45)}, ${120 + Math.floor(random() * 60)}, ${80 + Math.floor(random() * 35)}, 0.18)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.save();
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = 0.06;
        for (let i = 0; i < 140; i++) {
            const strokeW = 40 + random() * 180;
            const startX = random() * width;
            const startY = random() * height;
            ctx.strokeStyle = random() > 0.5 ? '#0f301e' : '#8dbe7a';
            ctx.lineWidth = 0.5 + random() * 1.1;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(
                startX + strokeW * 0.25,
                startY + (random() - 0.5) * 60,
                startX + strokeW * 0.7,
                startY + (random() - 0.5) * 60,
                startX + strokeW,
                startY + (random() - 0.5) * 20
            );
            ctx.stroke();
        }
        ctx.restore();
    },

    paintChromaticMist: function(ctx, width, height, random, intensity) {
        const blooms = Math.round(16 + intensity * 10);
        for (let i = 0; i < blooms; i++) {
            const x = random() * width;
            const y = random() * height;
            const radius = Math.min(width, height) * (0.18 + random() * 0.2);
            const hue = Math.floor(145 + random() * 190);
            const sat = 45 + Math.floor(random() * 40);
            const light = 52 + Math.floor(random() * 24);
            const gradient = ctx.createRadialGradient(x, y, radius * 0.04, x, y, radius);
            gradient.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, 0.22)`);
            gradient.addColorStop(0.55, `hsla(${hue + 26}, ${sat - 10}%, ${light - 4}%, 0.13)`);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.save();
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    },

    drawColorSplines: function(ctx, anchorPath, random, palette, density, complexity) {
        if (!anchorPath.length) return;
        const strands = Math.round(10 + density * 14 + complexity * 8);
        for (let i = 0; i < strands; i++) {
            const startIndex = Math.floor(random() * Math.max(1, anchorPath.length - 4));
            const a = anchorPath[startIndex];
            const b = anchorPath[Math.min(anchorPath.length - 1, startIndex + 2)];
            const c = anchorPath[Math.min(anchorPath.length - 1, startIndex + 4)];
            const drift = (random() - 0.5) * 120;

            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.08 + random() * 0.22;
            ctx.strokeStyle = this.pickContourInk(i * 9, palette, random, 0.78);
            ctx.lineWidth = 0.9 + random() * 2.2;
            ctx.beginPath();
            ctx.moveTo(a.x + drift * 0.2, a.y - drift * 0.14);
            ctx.bezierCurveTo(
                a.x + drift,
                a.y + drift * 0.12,
                b.x - drift * 0.35,
                b.y - drift * 0.2,
                c.x + drift * 0.15,
                c.y + drift * 0.05
            );
            ctx.stroke();
            ctx.restore();
        }
    },

    paintPaperBorder: function(ctx, width, height, random) {
        ctx.save();
        ctx.fillStyle = 'rgba(248, 242, 226, 0.96)';
        const frame = Math.min(width, height) * 0.018;
        ctx.fillRect(0, 0, width, frame);
        ctx.fillRect(0, height - frame, width, frame);
        ctx.fillRect(0, 0, frame, height);
        ctx.fillRect(width - frame, 0, frame, height);

        ctx.globalAlpha = 0.16;
        for (let i = 0; i < 180; i++) {
            const edge = random();
            const size = 4 + random() * 14;
            let x = 0;
            let y = 0;

            if (edge < 0.25) {
                x = random() * width;
                y = random() * frame;
            } else if (edge < 0.5) {
                x = random() * width;
                y = height - random() * frame;
            } else if (edge < 0.75) {
                x = random() * frame;
                y = random() * height;
            } else {
                x = width - random() * frame;
                y = random() * height;
            }

            ctx.fillRect(x, y, size, 1 + random() * 2);
        }
        ctx.restore();
    },

    drawCourseFlag: function(ctx, x, y, poleHeight, palette, random) {
        ctx.save();
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y + 8);
        ctx.lineTo(x, y - poleHeight);
        ctx.stroke();

        ctx.fillStyle = random() > 0.5 ? '#d44a3a' : '#f6f3ea';
        ctx.beginPath();
        ctx.moveTo(x, y - poleHeight);
        ctx.lineTo(x + 24, y - poleHeight + 8);
        ctx.lineTo(x, y - poleHeight + 18);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(16, 33, 23, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(x, y + 4, 16, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    },

    drawBunker: function(ctx, x, y, radiusX, radiusY, random) {
        ctx.save();
        ctx.fillStyle = 'rgba(245, 239, 220, 0.9)';
        ctx.beginPath();
        ctx.ellipse(x, y, radiusX, radiusY, random() * 0.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(x, y, radiusX * 0.88, radiusY * 0.82, random() * 0.9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    },

    drawDriftLines: function(ctx, width, height, random, density, complexity) {
        const drifts = Math.round(28 + density * 24);
        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.lineCap = 'round';
        for (let i = 0; i < drifts; i++) {
            const startX = random() * width;
            const startY = random() * height;
            const length = 28 + random() * 120;
            const angle = (-Math.PI / 8) + random() * (Math.PI / 4);
            ctx.strokeStyle = random() > 0.55 ? '#f7f4ec' : '#0e271a';
            ctx.lineWidth = 0.4 + random() * (0.8 + complexity * 0.6);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
            ctx.stroke();
        }
        ctx.restore();
    },

    // Generate artwork title based on data
    generateTitle: function(roundData) {
        const titles = [
            'Controlled Momentum',
            'Precision in Motion',
            'The Perfect Arc',
            'Moment of Impact',
            'Flow State',
            'Chase the Line',
            'Rhythm and Tempo',
            'Silent Flight',
            'Painted Trajectory',
            'Digital Memory'
        ];

        const consistency = roundData.metadata.consistency;
        const avgAccuracy = roundData.metadata.avgAccuracy;
        
        let titleIndex = Math.floor((consistency + avgAccuracy) / 2 / 10) % titles.length;
        
        return titles[titleIndex];
    },

    // For visualizing steps
    renderStepVisualization: function(canvasId, stepNumber) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.fillStyle = 'rgba(212, 175, 55, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (stepNumber === 1) {
            // Step 1: Trajectory lines
            this.renderTrajectoryLines(ctx, canvas.width, canvas.height);
        } else if (stepNumber === 2) {
            // Step 2: Data transformation
            this.renderDataTransformation(ctx, canvas.width, canvas.height);
        } else if (stepNumber === 3) {
            // Step 3: Abstract art
            this.renderAbstractPattern(ctx, canvas.width, canvas.height);
        }
    },

    renderTrajectoryLines: function(ctx, width, height) {
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;

        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            const startX = 20 + i * 60;
            const startY = height - 20;
            ctx.moveTo(startX, startY);

            for (let j = 0; j < 15; j++) {
                const x = startX + j * 8;
                const y = startY - Math.sin(j / 10) * 40 - j * 2;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    },

    renderDataTransformation: function(ctx, width, height) {
        ctx.strokeStyle = '#52b788';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.6;

        // Draw grid-like pattern representing data points
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(i * (width / 10), 10);
            ctx.lineTo(i * (width / 10), height - 10);
            ctx.stroke();
        }

        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(10, i * (height / 5));
            ctx.lineTo(width - 10, i * (height / 5));
            ctx.stroke();
        }
    },

    renderAbstractPattern: function(ctx, width, height) {
        ctx.strokeStyle = '#ff6b35';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;

        // Draw flowing abstract pattern
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            const startX = 0;
            const startY = i * (height / 20);

            for (let j = 0; j < width; j += 5) {
                const y = startY + Math.sin(j / 20 + i / 5) * 15;
                if (j === 0) {
                    ctx.moveTo(j, y);
                } else {
                    ctx.lineTo(j, y);
                }
            }
            ctx.stroke();
        }
    }
};
