import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { ONE_MINUTE } from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDebtorGroupProposalList from '@/hooks/services/useGetDebtorGroupProposalList';
import useGetDebtorProposalList from '@/hooks/services/useGetDebtorProposalList';
import useGetDebtSecuritiesDebtorList from '@/hooks/services/useGetDebtSecuritiesDebtorList';
import useGetDebtSecuritiesGroupExcludeDebtorList from '@/hooks/services/useGetDebtSecuritiesGroupExcludeDebtorList';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useIdentity from '@/hooks/useIdentity';

import {
  modal,
  tab,
  tabItems,
  tableHeaderDebtorProposedFacilitiesList,
  tableHeaderGroupProposedFacilitiesList,
  tableHeaderGroupProposedFacilitiesListMip,
} from './Detail.constants';
import useDeleteProposalPlanMaster from './hooks/useDeleteProposalPlanMaster';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDetailPage = () => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('calculation');
  const debtorIdFromParams = String(params.debtorId);
  const queryClient = useQueryClient();
  const { processId } = useIdentity();
  const isMipBmpp = processId ? true : false;

  const { data: detailMasterDebtor } = useGetDetailMasterDebtor({
    debtorId: debtorIdFromParams,
  });

  const isPemda = detailMasterDebtor?.isRegionalGovern;

  const tabsItemPemda = tabItems.filter((item) => item.value !== tab.SUMMARY && item.value !== tab.DEBT_SECURITIES);
  const tabs = isPemda ? tabsItemPemda : tabItems;

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  const {
    data: debtSecuritiesData,
    isLoading: isDebtSecuritiesLoading,
    isSuccess: isDebtSecuritiesSuccess,
  } = useGetDebtSecuritiesDebtorList({
    debtorId: debtorIdFromParams,
  }, {
    enabled: activeTab === tab.DEBT_SECURITIES,
    staleTime: ONE_MINUTE,
  });

  const {
    data: debtSecuritiesGroupData,
    isLoading: isDebtSecuritiesGroupLoading,
    isSuccess: isDebtSecuritiesGroupSuccess,
  } = useGetDebtSecuritiesGroupExcludeDebtorList({
    debtorId: debtorIdFromParams,
  }, {
    enabled: activeTab === tab.DEBT_SECURITIES,
    staleTime: ONE_MINUTE,
  });

  const tableDebtSecuritiesList = debtSecuritiesData?.map((data) => ({
    bonds: data.bonds ?? '-',
    currency: data.currExchangeRate ? data.currExchangeRate : '-',
    faceValue: data.faceValue ? data.faceValue : '-',
    faceValueIdr: data.faceValueInIdr ? data.faceValueInIdr : '-',
    issuer: data.issuer ?? '-',
    maturityDate: data.maturityDate ? formatDate(new Date(data.maturityDate)) : '-',
    sequence: data.seq ?? '-',
  }));

  const tableDebtGroupList = debtSecuritiesGroupData;

  // Start TabExistingFacilities
  const {
    data: debtorDataExisting,
    isLoading: isDebtorExistingFacilitiesLoading,
    isSuccess: isDebtorExistingFacilitiesSuccess,
  } = useGetDebtorProposalList({
    bucketProcessId: debtorIdFromParams,
    debtorId: debtorIdFromParams,
    excludeDebtor: true,
    feature: TypeModule.BMPP,
    isExisting: true,
    module: TypeModule.BMPP,
    process: TypeProcess.BMPP,
  });

  const tableDataDebtorExisting = debtorDataExisting?.map((item) => ({
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
    bucketProcessId: debtorIdFromParams,
    debtorId: debtorIdFromParams,
    excludeDebtor: true,
    feature: TypeModule.BMPP,
    isExisting: false,
    module: TypeModule.BMPP,
    process: TypeProcess.BMPP,
  });

  const tableDataDebtorProposed = debtorDataProposed?.map((item) => ({
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
    bucketProcessId: debtorIdFromParams,
    debtorId: debtorIdFromParams,
    excludeDebtor: true,
    feature: TypeModule.BMPP,
    isExisting: false,
    module: TypeModule.BMPP,
    process: TypeProcess.BMPP,
  });

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
        await queryClient.invalidateQueries({ queryKey: ['proposed-debtor-financing-facility']});
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
      debtorId: debtorIdFromParams, groupId: _groupId, handleChangeTab, isDebtor: isDebtor });
  };

  const handleOpenEditModal = (data, isDebtor: boolean) => {
    NiceModal.show(modal.facilityProposalPlan, {
      debtorId: debtorIdFromParams,
      handleChangeTab,
      id: data.id,
      isDebtor: isDebtor,
      nominalInIdr: data.nominal ? data.nominal.replaceAll(',', '').replaceAll('.00', '') : '0',
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
    {
      key: 'action',
      label: 'Action',
      options: (row) => row.source === 'PLAN' ? [
        {
          iconName: 'edit',
          onClick: (row) => handleOpenEditModal(row, true),
        },
        {
          iconName: 'delete',
          onClick: (row) => handleDeleteProposal(row),
        }
      ] : [],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    }
  ];

  const tableHeaderGroupProposed: TableHeader[] = [
    ...(isMipBmpp ? tableHeaderGroupProposedFacilitiesListMip : tableHeaderGroupProposedFacilitiesList),
    {
      key: 'action',
      label: 'Action',
      options: (row) => row.source === 'PLAN' ? [
        {
          iconName: 'edit',
          onClick: (row) => {
            NiceModal.show(modal.facilityProposalPlan, {
              debtorId: debtorIdFromParams,
              groupId: row.groupId ?? null,
              handleChangeTab,
              id: row.id,
              nominalInIdr: row.total ? row.total.replaceAll(',', '').replaceAll('.00', '') : '0',
            });
          },
        },
        {
          iconName: 'delete',
          onClick: (row) => handleDeleteProposal(row),
        }
      ] : [],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    }
  ];
  // End TabProposedFacilities

  return {
    activeTab,
    debtorIdFromParams,
    detailMasterDebtor,
    handleChangeTab,
    isMipBmpp,
    isPemda,
    tabDebtSecurities: {
      isDebtorLoading: isDebtSecuritiesLoading,
      isDebtorSuccess: isDebtSecuritiesSuccess,
      isGroupLoading: isDebtSecuritiesGroupLoading,
      isGroupSuccess: isDebtSecuritiesGroupSuccess,
      tableDataDebtor: tableDebtSecuritiesList,
      tableDataGroup: tableDebtGroupList,
    },
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
  };
};

export default useDetailPage;
