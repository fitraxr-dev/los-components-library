import { ModalDef } from '@ebay/nice-modal-react';

import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import BaseContainer from '../../../BaseContainer';
import ColumnWrapper from '../../../ColumnWrapper';

import ModalDebtorDetail from './components/ModalDebtorDetail';
import useTableDebtor from './TableDebtor.hook';

import type { ManagementShareholderProps } from './TableDebtor.types';


const TableDebtor = ({
  module,
  onSelectedChange,
  selected,
  status,
  viewOnly,
  tableType,
}: ManagementShareholderProps) => {
  const {
    tableDataDebtor,
    tableHeaderDebtor,
  } = useTableDebtor({ module, onSelectedChange, selected, status, tableType, viewOnly });

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Customer" isOpen>
        <BaseContainer>
          <Table
            tableHeader={tableHeaderDebtor}
            tableData={tableDataDebtor}
          />
        </BaseContainer>
      </SectionTitle>
      <ModalDef
        id="DEBTOR_DETAIL"
        component={ModalDebtorDetail}
      />
    </ColumnWrapper>
  );
};

export default TableDebtor;
