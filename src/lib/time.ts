import { headers } from 'next/headers';

export async function getCurrentTime(): Promise<number> {
  // 1. Check if we are in test mode
  // Note: We will add TEST_MODE to .env.local later for testing
  const isTestMode = process.env.TEST_MODE === '1';

  if (isTestMode) {
    // 2. In Next.js App Router, headers() is an async function
    const headersList = await headers();
    const testTimeHeader = headersList.get('x-test-now-ms');

    if (testTimeHeader) {
      const testTime = parseInt(testTimeHeader, 10);
      // Validate that it's a real number
      if (!isNaN(testTime)) {
        return testTime;
      }
    }
  }

  // 3. Fallback to real system time
  return Date.now();
}