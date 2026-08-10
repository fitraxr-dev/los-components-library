'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';


const useParameterLOV = () => {
  const path = usePathname();
  const { id } = useParams<{ id: string }>();

  const ignorePath = [
    '/master-parameter/parameter-lov',
  ];

  const params = useSearchParams();
  const additionalIgnorePath = [
    ...ignorePath,
  ];

  const isDetailPage = ignorePath.includes(path);
  const renderDetailLayout = additionalIgnorePath.includes(path) || params.get('from') !== null;

  // Get current step from URL (for backward compatibility)
  const getCurrentStep = () => {
    if (path.includes('/process')) return 'process';
    if (path.includes('/summary')) return 'summary';
    if (path.includes('/validasi')) return 'validasi';
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

export default useParameterLOV;
