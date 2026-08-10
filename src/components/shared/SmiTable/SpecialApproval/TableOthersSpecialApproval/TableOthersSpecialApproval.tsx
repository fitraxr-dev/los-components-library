'use client';
import { ModalDef } from '@ebay/nice-modal-react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';


import PopupSpecialApprovalDetail from '../TableSpecialApproval/components/ModalSpecialApprovalDetail';

import { modal } from './TableOthersSpecialApproval.constants';
import { useTableOthersSpecialApproval } from './TableOthersSpecialApproval.hook';

import type { TableOthersSpecialApprovalProps } from './TableOthersSpecialApproval.types';


const TableOthersSpecialApproval = (props: TableOthersSpecialApprovalProps) => {

  const {
    isMip,
    setItemPerPageOthers,
    setNoPageOthers,
    theme,
    others,
    otherList,
    noPageOthers,
    tableHeaderOthers,
  } = useTableOthersSpecialApproval(props);

  const { showSectionTitle = true } = props;

  const tableContent = (
    <BaseContainer
      sx={{
        borderRadius: theme.radius(1),
        boxShadow: 2,
        padding: theme.spacing(2),
      }}
    >
      <Table
        maxHeight="42vh"
        tableHeader={tableHeaderOthers}
        tableData={otherList}
        currentPage={noPageOthers}
        handlePageChange={setNoPageOthers}
        onPageSizeChange={setItemPerPageOthers}
        totalPage={others?.page?.totalPage}
        maxWidth="100%"
      />
    </BaseContainer>
  );

  return (
    <>
      {showSectionTitle ? (
        <ColumnWrapper sx={{ gap: 3 }}>
          <SectionTitle title="Jenis Persetujuan Khusus - Lainnya" isOpen>
            {tableContent}
          </SectionTitle>
        </ColumnWrapper>
      ) : (
        tableContent
      )}

      <ModalDef
        id={modal.SPECIAL_APPROVAL_DETAIL}
        component={PopupSpecialApprovalDetail}
      />
    </>
  );
};

export default TableOthersSpecialApproval;
