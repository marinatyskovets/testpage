var animationUtils = (function () {
    var random = function (min, max) {
        return min + Math.random() * (max - min);
    };

    var isReducedMotion = function () {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    var nextSign = function (sign, switchChance) {
        return Math.random() < switchChance ? -sign : sign;
    };

    return {
        random: random,
        isReducedMotion: isReducedMotion,
        nextSign: nextSign
    };
})();


var animHeart = (function () {
    var TILT_MIN = 5,
        TILT_MAX = 7;

    var initialize = function () {
        if (animationUtils.isReducedMotion()) {
            return;
        }

        document.querySelectorAll('.c-anim-heart').forEach(function (heart) {
            var sign = 1;

            var nextTilt = function () {
                sign = animationUtils.nextSign(sign, 0.7);
                heart.style.setProperty('--tilt', (sign * animationUtils.random(TILT_MIN, TILT_MAX)).toFixed(2) + 'deg');
            };

            heart.querySelector('img').addEventListener('animationiteration', nextTilt);
            nextTilt();
        });
    };

    return {
        initialize: initialize
    };
})();


var animEye = (function () {
    var TILT_MIN = 7,
        TILT_MAX = 11;

    var initialize = function () {
        if (animationUtils.isReducedMotion()) {
            return;
        }

        document.querySelectorAll('.c-anim-eye').forEach(function (eye) {
            var sign = 1;

            var nextTilt = function () {
                sign = animationUtils.nextSign(sign, 0.75);
                eye.style.setProperty('--tilt', (sign * animationUtils.random(TILT_MIN, TILT_MAX)).toFixed(2) + 'deg');
            };

            eye.querySelector('.c-anim-eye__scale').addEventListener('animationiteration', nextTilt);
            nextTilt();
        });
    };

    return {
        initialize: initialize
    };
})();


var animBrain = (function () {
    var SPEED = 0.8,
        TILT_MIN = 2,
        TILT_MAX = 4;

    var random = animationUtils.random;

    var getFlashSteps = function () {
        var chance = Math.random();

        if (chance < 0.25) {
            return [[1, 160], [0.25, 220], [0.9, 160], [0, 450]];
        }

        if (chance < 0.55) {
            return [[random(0.8, 1), random(200, 350)], [0, random(500, 800)]];
        }

        return [[random(0.5, 0.8), random(700, 1100)], [random(0.2, 0.35), random(400, 700)], [0, random(900, 1400)]];
    };

    var initialize = function () {
        if (animationUtils.isReducedMotion()) {
            return;
        }

        document.querySelectorAll('.c-anim-brain').forEach(function (brain) {
            var active = brain.querySelector('.c-anim-brain__active'),
                scale = brain.querySelector('.c-anim-brain__scale'),
                sign = 1;

            var glow = function (level, duration) {
                active.style.setProperty('--glow-speed', (duration * SPEED) + 'ms');
                active.style.setProperty('--glow', level.toFixed(2));
            };

            var fire = function () {
                var time = 0;

                getFlashSteps().forEach(function (step) {
                    setTimeout(function () {
                        glow(step[0], step[1]);
                    }, time * SPEED);
                    time += step[1];
                });

                setTimeout(fire, (time + random(300, 1400)) * SPEED);
            };

            var nextTilt = function () {
                sign = animationUtils.nextSign(sign, 0.75);
                brain.style.setProperty('--tilt', (sign * random(TILT_MIN, TILT_MAX)).toFixed(2) + 'deg');
            };

            scale.addEventListener('animationiteration', nextTilt);
            nextTilt();
            setTimeout(fire, 600);
        });
    };

    return {
        initialize: initialize
    };
})();


var animScales = (function () {
    var START_DELAY = 900,
        HOLD_MIN = 1400,
        HOLD_MAX = 2000,
        BREATH_SCALE = '1.09',
        BREATH_DURATION = 420;

    var initialize = function () {
        if (animationUtils.isReducedMotion()) {
            return;
        }

        document.querySelectorAll('.c-anim-scales').forEach(function (root) {
            var frames = root.querySelectorAll('[data-frame]'),
                index = 0;

            var step = function () {
                index = (index + 1) % frames.length;

                frames.forEach(function (frame, frameIndex) {
                    frame.classList.toggle('is-on', frameIndex === index);
                });

                root.style.setProperty('--scale', BREATH_SCALE);
                setTimeout(function () {
                    root.style.setProperty('--scale', '1');
                }, BREATH_DURATION);

                setTimeout(step, animationUtils.random(HOLD_MIN, HOLD_MAX));
            };

            setTimeout(step, START_DELAY);
        });
    };

    return {
        initialize: initialize
    };
})();


var animTarget = (function () {
    var WAIT_BEFORE_HIT = 1400,
        HOLD_AFTER_HIT = 2200,
        RESET_FADE = 250;

    var initialize = function () {
        if (animationUtils.isReducedMotion()) {
            return;
        }

        document.querySelectorAll('.c-anim-target').forEach(function (root) {
            var empty = root.querySelector('[data-frame="empty"]'),
                hit = root.querySelector('[data-frame="hit"]');

            var shoot = function () {
                root.classList.remove('is-resetting');
                hit.classList.add('is-on');
                empty.classList.remove('is-on');

                root.classList.remove('is-hit');
                void root.offsetWidth;
                root.classList.add('is-hit');

                setTimeout(function () {
                    empty.classList.add('is-on');
                    root.classList.add('is-resetting');
                    hit.classList.remove('is-on');

                    setTimeout(shoot, RESET_FADE + WAIT_BEFORE_HIT);
                }, HOLD_AFTER_HIT);
            };

            setTimeout(shoot, WAIT_BEFORE_HIT);
        });
    };

    return {
        initialize: initialize
    };
})();


var animSketch = (function () {
    var SPEED = 700,
        LIFT_MS = 240,
        ENTER_MS = 1000,
        START_MS = 300,
        EXIT_MS = 900,
        CORNER_IN = {x: 1000, y: 1250},
        CORNER_OUT = {x: 1060, y: 1320};

    var ease = function (t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    var wait = function (duration) {
        return new Promise(function (resolve) {
            setTimeout(resolve, duration);
        });
    };

    var animate = function (duration, step) {
        return new Promise(function (resolve) {
            var start = performance.now();

            var frame = function (now) {
                var progress = Math.min(1, (now - start) / duration);

                step(progress);

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    resolve();
                }
            };

            frame(start);
        });
    };

    var createSketch = function (root) {
        var hand = root.querySelector('.c-anim-sketch__hand'),
            guides = Array.from(root.querySelectorAll('.c-anim-sketch__guides path')),
            viewBox = root.querySelector('svg').viewBox.baseVal;

        var moveHand = function (point, lift) {
            var rect = root.getBoundingClientRect();

            hand.style.setProperty('--x', point.x / viewBox.width * rect.width + 'px');
            hand.style.setProperty('--y', point.y / viewBox.height * rect.height + 'px');
            hand.style.setProperty('--lift', lift);
        };

        var glide = function (from, to, duration) {
            return animate(duration, function (progress) {
                var eased = ease(progress);

                moveHand({
                    x: from.x + (to.x - from.x) * eased,
                    y: from.y + (to.y - from.y) * eased
                }, Math.sin(progress * Math.PI));
            });
        };

        var draw = async function () {
            var lengths = guides.map(function (path) {
                    return path.getTotalLength();
                }),
                position = CORNER_IN;

            guides.forEach(function (path, index) {
                path.style.strokeDasharray = lengths[index];
                path.style.strokeDashoffset = lengths[index];
            });

            moveHand(position, 1);
            await wait(START_MS);

            for (var index = 0; index < guides.length; index++) {
                var path = guides[index],
                    length = lengths[index];

                if (index === 0) {
                    hand.style.transition = 'opacity ' + ENTER_MS + 'ms ease-out';
                    hand.style.opacity = 1;
                }

                await glide(position, path.getPointAtLength(0), index === 0 ? ENTER_MS : LIFT_MS);
                await animate(length / SPEED * 1000, function (progress) {
                    var drawn = length * progress;

                    path.style.strokeDashoffset = length - drawn;
                    moveHand(path.getPointAtLength(drawn), 0);
                });

                position = path.getPointAtLength(length);
            }

            await glide(position, CORNER_OUT, EXIT_MS);
        };

        var showFinished = function () {
            moveHand(CORNER_OUT, 0);
        };

        return {
            draw: draw,
            showFinished: showFinished
        };
    };

    var initialize = function () {
        var items = document.querySelectorAll('.c-anim-sketch');

        if (!items.length) {
            return;
        }

        if (animationUtils.isReducedMotion()) {
            items.forEach(function (root) {
                createSketch(root).showFinished();
            });

            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    createSketch(entry.target).draw();
                }
            });
        }, {threshold: 0.4});

        items.forEach(function (root) {
            observer.observe(root);
        });
    };

    return {
        initialize: initialize
    };
})();


