'use client';
import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalReassign from '@/components/shared/SmiModal/ModalReassign';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { useMonitoring } from './Monitoring.hook';


const Monitoring = () => {
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filter,
    monitoringList,
    isLoading,
    setFilter,
    page,
    setPage,
    setItemPerPage,
    filterContentList,
    filterDropdownList,
    tableHeaderMonitoring,
    selectedTask,
    monitoringPage,
    handleClickReassignTo,
  } = useMonitoring();

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.SPFP,
      process: TypeProcess.SPDP,
      remarks: 'view SPFP monitoring page',
    });
  }, [recordActivity]);


  return (
    <>
      <Title title="Monitoring Compliance Check" />
      <ColumnWrapper gap={theme.spacing(1)} marginBottom={theme.spacing(5)}>
        <Box width="45vw">
          <Input
            type="search"
            value={filter}
            hasFilter
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
            onPageSizeChange={setItemPerPage}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>

        <RowWrapper justifyContent="end">
          <Button
            disabled={selectedTask.length === 0}
            onClick={handleClickReassignTo}
          >
            Re-assign to
          </Button>
        </RowWrapper>
      </ColumnWrapper>

    </>

  );
};

export default Monitoring;
