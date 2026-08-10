import { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';

import { TypeModule } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';


import useGetBmppDetail from '../TabBmppCalculation/hooks/useGetBmppDetail';
import useGetBmppDetailMaster from '../TabBmppCalculation/hooks/useGetBmppDetailMaster';

import useGetBmppSummaryList from './hooks/useGetBmppSummaryList';
import useGetBmppSummaryListMaster from './hooks/useGetBmppSummaryListMaster';
import useGetBmppSummaryRemark from './hooks/useGetBmppSummaryRemark';
import useSaveBmppSummaryRemark from './hooks/useSaveBmppSummaryRemark';

import type { TabSummaryProps } from './TabSummary.types';
import type {
  BmppDetailResponseDto,
  GenericBucketResponseDtoBmppSummaryResponseDto,
} from '@/services/openapi/master-service';


const useTabSummary = (props: TabSummaryProps) => {
  const { handleNext, module, process, processId, viewOnly = false, standaloneBmppSimulation } = props;
  const [remark, setRemark] = useState('');
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const isMipModule = module === TypeModule.MIP || TypeModule.MIP_REVIEW ? true : false;

  const { data } = useGetBmppDetail({
    bucketProcessId: processId,
    module,
    process,
  }, isMipModule);

  const { data: bmppDetailDataMaster } = useGetBmppDetailMaster({
    bucketProcessId: processId,
    module,
    process,
  }, !isMipModule);

  const bmppDetailData: BmppDetailResponseDto = isMipModule ? data : bmppDetailDataMaster;

  const { data: bmppSummaryListDataMip, isLoading } = useGetBmppSummaryList({
    filter: {
      bucketProcessId: processId,
      module,
      process,
    },
    page: {
      itemPerPage,
      noPage,
    },
  }, isMipModule);

  const { data: bmppSummaryListDataMaster, isLoading: isLoadingList } = useGetBmppSummaryListMaster({
    filter: {
      bucketProcessId: processId,
      module,
      process,
    },
    page: {
      itemPerPage,
      noPage,
    },
  }, !isMipModule);

  // eslint-disable-next-line max-len
  const bmppSummaryListData: GenericBucketResponseDtoBmppSummaryResponseDto = isMipModule ? bmppSummaryListDataMip : bmppSummaryListDataMaster;
  const tableData = bmppSummaryListData?.contents.map((item) => ({
    conclusion: item.conclusion ?? '-',
    groupName: item.groupName ?? '-',
    leewayDebtorGroup: item.leewayDebtorGroup ?? '-',
    percentage: item.percentage ?? '-',
  }));
  const tablePage = bmppSummaryListData?.page;

  const { data: summaryRemark, isLoading: isSummaryRemarkLoading } = useGetBmppSummaryRemark({
    bucketProcessId: processId,
    module,
    process,
  });

  useEffect(() => {
    if (summaryRemark) {
      setRemark(summaryRemark?.remarks);
    }
  }, [summaryRemark]);

  const { mutate: saveBmppRemark } = useSaveBmppSummaryRemark({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });

    },
  });

  const handleOnSave = () => {
    if (viewOnly || standaloneBmppSimulation) {
      handleNext();
    } else {
      saveBmppRemark({
        bucketProcessId: processId,
        module,
        process,
        remarks: remark,
      });
    }
  };

  const lastUpdateDate = isMipModule ?
    bmppDetailData?.modificationDate : bmppSummaryListDataMaster?.additionalData?.lastUpdate;
  const dataAsOfDate = useMemo(() => {
    return lastUpdateDate ? dayjs(lastUpdateDate).format('DD MMM YYYY, [Pukul] HH:mm:ss') : '-';
  }, [lastUpdateDate]);

  return {
    dataAsOfDate,
    handleOnSave,
    isLoading,
    isLoadingList,
    isSummaryRemarkLoading,
    noPage,
    remark,
    setItemPerPage,
    setNoPage,
    setRemark,
    tableData,
    tablePage,
  };
};

export default useTabSummary;
