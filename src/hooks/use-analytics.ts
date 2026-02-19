'use client';

import { useAnalytics } from '@/firebase/provider';
import { logEvent } from 'firebase/analytics';
import { useCallback } from 'react';

/**
 * Custom hook for logging Firebase Analytics events.
 * Provides a safe way to log events that handles the case where analytics
 * might not be initialized (e.g., during SSR or if blocked).
 */
export function useAnalyticsEvents() {
  const analytics = useAnalytics();

  const logAnalyticsEvent = useCallback((eventName: string, eventParams?: Record<string, any>) => {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  }, [analytics]);

  return { logAnalyticsEvent };
}
