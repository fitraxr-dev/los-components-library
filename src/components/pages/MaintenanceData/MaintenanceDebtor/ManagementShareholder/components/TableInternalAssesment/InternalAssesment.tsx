'use client';


import { Box, Tooltip, useTheme } from '@mui/material';

import { formatDateTime } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useInternalAssesment from './InternalAssesment.hook';


const showComingSoon = false;

const InternalAssesment = (props) => {
  const theme = useTheme();
  const {
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
    isLoading,
    tableHeader,
    tableData,
    tablePage,
    noPage,
    setNoPage,
    setItemPerPage,
    dataAsOf,
  } = useInternalAssesment(props);

  if (showComingSoon) {
    return (
      <ColumnWrapper gap={theme.spacing(3)}>
        <EmptyPlaceholder status="coming-soon" />
      </ColumnWrapper>
    );
  }


  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Box width="45vw">
        <Input
          type="search"
          value={filter}
          hasFilter
          onChange={setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          useMinChar={false}
          contentList={filterContentList}
        />
      </Box>
      <RowWrapper alignItems="center" gap={theme.spacing(2)}>
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.custom.text}
        >
          Data as of : {dataAsOf ? formatDateTime(dataAsOf) : '-'}
        </TextStyle>
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.error.main}
        >
          <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
            <Box display="flex" alignItems="center">
              <Icon iconName="information-shape" />
            </Box>
          </Tooltip>
        </TextStyle>
      </RowWrapper>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={tableData}
          totalPage={tablePage?.totalPage ?? 1}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
        />

      </BaseContainer>
    </ColumnWrapper>
  );
};

export default InternalAssesment;
