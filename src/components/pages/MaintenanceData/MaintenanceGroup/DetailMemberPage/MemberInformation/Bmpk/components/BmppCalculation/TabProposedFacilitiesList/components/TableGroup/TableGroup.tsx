'use client';

import { TableCell, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { mockGroupData } from '../../../TabExistingFacilitiesList/__mock_data__';

import useTableGroup from './TableGroup.hook';

import type { TableGroupProps } from './TableGroup.types';


const TableGroup = (props: TableGroupProps) => {
  const theme = useTheme();
  const {
    tableHeader,
  } = props;

  const {
    noPage,
    setItemPerPage,
    tableDataGroupProposed,
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
    const tableData = tableDataGroupProposed;

    const groupNameMap = new Map();
    if (props.groupDataFallback && props.groupDataFallback.length > 0) {
      props.groupDataFallback.forEach((group) => {
        if (group?.id && group?.name) {
          groupNameMap.set(group.id, group.name);
        }
      });
    }

    return tableData?.map((data, index) => {
      const table = data.data;

      let groupName = '';

      if (groupNameMap.size > 0 && props.data && props.data[index]) {
        const groupFromData = props.data[index] as any;
        const groupIdFromData = groupFromData?.id || groupFromData?.groupCode || groupFromData?.value;
        if (groupIdFromData) {
          groupName = groupNameMap.get(groupIdFromData) || '';
        }

        if (!groupName && props.groupDataFallback && props.groupDataFallback[index]) {
          groupName = props.groupDataFallback[index]?.name || '';
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
                        {table?.additionalData?.total ? `IDR ${table?.additionalData?.total}` : '-'}
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
