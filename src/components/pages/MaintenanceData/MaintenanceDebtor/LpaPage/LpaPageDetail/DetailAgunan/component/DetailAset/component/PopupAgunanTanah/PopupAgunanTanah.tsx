import { Box } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';
import Title from '@/components/shared/Title';

import { formatDateLocal } from '../../../../DetailAgunan.constant';
import FieldUploadDocument from '../../../FieldUploadDocument';

import usePopupAgunanTanah from './PopupAgunanTanah.hooks';


const PopupAgunanTanah = (props: any) => {
  const { control } = usePopupAgunanTanah(props.item);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'grid', gridGap: theme.spacing(3), mt: theme.spacing(3) }}>
      <Title title="Detail Tanah" sx={{ borderBottom: `1px solid ${theme.palette.custom.gray30}`, justifyContent: 'center' }} />
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          disabled
          name="documentTypeLabel"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Jenis Dokumen"
              placeholder="Jenis Dokumen"
            />
          )}
        />
        <Controller
          disabled
          name="documentNo"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nomor Dokumen"
              placeholder="Nomor Dokumen"
            />
          )}
        />
        <Controller
          disabled
          name="rightsHolders"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Pemegang Hak"
              placeholder="Pemegang Hak"
            />
          )}
        />
        <Controller
          disabled
          name="publicationDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ? field.value : ''}
              label="Tanggal Penerbitan"
              placeholder="Tanggal Penerbitan"
            />
          )}
        />
        <Controller
          disabled
          name="endDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ? field.value : ''}
              label="Tanggal Berakhir"
              placeholder="Tanggal Berakhir"
            />
          )}
        />
        <Controller
          disabled
          name="measuringLetterNo"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="No Surat Ukur"
              placeholder="No Surat Ukur"
            />
          )}
        />
        <Controller
          disabled
          name="measuringLetterDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ? field.value : ''}
              label="Tanggal Surat Ukur"
              placeholder="Tanggal Surat Ukur"
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

export default PopupAgunanTanah;
