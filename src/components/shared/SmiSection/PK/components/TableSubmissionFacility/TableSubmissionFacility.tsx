import React from 'react';

import { TableCell } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useTableSubmissionFacility from './TableSubmissionFacility.hook';


const TableSubmissionFacility = () => {

  const {
    tableHeader,
    isLoading,
    theme,
    totalOrder,
    facilityListContents,
  } = useTableSubmissionFacility();

  return (
    <ColumnWrapper sx={{ gap: 3, py: 3 }}>
      <SectionTitle title="Perikatan Berdasarkan Fasilitas" isOpen>
        <Table
          isPaper
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={facilityListContents}
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
                  {totalOrder}
                </TextStyle>
              </TableCell>

            </>
          )}
        />
      </SectionTitle>

    </ColumnWrapper>
  );
};

export default TableSubmissionFacility;
