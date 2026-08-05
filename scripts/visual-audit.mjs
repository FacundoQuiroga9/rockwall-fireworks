import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.AUDIT_URL ?? 'http://127.0.0.1:5173';
const DEBUG_URL = process.env.CHROME_DEBUG_URL ?? 'http://127.0.0.1:9222';
const LABEL = process.argv[2] ?? 'audit';
const OUTPUT_DIRECTORY = path.resolve('artifacts', 'visual-audit');

const viewports = [
  { width: 320, height: 700 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

class CdpClient {
  constructor(webSocketUrl) {
    this.webSocket = new WebSocket(webSocketUrl);
    this.nextId = 1;
    this.pendingCommands = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.webSocket.addEventListener('open', resolve, { once: true });
      this.webSocket.addEventListener('error', reject, { once: true });
    });

    this.webSocket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);

      if (message.id) {
        const pending = this.pendingCommands.get(message.id);
        if (!pending) return;

        this.pendingCommands.delete(message.id);
        if (message.error) {
          pending.reject(new Error(message.error.message));
        } else {
          pending.resolve(message.result);
        }
        return;
      }

      const listeners = this.eventListeners.get(message.method) ?? [];
      listeners.forEach((listener) => listener(message.params));
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;

    return new Promise((resolve, reject) => {
      this.pendingCommands.set(id, { resolve, reject });
      this.webSocket.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, listener) {
    const listeners = this.eventListeners.get(method) ?? [];
    listeners.push(listener);
    this.eventListeners.set(method, listeners);
  }

  waitFor(method, timeout = 15_000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeout);

      this.on(method, (params) => {
        clearTimeout(timer);
        resolve(params);
      });
    });
  }

  close() {
    this.webSocket.close();
  }
}

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function createTarget(url) {
  const response = await fetch(
    `${DEBUG_URL}/json/new?${encodeURIComponent(url)}`,
    { method: 'PUT' },
  );

  if (!response.ok) {
    throw new Error(`Unable to create Chrome target: ${response.status}`);
  }

  return response.json();
}

async function closeTarget(targetId) {
  await fetch(`${DEBUG_URL}/json/close/${targetId}`);
}

