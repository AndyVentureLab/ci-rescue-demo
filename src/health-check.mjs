/** A health check should throw on non-2xx HTTP status or failed requests. */
export async function checkHealth(url, { fetchImpl = fetch, timeoutMs = 3000 } = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1) {
    throw new RangeError('timeoutMs must be a positive integer');
  }
  const response = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) {
    throw new Error(`Health check failed: HTTP ${response.status}`);
  }
  return true;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node src/health-check.mjs <health-url>');
    process.exitCode = 2;
  } else {
    try {
      await checkHealth(url);
      console.log('Health check passed');
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}