'use client';

import React from 'react';

import { TableCell, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useTableGroup from './TableGroup.hook';

import type { TableGroupProps } from './TableGroup.types';


const TableGroup = (props: TableGroupProps) => {
  const theme = useTheme();
  const {
    idx,
    data,
    tableHeader,
    isLoading,
  } = props;

  const {
    totalNominalIdr,
    tableDataContents,
  } = useTableGroup(props);

  return (
    <>
      <SectionTitle title={`Group ${idx} ${data.groupName}`} isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableDataContents}
            renderAdditonalRow={() => (
              <>
                <TableCell colSpan={8}>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    Total
                  </TextStyle>
                </TableCell>
                <TableCell>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    {totalNominalIdr}
                  </TextStyle>
                </TableCell>
              </>
            )}
          />
        </BaseContainer>
      </SectionTitle>
    </>
  );
};

export default TableGroup;
