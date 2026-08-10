'use client';
import { useEffect } from 'react';

import { Box, useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useGetDetailCustomer from '../../../hooks/useGetDetailCustomer';


const DebtorDetailSection = () => {
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const { processId } = useIdentity();
  const [debtorIdFromProcess, bucketProcessId] = processId?.split('~') ?? [];


  const { data: debtorInfoData } = useGetDetailCustomer({
    id: debtorIdFromProcess,
  });
  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);

  useEffect(() => {
    if (debtorInfoData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.VA_CREATION,
        process: TypeProcess.VA_CREATION,
        remarks: 'view Virtual Account Detail',
      });
    }
  }, [debtorInfoData]);

  return (
    <SectionTitle isOpen={true} title="Detail Customer" sx={{ mb: 3 }}>
      <BaseContainer
        sx={{
          boxShadow: 2,
          maxWidth: '100%',
          mt: theme.spacing(2),
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
          <Cell title="Nama Customer" value={debtorInfoData?.customerDetail?.customerName ?? '-'} />
          <Cell
            title="Terafiliasi Dengan SMI"
            value={
              debtorInfoData?.customerDetail?.isRelatedSmi === undefined
                ? '-'
                : debtorInfoData?.customerDetail?.isRelatedSmi
                  ? 'Ya'
                  : 'Tidak'
            }
          />
          <Cell
            title="Tahun Didirikan"
            value={debtorInfoData?.customerDetail?.yearFounded ?? '-'}
          />
          <Cell
            title="Contact Person"
            value={debtorInfoData?.customerDetail?.contactPerson ?? '-'}
          />
          <Cell
            title="Jenis Sektor Usaha"
            value={debtorInfoData?.customerDetail?.sector ?? '-'}
          />
          <Cell
            title="Jabatan"
            value={debtorInfoData?.customerDetail?.position ?? '-'}
          />
          <Cell
            title="Hubungan dengan SMI Sejak Tahun"
            value={debtorInfoData?.customerDetail?.relatedWithSmiSince ?? '-'}
          />


        </Box>
      </BaseContainer>
    </SectionTitle>
  );
};

export default DebtorDetailSection;
