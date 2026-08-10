'use client';

import { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { accessid } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';

import ModalFormMember from '@/components/pages/Pipeline/GroupPage/DetailPage/components/ModalFormMember';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { data } from '../../MasterSLA/DetailPage/components/ApprovalModal/ApprovalModal.constants';

import TableGroupInformation from './components/TableGroupInformation';
import { modal } from './Detail.constants';
import { useDetail } from './Detail.hooks';


const GroupDetailPage = () => {
  const [state, _] = useApp();
  const {
    handleDecline,
    popUpGroupMemberHandler,
    handleDeleteGroup,
    tableHeader,
    debtorGroupMember,
    isLoadingGroupMember,
    debtorGroupDetail,
    page,
    setPage,
    setPageSize,
  } = useDetail();

  const isRM = state.currentRole.includes(roles.RM);
  const isTL = state.currentRole.includes(roles.TL);
  const isKadiv = state.currentRole.includes(roles.KADIV);
  const isSuperAdminMaker = state.currentRole.includes(roles.MAKER);

  const canEditGroup = useCheckAccess(accessid.MAINTENANCE_GROUP_UPDATE);


  // array data manipulation
  const dataTable = debtorGroupMember?.contents?.map((item) => ({
    ...item,
    cif: item.cif ?? '-',
    customerId: item.customerId ?? '-',
    gam: item.gamName ?? '-',
    lastModified: item.lastModified ?? '-',
    modifiedBy: item.modifiedBy ?? '-',
    name: item.name ?? '-',
    remark: item.remark ?? '-',
    sector: item.sectorLabel ?? '-',
  }));

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper sx={{ justifyContent: 'space-between' }}>
        <Title title="Group Detail" />
        {canEditGroup && (
          <RowWrapper sx={{ gap: 2 }}>
            <Button color="success" onClick={() => { }}>Edit Group</Button>
            <Button color="error" onClick={handleDeleteGroup}>Delete Group</Button>
          </RowWrapper>
        )}
      </RowWrapper>

      <TableGroupInformation dataGroup={debtorGroupDetail?.data?.content} />

      <ColumnWrapper>
        <SectionTitle title="Group Member" />
        <BaseContainer>
          <Table
            tableHeader={tableHeader}
            isLoading={isLoadingGroupMember}
            tableData={dataTable}
            currentPage={page}
            totalPage={debtorGroupMember?.page?.totalPage ?? 1}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            footer={
              <RowWrapper sx={{ justifyContent: 'end', mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon="add"
                  onClick={() => popUpGroupMemberHandler('Add New Group Member', 'new')}
                > Add New
                </Button>
              </RowWrapper>
            }
          />
        </BaseContainer>
      </ColumnWrapper>

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3 }}>
        {(isRM || isSuperAdminMaker) && (
          <>
            <Button variant="outlined" color="error" onClick={handleDecline}>Decline</Button>
            <Button variant="contained" color="primary" onClick={() => { }}>Save</Button>
            <Button variant="contained" color="success" onClick={() => { }}>Submit</Button>
          </>
        )}

        {
          isTL || isKadiv && (
            <>
              <Button variant="outlined" color="error" onClick={handleDecline}>Decline</Button>
              <Button variant="contained" color="primary" onClick={() => { }}>Return to staff</Button>
              <Button variant="contained" color="success" onClick={() => { }}>Approve Delete</Button>
            </>
          )
        }

      </RowWrapper>

      {/* MODAL POPUP */}
      <ModalDef
        id={modal.FORM_MEMBER_GROUP}
        component={ModalFormMember}
      />
    </ColumnWrapper>
  );
};

export default GroupDetailPage;
