import React from 'react';

import { TableCell, useTheme } from '@mui/material';

import useViewOnly from '@/hooks/useViewOnly';

import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';


import { TABLE_HEADER_PARENT } from './TableParent.constant';

import type { TableParentProps } from './TableParent.types';


const TableParent = (props: TableParentProps) => {
  const { viewOnly } = useViewOnly();
  const theme = useTheme();

  return (
    <SectionTitle title="Tingkat 1" isOpen sx={{ mb: 1 }}>
      {props.tableData?.length > 0 ? props.tableData.map((item, idx) => (
        item.shareholders?.map((holder, idx) => (
          (
            <Table
              key={idx}
              isPaper
              maxHeight="42vh"
              tableHeader={props.tableHeader}
              tableData={holder?.childList}
              renderAdditonalRow={() => (
                <>
                  <TableCell colSpan={1} />
                  <TableCell colSpan={1}>
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={theme.palette.primary.dark}
                    >
                      Total
                    </TextStyle>
                  </TableCell>
                  <TableCell colSpan={1}>
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={theme.palette.primary.dark}
                    >
                      {holder.totalShares || '-'}
                    </TextStyle>
                  </TableCell>
                  <TableCell>
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={theme.palette.primary.dark}
                    >
                      {holder.totalPercentage || 0}%
                    </TextStyle>
                  </TableCell>
                </>
              )}
              footer={
                !viewOnly && (props.lastLevel === item?.level) &&
                <TableFooter title="Add New Level" onClick={props.onAddNewLevel.bind(null, 2)} sx={{ mr: 2 }} />
              }
            />
          )
        ))
      )
      ) : <Table
        isPaper
        maxHeight="42vh"
        tableHeader={TABLE_HEADER_PARENT}
        tableData={[]}
        renderAdditonalRow={() => (
          <>
            <TableCell colSpan={1} />
            <TableCell colSpan={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.primary.dark}
              >
                Total
              </TextStyle>
            </TableCell>
            <TableCell colSpan={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.primary.dark}
              >
                -
              </TextStyle>
            </TableCell>
            <TableCell>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.primary.dark}
              >
                {0}%
              </TextStyle>
            </TableCell>
          </>
        )}
        isLoading={props.isLoading}
      />
      }
    </SectionTitle>
  );
};

export default TableParent;
