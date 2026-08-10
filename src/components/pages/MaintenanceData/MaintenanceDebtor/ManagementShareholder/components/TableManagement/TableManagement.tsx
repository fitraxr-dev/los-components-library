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
import ModalManagementDetailNew from '../NewModel/ModalManagementDetailNew';
import ModalManagementNew from '../NewModel/ModalManagementNew';

import useTableManagement from './TableManagement.hook';


const TableManagement = () => {
  const [state] = useApp();
  const {
    tableHeader,
    data,
    isLoading,
    viewOnly,
    handleAddData,
    noPage,
    setNoPage,
    setItemPerPage,
  } = useTableManagement();

  const isKadivTL = state.currentRole.includes(roles.KADIV) || state.currentRole.includes(roles.TL);
  const isViewOnly = viewOnly || (isKadivTL && viewOnly);

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
          isLoading={isLoading}
          footer={
            <TableFooter onClick={handleAddData} />
          }
        />
      </BaseContainer>

      <ModalDef
        id={modalData.MODAL_MANAGEMENT_EXISTING}
        component={ModalManagementExisting}
      />

      <ModalDef
        id={modalData.MODAL_MANAGEMENT_NEW}
        component={ModalManagementNew}
      />

      <ModalDef
        id={modalData.MODAL_MANAGEMENT_DETAIL_EXISTING}
        component={ModalManagementDetailExisting}
      />

      <ModalDef
        id={modalData.MODAL_MANAGEMENT_DETAIL_NEW}
        component={ModalManagementDetailNew}
      />
    </ColumnWrapper>
  );
};

export default TableManagement;
