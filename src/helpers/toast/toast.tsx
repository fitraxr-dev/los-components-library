import toast from 'react-hot-toast';

import CustomToast from '@/components/shared/Toast';

import type { ToastSeverity } from '@/components/shared/Toast/types';


export const showToast = (severity: ToastSeverity) => {
  toast.custom(() => <CustomToast severity={severity} />);
};
