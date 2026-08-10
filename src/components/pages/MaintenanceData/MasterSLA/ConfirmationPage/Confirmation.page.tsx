'use client';
import { useEffect, useState } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import Search from '@/components/shared/Search';
import SectionTitle from '@/components/shared/SectionTitle';
import SuccessModal from '@/components/shared/SmiModal/SuccessModal';
import Title from '@/components/shared/Title';

import RejectModal from '../../components/RejectModal';
import Table from '../components/Table/Table';
import { modal } from '../constants';
import { useList } from '../ListPage/List.hook';

import { useConfirmation } from './Confirmation.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const ConfirmationPage = () => {

  const {
    handleRejectModal,
    handleSubmitModal,
  } = useConfirmation();

  const [selected, setSelected] = useState([]);

  const TABLE_HEADER: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'role',
      label: 'Role',
    },
    {
      key: 'deadline',
      label: 'SLA DEADLINE',
    },
    {
      key: 'isActive',
      label: 'Active',
    },
    {
      key: 'createdBy',
      label: 'created By',
    },
    {
      key: 'createdDate',
      label: 'Created Date',
    },
  ];

  const mockData = [
    { multiRow: {
      header: ['index', 'checkbox'],
      row: [
        { deadline: '', isActive: 'ddd', role: 'dddd', status: 'dddff' },
        { deadline: '', isActive: 'AAAA', role: 'aaaa', status: 'aaaffff' },
      ],
    },
    },
    { deadline: '', isActive: 'ddd', role: 'dddd', status: 'dddff' },
    { deadline: '', isActive: 'ddd', role: 'dddd', status: 'dddff' },
  ];

  return (
    <>
      <Title title="Konfirmasi Master SLA Pipeline" />
      <SectionTitle title="Update" />
      <BaseContainer>
        <Table
          tableHeader={TABLE_HEADER}
          tableData={mockData}
        />
      </BaseContainer>
      <SectionTitle title="Add New" />
      <>
        <BaseContainer>
          <Table
            tableHeader={TABLE_HEADER}
            tableData={mockData}
          />
        </BaseContainer>
      </>
      <RowWrapper sx={{ gap: 3, justifyContent: 'flex-end', py: 3 }}>
        <Button
          color="darkBlue"
        >
          Next
        </Button>
        <Button
          color="success"
          onClick={() => handleSubmitModal()}
        >
          Submit
        </Button>
        <Button
          onClick={() => handleSubmitModal()}
          color="success"
        >
          Approve
        </Button>
        <Button
          color="error"
          variant="outlined"
          onClick={() => handleRejectModal()}
        >
          Reject
        </Button>
      </RowWrapper>
      <ModalDef
        id={modal.REJECT_MODAL}
        component={RejectModal}
      />
      <ModalDef
        id={MODAL.GLOBAL.SUCCESS}
        component={SuccessModal}
      />
    </>
  );
};

export default ConfirmationPage;
