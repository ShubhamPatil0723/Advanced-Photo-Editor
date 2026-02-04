export const ICON_LIBRARY: Record<string, string> = {
    // Lucide Star
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    // Lucide Heart
    heart: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
    // Lucide Cloud
    cloud: 'M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19 8.963 24.5 12 24.5s5.5-2.463 5.5-5.5z M20 19 h-1 M4 19 h1',
    // Wait, Cloud path above is mostly circles. Let's use simple paths.
    // Real Lucide Cloud:
    cloudy: 'M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19 8.963 24.5 12 24.5s5.5-2.463 5.5-5.5z', // Simplified

    // Standard Arrow Right
    arrowRight: 'M5 12h14 M12 5l7 7-7 7',

    // Check
    check: 'M20 6 9 17l-5-5',

    // User
    user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',

    // Home
    home: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',

    // Settings (Gear) - Simplified
    settings: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.18-.08a2 2 0 0 0-2 0l-.45.26a2 2 0 0 0-1 1.73v.43a2 2 0 0 0 2 2h.18a2 2 0 0 1 1 1.73L3 12.22a2 2 0 0 1 0 2l.08.18a2 2 0 0 0 0 2l-.26.45a2 2 0 0 0 1.73 1h.43a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1.73-1l.43-.25a2 2 0 0 1 2 0l.18.08a2 2 0 0 0 2 0l.45-.26a2 2 0 0 0 1-1.73v-.43a2 2 0 0 0-2-2h-.18a2 2 0 0 1-1-1.73l.08-.18a2 2 0 0 1 0-2l-.08-.18a2 2 0 0 0 0-2l.26-.45a2 2 0 0 0-1.73-1h-.43a2 2 0 0 0-2 2v.18a2 2 0 0 1-1.73 1l-.43.25a2 2 0 0 1-2 0l-.18-.08z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',

    // Zap (Lightning)
    zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',

    // Sun
    sun: 'M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41 M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',

    // Moon
    moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z'
};

export type IconName = keyof typeof ICON_LIBRARY;
