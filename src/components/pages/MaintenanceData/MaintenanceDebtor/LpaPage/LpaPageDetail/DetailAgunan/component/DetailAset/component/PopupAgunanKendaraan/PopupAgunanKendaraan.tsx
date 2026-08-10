import { Box } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';
import Title from '@/components/shared/Title';

import FieldUploadDocument from '../../../FieldUploadDocument';

import usePopupAgunanKendaraan from './PopupAgunanKendaraan.hooks';


const PopupAgunanKendaraan = (props: any) => {
  const { control } = usePopupAgunanKendaraan(props.item);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'grid', gridGap: theme.spacing(3), mt: theme.spacing(3) }}>
      <Title title="Detail Kendaraan" sx={{ borderBottom: `1px solid ${theme.palette.custom.gray30}`, justifyContent: 'center' }} />
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          disabled
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nama"
              placeholder="Nama"
            />
          )}
        />
        <Controller
          disabled
          name="year"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Tahun"
              placeholder="Tahun"
            />
          )}
        />
        <Controller
          disabled
          name="condition"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Kondisi"
              placeholder="Kondisi"
            />
          )}
        />
        <Controller
          disabled
          name="policeNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="No Polisi"
              placeholder="No Polisi"
            />
          )}
        />
        <Controller
          disabled
          name="bpkbNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="No BPKB"
              placeholder="No BPKB"
            />
          )}
        />
        <Controller
          disabled
          name="engineNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="No Mesin"
              placeholder="No Mesin"
            />
          )}
        />
      </Box>
      <Controller
        disabled
        name="remark"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="area"
            rows={4}
            label="Keterangan"
            placeholder="Keterangan"
          />
        )}
      />

      <FieldUploadDocument document={props.item.document} />
    </Box>
  );
};

export default PopupAgunanKendaraan;
