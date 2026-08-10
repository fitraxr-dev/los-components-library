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

import { useFacilityInformation } from './FacilityInformation.hooks';


const FacilityInformation = () => {
  const { control, theme, watch } = useFacilityInformation();
  return (
    <>
      <Title title="Facility Information" />
      <ColumnWrapper sx={{ gap: 3 }}>

        <SectionTitle
          isOpen
          title="Facility Information"
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
              name="facilityId"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Facility Id"
                  placeholder="Facility Id"
                  type="text"
                  disabled
                />
              }
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
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
export default FacilityInformation;
