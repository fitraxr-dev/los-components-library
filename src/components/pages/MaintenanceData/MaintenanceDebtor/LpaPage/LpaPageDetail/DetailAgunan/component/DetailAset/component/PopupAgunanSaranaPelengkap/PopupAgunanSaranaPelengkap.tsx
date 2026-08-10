import { Box } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';
import Title from '@/components/shared/Title';

import FieldUploadDocument from '../../../FieldUploadDocument';

import usePopupAgunanSaranaPelengkap from './PopupAgunanSaranaPelengkap.hooks';


const PopupAgunanSaranaPelengkap = (props: any) => {
  const { control } = usePopupAgunanSaranaPelengkap(props.item);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'grid', gridGap: theme.spacing(3), mt: theme.spacing(3) }}>
      <Title title="Detail Sarana Pelengkap" sx={{ borderBottom: `1px solid ${theme.palette.custom.gray30}`, justifyContent: 'center' }} />
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
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Jumlah Unit"
              placeholder="Jumlah Unit"
            />
          )}
        />
        <Controller
          disabled
          name="capacity"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Kapasitas"
              placeholder="Kapasitas"
            />
          )}
        />
        <Controller
          disabled
          name="magnitude"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Besaran"
              placeholder="Besaran"
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

export default PopupAgunanSaranaPelengkap;
