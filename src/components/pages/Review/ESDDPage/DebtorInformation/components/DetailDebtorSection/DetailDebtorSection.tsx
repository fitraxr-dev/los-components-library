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
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DLST,
  });
  const { data: institutionTypeData } = useGetParameterList(
    Modules.INSTITUTION_TYPE
  );

  const getTextValue = (value: any) => {
    return value && value !== '' ? value : '-';
  };

  const getRadioValue = (value: any) => {
    if (value === null) return 'n';
    return value ? 'y' : 'n';
  };

  return (
    <Box>
      <SectionTitle title="Detail Customer" isOpen sx={{ mb: 3 }}>
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
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Input
                disabled
                type="dropdown"
                label="Institution Type"
                value={getTextValue(debtorInfoData?.institutionType)}
                dropdownList={institutionTypeData}
                containerSx={{ flex: 1 }}
              />
              <Input
                disabled
                type="text"
                label="Nama Customer"
                value={getTextValue(debtorInfoData?.debtorName)}
                containerSx={{ flex: 1 }}
              />
            </Box>
            <Input
              disabled
              type="text"
              label="Hubungan dengan SMI Sejak Tahun"
              placeholder="contoh: Sejak 2020"
              value={getTextValue(debtorInfoData?.relationshipSince)}
              containerSx={{ flex: 1 }}
            />
            <Input
              disabled
              type="text"
              label="Tahun Didirikan"
              placeholder="contoh: Sejak 2020"
              value={getTextValue(debtorInfoData?.yearFounded)}
              containerSx={{ flex: 1 }}
            />
            <Input
              disabled
              type="radio"
              label="Terafiliasi dengan SMI"
              value={getRadioValue(debtorInfoData?.isAffiliate)}
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
              type="radio"
              label="Customer Memiliki Group"
              value={getRadioValue(debtorInfoData?.isGroup)}
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
              type="radio"
              label="Terkait dengan SMI"
              value={getRadioValue(debtorInfoData?.isRelatedToSmi)}
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
              label="Jenis Customer"
              value={getTextValue(debtorInfoData?.debtorTypeLabel)}
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
                value={getTextValue(debtorInfoData?.contactPerson)}
                containerSx={{ flex: 1 }}
              />
              <Input
                disabled
                type="text"
                label="Jabatan"
                placeholder="Input Jabatan"
                value={getTextValue(debtorInfoData?.position)}
                containerSx={{ flex: 1 }}
              />
            </Box>
            <Input
              disabled
              type="text"
              label="Jenis Sektor Usaha"
              placeholder="Input Jenis Sektor Usaha"
              value={getTextValue(debtorInfoData?.sectorName)}
              containerSx={{ flex: 1 }}
            />
          </Box>
        </BaseContainer>
      </SectionTitle>
    </Box>
  );
};

export default DetailDebtorSection;
