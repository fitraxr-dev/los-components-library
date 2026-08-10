import { ModalDef } from '@ebay/nice-modal-react';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';


import { MODALPK } from '../../PK.constants';
import SubmissionDraftModal from '../SubmissionDraftModal';

import useTableSubmission from './TableSubmission.hook';

import type { PkProcessingProps } from '../../PK.types';


const TableSubmission = (props: PkProcessingProps) => {

  const {
    contentDataList,
    handleOpenAddModal,
    isLoading,
    tableHeader,
    viewOnly,
    isLegalSigning,
    anomalyRow,
  } = useTableSubmission(props);


  return (
    <ColumnWrapper sx={{ gap: 3, py: 3 }}>
      <SectionTitle title="Perikatan yang diajukan" isOpen>
        <Table
          isPaper
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={contentDataList}
          footer={
            !isLegalSigning &&
            <TableFooter
              disabled={viewOnly}
              sx={{ mr: 4, mt: 2 }}
              onClick={handleOpenAddModal}
            />
          }
          anomalyRow={anomalyRow}
        />
      </SectionTitle>

      <ModalDef
        id={MODALPK.NEW_PROCESSING_TYPE}
        component={SubmissionDraftModal}
      />
    </ColumnWrapper>
  );
};

export default TableSubmission;
