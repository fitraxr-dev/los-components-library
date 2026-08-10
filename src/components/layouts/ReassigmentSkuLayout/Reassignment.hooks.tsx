import { usePathname } from 'next/navigation';

import { RE_ASSIGNMENT_SKU } from '@/configs/constants/pathname';
import { GENERAL_SKU } from '@/configs/constants/sku';
import useCustomRouter from '@/hooks/useCustomRouter';


const useReassignment = () => {
  const router = useCustomRouter();
  const path = usePathname();

  const handleBack = () => router.back();

  const pathSegments = path.split('/').filter(Boolean);
  const [moduleIndex, processId, mode, type] = pathSegments;

  const pathConditions = {
    isActionPage: pathSegments.length === 4 &&
      moduleIndex === 'reassignment-sku' &&
      [GENERAL_SKU.CREATE, GENERAL_SKU.VIEW, GENERAL_SKU.DETAIL].includes(mode) &&
      [GENERAL_SKU.REQUEST, GENERAL_SKU.VALIDATION].includes(type),
    isCreatePage: mode === GENERAL_SKU.CREATE,
    isDetailPage: mode === GENERAL_SKU.DETAIL,
    isListPage: path === RE_ASSIGNMENT_SKU.BASH_PATH,
    isRequestType: type === GENERAL_SKU.REQUEST,
    isValidasiType: type === GENERAL_SKU.VALIDATION,
    isViewPage: mode === GENERAL_SKU.VIEW,
  };

  return {
    handleBack,
    ...pathConditions,
    mode,
    moduleIndex,
    processId,
    renderDetailLayout: false,
    type,
  };
};

export default useReassignment;
