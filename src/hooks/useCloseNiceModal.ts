import NiceModal from '@ebay/nice-modal-react';

/**
 * Optimized function to close and remove NiceModal
 * @param modalId - The ID of the modal to close
 * @returns Promise<void> - Async operation for better promise handling
 */
const closeNiceModal = async (modalId: string): Promise<void> => {
  try {
    // Hide modal first (immediate visual feedback)
    NiceModal.hide(modalId);

    // Remove modal from DOM immediately for better performance
    // No need for timeout as NiceModal handles cleanup internally
    NiceModal.remove(modalId);

    // Return resolved promise for async compatibility
    return Promise.resolve();
  } catch (error) {
    // Silent fail if modal doesn't exist or already closed
    console.warn(`Failed to close modal ${modalId}:`, error);
    return Promise.reject(error);
  }
};

export default closeNiceModal;
