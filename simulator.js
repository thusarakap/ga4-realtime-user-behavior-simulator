const { chromium } = require('playwright');
const { CONFIG } = require('./config');

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

  const smoothConfig = CONFIG.scroll.smooth;
  if (smoothConfig && smoothConfig.enabled) {
    const stepSize = Math.max(1, randomIntInRange(smoothConfig.stepPixels));
    const direction = Math.sign(deltaY) || 1;
    const totalDistance = Math.abs(deltaY);

    let moved = 0;
    while (moved < totalDistance) {
      const chunk = Math.min(stepSize, totalDistance - moved);
      await page.mouse.wheel(0, chunk * direction);
      moved += chunk;
      await waitRandom(page, smoothConfig.stepPauseMs);
    }
  } else {
    await page.mouse.wheel(0, deltaY);
  }

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
  runSimulation,
  randomIntInRange,
  randomWeightedPick
};

// Made out of necessity by:

//  ___________.__                                       __                  ___    
//  \__    ___/|  |__  __ __  ___________ ____________  |  | _______     /\  \  \   
//    |    |   |  |  \|  |  \/  ___/\__  \\_  __ \__  \ |  |/ /\__  \    \/   \  \  
//    |    |   |   Y  \  |  /\___ \  / __ \|  | \// __ \|    <  / __ \_  /\    )  ) 
//    |____|   |___|  /____//____  >(____  /__|  (____  /__|_ \(____  /  \/   /  /  
//                  \/           \/      \/           \/     \/     \/       /__/   