import { useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailBucketDebtor from '@/hooks/services/bucket/debtor/useGetDetailBucketDebtor';
import useGetDebtorGroupProposalList from '@/hooks/services/bucket/financing-facility/useGetDebtorGroupProposalList';
import useGetDebtorProposalList from '@/hooks/services/bucket/financing-facility/useGetDebtorProposalList';
import useGetDebtorMaster from '@/hooks/services/master/maintenance-customer/useGetDebtorMaster';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import {
  modal,
  tab,
  tabItems,
  tableHeaderDebtorProposedFacilitiesList,
  tableHeaderGroupProposedFacilitiesListMip,
} from './BmppCalculation.constants';
import useDeleteProposalPlanMaster from './hooks/useDeleteProposalPlanMaster';
import useGetParamByKey from './hooks/useGetParamByKey';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useBmppCalculation = () => {
  const params = useParams();
  const [state] = useApp();
  const { processId } = useIdentity();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('calculation');
  const _module = state.pages.mipModule;
  const process = state.pages.mipProcess;
  const debtorIdFromParams = String(params.debtorId);
  const isIndividual = false;
  const { recordActivity } = useRecordLog();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: _module,
    process,
  }, { enabled: !!processId && !!_module && !!process });

  const debtorId = debtorInfoData?.debtorId;

  const { data: detailMasterDebtor } = useGetDebtorMaster({
    bucketProcessId: processId,
    debtorId: debtorId,
    module: _module,
    process: process,
  }, { enabled: !!processId && !!debtorId && !!_module && !!process });

  const { data: institutionTypeDropdownList } = useGetParameterList('institutionType', { isPemda: 'value3', label: 'value1', value: 'key' });

  const {
    data: paramByKeyData,
    isLoading: isParamByKeyLoading,
    isError: isParamByKeyError,
  } = useGetParamByKey();

  const isPemda = institutionTypeDropdownList
    ?.find((dt) => dt.value === detailMasterDebtor?.institutionType)
    ?.isPemda === 'PEMDA';
  const tabsItemPemdaGroup = tabItems.filter((item) => item.value !== tab.SUMMARY);
  const tabs = isPemda ? tabsItemPemdaGroup : tabItems;

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const bucketMasterId = debtorInfoData?.bucketMasterId;
  const stepperStatus = stepperData?.from;
  const stepperSteps = stepperData?.steps;

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  // Start TabExistingFacilities
  const {
    data: debtorDataExisting,
    isLoading: isDebtorExistingFacilitiesLoading,
    isSuccess: isDebtorExistingFacilitiesSuccess,
  } = useGetDebtorProposalList({
    bucketProcessId: processId,
    debtorId: debtorId,
    excludeDebtor: true,
    feature: _module,
    isExisting: false,
    module: _module,
    process: process,
  }, { enabled: !!processId && !!debtorId && !!_module && !!process });

  const tableDataDebtorExisting = debtorDataExisting?.constents?.map((item) => ({
    ...item,
    division: item.divison ?? '-',
    facilityId: item.facilityId,
    governmentMandate: item.governmentMandateLabel ?? '-',
    nominalInIdr: item.orderValueAfterExchangeRate ?? '',
    orderType: item.orderTypeLabel ?? '-',
    plafondExisting: item.outstanding,
    product: item.productLabel ?? '-',
    project: item.project?.name ?? '-',
    timePeriod: item.timePeriod ?? '-',
  }));

  // End TabExistingFacilities

  // Start TabProposedFacilities
  const {
    data: debtorDataProposed,
    isFetching: isDebtorProposedFacilitiesLoading,
    isSuccess: isDebtorProposedFacilitiesSuccess,
  } = useGetDebtorProposalList({
    bucketProcessId: processId,
    debtorId: debtorId,
    excludeDebtor: true,
    feature: _module,
    isExisting: false,
    module: _module,
    process: process,
  }, { enabled: !!processId && !!debtorId && !!_module && !!process });

  const tableDataDebtorProposed = debtorDataProposed?.constents?.map((item) => ({
    ...item,
    division: item.divison ?? '-',
    facilityId: item.facilityId,
    governmentMandate: item.governmentMandateLabel ?? '-',
    nominalInIdr: item.orderValueAfterExchangeRate ?? '',
    orderType: item.orderTypeLabel ?? '-',
    plafondExisting: item.outstanding,
    product: item.productLabel ?? '-',
    project: item.project?.name ?? '-',
    timePeriod: item.timePeriod ?? '-',
  }));

  const hasEditableDebtor = Boolean(tableDataDebtorProposed?.find((item) => item.isEditable === true));

  const {
    data: groupDataProposed,
    isLoading: isGroupProposedExistingLoading,
  } = useGetDebtorGroupProposalList({
    bucketProcessId: processId,
    debtorId: debtorId,
    excludeDebtor: true,
    feature: _module,
    isExisting: false,
    module: _module,
    process: process,
  }, { enabled: !!processId && !!debtorId && !!_module && !!process });

  const tableDataGroupProposed = groupDataProposed;

  const { mutate: deleteProposal, isPending: isDeleteLoading } = useDeleteProposalPlanMaster({
    onErrorr: () => {
      showNiceModalV2({
        title: 'Data gagal dihapus',
        type: 'error',
      });
    },
    onSuccess: async (variables) => {

      if (variables.groupId) {
        await queryClient.invalidateQueries({ queryKey: ['proposed-group-financing-facility']});
      } else {
        await queryClient.invalidateQueries({ queryKey: ['proposed-debtor-financing-facility', {
          debtorId: debtorIdFromParams,
          groupId: variables?.groupId,
          ownership: 'DEBTOR',
        }]});
      }

      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleOpenAddNewModal = (currentGroupId?: string) => {
    const isDebtor = !!currentGroupId?.includes('DEBT');
    const _groupId = currentGroupId;
    NiceModal.show(modal.facilityProposalPlan, {
      debtorId: debtorId,
      groupId: _groupId,
      handleChangeTab,
      isDebtor: isDebtor,
    });
  };

  const handleOpenEditModal = (data, isDebtor: boolean) => {
    NiceModal.show(modal.facilityProposalPlan, {
      debtorId: debtorId,
      handleChangeTab,
      id: data.id,
      isDebtor: isDebtor,
      nominalInIdr: data.nominalInIdr ? data.nominalInIdr.replaceAll(',', '').replaceAll('.00', '') : '0',
    });
  };

  const handleDeleteProposal = (row) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteProposal({ id: row?.id });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data??',
      type: 'warning',
    });
  };

  const tableHeaderDebtorProposed: TableHeader[] = [
    ...tableHeaderDebtorProposedFacilitiesList,
    // {
    //   key: 'action',
    //   label: 'Action',
    //   options: (row) => row.source === 'PLAN' ? [
    //     {
    //       iconName: 'edit',
    //       onClick: (row) => handleOpenEditModal(row, true),
    //     },
    //     {
    //       iconName: 'delete',
    //       onClick: (row) => handleDeleteProposal(row),
    //     }
    //   ] : [],
    //   sx: {
    //     minWidth: '6vw',
    //   },
    //   type: 'action',
    // }
  ];

  const tableHeaderGroupProposed: TableHeader[] = [
    ...tableHeaderGroupProposedFacilitiesListMip,
    // {
    //   key: 'action',
    //   label: 'Action',
    //   options: (row) => row.source === 'PLAN' ? [
    //     {
    //       iconName: 'edit',
    //       onClick: (row) => {
    //         NiceModal.show(modal.facilityProposalPlan, {
    //           debtorId: debtorIdFromParams,
    //           groupId: row.groupId ?? null,
    //           handleChangeTab,
    //           id: row.id,
    //           nominalInIdr: row.total ? row.total.replaceAll(',', '').replaceAll('.00', '') : '0',
    //         });
    //       },
    //     },
    //     {
    //       iconName: 'delete',
    //       onClick: (row) => handleDeleteProposal(row),
    //     }
    //   ] : [],
    //   sx: {
    //     minWidth: '6vw',
    //   },
    //   type: 'action',
    // }
  ];
  // End TabProposedFacilities


  return useMemo(() => ({
    activeTab,
    bucketMasterId,
    debtorId,
    detailMasterDebtor,
    handleChangeTab,
    isIndividual,
    isParamByKeyError,
    isParamByKeyLoading,
    isPemda,
    module: _module,
    paramByKeyData,
    process,
    processId,
    stepperStatus,
    stepperSteps,
    tabExistingFacilities: {
      isDebtorLoading: isDebtorExistingFacilitiesLoading,
      isSuccess: isDebtorExistingFacilitiesSuccess,
      tableDataDebtor: tableDataDebtorExisting,
    },
    tabProposedFacilities: {
      handleOpenAddNewModal,
      hasEditableDebtor,
      isDebtorLoading: isDebtorProposedFacilitiesLoading,
      isGroupLoading: isGroupProposedExistingLoading || isDeleteLoading,
      isSuccess: isDebtorProposedFacilitiesSuccess,
      tableDataDebtor: tableDataDebtorProposed,
      tableDataGroup: tableDataGroupProposed,
      tableHeaderDebtor: tableHeaderDebtorProposed,
      tableHeaderGroup: tableHeaderGroupProposed,
    },
    tabs,
  }), [
    activeTab,
    bucketMasterId,
    debtorId,
    processId,
    detailMasterDebtor,
    handleChangeTab,
    isIndividual,
    isParamByKeyError,
    isParamByKeyLoading,
    isPemda,
    _module,
    paramByKeyData,
    process,
    stepperStatus,
    stepperSteps,
    isDebtorExistingFacilitiesLoading,
    isDebtorExistingFacilitiesSuccess,
    tableDataDebtorExisting,
    handleOpenAddNewModal,
    hasEditableDebtor,
    isDebtorProposedFacilitiesLoading,
    isGroupProposedExistingLoading,
    isDeleteLoading,
    isDebtorProposedFacilitiesSuccess,
    tableDataDebtorProposed,
    tableDataGroupProposed,
    tableHeaderDebtorProposed,
    tableHeaderGroupProposed,
    tabs,
  ]);

};

export default useBmppCalculation;
