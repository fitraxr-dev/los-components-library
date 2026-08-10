'use client';

import { Box, Tooltip, useTheme } from '@mui/material';


import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useInternalAssessment from './InternalAssessment.hooks';

import type { internalAssessmentProps } from './InternalAssement.types';


const InternalAssessment = (props: internalAssessmentProps) => {
  const theme = useTheme();
  const {
    tableHeaderCreditChecking,
    filter,
    setFilter,
    filterContentList,
    filterDropdownList,
    dataAsOf,
    tableData,
    itemPerPage,
    setItemPerPage,
    noPage,
    setNoPage,
    totalPage,
    isLoading,
  } = useInternalAssessment(props);

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3), paddingY: theme.spacing(3) }}>
      <Title title="Internal Assessment" />
      <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.custom.text}
        >
          Data as of : {dataAsOf}
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
      <BaseContainer>
        {/* <Table
          tableHeader={tableHeaderCreditChecking}
          tableData={tableData}
          pageSize={itemPerPage}
          isLoading={isLoading}
          totalPage={totalPage ?? 1}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
        /> */}
        <EmptyPlaceholder status="coming-soon" />

      </BaseContainer>
    </ColumnWrapper>
  );
};

export default InternalAssessment;
