import { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';


const useGetCurrentModule = () => {
  const path = usePathname();
  const pathArray = path.split('/');

  const modulePath = useMemo(() => {
    switch (pathArray[3]) {
      case 'lpa-review':
        return {
          module: TypeModule.LPA,
          process: TypeProcess.LPA_REVIEW,
        };
      case 'lpa-request-review':
        return {
          module: TypeModule.LPA,
          process: TypeProcess.LPA,
        };
      default:
        return {
          module: TypeModule.LPA,
          process: TypeProcess.LPA_REVIEW,
        };
    }
  }, [pathArray]);

  return modulePath;
};

export default useGetCurrentModule;
