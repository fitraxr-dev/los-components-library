import { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import {
  maintenanceDebtor,
  maintenanceGroup,
  maintenanceModal,
  maintenanceSuratHutang,
} from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const useMaintenanceData = () => {
  const router = useCustomRouter();
  const path = usePathname();

  const ignorePath = [
    maintenanceDebtor.LIST_PAGE,
    maintenanceSuratHutang.LIST_PAGE,
    maintenanceModal.MAIN_PAGE,
    maintenanceGroup.LIST_PAGE,
  ];

  const isMaster = path.split('/').includes('master');
  const pathArray = path.split('/');
  const maintenanceIndex = pathArray[2];
  const moduleIndex = pathArray[3];
  const processIdIndex = pathArray[4];
  const idIndex = pathArray[6];
  const idFacilitySyariah = pathArray[7];
  const idForm = getLastPath(path);
  const params = useSearchParams();
  const isMaintenanceDebtor = !params.get('isPreviousPage') && path !== maintenanceDebtor.LIST_PAGE;
  const { redirectToFromPage } = useNavigationFromPage();

  const additionalIgnorePath = [
    ...ignorePath,
    replacePath(maintenanceDebtor.PROJECT_DETAIL_PAGE, {
      debtorId: processIdIndex,
      module: moduleIndex,
      projectId: idIndex,
    }),
    replacePath(maintenanceDebtor.DETAIL_GROUP_MEMBER_PAGE, {
      debtorId: processIdIndex,
      id: idIndex,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_MANAGEMENT_ADD, {
      debtorId: processIdIndex,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_MANAGEMENT_DETAIL, {
      debtorId: processIdIndex,
      id: idForm,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_MANAGEMENT_EDIT, {
      debtorId: processIdIndex,
      id: idForm,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_SHAREHOLDER_ADD, {
      debtorId: processIdIndex,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_SHAREHOLDER_DETAIL, {
      debtorId: processIdIndex,
      id: idForm,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_SHAREHOLDER_EDIT, {
      debtorId: processIdIndex,
      id: idForm,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_OTHER_RELATED_ADD, {
      debtorId: processIdIndex,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_OTHER_RELATED_DETAIL, {
      debtorId: processIdIndex,
      id: idForm,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_OTHER_RELATED_EDIT, {
      debtorId: processIdIndex,
      id: idForm,
      module: moduleIndex,
    }),

    replacePath(maintenanceDebtor.DETAIL_GROUP_INFORMATION_MEMBER_PAGE, {
      debtorId: processIdIndex,
      groupId: idIndex,
      memberId: idForm,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.DETAIL_GROUP_INFORMATION_PAGE, {
      debtorId: processIdIndex,
      groupId: idForm,
      module: moduleIndex,
    }),

    replacePath(maintenanceDebtor.CUSTOMER_INFORMATION_BMPP_MONITORING, {
      calculationId: idForm,
      module: moduleIndex,
      processId: processIdIndex,
    }),
    replacePath(maintenanceDebtor.DETAIL_GROUP_INFORMATION_BMPK_PAGE, {
      calculationId: idForm,
      debtorId: processIdIndex,
      groupId: idIndex,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.DETAIL_LPA_PAGE, {
      debtorId: processIdIndex,
      lpaId: idIndex,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.DETAIL_LPA_AGUNAN_PAGE, {
      agunanId: idForm,
      debtorId: processIdIndex,
      lpaId: idIndex,
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.CONVENTIONAL_FACILITY_OTHER_INFORMATION_PAGE, {
      debtorId: processIdIndex,
      id: pathArray[7],
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.CONVENTIONAL_FACILITY_INFORMATION_FACILITY_PAGE, {
      debtorId: processIdIndex,
      id: pathArray[7],
      module: moduleIndex,
    }),
    replacePath(maintenanceDebtor.EDIT_FASILITAS_PEMBIAYAAN, {
      id: idForm,
      module: moduleIndex,
      processId: processIdIndex,
    }),
    replacePath(maintenanceDebtor.DETAIL_PERIKATAN_PEMBIYAAN, {
      id: idIndex,
      module: moduleIndex,
      processId: processIdIndex,
    }),
    replacePath(maintenanceDebtor.ADD_FACILITY_SYARIAH, {
      module: moduleIndex,
      processId: processIdIndex,
    }),
    replacePath(maintenanceDebtor.DETAIL_LIMIT_INDUK, {
      id: idFacilitySyariah,
      module: moduleIndex,
      processId: processIdIndex,
    }),
    replacePath(maintenanceDebtor.DETAIL_FACILITY, {
      id: idFacilitySyariah,
      module: moduleIndex,
      processId: processIdIndex,
    }),
    replacePath(maintenanceDebtor.EDIT_LIMIT_INDUK, {
      id: idFacilitySyariah,
      module: moduleIndex,
      processId: processIdIndex,
    }),
    replacePath(maintenanceDebtor.EDIT_FACILITY, {
      id: idFacilitySyariah,
      module: moduleIndex,
      processId: processIdIndex,
    }),
  ];

  const pathUseBackButton = [
    replacePath(maintenanceDebtor.EDIT_FASILITAS_PEMBIAYAAN, {
      id: idForm,
      module: moduleIndex,
      processId: processIdIndex,
    }),
  ];


  const isDetailPage = ignorePath.includes(path);
  const renderDetailLayout = additionalIgnorePath.includes(path);

  const handleBack = (inDetailPage: boolean = false) => {
    if (redirectToFromPage()) return;
    const isPreviousPage = params.get('isPreviousPage');
    const routeMap: { [key: string]: string } = {
      'maintenance-debtor': maintenanceDebtor.LIST_PAGE,
      'maintenance-group': maintenanceGroup.LIST_PAGE,
      'maintenance-modal': maintenanceModal.MAIN_PAGE,
      'surat-hutang': maintenanceSuratHutang.LIST_PAGE,
    };

    const route = routeMap[maintenanceIndex];

    if (route && !isPreviousPage && !inDetailPage) {
      router.push(route);
    } else {
      router.back();
    }
  };

  return {
    additionalIgnorePath,
    handleBack,
    isDetailPage,
    isMaintenanceDebtor,
    isMaster,
    path,
    pathUseBackButton,
    renderDetailLayout,
    router,
  };
};

export default useMaintenanceData;
