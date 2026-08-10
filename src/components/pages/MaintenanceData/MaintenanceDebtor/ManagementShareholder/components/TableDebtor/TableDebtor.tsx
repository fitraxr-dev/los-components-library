import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { modalData } from '../../ManagementShareholder.constants';
import ModalDebtorDetailNew from '../NewModel/ModalDebtorDetailNew/ModalDebtorDetailNew';
import ModalTableDebtorNew from '../NewModel/ModalTableDebtorNew';

import useTableDebtor from './TableDebtor.hook';


const TableDebtor = () => {
  const { tableHeaderDebtor, tableDataDebtor } = useTableDebtor();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Customer" />
        <BaseContainer>
          <Table
            tableHeader={tableHeaderDebtor}
            tableData={tableDataDebtor}
          />
        </BaseContainer>
      </ColumnWrapper>
      <ModalDef id={modalData.MODAL_DEBTOR_DETAIL_NEW} component={ModalDebtorDetailNew} />
      <ModalDef id={modalData.MODAL_TABLE_DEBTOR_NEW} component={ModalTableDebtorNew} />
    </>
  );
};

export default TableDebtor;
