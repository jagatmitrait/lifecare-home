/**
 * CORS for the deployed frontend + local dev.
 * Set FRONTEND_URL to your production frontend URL (no trailing slash) —
 * e.g. your Hostinger domain: https://yourdomain.com
 * Optional CORS_ORIGINS: comma-separated extra origins (e.g. www + non-www,
 * or a staging subdomain).
 */
export function createCorsOptions() {
  const origins = new Set();

  const frontend = process.env.FRONTEND_URL?.trim().replace(/\/$/, '');
  if (frontend) origins.add(frontend);

  const extras = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
  extras.forEach((o) => origins.add(o));

  const allowVercelPreviews = process.env.CORS_ALLOW_VERCEL !== 'false';

  return {
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (origins.has(origin)) {
        return callback(null, true);
      }

      if (allowVercelPreviews && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
        return callback(null, true);
      }

      // Vercel preview URLs with team suffix: name-git-branch-user.vercel.app
      if (allowVercelPreviews && /^https:\/\/[a-z0-9.-]+\.vercel\.app$/i.test(origin)) {
        return callback(null, true);
      }

      const allowLocalhost = process.env.CORS_ALLOW_LOCALHOST !== 'false';
      if (
        allowLocalhost &&
        (
          /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
          /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
        )
      ) {
        return callback(null, true);
      }

      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };
}
