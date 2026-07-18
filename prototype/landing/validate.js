import fs from 'fs';
import path from 'path';

const DIR = './prototype/landing';

const REQUIRED_FILES = [
  'index.html',
  'login.html',
  'register.html',
  'method.html',
  'privacy.html',
  'accessibility.html',
  'terms.html',
  'styles.css',
  'app.js',
  'auth-ui.js',
  'content.js',
  'assets/relationship-network.svg',
  'README.md',
  'ACCESSIBILITY_CHECKLIST.md'
];

let failed = false;

function logPass(msg) {
  console.log(`[PASS] ${msg}`);
}

function logFail(msg) {
  console.error(`[FAIL] ${msg}`);
  failed = true;
}

console.log("=== BAZODIAC PROTOTYPE VALIDATOR ===");

// 1. Check file existence
console.log("\nChecking file existence...");
for (const file of REQUIRED_FILES) {
  const filePath = path.join(DIR, file);
  if (fs.existsSync(filePath)) {
    logPass(`File exists: ${file}`);
  } else {
    logFail(`Missing required file: ${file}`);
  }
}

// Check contents if files exist
if (!failed) {
  const indexHtml = fs.readFileSync(path.join(DIR, 'index.html'), 'utf-8');
  const loginHtml = fs.readFileSync(path.join(DIR, 'login.html'), 'utf-8');
  const registerHtml = fs.readFileSync(path.join(DIR, 'register.html'), 'utf-8');
  const stylesCss = fs.readFileSync(path.join(DIR, 'styles.css'), 'utf-8');
  const authJs = fs.readFileSync(path.join(DIR, 'auth-ui.js'), 'utf-8');

  // 2. Check for empty href="#"
  console.log("\nChecking for empty href='#'...");
  const htmls = [indexHtml, loginHtml, registerHtml];
  const hashHrefRegex = /href\s*=\s*"\s*#\s*"/gi;
  let hasHashHref = false;
  htmls.forEach((html, i) => {
    if (hashHrefRegex.test(html)) {
      logFail(`File index ${i} contains empty href="#"`);
      hasHashHref = true;
    }
  });
  if (!hasHashHref) {
    logPass("No empty href='#' found across main HTML pages.");
  }

  // 3. Check registration-to-login link and vice-versa
  console.log("\nChecking cross-linking between Login & Register...");
  if (registerHtml.includes('login.html')) {
    logPass("Register page contains link to login.html");
  } else {
    logFail("Register page is missing link to login.html");
  }

  if (loginHtml.includes('register.html')) {
    logPass("Login page contains link to register.html");
  } else {
    logFail("Login page is missing link to register.html");
  }

  // 4. Check for compatibility score wording (prohibited words)
  console.log("\nChecking for prohibited deterministic/score wording...");
  const prohibited = [
    "compatibility score",
    "compatibility percentage",
    "perfect match",
    "soulmate",
    "diagnostic instrument",
    "relationship grade",
    "fate prediction"
  ];
  let foundProhibited = false;
  htmls.forEach((html, idx) => {
    // Preprocess to remove safe, explicit negated warnings requested by instructions
    let cleanHtml = html.toLowerCase()
      .replace("not a compatibility score", "")
      .replace("no compatibility percentage", "");

    prohibited.forEach(word => {
      if (cleanHtml.includes(word)) {
        logFail(`File index ${idx} contains prohibited word/phrase: "${word}"`);
        foundProhibited = true;
      }
    });
  });
  if (!foundProhibited) {
    logPass("No prohibited deterministic or score wording found in HTML templates.");
  }

  // 5. Check auth-ui.js for storage, network, cookies
  console.log("\nChecking auth-ui.js adapter safety (no cookies, storage, or network)...");
  const forbiddenApis = [
    "localStorage",
    "sessionStorage",
    "document.cookie",
    "fetch",
    "XMLHttpRequest",
    "axios"
  ];
  let foundForbiddenApi = false;
  forbiddenApis.forEach(api => {
    if (authJs.includes(api)) {
      logFail(`auth-ui.js contains forbidden storage/network API: "${api}"`);
      foundForbiddenApi = true;
    }
  });
  if (!foundForbiddenApi) {
    logPass("auth-ui.js conforms to prototype data-safety constraints (no network/storage/cookies).");
  }

  // 6. Check for remote script or font dependencies in HTML files
  console.log("\nChecking for external dependencies (fonts/CDN scripts)...");
  let externalDep = false;
  htmls.forEach((html, idx) => {
    if (html.includes('googleapis.com') || html.includes('gstatic.com') || html.includes('bootstrapcdn.com') || html.includes('cdnjs.cloudflare.com')) {
      logFail(`File index ${idx} references remote fonts or libraries.`);
      externalDep = true;
    }
  });
  if (!externalDep) {
    logPass("No external/remote stylesheet or script dependencies detected.");
  }

  // 7. Check reduced-motion CSS
  console.log("\nChecking reduced-motion CSS and keyboard toggle styling support...");
  if (stylesCss.includes('@media') && stylesCss.includes('prefers-reduced-motion')) {
    logPass("styles.css contains prefers-reduced-motion media query.");
  } else {
    logFail("styles.css does not contain prefers-reduced-motion media query.");
  }
}

console.log("\n=== VALIDATION COMPLETED ===");
if (failed) {
  process.exit(1);
} else {
  console.log("All static assertions passed!");
}
