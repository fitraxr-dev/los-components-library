import { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { TypeModule, TypeProcess } from '../../../../../enums/Module';


// const useGetCurrentModule = () => {
//   const path = usePathname();
//   const pathArray = path.split('/');

//   const modulePath = useMemo(() => {
//     switch (pathArray[3]) {
//       case 'maintenance-reminder':
//         return {
//           module: TypeModule.MAINTENANCE_REMINDER,
//           process: TypeProcess.MAINTENANCE_REMINDER_DETAIL,
//         };
//       default:
//         return {
//           module: TypeModule.MAINTENANCE_REMINDER,
//           process: TypeProcess.MAINTENANCE_REMINDER_DETAIL,
//         };
//     }
//   }, [pathArray]);

//   return modulePath;
// };

//  Harus di Ubah
const useGetCurrentModule = () => {
  const path = usePathname();
  const pathArray = path.split('/');

  const modulePath = useMemo(() => {
    switch (pathArray[3]) {
      case 'lpa-review':
        return {
          module: TypeModule.MAINTENANCE_REMINDER,
          process: TypeProcess.MAINTENANCE_REMINDER,
        };
      case 'lpa-request-review':
        return {
          module: TypeModule.MAINTENANCE_REMINDER,
          process: TypeProcess.MAINTENANCE_REMINDER,
        };
      default:
        return {
          module: TypeModule.MAINTENANCE_REMINDER,
          process: TypeProcess.MAINTENANCE_REMINDER,
        };
    }
  }, [pathArray]);

  return modulePath;
};

export default useGetCurrentModule;
