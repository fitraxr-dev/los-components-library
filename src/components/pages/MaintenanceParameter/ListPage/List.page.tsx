'use client';

import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from '../components/ApprovalStatusModal/ApprovalStatusModal';

import TemplateDocumentSection from './components/TemplateDocumentSection/TemplateDocumentSection';
import UploadResultModal from './components/UploadResultModal';
import useList from './List.hook';


const ListPage = () => {
  return <ListPageContent />;
};

const ListPageContent = () => {
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const { push, reset } = useBreadcrumbs();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-lov', label: 'Parameter LOV' });
  }, [push, reset]);

  const {
    activeTab,
    filter,
    filterContentList,
    filterDropdownList,
    handleChangeTab,
    handleOpenApprovalStatusModal,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeaderData,
    tableHeaderHistory,
    totalPage,
    isMaker,
  } = useList();

  React.useEffect(() => {
    const getActivityRemarks = () => {
      switch (activeTab) {
        case 'data':
          return 'view maintenance parameter lov data';
        case 'history':
          return 'view maintenance parameter lov history';
        default:
          return 'view maintenance parameter lov';
      }
    };

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: getActivityRemarks(),
    });
  }, [activeTab, recordActivity]);

  const tabItems = [
    { label: 'Data', value: 'data' },
    { label: 'History', value: 'history' },
  ];

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: !rowData?.isEditable ? '#FFF5E4' : 'inherit',
  });

  return (
    <>
      <Title title="Maintenance Parameter LOV" />
      <ColumnWrapper gap={theme.spacing(1)}>
        <RowWrapper justifyContent="space-between" alignItems="center">
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
            containerSx={{ width: '45vw' }}
          />
          <Button
            onClick={handleOpenApprovalStatusModal}
            variant="contained"
          >
            Approval Status
          </Button>
        </RowWrapper>
        {isMaker && (
          <TemplateDocumentSection onUploadComplete={() => handleChangeTab('history')} />
        )}

        <Tabs
          activeTab={activeTab}
          onChange={(val: string) => {
            const newTab = val as 'data' | 'history';
            handleChangeTab(newTab);
            recordActivity({
              activity: ActivityType.INITIAL_PAGE,
              remarks: `switch to ${newTab} tab in maintenance parameter lov`,
            });
          }}
          items={tabItems}
        />

        <TabItem activeValue={activeTab} value="data">
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              tableHeader={tableHeaderData}
              tableData={tableData}
              totalPage={totalPage ?? 1}
              currentPage={page}
              handlePageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              isLoading={isLoading}
              anomalyRow={anomalyRowStyle}
            />
          </BaseContainer>
        </TabItem>

        <TabItem activeValue={activeTab} value="history">
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              tableHeader={tableHeaderHistory}
              tableData={tableData}
              totalPage={totalPage ?? 1}
              currentPage={page}
              handlePageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              isLoading={isLoading}
            />
          </BaseContainer>
        </TabItem>
      </ColumnWrapper>

      <ModalDef
        id="APPROVAL_STATUS_MODAL_PARAMETER"
        component={ApprovalStatusModal}
      />

      <ModalDef
        id="PARAMETER_UPLOAD_RESULT_MODAL_LOV"
        component={UploadResultModal}
      />
    </>
  );
};

export default ListPage;
