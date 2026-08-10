'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconTooltip from '@/components/shared/IconTooltip';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import PopupSpecialApproval from './components/ModalSpecialApproval';
import PopupSpecialApprovalDetail from './components/ModalSpecialApprovalDetail';
import { modal } from './TableSpecialApproval.constants';
import { useTableSpecialApproval } from './TableSpecialApproval.hook';

import type { TableSpecialApprovalProps } from './TableSpecialApproval.types';


const TableSpecialApproval = (props: TableSpecialApprovalProps) => {
  const {
    handpeOpenSpecialApprovalPopup,
    setItemPerPage,
    setNoPage,
    data,
    theme,
    noPage,
    viewOnly,
    dataList,
    tableHeader,
  } = useTableSpecialApproval(props);

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Jenis Persetujuan Khusus" isOpen>
          <BaseContainer
            sx={{
              borderRadius: theme.radius(1),
              boxShadow: 2,
              padding: theme.spacing(2),
            }}
          >
            <Table
              maxHeight="42vh"
              tableHeader={tableHeader}
              tableData={dataList}
              currentPage={noPage}
              handlePageChange={setNoPage}
              onPageSizeChange={setItemPerPage}
              totalPage={data?.page?.totalPage}
              maxWidth="100%"
              footer={viewOnly ? null : <TableFooter onClick={() => handpeOpenSpecialApprovalPopup()} />}
            />
          </BaseContainer>
        </SectionTitle>
      </ColumnWrapper>

      <ModalDef
        id={modal.SPECIAL_APPROVAL}
        component={PopupSpecialApproval}
      />

      <ModalDef
        id={modal.SPECIAL_APPROVAL_DETAIL}
        component={PopupSpecialApprovalDetail}
      />
    </>
  );
};

export default TableSpecialApproval;
