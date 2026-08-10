'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';

import TableDebtorInformationSyariah from '../TableDebtorInformationLocal';
import TopMenu from '../TopMenu';

import DataStatisFasilitas from './components/DataStatisFasilitas';
import IdLimit from './components/IdLimit';
import InformasiLimit from './components/InformasiLimit';
import useLimitInduk from './LimitInduk.hook';


const LimitInduk = () => {
  const {
    idInduk,
    isDebtor,
  } = useLimitInduk();

  return (
    <ColumnWrapper marginY={3} sx={{ gap: 3 }}>
      <TopMenu type="limit-induk" idInduk={idInduk} />

      {isDebtor ?
        <TableDebtorInformationSyariah title="Limit Induk" />
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
    </ColumnWrapper>
  );
};
export default LimitInduk;
