/* eslint-disable max-len */
import { Box, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import Checkbox from '@/components/shared/CheckBox';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';

import useMemberInformationDetail from './MemberInformationDetail.hook';


const MemberInformationDetail = () => {
  const { control, handleSave, isEdit } = useMemberInformationDetail();

  const theme = useTheme();
  return (
    <ColumnWrapper sx={{ gap: 3, paddingY: theme.spacing(2) }}>
      {/* <TableDebtorInformation module={TypeModule.MAINTENANCE_DEBTOR} process={TypeProcess.MAINTENANCE_DEBTOR} /> */}
      <SectionTitle title="Member Information" isOpen>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="debtorId"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Customer ID"
                placeholder="Customer ID"
                type="text"
              />
            }
          />

          <Controller
            name="cif"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="CIF"
                placeholder="CIF"
                type="text"
              />
            }
          />

          <Controller
            name="institutionType"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Institution Type"
                placeholder="Institution Type"
                type="text"
              />
            }
          />

          <Controller
            name="name"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Customer"
                placeholder="Nama Customer"
                type="text"
              />
            }
          />

          <Controller
            name="industrailSector"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Sektor Industri"
                placeholder="Sektor Industri"
                type="text"
              />
            }
          />

          <Controller
            name="controlRelationships"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Hubungan Pengendalian"
                placeholder="Hubungan Pengendalian"
                type="text"
              />
            }
          />

          <Controller
            name="gam"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="General Account Manager"
                placeholder="Genenal Account Manager"
                type="text"
              />
            }
          />
        </Box>

        <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 2, padding: 2 }}>
          <TextStyle sx={{ fontSize: '0.9375vw', fontWeight: 500, mb: 2 }}>
            Dasar pengelompokan customer/client beserta anggotanya telah sesuai dengan ketentuan yang berlaku yaitu apabila customer/client mempunyai hubungan pengendalian dengan customer/client lain baik melalui hubungan kepemilikan, kepengurusan, dan/atau keuangan yang meliputi (dapat lebih dari satu):
            <span style={{ fontStyle: 'normal' }}>*</span>
          </TextStyle>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { label: 'Customer merupakan pengendali customer lain.', name: 'isControllingOther' },
              { label: '1 (satu) pihak yang sama merupakan pengendali dari beberapa customer.', name: 'isControlledBySameParty' },
              { label: 'Customer memiliki ketergantungan keuangan dengan customer lain.', name: 'hasFinancialDependency' },
              { label: 'Customer menerbitkan jaminan untuk mengambil alih dan/atau melunasi sebagian atau seluruh kewajiban customer lain jika customer lain tersebut gagal memenuhi kewajibannya (wanprestasi) kepada Perusahaan.', name: 'isGuarantorForOther' },
              { label: 'Dewan komisaris dan/atau direksi customer menjadi dewan komisaris dan/atau direksi  pada customer lain.', name: 'hasSharedDirectors' }
            ].map((item) => (
              <Controller
                key={item.name}
                name={item.name}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    onChange={field.onChange}
                    label={item.label}
                    disabled={!isEdit}
                  />
                )}
              />
            ))}
          </Box>
        </Box>

        <Controller
          name="remark"
          control={control}
          disabled
          render={({ field }) =>
            <Input
              {...field}
              label="Keterangan"
              placeholder="Keterangan"
              type="area"
              rows={4}
            />
          }
        />

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="modifiedBy"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Modified By"
                placeholder="Modified By"
                type="text"
              />
            }
          />

          <Controller
            name="lastModified"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Last Modified"
                placeholder="Last Modified"
                type="text"
              />
            }
          />
        </Box>
      </SectionTitle>

      {
        isEdit && (
          <Button variant="contained" color="darkBlue" size="small" sx={{ alignSelf: 'flex-end', width: '100px' }} onClick={() => { handleSave(control._formValues); }}>Save</Button>
        )
      }


    </ColumnWrapper>
  );
};

export default MemberInformationDetail;
