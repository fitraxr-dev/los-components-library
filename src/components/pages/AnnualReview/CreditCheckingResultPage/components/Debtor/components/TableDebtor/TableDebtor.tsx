import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { modal } from '../../Debtor.constants';
import ModalDebtorDetail from '../ModalDebtorDetail';

import useTableDebtor from './TableDebtor.hook';


const TableDebtor = () => {
  const theme = useTheme();
  const { tableData, tableHeader, isLoading } = useTableDebtor();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Customer" isOpen sx={{ marginBottom: theme.spacing(3) }}>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
          />
        </BaseContainer>
      </SectionTitle>

      <ModalDef
        id={modal.MODAL_DEBTOR_DETAIL}
        component={ModalDebtorDetail}
      />
    </ColumnWrapper>
  );
};

export default TableDebtor;
