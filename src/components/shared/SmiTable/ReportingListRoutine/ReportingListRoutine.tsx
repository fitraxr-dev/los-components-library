'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import useViewOnly from '@/hooks/useViewOnly';


import {
  CreateNewSubReportESDD,
} from '@/components/pages/Review/ESDDPage/ReportingListRoutine/components/CreateNewSubReport';
import {
  EditListReportRoutineESDD,
} from '@/components/pages/Review/ESDDPage/ReportingListRoutine/components/EditListReportRoutine';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import CreateNewSubReport from './components/CreateNewSubReport';
import EditListReportRoutine from './components/EditListReportRoutine';
import { MODAL_ID } from './ReportingListRoutine.constants';
import useReportingListRoutine from './ReportingListRoutine.hook';

import type { ReportingListRoutineTypes } from './ReportingListRoutine.types';


const ReportingListRoutineTable = (props: ReportingListRoutineTypes) => {
  const { viewOnly } = useViewOnly();
  const path = usePathname();


  const pathSegments = path.split('/').filter((segment) => segment);
  const esddIndex = pathSegments[2];

  const { setPage, setPageSize, TABLE_HEADER, NEW_DATA, handleOpenShowAddListReport } = useReportingListRoutine(props);

  const showFooter = !viewOnly && esddIndex === 'esdd';

  const CreateNewSubReportComponent = esddIndex === 'esdd'
    ? CreateNewSubReportESDD
    : CreateNewSubReport;

  const EditListReportRoutineComponent = esddIndex === 'esdd'
    ? EditListReportRoutineESDD
    : EditListReportRoutine;

  return (
    <>
      <Table
        tableHeader={TABLE_HEADER}
        tableData={NEW_DATA}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
        footer={showFooter && <TableFooter sx={{ mr: 4 }} onClick={handleOpenShowAddListReport} />}
      />

      <ModalDef
        id={MODAL_ID.CREATE_SUB_REPORT}
        component={CreateNewSubReportComponent}
      />

      <ModalDef
        id={MODAL_ID.EDIT_LIST_REPORT}
        component={EditListReportRoutineComponent}
      />
    </>
  );
};

export default ReportingListRoutineTable;
