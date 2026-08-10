import { TypeModule, TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import useGetExposureGroup from '../../hooks/useGetExposureGroup';


const useExposureGroup = () => {
  const [state] = useApp();
  const { processId } = useIdentity();

  const { data: exposureGroupData } = useGetExposureGroup({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  return {
    exposureGroupData,
  };
};

export default useExposureGroup;
