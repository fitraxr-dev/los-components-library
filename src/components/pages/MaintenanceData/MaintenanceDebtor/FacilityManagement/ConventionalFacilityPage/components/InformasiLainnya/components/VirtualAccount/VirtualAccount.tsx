import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatNumber } from '@/helpers/utils';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';

import useInformasiLainnya from '../../InformasiLainnya.hook';

import { useVirtualAccount } from './VirtualAccount.hooks';


const VirtualAccount = () => {
  const { control, theme, watch } = useVirtualAccount();
  return (
    <>
      <Title title="Virtual Account" />
      <ColumnWrapper sx={{ gap: 3 }}>

        <SectionTitle
          isOpen
          title="Virtual Account"
          subtitle="test"
        >
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            <Controller
              name="bankNameVirtualAccount"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Bank name virtual account"
                  placeholder="Bank name virtual account"
                  type="text"
                  disabled
                />
              }
            />

            <Controller
              name="virtualAccountNumber"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Virtual Account Number"
                  placeholder="Virtual Account Number"
                  type="text"
                  disabled

                //hasDataMaster={detailProyek?.data?.content?.projectInformation?.name?.updated ? 'HasUpdate' : ''}
                />
              }
            />

            <Controller
              name="currencyVirtualAccount"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Currency Virtual Account"
                  placeholder="Currency Virtual Account"
                  type="date"
                  disabled
                // hasDataMaster={
                //   detailProyek?.data?.content?.projectInformation?.startDate?.updated
                //     ? 'HasUpdate'
                //     : ''
                // }
                />
              )}
            />

            <Controller
              name="statusVirtualAccount"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Status Virtual Account"
                  placeholder="Status Virtual Account"
                  type="date"
                  disabled
                // hasDataMaster={
                //   detailProyek?.data?.content?.projectInformation?.endDate?.updated
                //     ? 'HasUpdate'
                //     : ''
                // }
                />
              )}
            />

            <Controller
              name="modifiedBy"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Modified By"
                  placeholder="Modified By"
                  type="text"
                  disabled

                // hasDataMaster={detailProyek?.data?.content?.projectInformation?.outputUnit?.updated ?
                // 'HasUpdate' : ''}
                />
              }
            />

            <Controller
              name="lastModified"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Last Modified"
                  placeholder="Last Modified"
                  type="text"

                  disabled
                  // hasDataMaster={detailProyek?.data?.content?.projectInformation?.description?.updated ?
                  // 'HasUpdate' : ''}
                />
              }
            />
          </Box>
        </SectionTitle>
        <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2, pt: 3 }}>
          <Button
            onClick={() => console.log('SAVED!')}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </>
  );
};
export default VirtualAccount;
