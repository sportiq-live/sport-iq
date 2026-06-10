/**
 * ==========================================================================
 * SPORT-IQ RUNTIME ENGINE // APPLICATION JAVASCRIPT
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // Initialize standard Lucide layout interfaces
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // ---------------------------------------------------------
    // [1] DYNAMIC THEME BACKGROUND INITIALIZATION
    // ---------------------------------------------------------
    const initAppBackground = () => {
        const bgContainer = document.getElementById('app-background');
        if (!bgContainer || !window.SPORT_IQ_THEME) return;

        const config = window.SPORT_IQ_THEME;

        if (config.type === 'video') {
            const video = document.createElement('video');
            video.className = 'absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity';
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;

            const source = document.createElement('source');
            source.src = config.path;
            source.type = config.path.endsWith('.webm') ? 'video/webm' : 'video/mp4';

            video.appendChild(source);
            bgContainer.appendChild(video);
        } else if (config.type === 'slider' && config.sliderPaths && config.sliderPaths.length > 0) {
            config.sliderPaths.forEach((path, idx) => {
                const slide = document.createElement('div');
                slide.className = `bg-slide absolute inset-0 bg-cover bg-center mix-blend-luminosity transform scale-105 transition-opacity duration-[1500ms] ${idx === 0 ? 'opacity-30 active' : 'opacity-0'}`;
                slide.style.backgroundImage = `url('${path}')`;
                slide.setAttribute('id', `slide-${idx + 1}`);
                bgContainer.appendChild(slide);
            });

            if (config.sliderPaths.length > 1) {
                let currentSlideIdx = 0;
                setInterval(() => {
                    const slides = bgContainer.querySelectorAll('.bg-slide');
                    if (slides.length < 2) return;

                    slides[currentSlideIdx].classList.remove('opacity-30', 'active');
                    slides[currentSlideIdx].classList.add('opacity-0');

                    currentSlideIdx = (currentSlideIdx + 1) % slides.length;

                    slides[currentSlideIdx].classList.remove('opacity-0');
                    slides[currentSlideIdx].classList.add('opacity-30', 'active');
                }, 8000);
            }
        } else {
            // Default static image
            const imgDiv = document.createElement('div');
            imgDiv.className = 'absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity transform scale-105';
            imgDiv.style.backgroundImage = `url('${config.path}')`;
            bgContainer.appendChild(imgDiv);
        }
    };

    initAppBackground();


    // ---------------------------------------------------------
    // [2] HORIZONTAL TOP NAVIGATION ROUTING MECHANICS
    // ---------------------------------------------------------
    const btnAnalytics = document.getElementById('tab-btn-analytics');
    const btnMatchCenter = document.getElementById('tab-btn-matchcenter');
    const vAnalytics = document.getElementById('view-analytics');
    const vMatchCenter = document.getElementById('view-matchcenter');

    const loadMatchCenterNews = async () => {
        const newsContainer = document.getElementById('matchcenter-news-container');
        if (!newsContainer) return;

        // Prevent fetching multiple times per session unless refreshed
        if (newsContainer.getAttribute('data-loaded') === 'true') return;

        try {
            // Loading placeholder state
            newsContainer.innerHTML = `
                <div class="flex-1 flex flex-col items-center justify-center py-16 text-slate-500 space-y-3">
                    <span class="w-5 h-5 rounded-full border-2 border-slate-800 border-t-emerald-400 animate-spin"></span>
                    <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400">Ingesting live scraping feeds...</span>
                </div>
            `;

            const res = await fetch('/api/scrape/matchday');
            if (!res.ok) throw new Error('Ingestion pipeline offline');

            const data = await res.json();

            if (data && data.articles && data.articles.length > 0) {
                newsContainer.innerHTML = data.articles.map(article => `
                    <article class="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700/60 transition-colors shrink-0">
                        <div class="flex justify-between items-center text-[9px] font-mono">
                            <span class="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">MATCH ${data.matchId} FEED // SCRAPE OK</span>
                            <span class="text-slate-500">${article.timestamp}</span>
                        </div>
                        <h3 class="text-xs font-bold text-slate-200">${article.title}</h3>
                        <p class="text-[11px] text-slate-400 leading-relaxed">${article.content}</p>
                        <div class="flex items-center space-x-4 pt-1 text-[9px] text-slate-500 font-mono">
                            <div class="flex items-center space-x-1"><i data-lucide="shield-alert" class="w-3 h-3 text-slate-600"></i><span>Ref: ${data.referee}</span></div>
                            <div class="flex items-center space-x-1"><i data-lucide="maximize" class="w-3 h-3 text-slate-600"></i><span>Pitch: ${data.pitchDimensions}</span></div>
                        </div>
                    </article>
                `).join('');

                newsContainer.setAttribute('data-loaded', 'true');

                // Initialize Lucide icons on dynamically loaded templates
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            } else {
                newsContainer.innerHTML = `<p class="text-xs text-slate-500 p-4">No active scraping streams found.</p>`;
            }
        } catch (err) {
            console.warn("Matchday scrape routing failed, loading fallback metrics:", err);
            // Local fallback if serverless environment is not active
            newsContainer.innerHTML = `
                <div class="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-mono space-y-2 shrink-0">
                    <p class="font-bold">>> [INGESTION WIRE OFFLINE / LOCAL CACHE ACTIVE] <<</p>
                    <p class="text-[10px] text-rose-300 leading-relaxed">Could not establish connection to /api/scrape/matchday. Using offline compiled parameters.</p>
                </div>
                <article class="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-2 opacity-50 shrink-0">
                    <div class="flex justify-between items-center text-[9px] font-mono">
                        <span class="bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">MATCH 1 CACHED WIRE</span>
                        <span class="text-slate-500">Offline cached</span>
                    </div>
                    <h3 class="text-xs font-bold text-slate-300">MetLife Stadium Surface Metrics Logged</h3>
                    <p class="text-[11px] text-slate-400 leading-relaxed">Factual preview indexing finalized for initial cluster mapping. Scrape loop confirmation 100%.</p>
                </article>
            `;
        }
    };

    const handleTabRouting = (targetView) => {
        if (targetView === 'analytics') {
            vAnalytics.classList.remove('hidden');
            vMatchCenter.classList.add('hidden');
            btnAnalytics.className = "tab-btn active flex-1 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg shadow transition cursor-pointer text-center";
            btnMatchCenter.className = "tab-btn inactive flex-1 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg transition cursor-pointer text-center";
        } else {
            vAnalytics.classList.add('hidden');
            vMatchCenter.classList.remove('hidden');
            btnAnalytics.className = "tab-btn inactive flex-1 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg transition cursor-pointer text-center";
            btnMatchCenter.className = "tab-btn active flex-1 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg shadow transition cursor-pointer text-center";
            loadMatchCenterNews();
        }
    };

    if (btnAnalytics && btnMatchCenter) {
        btnAnalytics.addEventListener('click', () => handleTabRouting('analytics'));
        btnMatchCenter.addEventListener('click', () => handleTabRouting('matchcenter'));
    }


    // ---------------------------------------------------------
    // [3] SPECKY REACTIVE EMOTION TIMELINE CORE
    // ---------------------------------------------------------
    const bubble = document.getElementById('specky-bubble');
    const bubbleText = document.getElementById('specky-bubble-text');
    const eyes = document.getElementById('specky-eyes');
    const mouth = document.getElementById('specky-mouth');
    const speckyBall = document.getElementById('specky-ball');
    const animContainer = document.getElementById('animation-container');
    const pLeft = document.getElementById('player-left');
    const pRight = document.getElementById('player-right');

    // Definition of the 15 sequenced shots
    const SHOTS = [
        { class: "shot-pass", leftText: "Left player passes! 🎯", rightText: "Pass controlled and returned! 🔄" },
        { class: "shot-volley", leftText: "Boom! Volley hit! 🚀", rightText: "Intercepted and volleyed back! ⚔️" },
        { class: "shot-halfvolley", leftText: "Half-volley strike! 💥", rightText: "Returned after bounce! 🔄" },
        { class: "shot-header", leftText: "Great header! ⚽", rightText: "Headed back clear! 🛡️" },
        { class: "shot-bicycle", leftText: "Amazing Bicycle Kick! 🚲", rightText: "Cleared with a header! 🛡️" },
        { class: "shot-chip", leftText: "Delicate chipped lob! 🎈", rightText: "Chipped back into play! 🔄" },
        { class: "shot-drive", leftText: "Powerful Low Drive! ⚡", rightText: "Blocked and driven back! 🧱" },
        { class: "shot-curver", leftText: "Bending curver! 💫", rightText: "Curved return! 🔄" },
        { class: "shot-knuckle", leftText: "Erratic Knuckleball! 🌀", rightText: "Knuckleball controlled! 🤝" },
        { class: "shot-scorpion", leftText: "Scorpion Kick! 🦂", rightText: "Heel flicked back! 🦂" },
        { class: "shot-trivela", leftText: "Trivela outside-spin! 🌀", rightText: "Trivela curve returned! 🔄" },
        { class: "shot-rabona", leftText: "Rabona trick shot! 🪄", rightText: "Rabona returned! 🪄" },
        { class: "shot-panenka", leftText: "Cool Panenka penalty! 🧊", rightText: "Caught and kicked back! 🧤" },
        { class: "shot-diving", leftText: "Diving Header! 🤿", rightText: "Dived and returned! 🛡️" },
        { class: "shot-sliding", leftText: "Sliding shot poke! 🌱", rightText: "Slid and returned! 🛷" }
    ];

    let currentShotIdx = 0;
    let isPaused = false;
    let elapsed = 0; // ms spent in current shot cycle
    let lastTickTime = Date.now();
    let currentIntervalState = -1; // -1: initial, 0: pre-kick, 1: left kick, 2: mid-flight, 3: right kick, 4: return flight

    const activeShot = () => SHOTS[currentShotIdx];

    // Facial expression state definitions
    const setExpressionBase = () => {
        if (!eyes || !mouth) return;
        eyes.style.transform = 'scaleY(1) translateY(0) skewY(0)';
        mouth.style.height = '4px';
        mouth.style.width = '12px';
        mouth.style.borderRadius = '9999px';
    };

    const setExpressionSurprised = () => {
        if (!eyes || !mouth) return;
        eyes.style.transform = 'scale(1.2) translateY(-1px) skewY(0)';
        mouth.style.height = '8px';
        mouth.style.width = '8px';
        mouth.style.borderRadius = '9999px';
    };

    const setExpressionConfused = () => {
        if (!eyes || !mouth) return;
        eyes.style.transform = 'skewY(10deg)';
        mouth.style.height = '4px';
        mouth.style.width = '10px';
        mouth.style.borderRadius = '9999px';
    };

    const setExpressionExcited = () => {
        if (!eyes || !mouth) return;
        eyes.style.transform = 'scaleY(0.5) translateY(1px) skewY(0)';
        mouth.style.height = '6px';
        mouth.style.width = '14px';
        mouth.style.borderRadius = '0 0 12px 12px';
    };

    const runShotSequencer = () => {
        if (!speckyBall || !animContainer) return;

        // Clear all previous shot classes
        SHOTS.forEach(s => animContainer.classList.remove(s.class));

        // Reset kicker highlights
        if (pLeft) pLeft.classList.remove('active-kicker');
        if (pRight) pRight.classList.remove('active-kicker');

        // Apply new active shot class
        const shot = activeShot();
        animContainer.classList.add(shot.class);
    };

    const processTimelineState = (currentElapsed) => {
        if (!speckyBall || !bubble || !bubbleText) return;

        const shot = activeShot();

        if (currentElapsed >= 0 && currentElapsed < 225) {
            // Phase 0: Left Kicker Active, preparing
            if (currentIntervalState !== 0) {
                currentIntervalState = 0;
                setExpressionBase();
                bubble.style.opacity = '0';
                bubble.style.transform = 'translateY(2px)';
                speckyBall.style.boxShadow = "none";
                if (pLeft) pLeft.classList.add('active-kicker');
                if (pRight) pRight.classList.remove('active-kicker');
            }
        } 
        else if (currentElapsed >= 225 && currentElapsed < 1125) {
            // Phase 1: Left Impact! (Blue Glow, Surprised)
            if (currentIntervalState !== 1) {
                currentIntervalState = 1;
                setExpressionSurprised();
                bubbleText.innerText = shot.leftText;
                bubble.style.opacity = '1';
                bubble.style.transform = 'translateY(0)';
                // Hardware accelerated drop-shadow glow matching team colors
                speckyBall.style.boxShadow = "0 0 35px 8px rgba(59, 130, 246, 0.75)"; 
                if (pLeft) pLeft.classList.add('active-kicker');
                if (pRight) pRight.classList.remove('active-kicker');
            }
        } 
        else if (currentElapsed >= 1125 && currentElapsed < 2475) {
            // Phase 2: Ball in flight to Right Kicker (Confused, no glow)
            if (currentIntervalState !== 2) {
                currentIntervalState = 2;
                setExpressionConfused();
                bubble.style.opacity = '0';
                bubble.style.transform = 'translateY(2px)';
                speckyBall.style.boxShadow = "none";
                if (pLeft) pLeft.classList.remove('active-kicker');
                if (pRight) pRight.classList.add('active-kicker');
            }
        } 
        else if (currentElapsed >= 2475 && currentElapsed < 3375) {
            // Phase 3: Right Impact! (Rose Glow, Surprised)
            if (currentIntervalState !== 3) {
                currentIntervalState = 3;
                setExpressionSurprised();
                bubbleText.innerText = shot.rightText;
                bubble.style.opacity = '1';
                bubble.style.transform = 'translateY(0)';
                // Hardware accelerated drop-shadow glow matching team colors
                speckyBall.style.boxShadow = "0 0 35px 8px rgba(244, 63, 94, 0.75)"; 
                if (pLeft) pLeft.classList.add('active-kicker');
                if (pRight) pRight.classList.add('active-kicker');
            }
        } 
        else if (currentElapsed >= 3375) {
            // Phase 4: Ball in flight back to Left Kicker (Base, no glow)
            if (currentIntervalState !== 4) {
                currentIntervalState = 4;
                setExpressionBase();
                bubble.style.opacity = '0';
                bubble.style.transform = 'translateY(2px)';
                speckyBall.style.boxShadow = "none";
                if (pLeft) pLeft.classList.remove('active-kicker');
                if (pRight) pRight.classList.remove('active-kicker');
            }
        }
    };

    // Micro-interval requestAnimationFrame Ticker loop
    const tick = () => {
        const now = Date.now();
        const delta = now - lastTickTime;
        lastTickTime = now;

        if (!isPaused) {
            elapsed += delta;
            if (elapsed >= 4500) {
                elapsed = 0;
                currentIntervalState = -1; // Reset state trigger
                currentShotIdx = (currentShotIdx + 1) % SHOTS.length;
                runShotSequencer();
            }
            processTimelineState(elapsed);
        }

        requestAnimationFrame(tick);
    };

    // Initialize sequence and start Ticker
    if (speckyBall && animContainer) {
        runShotSequencer();
        requestAnimationFrame(tick);
    }


    // ---------------------------------------------------------
    // [4] DATA OVERLAY INTERACTIVE MODAL & HOVER CONTROLS
    // ---------------------------------------------------------
    const dataModal = document.getElementById('data-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Hover listeners to pause trajectory and render alert welcoming stance
    if (speckyBall && animContainer && bubble && bubbleText) {
        speckyBall.addEventListener('mouseenter', () => {
            isPaused = true;
            animContainer.classList.add('animation-paused');
            setExpressionExcited();
            bubbleText.innerText = "Welcome to Sport-IQ! Click me to inspect tactical matchups! ⚽";
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
            speckyBall.style.boxShadow = "0 0 35px 8px rgba(16, 185, 129, 0.85)"; // Emerald welcoming glow
        });

        speckyBall.addEventListener('mouseleave', () => {
            if (dataModal && !dataModal.classList.contains('hidden')) return; // Remain paused if modal is active
            isPaused = false;
            lastTickTime = Date.now(); // Reset delta baseline to avoid time jump
            animContainer.classList.remove('animation-paused');
            
            // Instantly restore visual status based on current elapsed state
            currentIntervalState = -1; // force state recalculation
            processTimelineState(elapsed);
        });
    }

    // Click listeners to open tactical ledger
    if (speckyBall && dataModal && closeModalBtn && animContainer && bubble) {
        speckyBall.addEventListener('click', () => {
            dataModal.classList.remove('hidden');
            isPaused = true;
            animContainer.classList.add('animation-paused');
            setExpressionExcited();
            bubble.style.opacity = '0';
        });

        closeModalBtn.addEventListener('click', () => {
            dataModal.classList.add('hidden');
            isPaused = false;
            lastTickTime = Date.now(); // Reset delta baseline
            animContainer.classList.remove('animation-paused');
            currentIntervalState = -1; // force state recalculation
            processTimelineState(elapsed);
        });
    }
});