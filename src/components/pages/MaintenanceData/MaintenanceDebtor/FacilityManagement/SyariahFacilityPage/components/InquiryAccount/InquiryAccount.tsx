'use client';

import React from 'react';

import { Box } from '@mui/material';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import TableDebtorInformationSyariah from '../TableDebtorInformationLocal';

import useInquiryAccount from './InquiryAccount.hook';


const InquiryAccount = () => {
  const {
    isMaster,
    processId,
    router,
    sectionInquiryAccount,
    theme,
    isDebtor,
  } = useInquiryAccount();

  return (
    <>
      <Title title="Inquiry Account" />
      <ColumnWrapper marginY={3} sx={{ gap: 3 }}>
        {isDebtor ?
          <TableDebtorInformationSyariah title="Inquiry Account" />
          :
          <TableDebtorInformation
            isMaintenanceCustomer={true}
            module={TypeModule.MAINTENANCE_DATA}
            process={TypeProcess.MAINTENANCE_CUSTOMER}
          />
        }

        <ColumnWrapper
          sx={{
            boxShadow: 0,
            gap: theme.spacing(3),
            maxWidth: '100%',
            mt: theme.spacing(3),
          }}
          px={3}
        >
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {sectionInquiryAccount && sectionInquiryAccount.map((item) => (
              <Input
                disabled
                key={item.key}
                type="text"
                label={item.label}
                placeholder={item.placeHolder}
                value={item.value}
              />
            ))}
          </Box>
        </ColumnWrapper>

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

export default InquiryAccount;
