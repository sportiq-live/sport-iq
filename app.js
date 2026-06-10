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
    // [1] ADMINISTRATIVE INTERFACE BACKGROUND DAILY SLIDER
    // ---------------------------------------------------------
    let slideToggle = true;
    const s1 = document.getElementById('slide-1');
    const s2 = document.getElementById('slide-2');

    setInterval(() => {
        if (s1 && s2) {
            if (slideToggle) {
                s1.classList.remove('opacity-30', 'active');
                s1.classList.add('opacity-0');
                s2.classList.remove('opacity-0');
                s2.classList.add('opacity-30', 'active');
            } else {
                s2.classList.remove('opacity-30', 'active');
                s2.classList.add('opacity-0');
                s1.classList.remove('opacity-0');
                s1.classList.add('opacity-30', 'active');
            }
            slideToggle = !slideToggle;
        }
    }, 8000); // Dynamic crossfade loop executes every 8 seconds


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
    let timelineTimeouts = [];

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

    const clearTimeouts = () => {
        timelineTimeouts.forEach(t => clearTimeout(t));
        timelineTimeouts = [];
    };

    const runShotSequencer = () => {
        if (!speckyBall || !animContainer || !bubble || !bubbleText) return;

        // Clear previous state
        clearTimeouts();
        SHOTS.forEach(s => animContainer.classList.remove(s.class));
        if (pLeft) pLeft.classList.remove('active-kicker');
        if (pRight) pRight.classList.remove('active-kicker');

        const activeShot = SHOTS[currentShotIdx];
        animContainer.classList.add(activeShot.class);

        // 1. Initial State: Left kicker active
        setExpressionBase();
        if (pLeft) pLeft.classList.add('active-kicker');

        // 2. Impact Point 1: Left player hits the ball (0.2s mark)
        timelineTimeouts.push(setTimeout(() => {
            setExpressionSurprised();
            bubbleText.innerText = activeShot.leftText;
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
            speckyBall.style.boxShadow = "0 25px 50px -12px rgba(59,130,246, 0.7)"; // Glow Blue
        }, 200));

        // 3. Flight Phase: Ball mid-air (1.1s mark)
        timelineTimeouts.push(setTimeout(() => {
            setExpressionConfused();
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(2px)';
            if (pLeft) pLeft.classList.remove('active-kicker');
            if (pRight) pRight.classList.add('active-kicker');
        }, 1100));

        // 4. Impact Point 2: Right player hits the ball back (2.2s mark)
        timelineTimeouts.push(setTimeout(() => {
            setExpressionSurprised();
            bubbleText.innerText = activeShot.rightText;
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
            speckyBall.style.boxShadow = "0 25px 50px -12px rgba(244,63,94, 0.7)"; // Glow Rose
        }, 2200));

        // 5. Flight Phase Back: Ball returning (3.2s mark)
        timelineTimeouts.push(setTimeout(() => {
            setExpressionBase();
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(2px)';
            speckyBall.style.boxShadow = "none";
            if (pRight) pRight.classList.remove('active-kicker');
        }, 3200));

        // Advance index for next cycle
        currentShotIdx = (currentShotIdx + 1) % SHOTS.length;
    };

    // Start running the sequence
    if (speckyBall && animContainer) {
        runShotSequencer();
        setInterval(runShotSequencer, 4500); // Sequence loops every 4.5 seconds
    }


    // ---------------------------------------------------------
    // [4] DATA OVERLAY INTERACTIVE MODAL OVERLAYS
    // ---------------------------------------------------------
    const dataModal = document.getElementById('data-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (speckyBall && dataModal && closeModalBtn) {
        speckyBall.addEventListener('click', () => {
            dataModal.classList.remove('hidden');
            setExpressionExcited();
        });

        closeModalBtn.addEventListener('click', () => {
            dataModal.classList.add('hidden');
            setExpressionBase();
        });
    }
});