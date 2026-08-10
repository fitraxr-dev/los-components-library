'use client';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalReassign from '@/components/shared/SmiModal/ModalReassign';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { MODAL } from './MonitoringList.contant';
import useMonitoringList from './MonitoringList.hook';


const MonitoringListPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    setFilter,
    filterContentList,
    filterDropdownList,
    isLoading,
    tableHeaderMonitoring,
    page,
    setPage,
    setPageSize,
    handleClickReassignTo,
    monitoringList,
    monitoringPage,
    selectedTask,
    filter,
  } = useMonitoringList();

  return (
    <>
      <Title title="Monitoring High Risk Assesment List" />
      <ColumnWrapper gap={theme.spacing(1)} marginBottom={theme.spacing(5)}>
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
        <BaseContainer sx={{ boxShadow: 7 }} >
          <Table
            isLoading={isLoading}
            tableHeader={tableHeaderMonitoring}
            tableData={monitoringList}
            totalPage={monitoringPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>
      {
        selectedTask.length > 0 && (
          <RowWrapper justifyContent="end" py={3}>
            <Button
              disabled={selectedTask.length === 0}
              onClick={handleClickReassignTo}
            >
              Re-assign to
            </Button>
          </RowWrapper>
        )
      }
      <ModalDef
        id={MODAL.REASSIGN_TO}
        component={ModalReassign}
      />
    </>
  );
};

export default MonitoringListPage;
