import { useParams } from 'next/navigation';

import { roles } from '@/configs/constants';
import useApp from '@/hooks/useApp';


export type Mode = 'edit' | 'detail' | 'submission';

const useMasterParameter = () => {
  const { processId, mode } = useParams<{ processId?: string; mode: Mode }>();
  const isSubmission = mode?.includes('submission');
  const isViewOnly = mode?.includes('detail');
  const isVieOnlyItem = mode?.includes('create');

  const bucketProcessIdFormat = [
    'PSLA', // SLA
    'PCE', // COT & EOD
    'PRATE', // Rate
    'PLOV', // LOV
    'PBO', // BENEFICIAL OWNER
    'PCDD', // CUSTOMER DUE DILIGENCE
    'BPLOV', // LOV
  ];
  const isBucketProcessId = !!processId && bucketProcessIdFormat.some((prefix) => processId.startsWith(prefix));

  const [{ currentRole }] = useApp();
  const isMaker = !!currentRole?.includes?.(roles.MAKER);
  const isChecker = !!currentRole?.includes?.(roles.CHECKER);

  return {
    isBucketProcessId,
    isChecker,
    isMaker,
    isSubmission,
    isVieOnlyItem,
    isViewOnly,
    mode,
    processId,
  };
};

export default useMasterParameter;