const metricsExpression = String.raw`
  (() => {
    const getSelector = (element) => {
      const id = element.id ? '#' + element.id : '';
      const classes = [...element.classList]
        .slice(0, 3)
        .map((className) => '.' + className)
        .join('');
      return element.tagName.toLowerCase() + id + classes;
    };

    const getRect = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        right: Math.round(rect.right),
        bottom: Math.round(rect.bottom),
      };
    };

    const visibleElements = [...document.querySelectorAll('body *')].filter(
      (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          rect.width > 0 &&
          rect.height > 0
        );
      },
    );

    const overflowElements = visibleElements
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left < -1 || rect.right > window.innerWidth + 1;
      })
      .slice(0, 30)
      .map((element) => ({
        selector: getSelector(element),
        rect: getRect(element),
      }));
    const unintendedOverflowElements = visibleElements
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const outsideViewport =
          rect.left < -1 || rect.right > window.innerWidth + 1;
        const insideIntentionalScroller = element.closest(
          '.logos, .product-carousel',
        );
        return outsideViewport && !insideIntentionalScroller;
      })
      .slice(0, 30)
      .map((element) => ({
        selector: getSelector(element),
        rect: getRect(element),
      }));

    const interactiveElements = [
      ...document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]',
      ),
    ]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          rect.width > 0 &&
          rect.height > 0
        );
      })
      .map((element) => {
        const rect = getRect(element);
        const imageAlt = element.querySelector('img')?.alt ?? '';
        const accessibleName =
          element.getAttribute('aria-label') ||
          element.getAttribute('title') ||
          imageAlt ||
          element.textContent.trim();

        return {
          selector: getSelector(element),
          name: accessibleName.trim().slice(0, 120),
          rect,
          smallTouchTarget: rect.width < 44 || rect.height < 44,
        };
      });

    const duplicateIds = Object.entries(
      [...document.querySelectorAll('[id]')].reduce((ids, element) => {
        ids[element.id] = (ids[element.id] ?? 0) + 1;
        return ids;
      }, {}),
    ).filter(([, count]) => count > 1);

    const resourceEntries = performance
      .getEntriesByType('resource')
      .map((entry) => ({
        name: entry.name,
        initiatorType: entry.initiatorType,
        transferSize: entry.transferSize,
        decodedBodySize: entry.decodedBodySize,
        duration: Math.round(entry.duration),
      }))
      .sort((a, b) => b.transferSize - a.transferSize);
    const originalScrollX = window.scrollX;
    const originalScrollY = window.scrollY;
    const scrollingElement = document.scrollingElement;
    window.scrollTo(scrollingElement.scrollWidth, originalScrollY);
    const horizontalScrollRange = window.scrollX;
    window.scrollTo(originalScrollX, originalScrollY);

    return {
      url: location.href,
      title: document.title,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      },
      document: {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        bodyScrollWidth: document.body.scrollWidth,
        layoutOverflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
        horizontalOverflow: horizontalScrollRange > 1,
        horizontalScrollRange,
      },
      overflowElements,
      unintendedOverflowElements,
      headings: [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(
        (heading) => ({
          level: Number(heading.tagName.slice(1)),
          text: heading.textContent.trim().slice(0, 160),
        }),
      ),
      landmarks: {
        header: document.querySelectorAll('header').length,
        nav: document.querySelectorAll('nav').length,
        main: document.querySelectorAll('main').length,
        footer: document.querySelectorAll('footer').length,
      },
      metadata: {
        description:
          document.querySelector('meta[name="description"]')?.content ?? '',
        canonical:
          document.querySelector('link[rel="canonical"]')?.href ?? '',
        ogTitle:
          document.querySelector('meta[property="og:title"]')?.content ?? '',
        ogDescription:
          document.querySelector('meta[property="og:description"]')?.content ??
          '',
        ogUrl:
          document.querySelector('meta[property="og:url"]')?.content ?? '',
        ogImage:
          document.querySelector('meta[property="og:image"]')?.content ?? '',
        twitterTitle:
          document.querySelector('meta[name="twitter:title"]')?.content ?? '',
        twitterDescription:
          document.querySelector('meta[name="twitter:description"]')?.content ??
          '',
        twitterImage:
          document.querySelector('meta[name="twitter:image"]')?.content ?? '',
      },
      duplicateIds,
      images: [...document.images].map((image) => ({
        src: image.currentSrc || image.src,
        alt: image.alt,
        hasAltAttribute: image.hasAttribute('alt'),
        loading: image.loading,
        decoding: image.decoding,
        fetchPriority: image.fetchPriority,
        widthAttribute: image.getAttribute('width'),
        heightAttribute: image.getAttribute('height'),
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        rendered: getRect(image),
        complete: image.complete,
      })),
      blankTargetLinks: [...document.querySelectorAll('a[target="_blank"]')].map(
        (link) => ({
          href: link.href,
          rel: link.rel,
          text: link.textContent.trim().slice(0, 120),
        }),
      ),
      interactiveElements,
      unnamedInteractiveElements: interactiveElements.filter(
        (element) => !element.name,
      ),
      smallTouchTargets: interactiveElements.filter(
        (element) => element.smallTouchTarget,
      ),
      performance: {
        paints: performance.getEntriesByType('paint').map((entry) => ({
          name: entry.name,
          startTime: Math.round(entry.startTime),
        })),
        navigation: performance.getEntriesByType('navigation').map((entry) => ({
          domContentLoaded: Math.round(entry.domContentLoadedEventEnd),
          loadEvent: Math.round(entry.loadEventEnd),
          transferSize: entry.transferSize,
          decodedBodySize: entry.decodedBodySize,
        }))[0],
        largestContentfulPaint:
          window.__visualAudit?.largestContentfulPaint ?? [],
        cumulativeLayoutShift:
          window.__visualAudit?.cumulativeLayoutShift ?? 0,
        longTasks: window.__visualAudit?.longTasks ?? [],
        resources: resourceEntries,
      },
      fontStatus: document.fonts.status,
    };
  })()
`;

const downloadButtonsExpression = String.raw`
  (() => {
    const getRect = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        right: Math.round(rect.right),
        bottom: Math.round(rect.bottom),
      };
    };

    return {
      activeElementLabel:
        document.activeElement?.getAttribute('aria-label') ?? '',
      hash: location.hash,
      scrollY: Math.round(window.scrollY),
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      buttons: [
        ...document.querySelectorAll('.mobile-app-download__link'),
      ].map((link) => {
        const badge = link.querySelector('.mobile-app-download__badge');
        const image = link.querySelector('img');
        const style = getComputedStyle(link);
        const badgeStyle = badge ? getComputedStyle(badge) : null;

        return {
          ariaDisabled: link.getAttribute('aria-disabled'),
          ariaLabel: link.getAttribute('aria-label'),
          href: link.getAttribute('href'),
          rect: getRect(link),
          badge: badge
            ? {
                backgroundColor: badgeStyle.backgroundColor,
                maskImage: badgeStyle.maskImage,
                rect: getRect(badge),
                webkitMaskImage: badgeStyle.webkitMaskImage,
              }
            : null,
          image: image
            ? {
                alt: image.alt,
                complete: image.complete,
                naturalWidth: image.naturalWidth,
                naturalHeight: image.naturalHeight,
                rect: getRect(image),
                src: image.currentSrc || image.src,
              }
            : null,
          style: {
            backgroundColor: style.backgroundColor,
            borderColor: style.borderColor,
            boxShadow: style.boxShadow,
            color: style.color,
            cursor: style.cursor,
            outlineColor: style.outlineColor,
            outlineStyle: style.outlineStyle,
            outlineWidth: style.outlineWidth,
            transform: style.transform,
            transitionDuration: style.transitionDuration,
          },
        };
      }),
    };
  })()
`;

