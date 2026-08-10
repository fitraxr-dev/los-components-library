'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';

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
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    monitoringList,
    monitoringPage,
    isLoading,
    setFilter,
    filter,
    page,
    setPage,
    setItemPerPage,
    filterContentList,
    filterDropdownList,
    tableHeaderMonitoring,
    handleClickReassignTo,
    selectedTask,
  } = useMonitoring();


  return (
    <>
      <Title title="Monitoring" />
      <ColumnWrapper gap={theme.spacing(1)} marginBottom={theme.spacing(5)}>
        <Box width="45vw">
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian"
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>
        <BaseContainer sx={{ boxShadow: 7 }} >
          <Table
            isLoading={isLoading}
            tableHeader={tableHeaderMonitoring}
            tableData={monitoringList}
            totalPage={monitoringPage?.totalPage}
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
      <ModalDef
        id={MODAL.REASSIGN_TO}
        component={ModalReassign}
        defaultProps={{
          isRiviewAssign: true,
        }}
      />
    </>

  );
};

export default Monitoring;
