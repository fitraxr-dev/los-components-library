import { Box } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';
import Title from '@/components/shared/Title';

import FieldUploadDocument from '../../../FieldUploadDocument';

import usePopupAgunanKapal from './PopupAgunanKapal.hooks';


const PopupAgunanKapal = (props: any) => {
  const { control } = usePopupAgunanKapal(props.item);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'grid', gridGap: theme.spacing(3), mt: theme.spacing(3) }}>
      <Title title="Detail Kapal" sx={{ borderBottom: `1px solid ${theme.palette.custom.gray30}`, justifyContent: 'center' }} />
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
          name="countryManufacture"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Negara Pembuat"
              placeholder="Negara Pembuat"
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
          name="portOfRegistration"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Pelabuhan Pendaftaran"
              placeholder="Pelabuhan Pendaftaran"
            />
          )}
        />
        <Controller
          disabled
          name="identificationLetterNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nomor / Huruf Pengenal"
              placeholder="Nomor / Huruf Pengenal"
            />
          )}
        />
        <Controller
          disabled
          name="imoNo"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="No IMO"
              placeholder="No IMO"
            />
          )}
        />
        <Controller
          disabled
          name="deadWeight"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Bobot Mati"
              placeholder="Bobot Mati"
            />
          )}
        />
        <Controller
          disabled
          name="mainEngine"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Mesin Utama"
              placeholder="Mesin Utama"
            />
          )}
        />
        <Controller
          disabled
          name="flag"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Bendera"
              placeholder="Bendera"
            />
          )}
        />
        <Controller
          disabled
          name="wide"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Lebar"
              placeholder="Lebar"
            />
          )}
        />
        <Controller
          disabled
          name="in"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Dalam"
              placeholder="Dalam"
            />
          )}
        />
        <Controller
          disabled
          name="length"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Panjang Keseluruhan"
              placeholder="Panjang Keseluruhan"
            />
          )}
        />
        <Controller
          disabled
          name="netWeight"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Berat Bersih"
              placeholder="Berat Bersih"
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

export default PopupAgunanKapal;
