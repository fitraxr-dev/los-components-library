'use client';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { accessid } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ModalFormMember from './components/ModalFormMember';
import ModalRecommendedGroup from './components/ModalRecommendedGroup/ModalRecommendedGroup';
import TableGroupDetail from './components/TableDetailGroup';
import TableGroupInformation from './components/TableGroupInformation';
import ViewDetailGroupModal from './components/ViewDetailGroupModal';
import { mockTableDataBmpk, modal } from './Create.constants';
import { useCreate } from './Create.hooks';


const GroupDetailPage = () => {
  const [state, _] = useApp();
  const {
    tableHeader,
    debtorGroupMember,
    isLoadingGroupMember,
    debtorGroupDetail,
    page,
    pageBmpk,
    setPage,
    setPageSize,
    methods,
    isCreate,
    isEdit,
    handleSaveNewGrup,
    isSubmission,
    isAutoSaveFetching,
    isBucketActive,
    tableHeaderBMPK,
    filterDropdownList,
    filterDropdownListBmpk,
    createdByAdmin,
    filterContentList,
    filterContentListBmpk,
    popupGroupMemberHandler,
    filter,
    setFilter,
    filterBmpk,
    setFilterBmpk,
    bmpkList,
    setPageSizeBmpk,
    setPageBmpk,
    handleSubmit,
    handleButtonClose,
    theme,
    dataAsOfDateBmpp,
    dataAsOfDateMemberGroup,
    status,
    canSubmit,
    saveButtonDisabled,
    findDataMaster,
    getMemberRowStyle,
    isViewOnlyByDivision,
  } = useCreate();

  const isRM = state.currentRole.includes(roles.RM);
  const isTL = state.currentRole.includes(roles.TL);
  const isSuperAdminChecker = state.currentRole.includes(roles.CHECKER);
  const isKadiv = state.currentRole.includes(roles.KADIV);
  const isSuperAdminMaker = state.currentRole.includes(roles.MAKER);
  const searchParams = useSearchParams();
  const fromApprovalStatus = searchParams.get('from') === 'approval-status';
  const fromList = searchParams.get('from') === 'list';

  const isDraft = status?.toUpperCase?.() === 'DRAFT';
  const isWaitingTL = status?.toUpperCase?.() === 'WAITING_APPROVAL_TL' || status?.toUpperCase?.() === 'WAITING APPROVAL TL';
  const isWaitingKadiv = status?.toUpperCase?.() === 'WAITING_APPROVAL_KADIV' || status?.toUpperCase?.() === 'WAITING APPROVAL KADIV';
  const isCanceled = status?.toUpperCase?.() === 'CANCELED';
  const isRejected = status?.toUpperCase?.() === 'REJECTED';
  const isApproved = status?.toUpperCase?.() === 'APPROVED';
  const isCompleted = status?.toUpperCase?.() === 'COMPLETED';
  const isReturnToStaff = status?.toUpperCase?.() === 'RETURN_TO_STAFF' || status?.toUpperCase?.() === 'RETURN TO STAFF';
  const isPipelineCreation = status?.toUpperCase?.() === 'PIPELINE_CREATION' || status?.toUpperCase?.() === 'PIPELINE CREATION';
  const isReturnToMaker = status?.toUpperCase?.() === 'RETURN_TO_MAKER' || status?.toUpperCase?.() === 'RETURN TO MAKER';
  const isWaitingApprovalChecker = status?.toUpperCase?.() === 'WAITING APPROVAL CHECKER' || status?.toUpperCase?.() === 'WAITING_APPROVAL_CHECKER';
  const canEditForm = isSuperAdminMaker && isReturnToMaker;

  const canAddGroupMember = useCheckAccess(accessid.MAINTENANCE_GROUP_CREATE);

  // array data manipulation
  const dataTable = (
    (debtorGroupMember as any)?.data?.contents ??
    (debtorGroupMember as any)?.contents ??
    []
  ).map((item) => ({
    ...item,
    cif: item?.cif || '-',
    gamName: item?.gam || '-',
    name: item?.debtorName || '-',
    sector: item?.sector || '-',
  }));

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper sx={{ justifyContent: 'space-between' }}>
        <Title
          title={
            isCreate ? 'Create New Group'
              : isEdit ? 'Edit Group' :
                'Detail Group'
          }
        />
      </RowWrapper>
      <SectionTitle title="Group" isOpen>
        {fromList && (isWaitingTL || isWaitingKadiv || isDraft || isReturnToStaff) ?
          <RowWrapper mt={2} px={3}>
            <Box display="flex" gap={1} alignItems="center">
              <Icon iconName="information-shape" />
              <TextStyle variant="body4" color="#284A63" sx={{ fontWeight: 700 }}>
                Data ini sedang dalam proses pengajuan, silakan cek pada Approval Status
              </TextStyle>
            </Box>
          </RowWrapper>
          : <></>
        }
        <FormProvider {...methods}>
          <TableGroupInformation
            disabledForm={
              (isViewOnlyByDivision && !isSuperAdminMaker) || isPipelineCreation ||
              (!canEditForm && (
                (!isRM && !isSuperAdminMaker) ||
                (!isCreate && !isEdit && !isReturnToMaker) ||
                (isEdit && !isSubmission && isBucketActive || (isWaitingTL && isWaitingKadiv))
              ))
            }
            findDataMaster={findDataMaster}
          />
        </FormProvider>
      </SectionTitle>

      <ColumnWrapper gap={3}>
        {(!isCreate || isSubmission) && (
          <SectionTitle title="BMPK/BMPD/BMPP" isOpen>
            <Box display="flex" alignItems="center" py={3} gap={1} px={3}>
              <TextStyle variant="body4">
                Data as of : {dataAsOfDateBmpp}
              </TextStyle>
              <Tooltip
                slotProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                }}
                title="Tanggal dan jam update data terakhir"
                placement="right"
              >
                <Box display="flex" alignItems="center">
                  <Icon iconName="information-shape" />
                </Box>
              </Tooltip>
            </Box>
            <BaseContainer>
              <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box width="45vw">
                  <Input
                    type="search"
                    value={filterBmpk}
                    onChange={setFilterBmpk}
                    placeholder="Pencarian..."
                    dropdownList={filterDropdownListBmpk}
                    contentList={filterContentListBmpk}
                  />
                </Box>
              </RowWrapper>
              <Table
                tableHeader={tableHeaderBMPK}
                tableData={bmpkList?.data?.contents || []}
                currentPage={pageBmpk}
                totalPage={bmpkList?.data?.page?.totalPage ?? 1}
                handlePageChange={setPageBmpk}
                onPageSizeChange={setPageSizeBmpk}
              />
            </BaseContainer>
          </SectionTitle>
        )}
        {(!isCreate || isSubmission) && (
          <SectionTitle title="Group Member" isOpen>
            <Box display="flex" alignItems="center" py={3} gap={1} px={3}>
              <TextStyle variant="body4">
                Data as of : {dataAsOfDateMemberGroup}
              </TextStyle>
              <Tooltip
                slotProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                }}
                title="Tanggal dan jam update data terakhir"
                placement="right"
              >
                <Box display="flex" alignItems="center">
                  <Icon iconName="information-shape" />
                </Box>
              </Tooltip>
            </Box>
            {/* Legend for member changes */}
            {((isTL && status?.toUpperCase?.() === 'WAITING_APPROVAL_TL') ||
              (isKadiv && status?.toUpperCase?.() === 'WAITING_APPROVAL_KADIV')) &&
              ((debtorGroupMember as any)?.data?.additionalData?.hasChanges === true ||
                (debtorGroupMember as any)?.additionalData?.hasChanges === true) &&
              (
                <Box display="flex" alignItems="center" py={2} gap={3} px={3}>
                  <TextStyle variant="body4" sx={{ fontWeight: 600 }}>
                    Legend:
                  </TextStyle>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box width={16} height={16} sx={{ bgcolor: '#e8f5e8', border: '1px solid #ccc' }} />
                    <TextStyle variant="body4">New Member</TextStyle>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box width={16} height={16} sx={{ bgcolor: '#fff3cd', border: '1px solid #ccc' }} />
                    <TextStyle variant="body4">Edited Member</TextStyle>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box width={16} height={16} sx={{ bgcolor: '#f8d7da', border: '1px solid #ccc' }} />
                    <TextStyle variant="body4">Deleted Member</TextStyle>
                  </Box>
                </Box>
              )}
            <BaseContainer>
              <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Box width="45vw">
                  <Input
                    type="search"
                    value={filter}
                    onChange={setFilter}
                    placeholder="Pencarian..."
                    dropdownList={filterDropdownList}
                    contentList={filterContentList}
                  />
                </Box>
                {(() => {
                  const canShowAddButton = (isRM || isSuperAdminMaker) && (
                    (isEdit && !isSubmission && !isBucketActive) ||
                    isSubmission
                  ) && !isCanceled && !isRejected && !isApproved;
                  return canShowAddButton && !isWaitingTL && !isWaitingKadiv && !isWaitingApprovalChecker &&
                    canAddGroupMember && (!isViewOnlyByDivision ||
                      (isViewOnlyByDivision && isSuperAdminMaker)) && !isPipelineCreation;
                })() ?
                  <RowWrapper sx={{ gap: 2 }}>
                    <Button
                      onClick={popupGroupMemberHandler}
                    >
                      Add Group Member
                    </Button>
                  </RowWrapper> : <></>
                }
              </RowWrapper>
              <Table
                tableHeader={tableHeader}
                isLoading={isLoadingGroupMember}
                tableData={dataTable}
                currentPage={page}
                totalPage={debtorGroupMember?.page?.totalPage ?? 1}
                handlePageChange={(newPage) => {
                  setPage(newPage);
                }}
                onPageSizeChange={setPageSize}
                anomalyRow={getMemberRowStyle}
              />
              {/* {isEdit && !isCreate ?

              :
              <Table
                tableHeader={tableHeader}
                tableData={[]}
              />
            } */}
            </BaseContainer>
          </SectionTitle>
        )}
      </ColumnWrapper>

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3 }}>
        {isCreate && (isRM || isSuperAdminMaker) && !isViewOnlyByDivision && !isPipelineCreation && (
          <Button variant="contained" color="primary" onClick={handleSaveNewGrup} disabled={!methods.formState.isValid}>Save</Button>
        )}

        {(() => {
          const canShowRMButtons = (isRM) && (
            (isEdit && !isSubmission && !isBucketActive) ||
            isSubmission
          );
          const canShowSuperAdminMakerButtons = (isSuperAdminMaker) && (
            (isEdit && !isSubmission && !isBucketActive) ||
            isSubmission
          );
          return (canShowRMButtons && !isWaitingTL && !isWaitingKadiv && !isWaitingApprovalChecker &&
            !isCreate && !isCanceled && !isRejected && !isApproved && !isCompleted
            && !isViewOnlyByDivision && !isPipelineCreation)
            || (canShowSuperAdminMakerButtons && !isWaitingTL && !isWaitingKadiv && !isWaitingApprovalChecker &&
              !isCreate && !isCanceled && !isRejected && !isApproved && !isCompleted
              && !isPipelineCreation);
        })() && (
          <>
            <Button variant="outlined" color="error" onClick={() => { handleSubmit('CANCELED'); }} disabled={!isSubmission}>Decline</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveNewGrup}
              disabled={saveButtonDisabled || isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>            <Button variant="contained" color="success" onClick={() => { handleSubmit('SUBMIT'); }} disabled={!canSubmit}>Submit</Button>
          </>
        )}

        {(isTL) && isWaitingTL &&
          (isBucketActive && !isCreate && !isEdit) && !isViewOnlyByDivision && !isPipelineCreation && (
          <>
            <Button variant="outlined" color="error" onClick={() => { handleSubmit('CANCELED'); }}>Decline</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSubmit('RETURN_TO_STAFF'); }}>Return to staff</Button>
            <Button variant="contained" color="success" onClick={() => { handleSubmit('SUBMIT'); }}>Submit</Button>
          </>
        )
        }

        {(isSuperAdminMaker && !createdByAdmin) && isWaitingTL &&
          (isBucketActive && !isCreate && !isEdit) && !isPipelineCreation && (
          <>
            <Button variant="outlined" color="error" onClick={() => { handleSubmit('CANCELED'); }}>Decline</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSubmit('RETURN_TO_STAFF'); }}>Return to staff</Button>
            <Button variant="contained" color="success" onClick={() => { handleSubmit('SUBMIT'); }}>Submit</Button>
          </>
        )
        }

        {isKadiv && isWaitingKadiv &&
          (isBucketActive && !isCreate && !isEdit) && !isViewOnlyByDivision && !isPipelineCreation && (
          <>
            <Button variant="outlined" color="error" onClick={() => { handleSubmit('CANCELED'); }}>Decline</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSubmit('RETURN_TO_STAFF'); }}>Return to staff</Button>
            <Button variant="contained" color="success" onClick={() => { handleSubmit('SUBMIT'); }}>Approve</Button>
          </>
        )}

        {isKadiv && isWaitingKadiv && createdByAdmin &&
          (isBucketActive && !isCreate && !isEdit) && !isPipelineCreation && (
          <>
            <Button variant="outlined" color="error" onClick={() => { handleSubmit('CANCELED'); }}>Decline</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSubmit('RETURN_TO_STAFF'); }}>Return to staff</Button>
            <Button variant="contained" color="success" onClick={() => { handleSubmit('SUBMIT'); }}>Approve</Button>
          </>
        )}

        {isSuperAdminChecker && isWaitingKadiv &&
          (isBucketActive && !isCreate && !isEdit) && !isViewOnlyByDivision && !isPipelineCreation && (
          <>
            <Button variant="outlined" color="error" onClick={() => { handleSubmit('CANCELED'); }}>Decline</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSubmit('RETURN_TO_STAFF'); }}>Return to staff</Button>
            <Button variant="contained" color="success" onClick={() => { handleSubmit('SUBMIT'); }}>Approve</Button>
          </>
        )}

        {(isSuperAdminMaker && !createdByAdmin) && isWaitingKadiv &&
          (isBucketActive && !isCreate && !isEdit) && !isPipelineCreation && (
          <>
            <Button variant="outlined" color="error" onClick={() => { handleSubmit('CANCELED'); }}>Decline</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSubmit('RETURN_TO_STAFF'); }}>Return to staff</Button>
            <Button variant="contained" color="success" onClick={() => { handleSubmit('SUBMIT'); }}>Approve</Button>
          </>
        )}

        {isSuperAdminChecker && isWaitingApprovalChecker &&
          (isBucketActive && !isCreate && !isEdit) && !isViewOnlyByDivision && !isPipelineCreation && (
          <>
            <Button variant="outlined" color="error" onClick={() => { handleSubmit('CANCELED'); }}>Decline</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSubmit('RETURN_TO_MAKER'); }}>Return to maker</Button>
            <Button variant="contained" color="success" onClick={() => { handleSubmit('SUBMIT'); }}>Approve</Button>
          </>
        )}

        {isTL && isWaitingApprovalChecker && (isBucketActive && !isCreate && !isEdit)
          && !isPipelineCreation && (
          <>
            <Button variant="outlined" color="error" onClick={() => { handleSubmit('CANCELED'); }}>Decline</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSubmit('RETURN_TO_MAKER'); }}>Return to maker</Button>
            <Button variant="contained" color="success" onClick={() => { handleSubmit('SUBMIT'); }}>Submit</Button>
          </>
        )}

        {isKadiv && isWaitingApprovalChecker && (isBucketActive && !isCreate && !isEdit)
          && !isPipelineCreation && (
          <>
            <Button variant="outlined" color="error" onClick={() => { handleSubmit('CANCELED'); }}>Decline</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSubmit('RETURN_TO_MAKER'); }}>Return to maker</Button>
            <Button variant="contained" color="success" onClick={() => { handleSubmit('SUBMIT'); }}>Approve</Button>
          </>
        )}

        {(() => {
          const isDetailViewOnly = (isViewOnlyByDivision && !isSuperAdminMaker) || isPipelineCreation ||
            ((!isCreate && !isEdit) && !isSubmission) ||
            ((isRM) &&
              (isWaitingTL || isWaitingKadiv || isCanceled || isRejected ||
                isApproved || isWaitingApprovalChecker || isReturnToMaker || isCompleted)) ||
            ((isSuperAdminMaker) &&
              (isCanceled || isRejected || isApproved || isWaitingApprovalChecker || isCompleted)) ||
            ((isSuperAdminMaker && createdByAdmin) && (isWaitingKadiv)) ||
            ((isSuperAdminChecker) &&
              (isCanceled || isRejected || isApproved || isCompleted ||
                isReturnToMaker || isReturnToStaff || isWaitingTL || isWaitingKadiv)) ||
            ((isTL || isKadiv) &&
              (isDraft || isCanceled || isRejected || isApproved ||
                isReturnToStaff || isWaitingApprovalChecker || isReturnToMaker || isCompleted)) ||
            (isTL && isWaitingKadiv) || (isKadiv && isWaitingTL);
          return isDetailViewOnly;
        })() && (
          <Button variant="outlined" onClick={handleButtonClose}>Close</Button>
        )}
      </RowWrapper>

      {/* MODAL POPUP */}
      <ModalDef
        id={modal.VIEW_DETAIL_GROUP_MODAL}
        component={ViewDetailGroupModal}
      />
      <ModalDef
        id={modal.FORM_MEMBER_GROUP}
        component={ModalFormMember}
      />
      <ModalDef
        id={modal.RECOMMENDED_GROUP}
        component={ModalRecommendedGroup}
      />
    </ColumnWrapper>
  );
};

export default GroupDetailPage;
