import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { RE_ASSIGNMENT_SKU } from '@/configs/constants/pathname';
import { GENERAL_SKU } from '@/configs/constants/sku';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import { useReassignmentSkuContext } from '../../Reassignment.context';


const useCustomNavMenu = () => {
  const pathname = usePathname();
  const router = useCustomRouter();
  const theme = useTheme();
  const { stepperData, isStepperLoading } = useReassignmentSkuContext();
  const [listStepper, setListStepper] = useState([]);
  const [listStepperRed, setListStepperRed] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const pathSegments = pathname.split('/').filter((segment) => segment);
  const currentModule = pathSegments[0];
  const currentProcessId = pathSegments[1];
  const currentMode = pathSegments[2];
  const steps = stepperData?.steps || [];

  const menuPaths = {
    request: replacePath(RE_ASSIGNMENT_SKU.REQUEST_PAGE, {
      mode: currentMode,
      processId: currentProcessId,
    }),
    validation: replacePath(RE_ASSIGNMENT_SKU.VALIDATION_PAGE, {
      mode: currentMode,
      processId: currentProcessId,
    }),
  };

  const formatStepperData = (stepperList) => {
    if (!stepperList || !Array.isArray(stepperList)) {
      return [];
    }

    const newStepper = stepperList?.map((item) => {
      const stepUrl = `/${currentModule}/${currentProcessId}/${currentMode}/${item.urlPath}`;

      return {
        childrenSteps: item.childrenSteps,
        enable: item.enable,
        id: item.key,
        key: item.key,
        label: item.label,
        subMenu: item.childrenSteps
          ? item.childrenSteps.map((child) => ({
            id: child.key,
            key: child.key,
            label: child.label,
            url: `/${currentModule}/${currentProcessId}/${currentMode}/${child.urlPath}`,
          }))
          : [],
        url: stepUrl,
        urlPath: item.urlPath,
      };
    });

    return newStepper;
  };

  useEffect(() => {
    if (steps && steps.length > 0) {
      const formattedSteps = formatStepperData(steps);
      setListStepper(formattedSteps);
    }
  }, [steps, currentModule, currentProcessId, currentMode]);

  useEffect(() => {
    if (steps && steps.length > 0) {
      const redSteps = steps
        .filter((step) => !step.enable)
        .map((step) => step.key);

      setListStepperRed(redSteps);
    }
  }, [steps]);

  useEffect(() => {
    setOpenDropdownId(null);
  }, [pathname]);

  const handleClickMenu = (menu) => {


    if (menu.url) {
      const newPath = menu.url;

      const isDirty = sessionStorage.getItem('isDirty');
      if (isDirty === 'true') {
        NiceModal.show(MODAL.GLOBAL.CONFIRM, {
          agreeText: 'Confirm',
          cancelText: 'Cancel',
          onSubmit: () => {
            router.push(newPath);
            sessionStorage.removeItem('isDirty');
          },
          title: 'Data belum tersimpan, apakah anda ingin menyimpan data ini dan berpindah ke tab lain?',
        });
      } else {
        router.push(newPath);
        sessionStorage.removeItem('isDirty');
      }
    }
  };

  const handleDropdownToggle = (dropdownId) => {
    if (openDropdownId === dropdownId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(dropdownId);
    }
  };

  const isActionPage = pathSegments.length === 4 &&
    pathSegments[0] === 'reassignment-sku' &&
    [GENERAL_SKU.CREATE, GENERAL_SKU.VIEW, GENERAL_SKU.DETAIL].includes(pathSegments[2]) &&
    Object.keys(menuPaths).includes(pathSegments[3]);

  const renderMenu = isActionPage && !isStepperLoading;

  return {
    handleClickMenu,
    handleDropdownToggle,
    isStepperLoading,
    listStepper,
    listStepperRed,
    menuPaths,
    openDropdownId,
    pathname,
    renderMenu,
    theme,
  };
};

export default useCustomNavMenu;
