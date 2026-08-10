'use client';
import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Icon from '@/components/shared/Icon';
import Search from '@/components/shared/Input/components/Search';
import Input from '@/components/shared/Input/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useTabInternalAssessment from './TabInternalAssessment.hook';

import type { TabInternalAssessmentProps } from './TabInternalAssessment.types';


const TabInternalAssessment = (props: TabInternalAssessmentProps) => {
  const { isDetailPage } = props;
  const theme = useTheme();

  const {
    filterContentList,
    filterDropdownList,
    handleClose,
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
    filter,
    setFilter,
  } = useTabInternalAssessment();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Box width="45vw">
        <Input
          type="search"
          value={filter}
          hasFilter
          onChange={setFilter}
          dropdownList={filterDropdownList}
          contentList={filterContentList}
          placeholder="Pencarian..."
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        borderBottom="1px dotted"
        width="fit-content"
        borderColor={theme.palette.primary.main}
      >
        <TextStyle
          variant="body4"
          weight={500}
          color={theme.palette.primary.main}
        >
          Data as of : 25 Oktober 2024
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
      {/* <Table
        tableHeader={tableHeader}
        tableData={tableData}
        currentPage={noPage}
        totalPage={tablePage?.totalPage ?? 1}
        onPageSizeChange={setItemPerPage}
        handlePageChange={setNoPage}
      /> */}
      <EmptyPlaceholder status="coming-soon" />

      {isDetailPage && (
        <RowWrapper justifyContent="end">
          <Button variant="outlined" onClick={handleClose}>Close</Button>
        </RowWrapper>
      )}
    </ColumnWrapper>
  );
};

export default TabInternalAssessment;
