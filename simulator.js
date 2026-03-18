const { chromium } = require('playwright');

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

// Use ONLY these device names (you can comment names in/out).
const ENABLED_DEVICE_NAMES = [
  'desktop-1080p',
  'desktop-1366',
  'desktop-1600',
  'macbook-air',
  'macbook-pro',
  'iphone-safari',
  'android-chrome'
  // 'android-samsung',
  // 'tablet-ipad'
];

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

const ENABLED_DEVICES = ALL_DEVICES.filter((device) =>
  ENABLED_DEVICE_NAMES.includes(device.name)
);

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
  devices: ENABLED_DEVICES,

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
    downChance: 0.7
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

function randomIntInRange(range) {
  const min = Math.floor(Math.min(range.min, range.max));
  const max = Math.floor(Math.max(range.min, range.max));
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWeightedPick(items, weightKey = 'weight') {
  const totalWeight = items.reduce((sum, item) => sum + Math.max(0, item[weightKey] || 0), 0);
  if (totalWeight <= 0) {
    return items[Math.floor(Math.random() * items.length)];
  }

  let cursor = Math.random() * totalWeight;
  for (const item of items) {
    cursor -= Math.max(0, item[weightKey] || 0);
    if (cursor <= 0) return item;
  }
  return items[items.length - 1];
}

async function waitRandom(page, range) {
  await page.waitForTimeout(randomIntInRange(range));
}

async function humanPause(page) {
  await waitRandom(page, CONFIG.actionPauseMs);
}

function getSiteHost(url) {
  return new URL(url).host;
}

function getRandomDevice() {
  if (!CONFIG.devices.length) {
    throw new Error('No enabled devices. Add names to ENABLED_DEVICE_NAMES.');
  }
  return randomWeightedPick(CONFIG.devices);
}

async function scrollAndMove(page) {
  const directionRoll = Math.random();
  const deltaY =
    directionRoll < CONFIG.scroll.downChance
      ? randomIntInRange(CONFIG.scroll.downPixels)
      : -randomIntInRange(CONFIG.scroll.upPixels);

  await page.mouse.wheel(0, deltaY);
  await page.mouse.move(
    randomIntInRange(CONFIG.mouseMove.x),
    randomIntInRange(CONFIG.mouseMove.y),
    { steps: randomIntInRange(CONFIG.mouseMove.steps) }
  );
}

async function simulateReading(page, totalReadMsRange, loopPauseMsRange) {
  const totalReadTime = randomIntInRange(totalReadMsRange);
  const startedAt = Date.now();

  while (Date.now() - startedAt < totalReadTime) {
    await scrollAndMove(page);
    await waitRandom(page, loopPauseMsRange);
  }
}

async function clickRandomNav(page, siteHost) {
  const links = page.locator(CONFIG.nav.selector);
  const count = await links.count();
  if (count === 0) return false;

  const candidates = [];
  const scanCount = Math.min(count, CONFIG.nav.maxCandidatesToScan);

  for (let i = 0; i < scanCount; i++) {
    const link = links.nth(i);
    const visible = await link.isVisible();
    if (!visible) continue;

    const href = await link.getAttribute('href');
    if (!href) continue;

    let target;
    try {
      target = new URL(href, page.url());
    } catch {
      continue;
    }

    // Keep navigation inside the target site.
    if (target.host !== siteHost) continue;
    if (target.href === page.url()) continue;

    candidates.push({ index: i, target: target.href });
  }

  if (!candidates.length) return false;

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  await humanPause(page);

  try {
    await links.nth(chosen.index).click({ timeout: CONFIG.navigationTimeoutMs });
    await waitRandom(page, CONFIG.nav.postClickPauseMs);
    return true;
  } catch {
    return false;
  }
}

async function runSingleUser(browser, userIndex, totalUsers, siteHost) {
  const device = getRandomDevice();
  const behavior = randomWeightedPick(CONFIG.behaviorProfiles);

  console.log(
    `[Session ${userIndex + 1}/${totalUsers}] device=${device.name}, behavior=${behavior.name}`
  );

  const context = await browser.newContext({
    viewport: device.viewport,
    userAgent: device.userAgent,
    isMobile: !!device.isMobile,
    hasTouch: !!device.hasTouch
  });

  try {
    const page = await context.newPage();
    await page.goto(CONFIG.siteUrl, {
      waitUntil: 'load',
      timeout: CONFIG.navigationTimeoutMs
    });

    await simulateReading(page, behavior.initialReadMs, behavior.loopPauseMs);

    const steps = randomIntInRange(behavior.navSteps);
    for (let step = 0; step < steps; step++) {
      const moved = await clickRandomNav(page, siteHost);
      if (!moved) break;
      await simulateReading(page, behavior.stepReadMs, behavior.loopPauseMs);
    }
  } catch (error) {
    console.log(`[Session ${userIndex + 1}] error: ${error.message}`);
  } finally {
    await context.close();
  }
}

async function runSimulation() {
  const usersThisRun = randomIntInRange(CONFIG.usersPerRun);
  const siteHost = getSiteHost(CONFIG.siteUrl);

  console.log(`Starting simulation on ${CONFIG.siteUrl}`);
  console.log(`Users this run: ${usersThisRun}`);

  const browser = await chromium.launch({
    headless: CONFIG.headless,
    args: CONFIG.browserArgs
  });

  try {
    for (let i = 0; i < usersThisRun; i++) {
      await runSingleUser(browser, i, usersThisRun, siteHost);

      if (i < usersThisRun - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, randomIntInRange(CONFIG.delayBetweenUsersMs))
        );
      }
    }
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  runSimulation().catch((error) => {
    console.error('Simulation failed:', error);
    process.exit(1);
  });
}

module.exports = {
  CONFIG,
  ALL_DEVICES,
  ENABLED_DEVICE_NAMES,
  runSimulation,
  randomIntInRange,
  randomWeightedPick
};
