import React, { useState } from 'react';

import { formatDate, toDateString } from '@/helpers/date';
import { downloadFile } from '@/helpers/utils';
import useIdentity from '@/hooks/useIdentity';

import useGetDrdInterfaceList from '@/components/pages/Review/EligibilityReview/RatingPage/hooks/useGetDrdInterfaceList';
import TextStyle from '@/components/shared/TextStyle';


import { DRD_INTERFACE_TABLE } from './DRDInterface.constants';

import type { DrdInterfaceProps } from './DRDInterface.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDrdInterface = (props: DrdInterfaceProps) => {
  const { processId } = useIdentity();
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data, isLoading } = useGetDrdInterfaceList({
    bucketProcessId: processId,
    page: {
      itemPerPage: itemPerPage,
      noPage: page,
    },
  });

  const totalPage = data?.content?.page?.totalPage;
  const tableData = data?.content?.contents?.map((item) => ({
    ...item,
    documentName: item?.documentName ?? '-',
    drdConfirmation: item.drdConfirmation ? formatDate(item.drdConfirmation, 'DD MMM YYYY, HH:mm:ss') : '-',
    drdLink: item?.drdLink ?? '-',
    informationDrd: item?.informationDrd ?? '-',
    sentToDrdDate: item.sentToDrdDate ? toDateString(item.sentToDrdDate) : '-',
    status: item?.statusDrd ?? '-',
  }));

  const handleOpenLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const nonPemdaHeaders: TableHeader[] = [
    ...DRD_INTERFACE_TABLE,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'download',
          onClick: (row) => {
            downloadFile(row.document, row.documentName);
          },
        },
      ],
      type: 'action',
    },

  ];

  const pemdaHeaders: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'drdConfirmation',
      label: 'DRD Confirmation',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'informationDrd',
      label: 'Information',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'status',
      label: 'Status',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'drdLink',
      label: 'Link DRD',
      render: (row) => {
        const hasUrl = !!row.drdLink;
        const displayText = row.drdLink || '-';

        return hasUrl ? (
          <TextStyle
            sx={{
              color: '#6E9FC1',
              cursor: 'pointer',
              display: 'inline-block',
              minWidth: '7.5vw',
              textDecoration: 'underline',
            }}
            onClick={() => handleOpenLink(row.drdLink)}
          >
            {displayText}
          </TextStyle>
        ) : (
          <TextStyle
            sx={{
              display: 'inline-block',
              minWidth: '7.5vw',
            }}
          >
            {displayText}
          </TextStyle>
        );
      },
      sx: {
        minWidth: '7.5vw',
      },
    }
  ];

  const TABLE_HEADER = props.isPemda ? pemdaHeaders : nonPemdaHeaders;

  return {
    TABLE_HEADER,
    isLoading,
    itemPerPage,
    page,
    setItemPerPage,
    setPage,
    tableData,
    totalPage,
  };
};

export default useDrdInterface;
