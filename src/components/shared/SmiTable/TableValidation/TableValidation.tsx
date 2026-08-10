'use client';

import { formatDateTime } from '@/helpers/date';

import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import BaseContainer from '../../BaseContainer';

import StatusLabel from './components/StatusLabel';
import { useValidation } from './TableValidation.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const ValidationTable = (props: SmiComponentProps) => {
  const { module, process, id } = props;

  const {
    isLoading,
    noPage,
    setNoPage,
    setItemPerPage,
    handleOpenDetail,
    validationPage,
    validationList,
  } = useValidation({ id, module, process });

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        maxWidth: '5vw',
        minWidth: '5vw',
      },
      type: 'index',
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (data) => (
        <TextStyle
          variant="body4"
          sx={{
            display: 'block',
            maxWidth: '15vw',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {data.comment ?? '-'}
        </TextStyle>
      ),
      sx: {
        maxWidth: '10vw',
        minWidth: '10vw',
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (data) => <StatusLabel data={data} />,
      sx: {
        maxWidth: '35vw',
      },
    },
    {
      key: 'createdBy',
      label: 'Created By',
      sx: {
        maxWidth: '10vw',
        minWidth: '10vw',
      },
    },
    {
      key: 'division',
      label: 'Divisi',
      render: (data) => (
        <TextStyle
          variant="body4"
          sx={{
            display: 'block',
            maxWidth: '10vw',
            overflow: 'hidden',
          }}
        >
          {data.division ?? '-'}
        </TextStyle>
      ),
      sx: {
        maxWidth: '10vw',
        minWidth: '10vw',
      },
    },
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (data) => (
        <TextStyle variant="body4">
          {data?.createdDate ? formatDateTime(data?.createdDate) : '-'}
        </TextStyle>),
      sx: {
        maxWidth: '10vw',
        minWidth: '10vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => handleOpenDetail(data),
        }
      ],
      type: 'action',
    },
  ];

  return (
    <>
      <Title title="Validasi" sx={{ mb: 3 }} />
      <BaseContainer>
        <Table
          tableHeader={tableHeader}
          tableData={validationList}
          isLoading={isLoading}
          currentPage={noPage}
          totalPage={validationPage?.totalPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
        />
      </BaseContainer>
    </>
  );
};

export default ValidationTable;
