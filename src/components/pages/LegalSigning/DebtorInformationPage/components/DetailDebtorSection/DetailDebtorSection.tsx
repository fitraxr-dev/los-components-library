'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';


import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';

import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';


const DetailDebtorSection = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.LEGAL_SIGNING,
  });
  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);

  return (
    <Box>
      <SectionTitle title="Detail Customer" isOpen>
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
            <Input
              disabled
              type="text"
              label="Nama Customer"
              value={debtorInfoData?.debtorName}
              containerSx={{ flex: 1 }}
            />
            <Input
              disabled
              type="text"
              label="Hubungan dengan SMI Sejak Tahun"
              placeholder="contoh: Sejak 2020"
              value={debtorInfoData?.relationshipSince}
              containerSx={{ flex: 1 }}
            />
            <Input
              disabled
              type="text"
              label="Tahun Didirikan"
              placeholder="contoh: Sejak 2020"
              value={debtorInfoData?.yearFounded}
              containerSx={{ flex: 1 }}
            />
            <Input
              disabled
              type="radio"
              label="Terafiliasi dengan SMI"
              value={debtorInfoData?.isAffiliate ? 'y' : 'n'}
              radioList={[
                {
                  label: 'Ya',
                  value: 'y',
                },
                {
                  label: 'Tidak',
                  value: 'n',
                },
              ]}
              sx={{ flex: 1 }}
            />
            <Input
              disabled
              type="text"
              label="Jenis Sektor Usaha"
              placeholder="Input Jenis Sektor Usaha"
              value={debtorInfoData?.sectorName}
              containerSx={{ flex: 1 }}
            />
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Input
                disabled
                type="text"
                label="Contact Person"
                placeholder="Input Contact Person"
                value={debtorInfoData?.contactPerson}
                containerSx={{ flex: 1 }}
              />
              <Input
                disabled
                type="dropdown"
                label="Jabatan"
                placeholder="Select Jabatan"
                value={debtorInfoData?.positionId}
                dropdownList={jobPositionData}
                containerSx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </BaseContainer>
      </SectionTitle>
    </Box>

  );
};

export default DetailDebtorSection;
