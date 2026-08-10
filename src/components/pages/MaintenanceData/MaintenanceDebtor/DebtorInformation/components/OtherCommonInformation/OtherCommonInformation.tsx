import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useOtherCommonInformation from './OtherCommonInformation.hooks';


const OtherCommonInformation = () => {
  const theme = useTheme();
  const { control } = useOtherCommonInformation();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Informasi Umum Lainnya"></SectionTitle>

      <BaseContainer
        sx={{
          boxShadow: 2,
          maxWidth: '100%',
          padding: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            name="anotherInformation.totalFinanceDebtor"
            control={control}
            render={({ field: { onChange, ref, value, name } }) =>
              <Input
                ref={ref}
                name={name}
                value={value}
                label="Total Pembiayaan Per Customer"
                placeholder="Masukkan Total Pembiayaan Per Customer"
                thousandSeparator
                type="number"
                onValueChange={(values) => {
                  onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="anotherInformation.portionOfFinance"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Porsi Pembiayaan SMI - Per Customer"
                placeholder="Masukkan Porsi Pembiayaan SMI - Per Customer"
                type="text"
              />
            }
          />

          <Controller
            name="anotherInformation.relation"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Informasi Berelasi"
                placeholder="Masukkan Informasi Berelasi"
                type="dropdown"
                dropdownList={[
                  { label: 'Ya', value: 'Ya' },
                  { label: 'Tidak', value: 'Tidak' },
                ]}
              />
            }
          />

          <Controller
            name="anotherInformation.affiliate"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Terafiliasi Dengan DMI"
                placeholder="Masukkan Terafiliasi Dengan DMI"
                type="dropdown"
                dropdownList={[
                  { label: 'Ya', value: 'Ya' },
                  { label: 'Tidak', value: 'Tidak' },
                ]}
              />
            }
          />

          <Controller
            name="anotherInformation.since"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Tahun Didirikan"
                placeholder="Masukkan Tahun Didirikan"
                type="text"
              />
            }
          />

          <Controller
            name="anotherInformation.typeOfBusinessSector"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Jenis Sektor Utama"
                placeholder="Masukkan Jenis Sektor Utama"
                type="text"
              />
            }
          />
          <Controller
            name="anotherInformation.relationWithSmi"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Hubungan Dengan PT SMI"
                placeholder="Masukkan Hubungan Dengan PT SMI"
                type="text"
              />
            }
          />

          <Controller
            name="anotherInformation.detailRelationship"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Detail Hubungan Dengan PT SMI"
                placeholder="Masukkan Detail Hubungan Dengan PT SMI"
                type="text"
              />
            }
          />

          <Controller
            name="anotherInformation.coBorrowerStatus"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Co Borrower Status"
                placeholder="Masukkan Co Borrower Status"
                type="text"
              />
            }
          />

          <Controller
            name="anotherInformation.coBorrowerView"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="View Co Borrower"
                placeholder="View Co Borrower"
                type="text"
              />
            }
          />

          <Controller
            name="anotherInformation.gam"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="General Account Manager"
                placeholder="Masukkan General Account Manager"
                type="text"
              />
            }
          />

          <Controller
            name="anotherInformation.lastModified"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Last Modified"
                placeholder="Masukkan Last Modified"
                type="text"
              />
            }
          />

          <Controller
            name="anotherInformation.modifiedBy"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Modified By"
                placeholder="Masukkan Modified By"
                type="text"
              />
            }
          />

        </Box>
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default OtherCommonInformation;
