import { useMemo } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';

import { detailLimitAnakMenu, editLimitAnakMenu, limitIndukMenu } from './TopMenu.constants';

import type { TopMenuContents, TopMenuProps } from './TopMenu.type';


const useTopMenu = ({ type = 'limit-induk', idInduk }: TopMenuProps) => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const isMaster = pathname.split('/').includes('master');

  const lastPath = getLastPath(pathname);

  const { id, processId } = params;

  const listMenu = useMemo(() => {
    if (type === 'limit-induk') {
      return limitIndukMenu;
    } else if (type === 'detail-limit-anak') {
      return detailLimitAnakMenu;
    } else {
      return editLimitAnakMenu;
    }
  }, [type]);

  const handleClickMenu = (val: TopMenuContents) => {
    switch (val.id) {
      case 'limit-induk':
        router.push(replacePath(maintenanceDebtor.LIMIT_INDUK, {
          id,
          module: isMaster ? 'master' : 'maintenance',
          processId,
        }));
        break;
      case 'limit-anak-list':
        router.push(replacePath(maintenanceDebtor.LIMIT_ANAK_LIST, {
          id,
          idInduk,
          module: isMaster ? 'master' : 'maintenance',
          processId,
        }));
        break;
      case 'detail-limit-anak':
        router.push(replacePath(maintenanceDebtor.DETAIL_LIMIT_ANAK, {
          id,
          module: isMaster ? 'master' : 'maintenance',
          processId,
        }));
        break;
      case 'edit-limit-anak':
        router.push(replacePath(maintenanceDebtor.EDIT_LIMIT_ANAK, {
          id,
          module: isMaster ? 'master' : 'maintenance',
          processId,
        }));
        break;
      case 'detail-informasi-lainnya':
        router.push(replacePath(maintenanceDebtor.DETAIL_INFORMASI_LAINNYA, {
          id,
          module: isMaster ? 'master' : 'maintenance',
          processId,
        }));
        break;
      case 'edit-informasi-lainnya':
        router.push(replacePath(maintenanceDebtor.EDIT_INFORMASI_LAINNYA, {
          id,
          module: isMaster ? 'master' : 'maintenance',
          processId,
        }));
        break;
      default:
        console.error('url not found!');
    }
  };

  return {
    handleClickMenu,
    lastPath,
    listMenu,
    pathname,
    theme,
  };
};
export default useTopMenu;
