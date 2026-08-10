'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';


const useMaintenanceParameterAPUPPT = () => {
  const path = usePathname();
  const { id } = useParams<{ id: string }>();

  const ignorePath = [
    '/master-parameter/parameter-mapping-apu_ppt',
  ];

  const params = useSearchParams();
  const additionalIgnorePath = [
    ...ignorePath,
  ];

  const isDetailPage = ignorePath.includes(path);
  const renderDetailLayout = additionalIgnorePath.includes(path) || params.get('from') !== null;

  // Get current step from URL (for backward compatibility)
  const getCurrentStep = () => {
    if (path.includes('/detail/process')) return 'process';
    if (path.includes('/detail/summary')) return 'summary';
    if (path.includes('/detail/validasi')) return 'validasi';
    return 'process'; // default
  };

  const currentStep = getCurrentStep();

  const isSubmission = false;

  return {
    currentStep,
    isSubmission,
    renderDetailLayout,
  };
};

export default useMaintenanceParameterAPUPPT;
