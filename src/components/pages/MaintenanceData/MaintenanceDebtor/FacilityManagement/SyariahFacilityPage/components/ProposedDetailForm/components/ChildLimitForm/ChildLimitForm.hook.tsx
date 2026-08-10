import { useEffect, useState } from 'react';


import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor, accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatCurrencyID } from '@/helpers/formatCurrency';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';


import useDeleteChildLimitSyariah from '../../../../hooks/useDeleteChildLimitSyariah';
import useGetListChildLimit from '../../../../hooks/useGetListChildLimitSyariah';
import useProposedFacilityTab from '../../../ProposedFacilityTab/ProposedFacilityTab.hook';

import { childFormTableList } from './ChildLimitForm.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useChildLimitForm = () => {
  const [filter, setFilter] = useSessionStorage('filter-child-limit-form', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const pathArray = pathname.split('/');
  const moduleIndex = pathArray[3];
  const processIdIndex = pathArray[4];
  const facilityIdIndex = pathArray[7];
  const isDetail = pathArray[8]?.includes('detail');
  const queryClient = useQueryClient();
  const isHidden: boolean = processId?.includes('DEBT');
  const [{ stepper }] = useApp();
  const isViewOnly = !stepper.steps
    .flatMap((step) => [step, ...(step.childrenSteps ?? [])])
    .find((step) => step.urlPath === 'facility-syariah')?.enable;
  const { clearSessionStorage } = useProposedFacilityTab();
  const { recordActivity } = useRecordLog();
  const canAddNew = useCheckAccess(accessid.MAINTENANCE_DEBTOR_CREATE);
  const canEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const canDelete = useCheckAccess(accessid.MAINTENANCE_DEBTOR_DELETE);
  const { data: searchByOptions } = useGetParameterList('searchByFacilityUsulanSubmitList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByFacilityUsulanSubmitList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: orderTypeOptions } = useGetParameterList('orderType');
  const { data: mappingOrderTypeOptions } = useGetParameterList('mappingOrderType');
  const { data: coreMappingOptions } = useGetParameterList('financingSegment');
  const { data: productOptions } = useGetParameterList('productSyariah');

  const [currentSyariahFacilityId, setCurrentSyariahFacilityId] = useState(
    typeof window !== 'undefined' ? sessionStorage.getItem('currentSyariahFacilityId') : null
  );

  const effectiveParentFacilityId = facilityIdIndex === 'add'
    ? currentSyariahFacilityId
    : facilityIdIndex;


  const { data, isLoading, isFetching } = useGetListChildLimit({
    filter: {
      ...filter?.filter,
      ...(isHidden
        ? { debtorId: String(processId) }
        : { bucketProcessId: String(processId) }
      ),
      parentFacilityId: Number(effectiveParentFacilityId),
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const processList = data?.contents?.map((item, index) => {
    const numericValue = item.orderValue || 0;
    const currencyValue = item.currencyOrderValue || '';

    return {
      ...item,
      orderValue: `${currencyValue} ${formatCurrencyID(numericValue)}`,
    };
  });
  const processPage = data?.page;

  useEffect(() => {
    if (data && !isLoading) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'view child limit list page',
      });
    }
  }, [data, isLoading, processId, recordActivity]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = sessionStorage.getItem('currentSyariahFacilityId');
      if (storedId && storedId !== currentSyariahFacilityId) {
        setCurrentSyariahFacilityId(storedId);
      }
    }
  }, [isFetching, currentSyariahFacilityId]);

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions || [],
      type: 'sort',
    },
    {
      key: 'orderTypes',
      label: 'Order Type',
      options: orderTypeOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'mappingOrderTypes',
      label: 'Mapping Order Type',
      options: mappingOrderTypeOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'mappingFinancingSegments',
      label: 'Segmen Pembiayaan',
      options: coreMappingOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'products',
      label: 'Produk',
      options: productOptions || [],
      type: 'multiple-autocomplete',
    },
  ];

  const { mutate: deleteParentLimit, isPending: isDeleteLoading } = useDeleteChildLimitSyariah({
    onErrorr: (error) => {
      const errorMessage = error?.message;
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'delete child limit syariah',
      });
      queryClient.invalidateQueries({ queryKey: ['child-limit-syariah-list']});
    },
  });

  const handleDeleteModal = (row) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'open delete child limit confirmation modal',
    });
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteParentLimit({ childFinancingFacilityId: Number(row?.facilityId) });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data ini?',
      type: 'warning',
    });
  };

  const handleDetail = (row) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view detail child limit syariah',
    });
    if (typeof window !== 'undefined' && row?.facilityId) {
      sessionStorage.setItem('currentIdDetailFacility', row?.facilityId);
    }

    if (typeof window !== 'undefined') {
      if (facilityIdIndex === 'add') {
        sessionStorage.setItem('currentModeFromLimitInduk', 'add');
      } else if (isDetail) {
        sessionStorage.setItem('currentModeFromLimitInduk', 'detail');
      } else {
        sessionStorage.setItem('currentModeFromLimitInduk', 'edit');
      }
    }

    router.push(replacePath(maintenanceDebtor.DETAIL_FACILITY, {
      id: row?.facilityNo,
      module: moduleIndex,
      processId: processIdIndex,
    }) + '?from=limitInduk&menu=child-limit');
  };

  const handleEdit = (row) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'navigate to edit child limit syariah',
    });
    if (typeof window !== 'undefined' && row?.facilityId) {
      sessionStorage.setItem('currentIdDetailFacility', row?.facilityId);
    }
    if (typeof window !== 'undefined') {
      if (facilityIdIndex === 'add') {
        sessionStorage.setItem('currentModeFromLimitInduk', 'add');
      } else if (isDetail) {
        sessionStorage.setItem('currentModeFromLimitInduk', 'detail');
      } else {
        sessionStorage.setItem('currentModeFromLimitInduk', 'edit');
      }
    }
    router.push(replacePath(maintenanceDebtor.EDIT_FACILITY, {
      id: row?.facilityNo,
      module: moduleIndex,
      processId: processIdIndex,
    }) + '?from=limitInduk&menu=child-limit');
  };

  const handleCancel = () => {
    clearSessionStorage();
    router.push(replacePath(maintenanceDebtor.FACILITY_SYARIAH_PAGE, { module: moduleIndex, processId: processId }));
  };


  const tableHeader: TableHeader[] = [
    ...childFormTableList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => handleDetail(row),
        },
        // {
        //   iconName: 'edit',
        //   isHidden: isHidden || isDetail,
        //   onClick: (row) => handleEdit(row),
        // },
        {
          iconName: 'delete',
          isDisabled: isViewOnly || !canDelete,
          isHidden: isHidden || isDetail,
          onClick: (row) => handleDeleteModal(row),
        }
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
  ];

  const hanldeOpenAddModal = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'open add child limit modal',
    });
    NiceModal.show(MODAL.MAINTENANCE_DATA.ADD_ADD_CHILD_LIMIT);
  };

  const anomalyRow = (val: any) => {
    if (val.hasDelta === true)
      return { bgcolor: 'rgba(235, 87, 87, 0.2)' };
  };

  return {
    anomalyRow,
    canAddNew,
    canDelete,
    canEdit,
    filter,
    filterContentList,
    filterDropdownList,
    handleCancel,
    hanldeOpenAddModal,
    hasData: (data?.contents?.length || 0) > 0,
    isDeleteLoading,
    isDetail,
    isHidden,
    isLoading,
    isViewOnly,
    page,
    pageSize,
    processList,
    processPage,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useChildLimitForm;
