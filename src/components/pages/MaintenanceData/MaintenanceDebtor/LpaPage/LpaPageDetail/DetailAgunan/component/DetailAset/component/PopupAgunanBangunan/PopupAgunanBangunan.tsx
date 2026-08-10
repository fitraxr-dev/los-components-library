import { Box } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';
import Title from '@/components/shared/Title';

import { formatDateLocal } from '../../../../DetailAgunan.constant';
import FieldUploadDocument from '../../../FieldUploadDocument';

import usePopupAgunanBangunan from './PopupAgunanBangunan.hooks';


const PopupAgunanBangunan = (props: any) => {
  const { control } = usePopupAgunanBangunan(props.item);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'grid', gridGap: theme.spacing(3), mt: theme.spacing(3) }}>
      <Title title="Detail Bangunan" sx={{ borderBottom: `1px solid ${theme.palette.custom.gray30}`, justifyContent: 'center' }} />
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
          name="imbNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nomor IMB"
              placeholder="Nomor IMB"
            />
          )}
        />
        <Controller
          disabled
          name="imbDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ? field.value : ''}
              label="Tanggal IMB"
              placeholder="Tanggal IMB"
            />
          )}
        />
        <Controller
          disabled
          name="publishedPlace"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Diterbitkan Di"
              placeholder="Diterbitkan Di"
            />
          )}
        />
        <Controller
          disabled
          name="builtYear"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Tahun Dibangun/Renovasi"
              placeholder="Tahun Dibangun/Renovasi"
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
          name="allotment"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Peruntukan"
              placeholder="Peruntukan"
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
              label="Luas (m2)"
              placeholder="Luas (m2)"
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

export default PopupAgunanBangunan;
