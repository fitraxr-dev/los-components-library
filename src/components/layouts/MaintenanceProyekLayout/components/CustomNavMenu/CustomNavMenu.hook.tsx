import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { reducer } from '@/components/layouts/AppLayout/App.constants';

import { useGetProyekStepper } from '../../hooks/useGetStepper';
import { useMaintenanceProyekContext } from '../../MaintenanceProyek.context';


const useCustomNavMenu = () => {
  const { id } = useParams();
  const router = useCustomRouter();
  const theme = useTheme();
  const pathname = usePathname();
  const [app, dispatch] = useApp();
  const { setViewOnly } = useViewOnly();
  const [listStepper, setListStepper] = useState([]);
  const { formDirty } = useMaintenanceProyekContext();
  const isKadiv = app?.currentRole.includes('KADIV');
  const isTL = app?.currentRole.includes('TL');
  const isCreate = pathname?.includes('create');
  const convertId = Array.isArray(id) ? id[0] : id;
  const { formDirtyStates, getFormDirty } = useMaintenanceProyekContext();

  // Check if current URL contains PRJ
  const containsPRJ = convertId?.includes('PRJ') || pathname?.includes('PRJ');

  const getBucketProcessId = () => {
    if (convertId?.includes('MNTP')) {
      return convertId;
    }

    if (convertId?.includes('PRJ')) {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem('maintenance-proyek');
      }
    }

    return null;
  };

  const [bucketProcessId, setBucketProcessId] = useState(getBucketProcessId());

  // Update bucketProcessId ketika convertId berubah
  useEffect(() => {
    setBucketProcessId(getBucketProcessId());
  }, [convertId]);

  const { data: proyekStepper } = useGetProyekStepper({
    bucketProcessId: bucketProcessId ?? null,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_PROYEK,
  });

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

  const checkStepperRed = (keyStep) => {
    let isRed = false;
    if (isTL || isKadiv) {
      isRed = keyStep;
    }
    return isRed;
  };

  const formatMockStep = (stepperList) => {
    const newStepper = stepperList?.map((item, idx) => ({
      enable: isCreate ? (item.urlPath === 'project-information' ? true : false) : true,
      // Set hasUpdate to false if URL contains PRJ, otherwise use original value
      hasUpdate: containsPRJ ? false : item.hasUpdate,
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
    }));
    setListStepper(newStepper);
  };

  useEffect(() => {
    if (proyekStepper !== undefined) {
      findViewOnly(proyekStepper?.data?.content?.steps, proyekStepper);
      formatMockStep(proyekStepper?.data?.content?.steps);
      dispatch({
        data: proyekStepper?.data?.content,
        type: reducer.SET_STEPPER,
      });
    }

  }, [pathname, proyekStepper, containsPRJ]);

  const shouldShowConfirmation = (destination) => {
    const isFromProjectInformation = pathname.includes('project-information');
    const isFromInformasiLainnya = pathname.includes('informasi-lainnya');
    const isFromProjectOwner = pathname.includes('project-owner');
    const isFromContractor = pathname.includes('contractor');

    // Check if navigating TO any other page (including validasi, etc.)
    const isNavigatingToAnotherPage = destination && !pathname.includes(destination);

    let currentFormDirty = false;
    if (isFromProjectInformation) {
      currentFormDirty = getFormDirty('projectInformation');
    } else if (isFromInformasiLainnya) {
      currentFormDirty = getFormDirty('informasiLainnya');
    } else if (isFromProjectOwner) {
      currentFormDirty = getFormDirty('projectOwner');
    } else if (isFromContractor) {
      currentFormDirty = getFormDirty('contractor');
    }

    // Debug log
    // console.log('🔍 Confirmation check:', {
    //   isFromProjectInformation,
    //   isFromInformasiLainnya,
    //   isFromProjectOwner,
    //   isFromContractor,
    //   isNavigatingToAnotherPage,
    //   destination,
    //   currentPath: pathname,
    //   currentFormDirty,
    //   formDirtyType: typeof currentFormDirty,
    // });

    const isFormActuallyDirty = currentFormDirty === true;

    return (
      (isFromProjectInformation || isFromInformasiLainnya || isFromProjectOwner || isFromContractor) &&
      isNavigatingToAnotherPage &&
      isFormActuallyDirty
    );
  };

  const handleClickMenu = (menu) => {
    if (menu.url && menu.enable) {
      const destination = menu.url;
      const segments: string[] = pathname.split('/');
      const sliceIndex = segments[3].toLocaleLowerCase() === 'create' ? 4 : 5;
      const basePath: string = `${segments.slice(0, sliceIndex).join('/')}${destination}`;
      const newPath = replacePath(basePath, {});

      if (shouldShowConfirmation(destination)) {
        // Get current form dirty untuk log
        const isFromProjectInformation = pathname.includes('project-information');
        const isFromInformasiLainnya = pathname.includes('informasi-lainnya');
        const isFromProjectOwner = pathname.includes('project-owner');
        const isFromContractor = pathname.includes('contractor');

        let currentFormDirty = false;
        if (isFromProjectInformation) {
          currentFormDirty = getFormDirty('projectInformation');
        } else if (isFromInformasiLainnya) {
          currentFormDirty = getFormDirty('informasiLainnya');
        } else if (isFromProjectOwner) {
          currentFormDirty = getFormDirty('projectOwner');
        } else if (isFromContractor) {
          currentFormDirty = getFormDirty('contractor');
        }

        // console.log('✅ Showing confirmation modal for formDirty:', currentFormDirty);
        showNiceModalV2({
          cancelText: 'Tidak',
          onCancel: () => {
          },
          onSubmit: () => {
            router.push(newPath);
          },
          submitText: 'Ya',
          title: 'Apakah Anda yakin tidak save? Perubahan yang Anda buat tidak akan disimpan.',
          type: 'warning',
        });
      } else {
        const isFromProjectInformation = pathname.includes('project-information');
        const isFromInformasiLainnya = pathname.includes('informasi-lainnya');
        const isFromProjectOwner = pathname.includes('project-owner');
        const isFromContractor = pathname.includes('contractor');

        let currentFormDirty = false;
        if (isFromProjectInformation) {
          currentFormDirty = getFormDirty('projectInformation');
        } else if (isFromInformasiLainnya) {
          currentFormDirty = getFormDirty('informasiLainnya');
        } else if (isFromProjectOwner) {
          currentFormDirty = getFormDirty('projectOwner');
        } else if (isFromContractor) {
          currentFormDirty = getFormDirty('contractor');
        }

        // console.log('➡️ Navigating directly, no confirmation needed. formDirty:', currentFormDirty);
        // Navigasi langsung jika tidak perlu konfirmasi
        router.push(newPath);
      }
    }
  };

  return {
    checkStepperRed,
    handleClickMenu,
    listStepper,
    pathname,
    theme,
  };
};

export default useCustomNavMenu;
