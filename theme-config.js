// ==========================================================================
// SPORT-IQ USER LANDING THEME CONFIGURATION
// ==========================================================================
// Adjust this file to configure the landing page background. Changes here
// propagate instantly to the entire application upon reloading.

window.SPORT_IQ_THEME = {
    // -------------------------------------------------------------
    // [1] BACKGROUND TYPE
    // -------------------------------------------------------------
    // Set to one of: "image" | "video" | "slider"
    type: "slider",

    // -------------------------------------------------------------
    // [2] SINGLE STATIC ASSET PATH
    // -------------------------------------------------------------
    // Used when type is "image" or "video" (paste path or public URL here)
    // Example Video: "https://assets.mixkit.co/videos/preview/mixkit-soccer-ball-passing-through-field-lines-42999-large.mp4"
    path: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80",

    // -------------------------------------------------------------
    // [3] MULTI-IMAGE SLIDER PATHS
    // -------------------------------------------------------------
    // Used when type is "slider" (rotates between these paths dynamically)
    sliderPaths: [
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1431324155629-1a6edd1d1315?auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1920&q=80"
    ]
};
