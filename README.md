   _________   __ __     ____             ____  _                   __  __                  ____       __                _               _____ _                 __      __            
  / ____/   | / // /    / __ \___  ____ _/ / /_(_)___ ___  ___     / / / /_______  _____   / __ )___  / /_  ____ __   __(_)___  _____   / ___/(_)___ ___  __  __/ /___ _/ /_____  _____
 / / __/ /| |/ // /_   / /_/ / _ \/ __ `/ / __/ / __ `__ \/ _ \   / / / / ___/ _ \/ ___/  / __  / _ \/ __ \/ __ `/ | / / / __ \/ ___/   \__ \/ / __ `__ \/ / / / / __ `/ __/ __ \/ ___/
/ /_/ / ___ /__  __/  / _, _/  __/ /_/ / / /_/ / / / / / /  __/  / /_/ (__  )  __/ /     / /_/ /  __/ / / / /_/ /| |/ / / /_/ / /      ___/ / / / / / / / /_/ / / /_/ / /_/ /_/ / /    
\____/_/  |_| /_/    /_/ |_|\___/\__,_/_/\__/_/_/ /_/ /_/\___/   \____/____/\___/_/     /_____/\___/_/ /_/\__,_/ |___/_/\____/_/      /____/_/_/ /_/ /_/\__,_/_/\__,_/\__/\____/_/     

                                                                                                                                              
Simulates realistic user behavior (scrolling, internal navigation, device variation, and dwell time) so you can observe activity in Google Analytics 4 Realtime reports.

## 1. Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm (comes with Node.js)

Check versions:

```bash
node -v
npm -v
```

## 2. Install dependencies

Install the project package(s) from `package.json`:

```bash
npm install
```

This installs:

- `playwright` (the automation library used by `simulator.js`)

## 3. Install Playwright browsers

After `npm install`, install the browser binaries Playwright needs:

```bash
npm run setup
```

Equivalent direct command:

```bash
npx playwright install
```

Optional (mainly Linux CI/servers): install system dependencies too:

```bash
npm run setup:deps
```

Equivalent direct command:

```bash
npx playwright install --with-deps
```

## 4. Run the simulator

From the project root:

```bash
npm start
```

Equivalent direct command:

```bash
node simulator.js
```

If everything is configured correctly, you will see session logs in the terminal (selected device and behavior profile for each simulated user).

## 5. Configure settings (`config.js`)

Edit `config.js` before running.

### Core settings

- `SITE_URL`
The target site URL users will visit.

- `HEADLESS`
`false` = visible browser window, `true` = background/headless run.

- `BROWSER_ARGS`
Extra Chromium launch flags.

### Traffic volume and timing

- `USERS_PER_RUN`
Random number of users per run (`min` to `max`).

- `DELAY_BETWEEN_USERS_MS`
Random delay between one user session and the next.

- `ACTION_PAUSE_MS`
Small random pause to make behavior less robotic.

- `NAVIGATION_TIMEOUT_MS`
Max wait for navigation/click operations.

### Enable/disable devices (1 or 0)

Use `DEVICE_ENABLE_FLAGS` to control which device profiles are active:

```js
const DEVICE_ENABLE_FLAGS = {
  'desktop-1080p': 1,
  'desktop-1366': 1,
  'desktop-1600': 1,
  'macbook-air': 1,
  'macbook-pro': 1,
  'iphone-safari': 1,
  'android-chrome': 1,
  'android-samsung': 0, // disabled
  'tablet-ipad': 1
};
```

- `1` = enabled
- `0` = disabled

At least one device must be enabled, or the simulator will fail at runtime.

### Behavior profiles

Under `behaviorProfiles`:

- `weight`: chance of picking this profile
- `initialReadMs`: read time right after landing
- `navSteps`: number of internal clicks
- `stepReadMs`: read time after each click
- `loopPauseMs`: pause between read-loop actions

### Interaction tuning

- `scroll`: scroll distance and direction chance
- `mouseMove`: movement range and smoothness (`steps`)
- `nav`: link selector and navigation scanning limits

## Quick start summary

```bash
npm install
npm run setup
npm start
```

## Made out of necessity by:

___________.__                                       __                  ___    
\__    ___/|  |__  __ __  ___________ ____________  |  | _______     /\  \  \   
  |    |   |  |  \|  |  \/  ___/\__  \\_  __ \__  \ |  |/ /\__  \    \/   \  \  
  |    |   |   Y  \  |  /\___ \  / __ \|  | \// __ \|    <  / __ \_  /\    )  ) 
  |____|   |___|  /____//____  >(____  /__|  (____  /__|_ \(____  /  \/   /  /  
                \/           \/      \/           \/     \/     \/       /__/   


