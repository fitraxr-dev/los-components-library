'use client';


import { ModalDef } from '@ebay/nice-modal-react';

import Table from '@/components/shared/Table';

import CreateNewSubReport from './components/CreateNewSubReport';
import { MODAL_ID } from './ReportingListRoutine.constants';
import useReportingListRoutine from './ReportingListRoutine.hook';

import type { ReportingListRoutineTypes } from './ReportingListRoutine.types';


const ReportingListRoutineTable = (props: ReportingListRoutineTypes) => {
  const { setPage, setPageSize, TABLE_HEADER, NEW_DATA, isLoading } = useReportingListRoutine(props);

  return (
    <>
      <Table
        tableHeader={TABLE_HEADER}
        tableData={NEW_DATA}
        isLoading={isLoading}
        renderFooter={() => null}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
      <ModalDef
        id={MODAL_ID.CREATE_SUB_REPORT}
        component={CreateNewSubReport}
      />
    </>
  );
};

export default ReportingListRoutineTable;
