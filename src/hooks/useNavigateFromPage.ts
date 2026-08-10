'use client';

import { useSearchParams } from 'next/navigation';

import { HOME_PAGE, MONITORING } from '@/configs/constants/pathname';

import useCustomRouter from './useCustomRouter';


type FromPageItem = {
  key: string;
  value: string;
};

const fromPageList: FromPageItem[] = [
  { key: 'dashboard', value: HOME_PAGE },
  { key: 'monitoring', value: MONITORING.PROCESS_MONITORING },
];

export const useNavigationFromPage = () => {
  const searchParams = useSearchParams();
  const router = useCustomRouter();

  const getFromPageKey = (): string | null => {
    return searchParams.get('fromPage');
  };

  const getFromPageValue = (): string | null => {
    const fromPageKey = getFromPageKey();
    if (!fromPageKey) return null;

    const pageItem = fromPageList.find((item) => item.key === fromPageKey);
    return pageItem?.value || null;
  };

  const isFromPageItem = (): boolean => {
    const fromPageKey = getFromPageKey();
    return fromPageList.some((item) => item.key === fromPageKey);
  };

  const getFromPageItem = (): FromPageItem | null => {
    const fromPageKey = getFromPageKey();
    if (!fromPageKey) return null;

    return fromPageList.find((item) => item.key === fromPageKey) || null;
  };

  const redirectToFromPage = (): boolean => {
    const isPreview = searchParams.get('isPreview');
    const fromPageKey = getFromPageKey();

    if (isPreview === 'true' && !fromPageKey) {
      router.replace(HOME_PAGE);
      return true;
    }

    if (!fromPageKey) return false;

    const fromPageItem = getFromPageItem();
    if (!fromPageItem) {
      return false;
    }

    router.replace(fromPageItem.value);
    return true;
  };

  return {
    getFromPageItem,
    getFromPageKey,
    getFromPageValue,
    isFromPageItem,
    redirectToFromPage,
  };
};