async function auditViewport(viewport, pathname = '/', screenshotSuffix = '') {
  const pageUrl = new URL(pathname, BASE_URL).href;
  const target = await createTarget(pageUrl);
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();

  const consoleMessages = [];
  const exceptions = [];
  const failedRequests = [];
  const errorResponses = [];

  client.on('Runtime.consoleAPICalled', (event) => {
    consoleMessages.push({
      type: event.type,
      values: event.args.map((argument) => argument.value ?? argument.description),
    });
  });
  client.on('Runtime.exceptionThrown', (event) => {
    exceptions.push(event.exceptionDetails.text);
  });
  client.on('Network.loadingFailed', (event) => {
    if (!event.canceled) {
      failedRequests.push({
        errorText: event.errorText,
        type: event.type,
      });
    }
  });
  client.on('Network.responseReceived', ({ response, type }) => {
    if (response.status >= 400) {
      errorResponses.push({
        status: response.status,
        url: response.url,
        type,
      });
    }
  });

  await Promise.all([
    client.send('Page.enable'),
    client.send('Runtime.enable'),
    client.send('Network.enable'),
  ]);

  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__visualAudit = {
        largestContentfulPaint: [],
        cumulativeLayoutShift: 0,
        longTasks: [],
      };

      try {
        new PerformanceObserver((list) => {
          window.__visualAudit.largestContentfulPaint = list
            .getEntries()
            .map((entry) => ({
              startTime: Math.round(entry.startTime),
              size: entry.size,
              url: entry.url,
              element: entry.element
                ? entry.element.tagName.toLowerCase() +
                  (entry.element.className
                    ? '.' + String(entry.element.className).split(' ').join('.')
                    : '')
                : '',
            }));
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {}

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__visualAudit.cumulativeLayoutShift += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {}

      try {
        new PerformanceObserver((list) => {
          window.__visualAudit.longTasks.push(
            ...list.getEntries().map((entry) => ({
              startTime: Math.round(entry.startTime),
              duration: Math.round(entry.duration),
            })),
          );
        }).observe({ type: 'longtask', buffered: true });
      } catch {}
    `,
  });

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: viewport.width,
    screenHeight: viewport.height,
  });
  await client.send('Emulation.setTouchEmulationEnabled', {
    enabled: viewport.width < 768,
    maxTouchPoints: viewport.width < 768 ? 5 : 1,
  });

  const loaded = client.waitFor('Page.loadEventFired');
  await client.send('Page.navigate', { url: pageUrl });
  await loaded;
  await delay(1_500);

  const evaluation = await client.send('Runtime.evaluate', {
    expression: metricsExpression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (evaluation.exceptionDetails) {
    throw new Error(evaluation.exceptionDetails.text);
  }

  const screenshot = await client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });
  const screenshotPath = path.join(
    OUTPUT_DIRECTORY,
    `${LABEL}-${viewport.width}${screenshotSuffix}.png`,
  );
  await writeFile(screenshotPath, screenshot.data, 'base64');

  let menuAudit = null;
  if (pathname === '/' && viewport.width === 320) {
    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.navbar-button')?.click()`,
    });
    await delay(200);
    const openMenuEvaluation = await client.send('Runtime.evaluate', {
      expression: `
        (() => ({
          expanded:
            document.querySelector('.navbar-button')?.getAttribute('aria-expanded'),
          activeElement: document.activeElement?.textContent?.trim(),
          mainInert: document.querySelector('main')?.inert,
          bodyLocked: document.body.classList.contains('menu-open'),
        }))()
      `,
      returnByValue: true,
    });
    await client.send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    });
    await client.send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    });
    await delay(200);
    const closedMenuEvaluation = await client.send('Runtime.evaluate', {
      expression: `
        (() => ({
          expanded:
            document.querySelector('.navbar-button')?.getAttribute('aria-expanded'),
          activeElementLabel:
            document.activeElement?.getAttribute('aria-label') ?? '',
          mainInert: document.querySelector('main')?.inert,
          bodyLocked: document.body.classList.contains('menu-open'),
        }))()
      `,
      returnByValue: true,
    });
    menuAudit = {
      open: openMenuEvaluation.result.value,
      closedWithEscape: closedMenuEvaluation.result.value,
    };
  }

  let dialogAudit = null;
  if (pathname === '/' && viewport.width === 390) {
    await delay(1_800);
    const openDialogEvaluation = await client.send('Runtime.evaluate', {
      expression: `
        (() => ({
          exists: Boolean(document.querySelector('[role="dialog"]')),
          ariaModal:
            document.querySelector('[role="dialog"]')?.getAttribute('aria-modal'),
          activeElementLabel:
            document.activeElement?.getAttribute('aria-label') ?? '',
          mainInert: document.querySelector('main')?.inert,
          bodyLocked: document.body.classList.contains('dialog-open'),
        }))()
      `,
      returnByValue: true,
    });
    const dialogScreenshot = await client.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
    });
    const dialogScreenshotPath = path.join(
      OUTPUT_DIRECTORY,
      `${LABEL}-${viewport.width}-dialog.png`,
    );
    await writeFile(dialogScreenshotPath, dialogScreenshot.data, 'base64');

    await client.send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    });
    await client.send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    });
    await delay(200);
    const closedDialogEvaluation = await client.send('Runtime.evaluate', {
      expression: `
        (() => ({
          exists: Boolean(document.querySelector('[role="dialog"]')),
          mainInert: document.querySelector('main')?.inert,
          bodyLocked: document.body.classList.contains('dialog-open'),
        }))()
      `,
      returnByValue: true,
    });
    dialogAudit = {
      open: openDialogEvaluation.result.value,
      closedWithEscape: closedDialogEvaluation.result.value,
      screenshot: dialogScreenshotPath,
    };
  }

  const sectionScreenshots = [];
  if (pathname === '/' && [320, 768, 1440].includes(viewport.width)) {
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const style = document.createElement('style');
          style.textContent = '.popup-overlay { display: none !important; }';
          document.head.append(style);
        })()
      `,
    });

    for (const sectionId of ['featured-products', 'about', 'contact']) {
      await client.send('Runtime.evaluate', {
        expression: `document.getElementById('${sectionId}')?.scrollIntoView({ block: 'start' })`,
      });
      await delay(500);
      const sectionScreenshot = await client.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false,
      });
      const sectionScreenshotPath = path.join(
        OUTPUT_DIRECTORY,
        `${LABEL}-${viewport.width}-${sectionId}.png`,
      );
      await writeFile(
        sectionScreenshotPath,
        sectionScreenshot.data,
        'base64',
      );
      sectionScreenshots.push(sectionScreenshotPath);
    }
  }

  if (pathname === '/mobile-app') {
    const mobileAppSections = [390, 1440].includes(viewport.width)
      ? [
          ['benefits', '.mobile-app-benefits'],
          ['download', '.mobile-app-download'],
          ['rewards', '.mobile-app-rewards'],
        ]
      : [['download', '.mobile-app-download']];

    for (const [sectionName, selector] of mobileAppSections) {
      await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const element = document.querySelector('${selector}');
            const header = document.querySelector('.sticky-nav');
            if (!element) return;
            window.scrollTo({
              top: element.offsetTop - (header?.offsetHeight ?? 0),
              behavior: 'instant',
            });
          })()
        `,
      });
      await delay(500);
      const sectionScreenshot = await client.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false,
      });
      const sectionScreenshotPath = path.join(
        OUTPUT_DIRECTORY,
        `${LABEL}-${viewport.width}-mobile-app-${sectionName}.png`,
      );
      await writeFile(
        sectionScreenshotPath,
        sectionScreenshot.data,
        'base64',
      );
      sectionScreenshots.push(sectionScreenshotPath);
    }
  }

  let downloadButtonAudit = null;
  if (pathname === '/mobile-app') {
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const element = document.querySelector('.mobile-app-download');
          const header = document.querySelector('.sticky-nav');
          if (!element) return;
          window.scrollTo({
            top: element.offsetTop - (header?.offsetHeight ?? 0),
            behavior: 'instant',
          });
        })()
      `,
    });
    await delay(250);

    await client.send('Runtime.evaluate', {
      expression: `
        document
          .querySelector('.mobile-app-download__link:not([aria-disabled="true"])')
          ?.addEventListener('click', (event) => event.preventDefault())
      `,
    });

    const evaluateDownloadButtons = async () => {
      const state = await client.send('Runtime.evaluate', {
        expression: downloadButtonsExpression,
        returnByValue: true,
      });
      return state.result.value;
    };

    const normal = await evaluateDownloadButtons();
    const firstButton = normal.buttons[0];

    if (firstButton) {
      const point = {
        x: firstButton.rect.x + firstButton.rect.width / 2,
        y: firstButton.rect.y + firstButton.rect.height / 2,
      };

      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        ...point,
      });
      await delay(250);
      const hover = await evaluateDownloadButtons();

      await client.send('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        button: 'left',
        buttons: 1,
        clickCount: 1,
        ...point,
      });
      await delay(250);
      const active = await evaluateDownloadButtons();
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        button: 'left',
        buttons: 0,
        clickCount: 1,
        ...point,
      });

      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: 0,
        y: 0,
      });
      await client.send('Runtime.evaluate', {
        expression:
          "document.querySelectorAll('.mobile-app-download__link')[1]?.focus({ preventScroll: true })",
      });
      await client.send('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key: 'Tab',
        code: 'Tab',
        modifiers: 8,
        windowsVirtualKeyCode: 9,
      });
      await client.send('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key: 'Tab',
        code: 'Tab',
        modifiers: 8,
        windowsVirtualKeyCode: 9,
      });
      await delay(250);
      const focus = await evaluateDownloadButtons();

      const placeholderClick = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const link = document.querySelector('.mobile-app-download__link');
            const before = {
              hash: location.hash,
              scrollY: Math.round(window.scrollY),
            };
            link?.click();
            return {
              before,
              after: {
                hash: location.hash,
                scrollY: Math.round(window.scrollY),
              },
            };
          })()
        `,
        returnByValue: true,
      });

      await client.send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
      await delay(50);
      const reducedMotion = await evaluateDownloadButtons();

      let focusScreenshotPath = null;
      if ([390, 1440].includes(viewport.width)) {
        const focusScreenshot = await client.send('Page.captureScreenshot', {
          format: 'png',
          fromSurface: true,
          captureBeyondViewport: false,
        });
        focusScreenshotPath = path.join(
          OUTPUT_DIRECTORY,
          `${LABEL}-${viewport.width}-mobile-app-download-focus.png`,
        );
        await writeFile(
          focusScreenshotPath,
          focusScreenshot.data,
          'base64',
        );
        sectionScreenshots.push(focusScreenshotPath);
      }

      downloadButtonAudit = {
        normal,
        hover,
        active,
        focus,
        placeholderClick: placeholderClick.result.value,
        reducedMotion,
        focusScreenshot: focusScreenshotPath,
      };
    }
  }

  const result = {
    ...evaluation.result.value,
    consoleMessages,
    exceptions,
    failedRequests,
    errorResponses,
    screenshot: screenshotPath,
    sectionScreenshots,
    downloadButtonAudit,
    menuAudit,
    dialogAudit,
  };

  client.close();
  await closeTarget(target.id);
  return result;
}

