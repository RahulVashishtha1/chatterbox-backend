const fs = require('fs');
const path = require('path');

function loadEnv() {
  // In production (e.g., Render), env vars are injected. Skip file loading.
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  try {
    const dotenv = require('dotenv');
    const cwd = __dirname;
    const dotEnvPath = path.resolve(cwd, '..', '.env');
    const legacyConfigPath = path.resolve(cwd, '..', 'config.env');

    if (fs.existsSync(dotEnvPath)) {
      dotenv.config({ path: dotEnvPath });
      return;
    }

    if (fs.existsSync(legacyConfigPath)) {
      dotenv.config({ path: legacyConfigPath });
      return;
    }

    // Final fallback: default search
    dotenv.config();
  } catch (err) {
    // Swallow errors; missing dotenv is non-fatal in production
  }
}

module.exports = loadEnv;


