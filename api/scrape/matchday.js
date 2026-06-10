// Vercel Serverless Function: api/scrape/matchday.js

export default function handler(req, res) {
    // Set explicit cache-control header to protect compute hours from traffic spikes
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.setHeader('Content-Type', 'application/json');

    // Simulate HTML scrape loop of public domain, non-copyrighted pre-match facts
    const preMatchFeeds = {
        matchId: 1,
        pairing: "USA vs Brazil",
        venue: "MetLife Stadium (East Rutherford, NJ)",
        pitchDimensions: "105m x 68m (Kentucky Bluegrass)",
        referee: "Piero Maza (Chile)",
        scrapedAt: new Date().toISOString(),
        articles: [
            {
                title: "MetLife Stadium Surface Metrics Logged",
                content: "Kentucky Bluegrass turf is confirmed to be cut at standard 23mm height. Soil moisture levels are registered at 22% with high-velocity drainage systems active. Aggregated venue metrics confirm a high-speed ball roll coefficient, favoring fast transitional wing duels.",
                timestamp: "Scraped 2h ago"
            },
            {
                title: "Match Official Referee Allocation Finalized",
                content: "Chilean referee Piero Maza is officially allocated to USA vs Brazil. Maza maintains a historical average of 4.8 yellow cards and 24.2 fouls called per international fixture. Tactical simulation models predict higher foul caution thresholds for rest-defense structures.",
                timestamp: "Scraped 4h ago"
            },
            {
                title: "Pre-Match Training Ground Wire Aggregated",
                content: "Both teams have completed their initial MetLife pitch inspections. US camp reports no new injury status updates, maintaining their low-block transitional model. Brazil's technical staff confirmed standard rest-defense coverage formations.",
                timestamp: "Scraped 6h ago"
            }
        ]
    };

    return res.status(200).json(preMatchFeeds);
}
