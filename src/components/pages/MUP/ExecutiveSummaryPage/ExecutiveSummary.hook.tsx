import { useContext, useState } from 'react';

import { useParams } from 'next/navigation';

import { mup } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
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
  const { processId } = useParams();
  const router = useCustomRouter();
  const goToNextStep = useGoToNextStep();
  const { viewOnly } = useViewOnly();
  const { setDirtyMsg } = useContext(DirtyContext);

  const [activeTab, setActiveTab] = useState(tab.FULLFILLMENT);
  const [containerFullfillment, setContainerFullfillment] = useState(undefined);
  const [containerIndicator, setContainerIndicator] = useState(undefined);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);


  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };
  const {
    data: executiveSummaryDetail,
    isFetching: isFetchLoading,
  } = useGetExecutiveSummaryById({
    bucketProcessId: processId as string,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const {
    data: financialEconomyDetail,
    isFetching: isFetchFinancialLoading,
  } = useGetFinancialEconomy({
    bucketProcessId: processId as string,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const { isPending: isSaveLoading, mutate: saveExecutiveSummary } = useSaveExecutiveSummary({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  const { isPending: isSaveFinancialLoading, mutate: saveFinancialEconomy } = useSaveFinancialEconomy({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose: () => {goToNextStep();},
        type: 'success',
      });
    },
  });


  const { isPending: isDeleteLoading, mutate: deleteFulfillment } = useDeleteFulfillment({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' });
    },
  });

  const { data: dataList, isPending: isFecthListLoading } = useGetFullfillmentList({
    filter: {
      bucketProcessId: processId as string,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
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
                  mup.EXECUTIVE_OVERVIEW_EDIT_FULLFILLMENT_PAGE,
                  {
                    id: row.id,
                    processId: row.bucketProcessId,
                  }
                ));
            },
          },
          {
            iconName: 'delete',
            isDisabled: isDeleteLoading,
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
          module: TypeModule.MUP,
          process: TypeProcess.MUP,
        });
        handleChangeTab(tab.INDICATOR);
      } else {
        const description = await convertToDocx(containerIndicator);
        saveFinancialEconomy({
          bucketProcessId: processId as string,
          description: description,
          id: undefined,
          module: TypeModule.MUP,
          process: TypeProcess.MUP,
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
      });

  };
  return {
    activeTab,
    containerFullfillment,
    containerIndicator,
    dataList,
    executiveSummaryDetail,
    financialEconomyDetail,
    handleChangeTab,
    handleSave,
    isFecthListLoading,
    isFetchFinancialLoading,
    isFetchLoading,
    isSaveFinancialLoading,
    isSaveLoading,
    itemPerPage,
    page,
    setContainerFullfillment,
    setContainerIndicator,
    setItemPerPage,
    setPage,
    tableHeader,
  };
};

export default useExecutiveOverview;
