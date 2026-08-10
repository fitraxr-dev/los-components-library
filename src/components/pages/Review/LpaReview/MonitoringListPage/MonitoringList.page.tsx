'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import useApp from '@/hooks/useApp';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalReassign from '@/components/shared/SmiModal/ModalReassign';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useAssignmentList from './MonitoringList.hook';


const MonitoringList = () => {
  const [{ currentRole }] = useApp();
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filter,
    monitoringList,
    selected,
    filterContentList,
    filterDropdownList,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    handleClickReassignTo,
    monitoringPage,
    isLoading,
    isShowCheckbox,
    isTLKadiv,
    tableHeader } = useAssignmentList();

  return (
    <>
      <Title title={isTLKadiv ? 'Permohonan Review LPA List' : 'Monitoring Review LPA'} />
      <ColumnWrapper gap={theme.spacing(1)}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
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
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={monitoringList}
            totalPage={monitoringPage?.totalPage}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            anomalyRow={anomalyRowStyle}
          />

        </BaseContainer>

        {
          !isShowCheckbox &&
          <RowWrapper justifyContent="end">
            <Button
              disabled={selected.length === 0}
              onClick={handleClickReassignTo}
            >
              Re-assign to
            </Button>
          </RowWrapper>
        }
      </ColumnWrapper>

      <ModalDef
        id={MODAL.REASSIGN_TO}
        component={ModalReassign}
      />
    </>
  );
};

export default MonitoringList;
