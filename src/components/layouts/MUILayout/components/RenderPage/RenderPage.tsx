'use client';
import { useEffect } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import { removeCookie, setCookie } from '@/helpers/cookie';

import PageContainer from '@/components/layouts/MUILayout/components/PageContainer';
import NotGrantedPage from '@/components/pages/NotGrantedPage';
import ModalConfirmIdle from '@/components/shared/SmiModal/ModalConfirmIdle';
import { MODAL_CHECK_IDLE } from '@/components/shared/SmiModal/ModalConfirmIdle/ModalConfirmIdle.constants';

import useRenderPage from './RenderPage.hook';
// import { setMenuListPathCookie } from './actions';


function collectPaths(menu) {
  const result = [];

  function traverse(items) {
    for (const item of items) {
      if (item.path) {
        result.push(item.path);
      }
      if (item.subMenu) {
        traverse(item.subMenu);
      }
    }
  }

  traverse(menu);
  return result;
}

function compressPath(paths) {
  return paths.map((path) => {
    // Kalau root "/", langsung return
    if (path === '/') return path;

    // Split path jadi segment tanpa empty values
    const parts = path.split('/').filter(Boolean);

    // Ambil karakter pertama tiap segment
    const compressed = parts.map((seg) => seg[0]).join('/');

    // Tambahkan "/" di depan
    return '/' + compressed;
  });
}

const RenderPage = ({ page }) => {
  const {
    isPathAllowed,
    publicRoute,
    grantedAccess,
    pathname,
    menuList,
  } = useRenderPage();

  useEffect(() => {

    // Only save to localStorage if menuList is not just the placeholder data
    if (menuList && menuList.length > 0) {
      try {
        localStorage.setItem('accessMenu', JSON.stringify(menuList));
        // console.log('✅ localStorage updated with menu data:', menuList.length, 'items');
        const paths = collectPaths(menuList);
        console.log('paths', compressPath(paths));
        if (paths.length > 1) {
          // setMenuListPathCookie(JSON.stringify(paths));
          removeCookie('menuListPath');
          setCookie('menuListPath', JSON.stringify(paths), {
            path: '/',
            sameSite: 'lax',
          });
        }
      } catch (error) {
        // console.error('Error saving permissions to localStorage:', error);
      }
    } else {
      // console.log('❌ Not updating localStorage - menuList length:', menuList?.length);
    }
  }, [menuList]);

  const isPublicRoute = publicRoute.includes(pathname);

  if (isPublicRoute) {
    return grantedAccess ? page : <NotGrantedPage />;
  }

  return (
    <>
      <PageContainer sidebarMenu={menuList}>
        {isPathAllowed ? page : <NotGrantedPage />}
        <ModalDef id={MODAL_CHECK_IDLE} component={ModalConfirmIdle} />
      </PageContainer>
    </>
  );
};

export default RenderPage;
