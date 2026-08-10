import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import useApp from '@/hooks/useApp';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { modalData } from '../../ManagementShareholder.constants';
import ModalManagementDetailExisting from '../ExistingModel/ModalManagementDetailExisting';
import ModalManagementExisting from '../ExistingModel/ModalManagementExisting';

import useTableManagement from './TableManagement.hook';


const TableManagement = () => {
  const [state] = useApp();
  const {
    tableHeader,
    data,
    isFetching,
    viewOnly,
    handleAddData,
    noPage,
    setNoPage,
    setItemPerPage,
  } = useTableManagement();

  const isKadiv = state.currentRole.includes(roles.KADIV);
  const isViewOnly = viewOnly || (isKadiv && viewOnly);
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Management" />
      <BaseContainer>
        <Table
          tableHeader={tableHeader}
          tableData={data?.contents}
          totalPage={data?.page?.totalPage ?? 1}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          isLoading={isFetching}
          footer={
            !isViewOnly &&
            <TableFooter onClick={handleAddData} />
          }
        />
      </BaseContainer>

      <ModalDef
        id={modalData.MODAL_MANAGEMENT_EXISTING}
        component={ModalManagementExisting}
      />

      <ModalDef
        id={modalData.MODAL_MANAGEMENT_DETAIL_EXISTING}
        component={ModalManagementDetailExisting}
      />

    </ColumnWrapper>
  );
};

export default TableManagement;
