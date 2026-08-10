import React from 'react';

import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useLimitIndukSyariah from './TableLimitIndukSyariah.hook';


const TableLimitIndukSyariah = () => {
  const theme = useTheme();
  const {
    filter,
    processList,
    isLoading,
    setPage,
    setPageSize,
    page,
    tableHeader,
    setFilter,
    filterDropdownList,
    filterContentList,
    processPage,
    isViewOnly,
    gotoAddPage,
    anomalyRow,
    canAddNew,
    isHidden,
  } = useLimitIndukSyariah();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <SectionTitle
        title="Limit Induk Syariah"
        isOpen
      >
        <Box sx={{ width: '45vw' }}>
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
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={processList}
            totalPage={processPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            isLoading={isLoading}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRow}
            footer={
              (
                <RowWrapper
                  sx={{ justifyContent: 'end', mb: 2 }}
                >
                  {!isHidden &&
                    <Button
                      variant="outlined"
                      startIcon="add-2"
                      startIconSx={{ fontSize: theme.spacing(3) }}
                      sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                      onClick={gotoAddPage}
                      disabled={isViewOnly || !canAddNew}
                    >
                      Add New
                    </Button>
                  }
                </RowWrapper>
              )
            }
          />
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default TableLimitIndukSyariah;
