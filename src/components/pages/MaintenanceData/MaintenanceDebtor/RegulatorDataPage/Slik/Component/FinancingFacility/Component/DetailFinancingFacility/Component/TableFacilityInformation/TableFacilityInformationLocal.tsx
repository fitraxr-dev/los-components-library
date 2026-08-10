'use client';
import { Box, useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';

import { formatDateTime, toDateString } from '@/helpers/date';
import useIdentity from '@/hooks/useIdentity';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';
import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import SectionTitle from '@/components/shared/SectionTitle';

import useGetSlikFinancingFacilityList from '../../../../hooks/UseGetSlikFacilityList';

import type { FacilityInformationProps } from './TableFacilityInformationLocal.types';


const TableFacilityInformationSlik = () => {

  const { processId } = useIdentity();
  const { id } = useParams();
  const params = useSearchParams();
  const isKonven = params.get('isKonven') === 'true';
  const { data: facilityInformation } = useGetSlikFinancingFacilityList({
    filter: {
      ...payloadFilterList(processId),
      isKonven: isKonven,
    },
    page: {
      itemPerPage: 1,
      noPage: 1,
    },
    searchDetail: { key: 'facilityId', value: id },

  });

  const facilityData = (facilityInformation as any)?.data?.contents[0];
  const theme = useTheme();

  return (
    <SectionTitle title="Facility Information" isOpen sx={{ mb: 3, mt: theme.spacing(3) }}>
      <BaseContainer
        sx={{
          boxShadow: 2,
          maxWidth: '100%',
          my: theme.spacing(3),
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
          {!isKonven ? (
            <>
              <Cell title="Kode Induk" value={facilityData?.parentFacilityNo ?? '-'} />
              <Cell title="Financing Type" value={facilityData?.financingType ?? '-'} />
              <Cell title="Fasilitas Induk Id" value={facilityData?.parentLimitId ?? '-'} />
              <Cell title="Product Type" value={facilityData?.productType ?? '-'} />
              <Cell title="Kode Anak" value={facilityData?.childFacilityCode ?? '-'} />
              <Cell title="Akad" value={facilityData?.syariahContract ?? '-'} />
              <Cell title="Fasilitas Anak Id" value={facilityData?.childFacilityCoreId ?? '-'} />
            </>
          ) : (
            <>
              <Cell title="Application No." value={facilityData?.applicationNo ?? '-'} />
              <Cell title="Facility ID" value={facilityData?.facilityCore ?? '-'} />
              <Cell title="Facility No." value={facilityData?.facilityNo ?? '-'} />
              <Cell title="Financing Type" value={facilityData?.financingType ?? '-'} />
              <Cell title="Product Type" value={facilityData?.productType ?? '-'} />
            </>
          )}


          {/* <Cell title="ID Limit" value={facilityData?.idLimit ?? '-'} /> */}
        </Box>
      </BaseContainer>
    </SectionTitle>
  );
};

export default TableFacilityInformationSlik;