await mkdir(OUTPUT_DIRECTORY, { recursive: true });

const results = [];
for (const viewport of viewports) {
  results.push(await auditViewport(viewport));
}

const routeResults = [];
const auditedRoutes = [
  '/terms-and-conditions',
  '/app-privacy',
  '/app-support',
  '/mobile-app',
];

for (const viewport of viewports) {
  const routesForViewport = [390, 1440].includes(viewport.width)
    ? auditedRoutes
    : ['/mobile-app'];

  for (const pathname of routesForViewport) {
    const screenshotSuffix = `-${pathname.slice(1)}`;
    routeResults.push(
      await auditViewport(viewport, pathname, screenshotSuffix),
    );
  }
}

const report = {
  label: LABEL,
  generatedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  results,
  routeResults,
};
const reportPath = path.join(OUTPUT_DIRECTORY, `${LABEL}.json`);
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Visual audit written to ${reportPath}`);
console.log(
  results.map((result) => ({
    viewport: result.viewport,
    horizontalOverflow: result.document.horizontalOverflow,
    overflowElements: result.overflowElements.length,
    unintendedOverflowElements: result.unintendedOverflowElements.length,
    exceptions: result.exceptions.length,
    failedRequests: result.failedRequests.length,
    errorResponses: result.errorResponses.length,
    missingAlt: result.images.filter((image) => !image.hasAltAttribute).length,
    unnamedInteractiveElements: result.unnamedInteractiveElements.length,
    smallTouchTargets: result.smallTouchTargets.length,
  })),
);
