import React from 'react';

import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const DigitalMemo = () => {
  const theme = useTheme();

  const TABLE_HEADER: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'creditorId',
      label: 'Jenis Dokumen',
      render: (row, index) => (
        <Input
          placeholder="Jenis Dokumen"
          containerSx={{ flex: 1 }}
          type="dropdown"
          dropdownList={[]}
        />
      ),
      sx: { width: '90%' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'delete', onClick: (_: any, index: number) => { } },
      ],
      type: 'action',
    },
  ];


  return (
    <BaseContainer sx={{ boxShadow: 2, p: 2 }}>
      <Table
        tableHeader={TABLE_HEADER}
        tableData={[
          {
            creditorId: 'PT. Bank Central Asia Tbk',
          },
        ]}
        totalPage={1}
        currentPage={1}
        handlePageChange={() => { }}
        pageSize={10}
        footer={
          <ColumnWrapper sx={{ pb: 3 }}>
            <RowWrapper
              sx={{
                borderBottom: '0.02vw solid',
                borderColor: theme.palette.custom.gray30,
                justifyContent: 'end',
                mb: 4,
              }}
            >
              <Box sx={{ mb: 2 }} >
                <Button
                  variant="outlined"
                  startIcon="add-2"
                  startIconSx={{ fontSize: theme.spacing(3) }}
                  sx={{
                    height: theme.spacing(6),
                    padding: theme.spacing(1),
                  }}
                >
                  Add New
                </Button>
              </Box>
            </RowWrapper>
          </ColumnWrapper>
        }
      />
    </BaseContainer>);
};

export default DigitalMemo;
