import { useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { mip } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useViewOnly from '@/hooks/useViewOnly';

import Icon from '@/components/shared/Icon';

import { tab, tableHeaderList } from './ExecutiveSummary.constant';
import useDeleteFulfillment from './hooks/useDeleteFulfillment';
import useGetExecutiveSummaryById from './hooks/useGetExecutiveSummaryById';
import useGetFinancialEconomy from './hooks/useGetFinancialEconomy';
import useGetFullfillmentList from './hooks/useGetFullfillmentList';
import useSaveExecutiveSummary from './hooks/useSaveExecutiveSummary';
import useSaveFinancialEconomy from './hooks/useSaveFinancialEconomy';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useExecutiveOverview = () => {
  const [state] = useApp();
  const { processId } = useParams();
  const router = useCustomRouter();
  const goToNextStep = useGoToNextStep();
  const { viewOnly } = useViewOnly();

  const [activeTab, setActiveTab] = useState(tab.FULLFILLMENT);
  const [containerFullfillment, setContainerFullfillment] = useState(undefined);
  const [containerIndicator, setContainerIndicator] = useState(undefined);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [shouldGoNext, setShouldGoNext] = useState(false);


  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };
  const {
    data: executiveSummaryDetail,
    isFetching: isFetchLoading,
  } = useGetExecutiveSummaryById({
    bucketProcessId: processId as string,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const {
    data: financialEconomyDetail,
    isFetching: isFetchFinancialLoading,
  } = useGetFinancialEconomy({
    bucketProcessId: processId as string,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { isPending: isSaveLoading, mutate: saveExecutiveSummary } = useSaveExecutiveSummary({
    onSuccess: () => {
      showNiceModalV2({ type: 'success' });
      shouldGoNext ? goToNextStep() : null;
    },
  });

  const { isPending: isSaveFinancialLoading, mutate: saveFinancialEconomy } = useSaveFinancialEconomy({
    onSuccess: () => {
      showNiceModalV2({ onClose: () => {goToNextStep();}, type: 'success' });
    },
  });


  const { isPending: isDeleteLoading, mutate: deleteFulfillment } = useDeleteFulfillment({
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' });
    },
  });

  const { data: dataList, isPending: isFecthListLoading } = useGetFullfillmentList({
    filter: {
      bucketProcessId: processId as string,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: page,
    },
  });


  const tableHeader: Array<TableHeader> = [
    ...tableHeaderList,
    {
      key: 'category_one',
      label: '1*',
      render: (val) => { return (
        <>
          {val.category.includes('1') ? <Icon iconName="check" /> : ''}
        </>
      );},
      sx: {
        minWidth: '4vw',
      },
    },
    {
      key: 'category_two',
      label: '2*',
      render: (val) => { return (
        <>
          {val.category.includes('2') ? <Icon iconName="check" /> : ''}
        </>
      );},
      sx: {
        minWidth: '4vw',
      },
    },
    {
      key: 'category_three',
      label: '3*',
      render: (val) => { return (
        <>
          {val.category.includes('3') ? <Icon iconName="check" /> : ''}
        </>
      );},
      sx: {
        minWidth: '4vw',
      },
    },
    {
      key: 'fulfillment',
      label: 'Pemenuhan (YA/TBO)',
      sx: {
        minWidth: '4vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: () => {
        return [
          {
            iconName: 'edit',
            onClick: (row) => {
              router.push(
                replacePath(
                  mip.EXECUTIVE_OVERVIEW_EDIT_FULLFILLMENT_PAGE,
                  {
                    id: row.id,
                    processId: row.bucketProcessId,
                  }
                ));
            },
          },
          {
            iconName: 'delete',
            onClick: (row) => {
              handleDelete(row?.id);
            },
          }
        ];
      },
      type: 'action',
    },
  ];

  const handleSave = async () => {

    if (viewOnly) {
      goToNextStep();
    } else {
      if (activeTab === tab.FULLFILLMENT) {
        const description = await convertToDocx(containerFullfillment);
        saveExecutiveSummary({
          bucketProcessId: processId as string,
          description: description,
          financingType: 'MUNICIPAL_FINANCING',
          id: undefined,
          module: state.pages.mipModule,
          process: state.pages.mipProcess,
        });
        handleChangeTab(tab.INDICATOR);
      } else {
        const description = await convertToDocx(containerIndicator);
        saveFinancialEconomy({
          bucketProcessId: processId as string,
          description: description,
          id: undefined,
          module: state.pages.mipModule,
          process: state.pages.mipProcess,
        });
      }

    }
  };

  const handleDelete = (id) => {
    showNiceModalV2(
      {
        onSubmit: () => {
          deleteFulfillment({
            id: id,
          });
        },
        submitText: 'Ya',
        title: 'Apakah Anda yakin ingin menghapus data?',
        type: 'warning',
      }); };

  const autoSavePayload = useMemo(() => async () => {

    // tab Fullfillment
    if (activeTab === tab.FULLFILLMENT) {
      if (!containerFullfillment) return null;
      const description = await convertToDocx(containerFullfillment);
      return {
        bucketProcessId: processId as string,
        description: description,
        financingType: 'MUNICIPAL_FINANCING',
        id: undefined,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      };
    }

    // tab Indicator
    if (activeTab === tab.INDICATOR) {
      if (!containerIndicator) return null;
      const description = await convertToDocx(containerIndicator);
      return {
        bucketProcessId: processId as string,
        description: description,
        id: undefined,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      };
    }

    return null;
  }, [activeTab,
    containerFullfillment,
    containerIndicator,
    processId,
    state.pages.mipModule,
    state.pages.mipProcess]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && (
      (activeTab === tab.FULLFILLMENT && !!executiveSummaryDetail) ||
      (activeTab === tab.INDICATOR && !!financialEconomyDetail)
    ),
    payload: autoSavePayload,
    url: activeTab === tab.FULLFILLMENT ? 'mip.exce.saveSum' : 'mip.exce.saveEco',
  });


  return {
    activeTab,
    containerFullfillment,
    containerIndicator,
    dataList,
    executiveSummaryDetail,
    financialEconomyDetail,
    handleChangeTab,
    handleSave,
    isAutoSaveFetching,
    isFecthListLoading,
    isFetchFinancialLoading,
    isFetchLoading,
    isSaveLoading,
    itemPerPage,
    page,
    setContainerFullfillment,
    setContainerIndicator,
    setItemPerPage,
    setPage,
    setShouldGoNext,
    tableHeader,
  };
};

export default useExecutiveOverview;
