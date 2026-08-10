import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import ModalAddExternalRating from '../ModalAddExternalRating';
import { modalId } from '../ModalAddExternalRating/ModalAddExternalRating.constants';

import useExternalRatingTable from './ExternalRatingTable.hooks';


const ExternalRatingTable = () => {
  const { handleAddRating, viewOnly, data, tableHeader, isLoading } = useExternalRatingTable();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Rating" />
        <BaseContainer>
          <Table
            tableHeader={tableHeader}
            tableData={data}
            isLoading={isLoading}
            footer={!viewOnly ? <TableFooter onClick={handleAddRating} /> : null}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id={modalId.MODAL_ADD_EXTERNAL_RATING}
        component={ModalAddExternalRating}
      />
    </>
  );
};

export default ExternalRatingTable;
