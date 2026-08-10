import { useEffect, useState, useMemo } from 'react';

import { tab, tabItems } from './Detail.constants';
import useGetDetailDocument from './hooks/useGetDetailDocument';


const useDetail = (props) => {
  const [activeTab, setActiveTab] = useState(tab.DPPSPM);

  const tabs = tabItems;
  const uploadId = Number(props.params.id);

  const headerPayload = useMemo(() => ({
    filter: {
      category: activeTab,
      uploadId,
    },
    page: {
      itemPerPage: 1,
      noPage: 1,
    },
  }), [uploadId, activeTab]);

  const { data: headerData, isLoading: isLoadingHeader } = useGetDetailDocument(headerPayload);

  const headerInfo = useMemo(() => ({
    fileName: headerData?.fileName || '-',
    uploadDate: headerData?.uploadDate || '',
    uploadedBy: headerData?.uploadedBy || '-',
  }), [headerData]);

  const handleChangeTab = (newTab: string) => {
    setActiveTab(newTab);
  };

  return {
    activeTab,
    handleChangeTab,
    headerInfo,
    isLoadingHeader,
    tabs,
    uploadId,
  };
};

export default useDetail;
