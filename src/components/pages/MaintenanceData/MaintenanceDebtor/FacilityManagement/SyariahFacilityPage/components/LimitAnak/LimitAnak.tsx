'use client';

import { Box } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';

import SyariahForm from '../SyariahForm/SyariahForm';
import TableDebtorInformationSyariah from '../TableDebtorInformationLocal';
import TopMenu from '../TopMenu';

import DataStatisFasilitas from './components/DataStatisFasilitas';
import IdLimit from './components/IdLimit';
import InformasiLimit from './components/InformasiLimit';
import useLimitAnak from './LimitAnak.hook';


const LimitAnak = () => {
  const {
    data,
    paymentScheme,
    id,
    isDebtor,
    topMenuType,
  } = useLimitAnak();

  return (
    <ColumnWrapper marginY={3} sx={{ gap: 3 }}>
      <TopMenu type={topMenuType} />

      {isDebtor ?
        <TableDebtorInformationSyariah title="Limit Anak" />
        :
        <TableDebtorInformation
          isMaintenanceCustomer={true}
          module={TypeModule.MAINTENANCE_DATA}
          process={TypeProcess.MAINTENANCE_CUSTOMER}
        />
      }

      <IdLimit />
      <InformasiLimit />
      <DataStatisFasilitas />
      <Box
        display="flex"
        flexDirection="column"
        px={3}
        gap={3}
      >
        <SyariahForm
          onChangeSyariahForm={(e) => {console.log('e: ', e);}}
          paymentScheme={paymentScheme}
          financingFacilityData={data}
          existing={true} //existing
          facilityId={id as string} //facilityId
          disabled
        />
      </Box>
    </ColumnWrapper>
  );
};
export default LimitAnak;