var animConfetti = (function () {
    var COUNT = 110,
        COLORS = ['#6d3df5', '#9b7bff', '#3b82f6', '#9ec3ff', '#f5b400', '#f59e0b', '#c4b5fd'],
        DURATION = 2000,
        SPEED = 7,
        GRAVITY = 0.03,
        DRAG = 0.955,
        OVERFLOW = 170,
        INTERVAL_MIN = 2500,
        INTERVAL_MAX = 4000,
        MAX_PIXEL_RATIO = 2;

    var random = animationUtils.random;

    var createConfetti = function (target) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            particles = [],
            frameId = null,
            width = 0,
            height = 0,
            originX = 0;

        var resize = function () {
            var ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO),
                rect = target.getBoundingClientRect(),
                viewportWidth = document.documentElement.clientWidth,
                // Horizontally the canvas stops at the viewport edges, so it never causes a horizontal scroll
                overflowLeft = Math.min(OVERFLOW, Math.max(0, rect.left)),
                overflowRight = Math.min(OVERFLOW, Math.max(0, viewportWidth - rect.right));

            canvas.style.left = -overflowLeft + 'px';
            canvas.style.width = rect.width + overflowLeft + overflowRight + 'px';
            // The canvas can be asymmetric now, so the burst point is the target's center, not the canvas's
            originX = overflowLeft + rect.width / 2;

            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        var frame = function (now) {
            context.clearRect(0, 0, width, height);

            particles = particles.filter(function (particle) {
                return now - particle.born < DURATION;
            });

            particles.forEach(function (particle) {
                if (now < particle.born) {
                    return;
                }

                var life = (now - particle.born) / DURATION;

                particle.vx *= DRAG;
                particle.vy = particle.vy * DRAG + GRAVITY;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.rotation += particle.spin;
                particle.tilt += particle.tiltSpeed;

                context.save();
                context.translate(particle.x, particle.y);
                context.rotate(particle.rotation);
                context.scale(1, Math.cos(particle.tilt));
                context.globalAlpha = life < 0.7 ? 1 : 1 - (life - 0.7) / 0.3;
                context.fillStyle = particle.color;
                context.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
                context.restore();
            });

            frameId = particles.length ? requestAnimationFrame(frame) : null;
        };

        var burst = function () {
            if (document.hidden) {
                return;
            }

            var centerX = originX,
                centerY = height / 2,
                now = performance.now();

            for (var index = 0; index < COUNT; index++) {
                var angle = random(0, Math.PI * 2),
                    velocity = SPEED * random(0.4, 1.3);

                particles.push({
                    born: now + random(0, 120),
                    x: centerX + random(-15, 15),
                    y: centerY + random(-15, 15),
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    width: random(4, 10),
                    height: random(3, 8),
                    rotation: random(0, Math.PI),
                    spin: random(-0.15, 0.15),
                    tilt: random(0, Math.PI),
                    tiltSpeed: random(0.15, 0.35),
                    color: COLORS[Math.floor(Math.random() * COLORS.length)]
                });
            }

            if (!frameId) {
                frameId = requestAnimationFrame(frame);
            }
        };

        var start = function () {
            burst();
            setTimeout(start, random(INTERVAL_MIN, INTERVAL_MAX));
        };

        canvas.style.cssText = [
            'position: absolute',
            'z-index: 9',
            'top: -' + OVERFLOW + 'px',
            'height: calc(100% + ' + OVERFLOW * 2 + 'px)',
            'pointer-events: none'
        ].join(';');

        if (getComputedStyle(target).position === 'static') {
            target.style.position = 'relative';
        }

        target.appendChild(canvas);
        resize();

        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                particles = [];
            }
        });

        return {
            start: start
        };
    };

    var initialize = function () {
        if (animationUtils.isReducedMotion()) {
            return;
        }

        document.querySelectorAll('.js-confetti').forEach(function (target) {
            createConfetti(target).start();
        });
    };

    return {
        initialize: initialize
    };
})();
