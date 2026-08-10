import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useTabIndividual from './TabIndividual.hook';


const TabIndividual = () => {
  const {
    theme,
    dataAsOfDateBmpp,
    tableData,
    tableHeader,
    page,
    setPage,
    setPageSize,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
    isLoading,
    totalData,
  } = useTabIndividual();

  return (
    <SectionTitle title="BMPK/BMPD/BMPP Individual" isOpen>
      <Box width="100%">
        <Input
          type="search"
          value={filter}
          onChange={setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          contentList={filterContentList}
        />
      </Box>

      <Box display="flex" alignItems="center" py={3} gap={1}>
        <TextStyle variant="body4">
          Data as of : { dataAsOfDateBmpp }
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
        <Table
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={tableData}
          currentPage={page}
          totalPage={totalData?.totalPage ?? 1}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </BaseContainer>

    </SectionTitle>
  );
};

export default TabIndividual;
