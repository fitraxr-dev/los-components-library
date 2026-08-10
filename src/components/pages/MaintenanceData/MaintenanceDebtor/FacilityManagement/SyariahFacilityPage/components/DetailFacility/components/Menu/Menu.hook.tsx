import { useTheme } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { MenuContents } from './Menu.constants';


const useMenu = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditPage = pathname.split('/')[8]?.includes('edit');

  const handleClickMenu = (val: MenuContents) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('menu', val.id);

    if (isEditPage) {
      params.set('isEdit', 'true');
    }

    const url = `${pathname}?${params.toString()}`;

    router.push(url);
  };

  return {
    handleClickMenu,
    pathname,
    theme,
  };
};
export default useMenu;
