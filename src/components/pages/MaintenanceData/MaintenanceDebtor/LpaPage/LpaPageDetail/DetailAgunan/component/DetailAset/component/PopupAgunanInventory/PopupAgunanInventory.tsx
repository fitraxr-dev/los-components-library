import { Box } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';
import Title from '@/components/shared/Title';

import FieldUploadDocument from '../../../FieldUploadDocument';

import usePopupAgunanInventory from './PopupAgunanInventory.hooks';


const PopupAgunanInventory = (props: any) => {
  const { control } = usePopupAgunanInventory(props.item);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'grid', gridGap: theme.spacing(3), mt: theme.spacing(3) }}>
      <Title title="Detail Inventory" sx={{ borderBottom: `1px solid ${theme.palette.custom.gray30}`, justifyContent: 'center' }} />
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
      </Box>

      <FieldUploadDocument document={props.item.document} />
    </Box>
  );
};

export default PopupAgunanInventory;
