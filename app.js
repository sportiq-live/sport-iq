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

    const phrases = [
        "Click me to see match insights!",
        "Whoa! USA vs Brazil data streams are heavy!",
        "Ready to compile historical models?",
        "Analyzing high-press metrics live!"
    ];

    // Facial expression state definitions
    const setExpressionBase = () => {
        eyes.style.transform = 'scaleY(1) translateY(0)';
        mouth.style.height = '4px';
        mouth.style.width = '12px';
        mouth.style.borderRadius = '9999px';
    };

    const setExpressionSurprised = () => {
        eyes.style.transform = 'scale(1.2) translateY(-1px)';
        mouth.style.height = '8px';
        mouth.style.width = '8px';
        mouth.style.borderRadius = '9999px';
    };

    const setExpressionConfused = () => {
        eyes.style.transform = 'skewY(10deg)';
        mouth.style.height = '4px';
        mouth.style.borderRadius = '9999px';
    };

    const setExpressionExcited = () => {
        eyes.style.transform = 'scaleY(0.5)';
        mouth.style.height = '6px';
        mouth.style.width = '14px';
        mouth.style.borderRadius = '0 0 12px 12px';
    };

    // Synchronized execution loop (matches the 4.0s loop cycle of the CSS layout)
    const runSpeckyTimeline = () => {
        if (!speckyBall || !eyes || !mouth || !bubble) return;

        setExpressionBase();

        // IMPACT POINT 1: Left player strike response (0.2s mark)
        setTimeout(() => {
            setExpressionSurprised();
            if (bubbleText) bubbleText.innerText = "Oof! USA metrics kicked!";
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
            speckyBall.style.boxShadow = "0 25px 50px -12px rgba(59,130,246, 0.6)"; // Pulse Blue
        }, 200);

        // Mid-air flight settlement (1.0s mark)
        setTimeout(() => {
            setExpressionConfused();
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(2px)';
        }, 1000);

        // IMPACT POINT 2: Right player strike response (2.2s mark)
        setTimeout(() => {
            setExpressionSurprised();
            if (bubbleText) bubbleText.innerText = "Boom! Brazil data received!";
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
            speckyBall.style.boxShadow = "0 25px 50px -12px rgba(244,63,94, 0.6)"; // Pulse Rose
        }, 2200);

        // Return mid-air flight settlement (3.0s mark)
        setTimeout(() => {
            setExpressionBase();
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(2px)';
            speckyBall.style.boxShadow = "none";
        }, 3000);
    };

    // Initialize tracking logic and set interval run speed
    if (speckyBall) {
        runSpeckyTimeline();
        setInterval(runSpeckyTimeline, 4000);
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