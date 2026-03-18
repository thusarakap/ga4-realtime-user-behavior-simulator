// =====================================================================
// QUICK SETTINGS (edit these first)
// =====================================================================
const SITE_URL = 'https://playwright.dev/'; // Main URL to visit
const HEADLESS = false; // true = no browser UI, false = visible browser
const BROWSER_ARGS = ['--no-sandbox', '--disable-setuid-sandbox'];

// Number of users in one run = random integer between min and max.
const USERS_PER_RUN = { min: 5, max: 7 };

// Delay before starting next user.
const DELAY_BETWEEN_USERS_MS = { min: 5000, max: 15000 };

// Small random "human pause" before actions.
const ACTION_PAUSE_MS = { min: 600, max: 2500 };

// Max time allowed for page/navigation actions.
const NAVIGATION_TIMEOUT_MS = 45000;

// Use 1 to enable, 0 to disable each device.
const DEVICE_ENABLE_FLAGS = {
  'desktop-1080p': 1,
  'desktop-1366': 1,
  'desktop-1600': 1,
  'macbook-air': 1,
  'macbook-pro': 1,
  'iphone-safari': 1,
  'android-chrome': 1,
  'android-samsung': 1,
  'tablet-ipad': 1
};

// =====================================================================
// ADVANCED BEHAVIOR SETTINGS
// =====================================================================
const CONFIG = {
  siteUrl: SITE_URL,
  headless: HEADLESS,
  browserArgs: BROWSER_ARGS,
  usersPerRun: USERS_PER_RUN,
  delayBetweenUsersMs: DELAY_BETWEEN_USERS_MS,
  actionPauseMs: ACTION_PAUSE_MS,
  navigationTimeoutMs: NAVIGATION_TIMEOUT_MS,
  devices: [],

  // Each object is one behavior profile:
  // - name: label used in logs
  // - weight: chance of selecting this profile (higher = more often)
  // - initialReadMs: random reading time immediately after landing
  // - navSteps: random number of internal link clicks to perform
  // - stepReadMs: random reading time after EACH nav click
  // - loopPauseMs: random wait between scroll/mouse actions while "reading"
  behaviorProfiles: [
    {
      name: 'bounce',
      weight: 40,
      initialReadMs: { min: 10000, max: 25000 },
      navSteps: { min: 0, max: 0 }, // bounce users do NOT navigate
      stepReadMs: { min: 0, max: 0 }, // unused when navSteps is 0..0
      loopPauseMs: { min: 1200, max: 3200 }
    },
    {
      name: 'browse',
      weight: 35,
      initialReadMs: { min: 25000, max: 60000 },
      navSteps: { min: 2, max: 4 }, // does a few internal clicks
      stepReadMs: { min: 15000, max: 50000 },
      loopPauseMs: { min: 1200, max: 4000 }
    },
    {
      name: 'intent',
      weight: 25,
      initialReadMs: { min: 30000, max: 70000 },
      navSteps: { min: 3, max: 6 }, // deeper browsing journey
      stepReadMs: { min: 25000, max: 70000 },
      loopPauseMs: { min: 1000, max: 3500 }
    }
  ],

  scroll: {
    downPixels: { min: 180, max: 700 },
    upPixels: { min: 120, max: 420 },
    downChance: 0.7,
    smooth: {
      enabled: true,
      stepPixels: { min: 30, max: 90 },
      stepPauseMs: { min: 25, max: 80 }
    }
  },

  mouseMove: {
    x: { min: 30, max: 1400 },
    y: { min: 30, max: 900 },
    steps: { min: 5, max: 18 }
  },

  nav: {
    selector: 'a[href]',
    maxCandidatesToScan: 120,
    postClickPauseMs: { min: 1000, max: 3500 }
  }
};


// =====================================================================
// DEVICE DEFINITIONS (leave as-is; choose with ENABLED_DEVICE_NAMES)
// =====================================================================
const ALL_DEVICES = [
  {
    name: 'desktop-1080p',
    weight: 22,
    viewport: { width: 1920, height: 1080 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36'
  },
  {
    name: 'desktop-1366',
    weight: 20,
    viewport: { width: 1366, height: 768 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36'
  },
  {
    name: 'desktop-1600',
    weight: 14,
    viewport: { width: 1600, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36'
  },
  {
    name: 'macbook-air',
    weight: 10,
    viewport: { width: 1440, height: 900 },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 Chrome/122 Safari/537.36'
  },
  {
    name: 'macbook-pro',
    weight: 8,
    viewport: { width: 1728, height: 1117 },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/537.36 Chrome/122 Safari/537.36'
  },
  {
    name: 'iphone-safari',
    weight: 12,
    viewport: { width: 390, height: 844 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true
  },
  {
    name: 'android-chrome',
    weight: 9,
    viewport: { width: 412, height: 915 },
    userAgent:
      'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Mobile Safari/537.36',
    isMobile: true,
    hasTouch: true
  },
  {
    name: 'android-samsung',
    weight: 3,
    viewport: { width: 360, height: 800 },
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/122.0 Mobile Safari/537.36',
    isMobile: true,
    hasTouch: true
  },
  {
    name: 'tablet-ipad',
    weight: 5,
    viewport: { width: 820, height: 1180 },
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true
  }
];

const ENABLED_DEVICE_NAMES = Object.entries(DEVICE_ENABLE_FLAGS)
  .filter(([, enabled]) => Number(enabled) === 1)
  .map(([name]) => name);

const ENABLED_DEVICES = ALL_DEVICES.filter((device) => ENABLED_DEVICE_NAMES.includes(device.name));
CONFIG.devices = ENABLED_DEVICES;

// =====================================================================

module.exports = {
  CONFIG,
  ALL_DEVICES,
  DEVICE_ENABLE_FLAGS,
  ENABLED_DEVICE_NAMES,
  SITE_URL,
  HEADLESS,
  BROWSER_ARGS,
  USERS_PER_RUN,
  DELAY_BETWEEN_USERS_MS,
  ACTION_PAUSE_MS,
  NAVIGATION_TIMEOUT_MS
};
