import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { reducer } from '@/components/layouts/AppLayout/App.constants';
import useGetAppsMenu from '@/components/pages/UserManagement/AccessMenu/hooks/useGetAccessMenuById';

import useGetDataDeltaStepper from '../../hooks/useGetDataDeltaStepper';


const useCustomNavMenu = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useCustomRouter();
  const theme = useTheme();
  const [app, dispatch] = useApp();
  const { setViewOnly } = useViewOnly();
  const [listStepper, setListStepper] = useState([]);
  const [listStepperRed, setListStepperRed] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const isKadiv = app?.currentRole.includes('KADIV');
  const isTL = app?.currentRole.includes('TL');
  const isChecker = app?.currentRole.includes('CHECKER');
  const pathArray = pathname.split('/');
  const moduleIndex = pathArray[3];

  const { data: menuList, isSuccess: isSuccessMenu } = useGetAppsMenu();

  const mapMenuPaths = (menuItems) => {
    let mappedList = [];

    for (const item of menuItems) {
      if (item.path) {
        mappedList.push({
          id: item.id,
          path: item.path,
        });
      }

      if (item.subMenu && item.subMenu.length > 0) {
        mappedList = mappedList.concat(mapMenuPaths(item.subMenu));
      }
    }

    return mappedList;
  };

  const menuCodeList = isSuccessMenu && menuList ? mapMenuPaths(menuList) : [];

  const currentMenu = menuCodeList.find((menu) =>
    menu.id !== 'home' && pathname.includes(menu.path)
  );

  const menuCodes = currentMenu ? currentMenu.id : null;
  const { processId, id, idInduk, projectId } = params;

  const inquiryLimitPath = replacePath(maintenanceDebtor.INQUIRY_LIMIT, {
    id,
    module: moduleIndex,
    processId,
  });
  const inquiryAccountPath = replacePath(maintenanceDebtor.INQUIRY_ACCOUNT, {
    id,
    module: moduleIndex,
    processId,
  });
  const limitIndukPath = replacePath(maintenanceDebtor.LIMIT_INDUK, {
    id,
    module: moduleIndex,
    processId,
  });
  const limitAnakListPath = replacePath(maintenanceDebtor.LIMIT_ANAK_LIST, {
    id,
    idInduk,
    module: moduleIndex,
    processId,
  });
  const limitAnakPath = replacePath(maintenanceDebtor.LIMIT_ANAK, {
    id,
    module: moduleIndex,
    processId,
  });
  const informasiLainnyaPath = replacePath(maintenanceDebtor.INFORMASI_LAINNYA, {
    id,
    module: moduleIndex,
    processId,
  });
  const detailLimitAnakPath = replacePath(maintenanceDebtor.DETAIL_LIMIT_ANAK, {
    id,
    module: moduleIndex,
    processId,
  });
  const detailInformasiLainnyaPath = replacePath(maintenanceDebtor.DETAIL_INFORMASI_LAINNYA, {
    id,
    module: moduleIndex,
    processId,
  });
  const editLimitAnakPath = replacePath(maintenanceDebtor.EDIT_LIMIT_ANAK, {
    id,
    module: moduleIndex,
    processId,
  });
  const editInformasiLainnyaPath = replacePath(maintenanceDebtor.EDIT_INFORMASI_LAINNYA, {
    id,
    module: moduleIndex,
    processId,
  });
  const detailProjectPath = replacePath(maintenanceDebtor.DETAIL_PROJECT, {
    id,
    module: moduleIndex,
    processId,
    projectId,
  });

  const ignorePath = [
    detailLimitAnakPath,
    detailInformasiLainnyaPath,
    detailProjectPath,
    editLimitAnakPath,
    editInformasiLainnyaPath,
    informasiLainnyaPath,
    inquiryLimitPath,
    inquiryAccountPath,
    limitIndukPath,
    limitAnakListPath,
    limitAnakPath,
  ];

  const { data: bucketStepperData } = useGetBucketStepper({
    bucketProcessId: params?.processId as string,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, undefined, {
    enabled: Boolean(params?.processId?.length),
  });

  const { data: dataDeltaStepper, isSuccess } = useGetDataDeltaStepper({
    bucketProcessId: params?.processId as string,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: Boolean(params?.processId?.length) && (isTL || isKadiv || isChecker),
  });

  const { steps, progress } = bucketStepperData;

  const findViewOnly = (stepperList, bucketStepper) => {
    const lastPath = getLastPath(pathname);
    const checkStepChildren = (stepperList) => {
      stepperList?.forEach((item) => {
        checkLastPathStepper(item);
      });
    };
    const checkLastPathStepper = (data) => {
      if (data?.urlPath === lastPath) {
        const viewOnly = !data?.enable;
        setViewOnly(viewOnly);
      }

      if (data?.childrenSteps && data?.childrenSteps?.length > 0) {
        checkStepChildren(data?.childrenSteps);
      }
    };
    checkStepChildren(stepperList);
  };

  useMemo(() => {
    if (Array.isArray(dataDeltaStepper) && dataDeltaStepper.length > 0 && isSuccess) {
      let keyArray = [];
      dataDeltaStepper.map((res) => {
        if (res && typeof res === 'object' && 'key' in res) {
          keyArray.push(res.key);
          if (res?.children && Array.isArray(res.children) && res.children.length > 0) {
            res.children.map((item) => {
              if (item && typeof item === 'object' && 'key' in item) {
                keyArray.push(item.key);
              }
            });
          }
        }
      });
      setListStepperRed(keyArray);
    }
  }, [isSuccess, dataDeltaStepper]);


  const formatMockStep = (stepperList) => {
    const newStepper = stepperList?.map((item, idx) => {
      return {
        id: item.key,
        label: item.label,
        subMenu: item.childrenSteps
          ? item.childrenSteps.map((child) => ({
            id: child.key,
            label: child.label,
            url: `/${item.key}/${child.urlPath}`,
          }))
          : [],
        url: item.childrenSteps ? undefined : `/${item.urlPath}`,
      };
    });
    setListStepper(newStepper);
  };


  useEffect(() => {
    // if (!initiateBreadCrumb?.some((item) => item?.url?.includes(path))) {
    findViewOnly(steps, bucketStepperData);
    formatMockStep(steps);
    dispatch({
      data: bucketStepperData,
      type: reducer.SET_STEPPER,
    });
  // }
  }, [pathname, bucketStepperData]);

  // Close all dropdowns when pathname changes
  useEffect(() => {
    setOpenDropdownId(null);
  }, [pathname]);


  const handleClickMenu = (menu) => {
    if (menu.url) {
      const destination = menu.url;
      const segments: string[] = pathname.split('/');
      const basePath: string = `${segments.slice(0, 5).join('/')}${destination}`;
      const newPath = replacePath(basePath, {});

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
    // If clicking the same dropdown, close it. Otherwise, open the new one and close others
    if (openDropdownId === dropdownId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(dropdownId);
    }
  };

  const renderMenu = !ignorePath.includes(pathname);

  return {
    handleClickMenu,
    handleDropdownToggle,
    listStepper,
    listStepperRed,
    openDropdownId,
    pathname,
    renderMenu,
    theme,
  };
};

export default useCustomNavMenu;
