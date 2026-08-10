'use client';
import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import DetailGroupModal from './components/detailGroupModal/DetailGroupModal';
import DetailGroupUpdateModal from './components/detailGroupUpdateModal/DetailGroupUpdateModal';
import DetailItemModal from './components/detailItemModal/DetailItemModal';
import DetailItemUpdateModal from './components/detailItemUpdateModal/DetailItemUpdateModal';
import DetailSubItemModal from './components/detailSubItemModal/DetailSubItemModal';
import DetailSubItemUpdateModal from './components/detailSubItemUpdateModal/DetailSubItemUpdateModal';
import { useSummary } from './Summary.hook';


const SummaryPage = () => {
  const theme = useTheme();
  const { push, reset } = useBreadcrumbs();
  const { recordActivity } = useRecordLog();
  const {
    form,
    isLoading,
    // Data
    groupUpdateData,
    groupAddData,
    itemUpdateData,
    itemAddData,
    subUpdateData,
    subAddData,
    // Data existence flags
    hasGroupUpdateData,
    hasGroupAddData,
    hasItemUpdateData,
    hasItemAddData,
    hasSubUpdateData,
    hasSubAddData,
    hasAnyData,
    // Headers
    summaryGroupAddHeader,
    summaryGroupUpdateHeader,
    summaryItemAddHeader,
    summaryItemUpdateHeader,
    summarySubItemAddHeader,
    summarySubItemUpdateHeader,
    // Handlers
    handleAdd,
    handleApprovalStatusModal,
    updateStatus,
    handleClose,
    handlePageChange,
    handlePageSizeChange,
    viewOnly,
    isMaker,
    shouldShowCloseButton,
    handleCancel,
    // Pagination
    page,
    pageSize,
  } = useSummary();


  const disableAction =
    viewOnly ||
    isLoading ||
    !hasAnyData;

  const disableActionCancel =
    viewOnly ||
    isLoading;

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-mapping-apu_ppt', label: 'Parameter Mapping APU PPT' });
    push({ label: 'Summary' });

    // Record activity for page access
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: '/master-parameter/parameter-mapping-apu_ppt/summary',
      module: 'PARAMETER_APU_PPT',
      process: 'PARAMETER_APU_PPT',
      remarks: 'Accessed Parameter Mapping APU PPT Summary page',
    });
  }, [push, reset, recordActivity]);

  return (
    <FormProvider {...form}>
      <ColumnWrapper gap={3}>
        <Title title="Summary" />

        {/* Table 1 - Group Add */}
        {hasGroupAddData && (
          <SectionTitle
            title="Add New Item Group"
            isOpen={true}
            hideToggle={true}
          >
            <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(2) }}>
              <Table
                tableHeader={summaryGroupAddHeader}
                tableData={groupAddData}
                isLoading={isLoading}
                currentPage={page}
                totalPage={Math.ceil(groupAddData.length / pageSize)}
                handlePageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
              />
            </BaseContainer>
          </SectionTitle>
        )}

        {/* Table 2 - Group Update */}
        {hasGroupUpdateData && (
          <SectionTitle
            title="Update Item Group"
            isOpen={true}
            hideToggle={true}
          >
            <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(2) }}>
              <Table
                tableHeader={summaryGroupUpdateHeader}
                tableData={groupUpdateData}
                isLoading={isLoading}
                currentPage={page}
                totalPage={Math.ceil(groupUpdateData.length / pageSize)}
                handlePageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                isMaintenanceParameterBar={true}
              />
            </BaseContainer>
          </SectionTitle>
        )}

        {hasItemAddData && (
          <SectionTitle
            title="Add New Item"
            isOpen={true}
            hideToggle={true}
          >
            <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(2) }}>
              <Table
                tableHeader={summaryItemAddHeader}
                tableData={itemAddData}
                isLoading={isLoading}
                currentPage={page}
                totalPage={Math.ceil(itemAddData.length / pageSize)}
                handlePageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
              />
            </BaseContainer>
          </SectionTitle>
        )}

        {hasItemUpdateData && (
          <SectionTitle
            title="Update Item"
            isOpen={true}
            hideToggle={true}
          >
            <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(2) }}>
              <Table
                tableHeader={summaryItemUpdateHeader}
                tableData={itemUpdateData}
                isLoading={isLoading}
                currentPage={page}
                totalPage={Math.ceil(itemUpdateData.length / pageSize)}
                handlePageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                isMaintenanceParameterBar={true}
              />
            </BaseContainer>
          </SectionTitle>
        )}

        {hasSubAddData && (
          <SectionTitle
            title="Add New Sub Item"
            isOpen={true}
            hideToggle={true}
          >
            <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(2) }}>
              <Table
                tableHeader={summarySubItemAddHeader}
                tableData={subAddData}
                isLoading={isLoading}
                currentPage={page}
                totalPage={Math.ceil(subAddData.length / pageSize)}
                handlePageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
              />
            </BaseContainer>
          </SectionTitle>
        )}

        {hasSubUpdateData && (
          <SectionTitle
            title="Update Sub Item"
            isOpen={true}
            hideToggle={true}
          >
            <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(2) }}>
              <Table
                tableHeader={summarySubItemUpdateHeader}
                tableData={subUpdateData}
                isLoading={isLoading}
                currentPage={page}
                totalPage={Math.ceil(subUpdateData.length / pageSize)}
                handlePageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                isMaintenanceParameterBar={true}
              />
            </BaseContainer>
          </SectionTitle>
        )}

        {!hasAnyData && (
          <SectionTitle
            title="No Data Available"
            isOpen={true}
            hideToggle={true}
          >
            <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(2) }}>
              <Table
                tableHeader={[]}
                tableData={[]}
                isLoading={isLoading}
                currentPage={page}
                totalPage={1}
                handlePageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
              />
            </BaseContainer>
          </SectionTitle>
        )}

        {/* Action Buttons */}
        <RowWrapper mt={5} gap={2} alignItems="center" justifyContent="end">
          {shouldShowCloseButton ? (
            <Button
              variant="outlined"
              onClick={handleClose}
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={handleClose}
              >
                Close
              </Button>

              {isMaker && (
                <>
                  <Button
                    disabled={disableActionCancel}
                    variant="outlined"
                    onClick={handleCancel}
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={disableAction}
                    variant="contained"
                    color="success"
                    onClick={() => updateStatus('SUBMIT')}
                  >
                    Submit
                  </Button>
                </>
              )}

              {!isMaker && (
                <>
                  <Button
                    disabled={disableAction}
                    variant="contained"
                    color="info"
                    onClick={() => updateStatus('RETURN_TO_MAKER')}
                  >
                    Return to Maker
                  </Button>
                  <Button
                    disabled={disableAction}
                    variant="contained"
                    color="error"
                    onClick={() => updateStatus('REJECT')}
                  >
                    Reject
                  </Button>
                  <Button
                    disabled={disableAction}
                    variant="contained"
                    color="success"
                    onClick={() => updateStatus('SUBMIT')}
                  >
                    Approved
                  </Button>
                </>
              )}
            </>
          )}
        </RowWrapper>

        {/* Modal Definitions */}
        <ModalDef
          id="MODAL_DETAIL_GROUP"
          component={DetailGroupModal}
        />
        <ModalDef
          id="MODAL_DETAIL_ITEM"
          component={DetailItemModal}
        />
        <ModalDef
          id="MODAL_DETAIL_SUB_ITEM"
          component={DetailSubItemModal}
        />
        <ModalDef
          id="MODAL_DETAIL_GROUP_UPDATE"
          component={DetailGroupUpdateModal}
        />
        <ModalDef
          id="MODAL_DETAIL_ITEM_UPDATE"
          component={DetailItemUpdateModal}
        />
        <ModalDef
          id="MODAL_DETAIL_SUB_ITEM_UPDATE"
          component={DetailSubItemUpdateModal}
        />
      </ColumnWrapper>
    </FormProvider>
  );
};

export default SummaryPage;
