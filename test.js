const { chromium } = require('playwright');

// 📱 Device profiles
const devices = [
  // 💻 Windows Desktops
  {
    name: "desktop-1080p",
    viewport: { width: 1920, height: 1080 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  },
  {
    name: "desktop-1366",
    viewport: { width: 1366, height: 768 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  },
  {
    name: "desktop-1600",
    viewport: { width: 1600, height: 900 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  },

  // 🍎 MacBooks
  {
    name: "macbook-air",
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  },
  {
    name: "macbook-pro",
    viewport: { width: 1728, height: 1117 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  },

  // 📱 iPhone (Safari)
  {
    name: "iphone-safari",
    viewport: { width: 390, height: 844 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true
  },

  // 🤖 Android (Chrome)
  {
    name: "android-chrome",
    viewport: { width: 412, height: 915 },
    userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36",
    isMobile: true,
    hasTouch: true
  },

  // 📱 Samsung Internet (extra realism)
  {
    name: "android-samsung",
    viewport: { width: 360, height: 800 },
    userAgent: "Mozilla/5.0 (Linux; Android 12; SAMSUNG SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/19.0 Chrome/102.0 Mobile Safari/537.36",
    isMobile: true,
    hasTouch: true
  },

  // 📲 Tablet (iPad)
  {
    name: "tablet",
    viewport: { width: 768, height: 1024 },
    userAgent: "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true
  }
];

// 🎯 Realistic device distribution
function getRandomDevice() {
  const r = Math.random();

  // 💻 Desktop ~65%
  if (r < 0.65) {
    const desktops = devices.slice(0, 5);
    return desktops[Math.floor(Math.random() * desktops.length)];
  }

  // 📱 Mobile ~25%
  if (r < 0.9) {
    const mobiles = devices.slice(5, 8);

    const m = Math.random();
    if (m < 0.5) return mobiles[0];   // iPhone Safari
    if (m < 0.85) return mobiles[1];  // Android Chrome
    return mobiles[2];                // Samsung Internet
  }

  // 📲 Tablet ~10%
  return devices[8];
}

// 🧠 Human-like reading + scrolling
async function simulateReading(page, minTime = 20000, maxTime = 90000) {
  const totalTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);
  const start = Date.now();

  while (Date.now() - start < totalTime) {
    const direction = Math.random();

    if (direction < 0.7) {
      await page.mouse.wheel(0, Math.random() * 500 + 200);
    } else {
      await page.mouse.wheel(0, -(Math.random() * 300 + 100));
    }

    await page.mouse.move(
      Math.random() * 800,
      Math.random() * 600,
      { steps: 10 }
    );

    await page.waitForTimeout(Math.random() * 3000 + 1000);
  }
}

// 🤔 Pause before actions
async function humanPause() {
  await new Promise(r => setTimeout(r, Math.random() * 5000 + 2000));
}

// 🔀 Random navbar navigation
async function clickRandomNav(page) {
  const links = await page.locator('#WDxLfe a').all();
  const valid = [];

  for (const link of links) {
    const href = await link.getAttribute('href');
    const visible = await link.isVisible();

    if (visible && href && !page.url().includes(href)) {
      valid.push(link);
    }
  }

  if (valid.length === 0) return;

  const chosen = valid[Math.floor(Math.random() * valid.length)];
  const text = await chosen.innerText();

  console.log("Clicking:", text.trim());

  await humanPause();
  await chosen.click();
}

// 👤 Bounce user
async function bounceUser(page) {
  await page.goto('https://sites.google.com/view/vorma-ai/home', {
    waitUntil: 'load'
  });

  await simulateReading(page, 10000, 25000);
}

// 🔍 Browsing user
async function browsingUser(page) {
  await page.goto('https://sites.google.com/view/vorma-ai/home', {
    waitUntil: 'load'
  });

  await simulateReading(page, 25000, 60000);

  const steps = Math.floor(Math.random() * 3) + 2;

  for (let i = 0; i < steps; i++) {
    await clickRandomNav(page);
    await simulateReading(page, 20000, 60000);
  }
}

// 🎯 Intent user
async function intentUser(page) {
  await page.goto('https://sites.google.com/view/vorma-ai/home', {
    waitUntil: 'load'
  });

  await simulateReading(page, 30000, 70000);

  const steps = Math.floor(Math.random() * 4) + 3;

  for (let i = 0; i < steps; i++) {
    await clickRandomNav(page);
    await simulateReading(page, 30000, 80000);
  }
}

// 🚀 Main runner
async function runSimulation() {
  const browser = await chromium.launch({
    headless: false, // change to true on VPS
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 👇 5–7 users per run
  const sessions = Math.floor(Math.random() * 3) + 5;

  for (let i = 0; i < sessions; i++) {

    const device = getRandomDevice();
    console.log("Device:", device.name);

    const context = await browser.newContext({
      viewport: device.viewport,
      userAgent: device.userAgent,
      isMobile: device.isMobile || false,
      hasTouch: device.hasTouch || false
    });

    const page = await context.newPage();
    const rand = Math.random();

    try {
      if (rand < 0.4) {
        await bounceUser(page);
      } else if (rand < 0.75) {
        await browsingUser(page);
      } else {
        await intentUser(page);
      }
    } catch (err) {
      console.log("Error in session:", err.message);
    }

    await context.close();

    // ⏱️ Delay between users
    await new Promise(r => setTimeout(r, Math.random() * 10000 + 5000));
  }

  await browser.close();
}

runSimulation();