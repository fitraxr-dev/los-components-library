'use client';

import React from 'react';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import TableDebtorInformationSyariah from '../TableDebtorInformationLocal';

import IdLimit from './components/IdLimit';
import InformasiLimit from './components/InformasiLimit';
import InformasiLoanDeposit from './components/InformasiLoanDeposit';
import useInquiryLimit from './InquiryLimit.hook';


const InquiryLimit = () => {
  const {
    router,
    isDebtor,
    isMaster,
    processId,
  } = useInquiryLimit();

  return (
    <>
      <Title title="Inquiry Limit" />
      <ColumnWrapper marginY={3} sx={{ gap: 3 }}>
        {isDebtor ?
          <TableDebtorInformationSyariah title="Inquiry Limit" />
          :
          <TableDebtorInformation
            isMaintenanceCustomer={true}
            module={TypeModule.MAINTENANCE_DATA}
            process={TypeProcess.MAINTENANCE_CUSTOMER}
          />
        }

        <IdLimit />
        <InformasiLimit />
        <InformasiLoanDeposit />

        <RowWrapper sx={{ justifyContent: 'end', pb: 2, pt: 3 }}>
          <Button
            onClick={() => router.push(replacePath(maintenanceDebtor.SYARIAH_FACILITY_PAGE, {
              module: isMaster ? 'master' : 'maintenance',
              processId,
            }))}
            variant="outlined"
          >
            Close
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </>
  );
};

export default InquiryLimit;
