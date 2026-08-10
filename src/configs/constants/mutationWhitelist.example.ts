import { useMutation } from '@tanstack/react-query';

import { createWhitelistedMutationKey, createMutationOptions } from '@/helpers/mutation';

// Example 1: Background sync mutation
const useBackgroundSync = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      // Sync data in background
      return await api.syncData(data);
    },
    mutationKey: createWhitelistedMutationKey('background-sync'),
  });
};

// Example 2: Auto-save mutation
const useAutoSave = () => {
  return useMutation({
    mutationFn: async (formData: any) => {
      // Auto save form data
      return await api.autoSave(formData);
    },
    mutationKey: createWhitelistedMutationKey('auto-save'),
  });
};

// Example 3: Using the helper function
const usePollingUpdate = () => {
  return useMutation(
    createMutationOptions(
      'polling-update',
      async (data: any) => {
        return await api.updatePollingData(data);
      },
      {
        onError: (error) => {
          console.error('Polling update failed:', error);
        },
        onSuccess: (data) => {
          console.log('Polling update successful:', data);
        },
      }
    )
  );
};

// Example 4: Analytics tracking (background operation)
const useTrackAnalytics = () => {
  return useMutation({
    mutationFn: async (eventData: any) => {
      // Track user behavior in background
      return await analyticsApi.track(eventData);
    },
    mutationKey: createWhitelistedMutationKey('analytics-track'),
  });
};

// Example 5: Notification update (like the original issue)
const useUpdateNotificationStatus = () => {
  return useMutation({
    mutationFn: async (notificationIds: number[]) => {
      // Update notification status without showing loading
      return await notificationApi.updateStatus(notificationIds);
    },
    mutationKey: createWhitelistedMutationKey('notification-status'),
  });
};
