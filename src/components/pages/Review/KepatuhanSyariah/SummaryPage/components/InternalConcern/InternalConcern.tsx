'use client';


import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import useSummaryForm from './InternalConcern.hooks';

import type { TableProps } from '../../Summary.types';


const SummaryForm = ({ onChange }: TableProps) => {
  const {
    data,
    handleNewData,
    tableHeader,
    canUpdate,
    canCreate,
    viewOnly,
  } = useSummaryForm();

  return (
    <ColumnWrapper sx={{ gap: 6 }}>
      <Table
        isPaper
        tableHeader={tableHeader}
        tableData={data}
        footer={(!viewOnly || canUpdate || canCreate) && <TableFooter onClick={handleNewData} />}
      />
      <RowWrapper sx={{ justifyContent: 'end' }}>
        <Button
          onClick={() => onChange('2')}
          variant="contained"
        >
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default SummaryForm;
