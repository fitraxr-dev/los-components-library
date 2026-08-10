'use client';

import React, { useEffect, useState } from 'react';

import { TableCell, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';

import useGetExistingLists from '../hooks/useGetDebtorExistingLists';

import useTableGroup from './TableGroup.hook';

import type { TableGroupProps } from './TableGroup.types';


const TableGroup = (props: TableGroupProps) => {
  const theme = useTheme();
  const {
    tableHeader,
    withAddButton,
    handleOpenAddModal,
    viewOnly,
    groupDataFallback,
  } = props;

  const {
    totalNominalIdr,
    hasEditableGroup,
    noPage,
    setItemPerPage,
    tableDataGroupExisting,
    dataPages,
    setDataPages,
    withConditional,
  } = useTableGroup(props);

  function handleClick(page, index) {
    const nextArr = dataPages.map((data, i) => {
      if (i === index) {
        return page;
      } else {
        return data;
      }
    });
    setDataPages(nextArr);
  }

  const renderTableRows = () => {
    const tableData = tableDataGroupExisting;
    return tableData?.map((data, index) => {
      const table = data.data;

      // Get group name - fallback to groupDataFallback if table.group is undefined
      let groupName = '';
      if (table?.group?.name) {
        groupName = table.group.name;
      } else if (groupDataFallback && groupDataFallback.length > 0) {
        // Try to match by group ID
        const groupId = table?.group?.id;
        if (groupId) {
          const matchingGroup = groupDataFallback.find((group) => group?.id === groupId);
          groupName = matchingGroup?.name || '';
        } else {
          // If no group ID in table, use the fallback group name directly
          groupName = groupDataFallback[index]?.name || '';
        }
      }
      return (
        <>
          <SectionTitle title={`Group ${index + 1} ${groupName}`} sx={{ mt: 2 }} isOpen>
            <BaseContainer sx={{ boxShadow: 2 }}>
              <Table
                key={table?.group?.id}
                isLoading={data.isFetching}
                tableHeader={tableHeader}
                tableData={table?.contents}
                totalPage={table?.page?.totalPage ?? 1}
                currentPage={dataPages[index]}
                handlePageChange={(page) => handleClick(page, index)}
                onPageSizeChange={setItemPerPage}
                withConditional={withConditional}
                footer={withAddButton && !table?.additionalData?.hasPlan && (
                  <TableFooter
                    disabled={viewOnly || hasEditableGroup}
                    onClick={() => handleOpenAddModal(table?.group?.id)}
                    sx={{ mt: 2 }}
                  />
                )}
                renderAdditonalRow={() => (
                  <>
                    <TableCell colSpan={9}>
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
                        sx={{ float: 'right', whiteSpace: 'nowrap' }}
                      >
                        {table?.additionalData?.totalPlafondExistingInIdr ? `IDR ${table?.additionalData?.totalPlafondExistingInIdr}` : '-'}
                      </TextStyle>
                    </TableCell>
                    <TableCell>
                      <TextStyle
                        variant="body4"
                        weight={600}
                        color={theme.palette.primary.main}
                        sx={{ float: 'right', whiteSpace: 'nowrap' }}
                      >
                        {table?.additionalData?.totalOutstanding ? `IDR ${table?.additionalData?.totalOutstanding}` : '-'}
                      </TextStyle>
                    </TableCell>
                    <TableCell>
                      <TextStyle
                        variant="body4"
                        weight={600}
                        color={theme.palette.primary.main}
                        sx={{ float: 'right', whiteSpace: 'nowrap' }}
                      >
                        {table?.additionalData?.totalLeewayUnfiltered ? `IDR ${table?.additionalData?.totalLeewayUnfiltered}` : '-'}
                      </TextStyle>
                    </TableCell>
                  </>
                )}
              />
            </BaseContainer>
          </SectionTitle>
        </>
      );
    });
  };

  return <>{renderTableRows()}</>;
};

export default TableGroup;
