import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';

import { formatDateTime } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useExistingFacilityTab from './ExistingFacilityTab.hook';


const ExistingFacilityTab = () => {
  const theme = useTheme();

  const {
    itemPerPage,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
    konvenList,
    filter,
    handleSyncArium,
    setFilter,
    filterDropdownList,
    filterContentList,
    anomalyRowStyle,
  } = useExistingFacilityTab();
  const konvenDataTemp = konvenList as any;

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <RowWrapper justifyContent="space-between">
        <Box sx={{ alignItems: 'center', display: 'flex', flex: 1, minWidth: 0, pr: theme.spacing(2) }}>
          <Box sx={{ flex: '0 0 auto', width: '70%' }}>
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
        </Box>

        <Button
          startIcon="sync"
          onClick={handleSyncArium}
          variant="outlined"
        >
          Sync with Arium
        </Button>
      </RowWrapper>
      <RowWrapper alignItems="center" gap={theme.spacing(2)}>
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.custom.text}
        >
          Data as of : {konvenDataTemp?.data?.additionalData?.lastUpdate ? formatDateTime(konvenDataTemp?.data?.additionalData?.lastUpdate) : '-'}
        </TextStyle>
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.error.main}
        >
          <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
            <Box sx={{ alignItems: 'center', display: 'flex' }}>
              <Icon iconName="information-shape" />
            </Box>
          </Tooltip>
        </TextStyle>
      </RowWrapper>

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableData={konvenDataTemp?.data?.contents ?? []}
          tableHeader={tableHeader}
          pageSize={itemPerPage}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          totalPage={konvenDataTemp?.data?.page?.totalPage ?? 1}
          anomalyRow={anomalyRowStyle}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default ExistingFacilityTab;
