import { extractPaths } from '@/helpers/utils';


interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  status: number;
  subMenu?: MenuItem[];
}

const setPreviewPage = (path: string, fromPage: string = ''): string => {
  try {
    const accessMenuData = localStorage.getItem('accessMenu');

    // Jika accessMenu tidak ada → otomatis preview
    if (!accessMenuData) {
      const hasQueryString = path.includes('?');
      const fromParam = fromPage ? `&fromPage=${encodeURIComponent(fromPage)}` : '';
      return hasQueryString
        ? `${path}&isPreview=true${fromParam}`
        : `${path}?isPreview=true${fromParam}`;
    }

    const menuData: string[] = JSON.parse(accessMenuData);

    // Jika format salah → otomatis preview
    if (!Array.isArray(menuData)) {
      const hasQueryString = path.includes('?');
      const fromParam = fromPage ? `&fromPage=${encodeURIComponent(fromPage)}` : '';
      return hasQueryString
        ? `${path}&isPreview=true${fromParam}`
        : `${path}?isPreview=true${fromParam}`;
    }

    const pathWithoutQuery = path.split('?')[0];

    // === LOGIC AKSES ===
    const hasAccess = menuData.some((accessPath) =>
      pathWithoutQuery.startsWith(accessPath)
    );

    // Jika ada akses → return apa adanya
    if (hasAccess) {
      return path;
    }

    // Jika tidak ada akses → tambahkan isPreview dan fromPage
    const hasQueryString = path.includes('?');
    const fromParam = fromPage ? `&fromPage=${encodeURIComponent(fromPage)}` : '';

    return hasQueryString
      ? `${path}&isPreview=true${fromParam}`
      : `${path}?isPreview=true${fromParam}`;

  } catch (error) {
    console.error('Error checking access page:', error);
    const hasQueryString = path.includes('?');
    const fromParam = fromPage ? `&fromURL=${encodeURIComponent(fromPage)}` : '';
    return hasQueryString
      ? `${path}&isPreview=true${fromParam}`
      : `${path}?isPreview=true${fromParam}`;
  }
};

export default setPreviewPage;
