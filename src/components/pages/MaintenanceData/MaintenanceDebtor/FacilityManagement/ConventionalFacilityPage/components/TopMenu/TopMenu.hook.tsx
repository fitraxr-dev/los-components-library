import { useMemo } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';

// import { listMenu } from './TopMenu.constants';

import type { TopMenuContents } from './TopMenu.type';


const useTopMenu = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('isEdit') === 'true';
  const isOrderType = searchParams.get('orderType');

  const { processId, id } = params;
  const modul = pathname.split('/')[3];


  const handleClickMenu = (val: TopMenuContents) => {

    let url = '';
    let finalUrl = '';
    switch (val.id) {
      case 'facility-information':
        url = replacePath(maintenanceDebtor.CONVENTIONAL_FACILITY_INFORMATION_FACILITY_PAGE, {
          debtorId: processId, id, module: modul,
        });
        finalUrl = isEdit ? `${url}?isEdit=true${isOrderType ? `&orderType=${isOrderType}` : ''}` : `${url}?${isOrderType ? `orderType=${isOrderType}` : ''}`;
        router.push(finalUrl);
        break;
      case 'other-information':
        url = replacePath(maintenanceDebtor.CONVENTIONAL_FACILITY_OTHER_INFORMATION_PAGE, {
          debtorId: processId, id, module: modul,
        });
        finalUrl = isEdit ? `${url}?isEdit=true${isOrderType ? `&orderType=${isOrderType}` : ''}` : `${url}?${isOrderType ? `orderType=${isOrderType}` : ''}`;
        router.push(finalUrl);
        break;
      default:
        console.error('url not found!');
    }
  };

  return {
    handleClickMenu,
    pathname,
    theme,
  };
};
export default useTopMenu;
