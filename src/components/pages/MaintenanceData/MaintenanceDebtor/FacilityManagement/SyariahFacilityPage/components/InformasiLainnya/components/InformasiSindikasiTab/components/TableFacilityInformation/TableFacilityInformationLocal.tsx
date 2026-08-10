'use client';
import { Box, useTheme } from '@mui/material';

import { formatDateTime, toDateString } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import SectionTitle from '@/components/shared/SectionTitle';

import type { FacilityInformationProps } from './TableFacilityInformationLocal.types';


const TableFacilityInformation = ({
  title,
  facilityID,
  facilityNo,
  rm,
  divisi,
  modifiedBy,
  lastModified,
}: FacilityInformationProps) => {
  const theme = useTheme();

  return (
    <SectionTitle title={title || 'Facility Information'} subtitle={`Facility No: ${facilityNo ? facilityNo : '-'} | RM: ${rm ? rm : '-'} | Divisi: ${divisi ? divisi : '-'}`}>
      <BaseContainer
        sx={{
          boxShadow: 2,
          maxWidth: '100%',
          mt: theme.spacing(3),
          padding: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(2),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Cell title="Facility ID" value={facilityID ?? '-'} />
          <Cell title="Facility No" value={facilityNo ?? '-'} />
          <Cell title="RM" value={rm ?? '-'} />
          <Cell title="Divisi" value={divisi ?? '-'} />
          <Cell title="Modified By" value={modifiedBy ?? '-'} />
          <Cell title="Last Modified" value={lastModified ? formatDateTime(lastModified) : '-'} />
        </Box>
      </BaseContainer>
    </SectionTitle>
  );
};

export default TableFacilityInformation;
