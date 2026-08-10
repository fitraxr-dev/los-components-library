import { useParams, usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import useApp from '@/hooks/useApp';


export type Mode = 'edit' | 'detail' | 'submission';

const useParameterSyariahMode = () => {
  const { processId } = useParams<{ processId?: string }>();
  const pathname = usePathname();

  // Detect mode from pathname
  const isSubmission = pathname?.includes('/submission');
  const isViewOnly = pathname?.includes('/detail');
  const isCreate = pathname?.includes('/create');
  // Add 'create' to Mode type
  type ModeExtended = Mode | 'create';
  const mode: ModeExtended = isSubmission
    ? 'submission'
    : isViewOnly
      ? 'detail'
      : isCreate
        ? 'create'
        : 'edit';

  const bucketProcessIdFormat = [
    'PSLA', // SLA
    'PCE', // COT & EOD
    'PRATE', // Rate
    'PLOV', // LOV
    'PSYAR', // Parameter Syariah submission
  ];
  const isBucketProcessId = !!processId && bucketProcessIdFormat.some((prefix) => processId.startsWith(prefix));
  const isSubmissionBucket = !!processId && processId.startsWith('PSYAR');

  const [{ currentRole }] = useApp();
  const isMaker = !!currentRole?.includes?.(roles.MAKER);
  const isChecker = !!currentRole?.includes?.(roles.CHECKER);

  return {
    isBucketProcessId,
    isChecker,
    isMaker,
    isSubmission: isSubmission || isSubmissionBucket,
    isSubmissionBucket,
    isViewOnly,
    mode: isSubmissionBucket ? 'submission' : mode,
    processId,
  };
};

export default useParameterSyariahMode;
