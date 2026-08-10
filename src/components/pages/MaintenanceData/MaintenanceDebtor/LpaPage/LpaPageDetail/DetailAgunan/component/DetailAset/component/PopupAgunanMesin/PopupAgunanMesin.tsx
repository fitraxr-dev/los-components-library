import { Box } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';
import Title from '@/components/shared/Title';

import FieldUploadDocument from '../../../FieldUploadDocument';

import usePopupAgunanMesin from './PopupAgunanMesin.hooks';


const PopupAgunanMesin = (props: any) => {
  const { control } = usePopupAgunanMesin(props.item);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'grid', gridGap: theme.spacing(3), mt: theme.spacing(3) }}>
      <Title title="Detail Mesin & Peralatan" sx={{ borderBottom: `1px solid ${theme.palette.custom.gray30}`, justifyContent: 'center' }} />
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          disabled
          name="engineName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nama Mesin & Peralatan"
              placeholder="Nama Mesin & Peralatan"
            />
          )}
        />
        <Controller
          disabled
          name="spesification"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Spesifikasi"
              placeholder="Spesifikasi"
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
              label="Jumlah"
              placeholder="Jumlah"
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
          name="number"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nomor"
              placeholder="Nomor"
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

export default PopupAgunanMesin;
