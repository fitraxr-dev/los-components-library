import { useEffect } from 'react';

import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDate } from '@/helpers/date';

import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import Title from '@/components/shared/Title';

import useFieldUploadDocument from './FieldUploadDocument.hooks';


const FieldUploadDocument = ({ document }: { document: any }) => {
  const { control, watch, theme, reset, handleOpenWatermarkModal } = useFieldUploadDocument();
  useEffect(() => {
    reset(document);
  }, [document]);

  return (
    <Box sx={{ display: 'content', mt: theme.spacing(3) }}>
      <Title title="Upload Dokumen" sx={{ borderBottom: `1px solid ${theme.palette.custom.gray30}`, justifyContent: 'center' }} />
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
          my: theme.spacing(1.5),
        }}
      >
        <Controller
          disabled
          name="createdDate"
          control={control}
          render={({ field }) => (
            <Input
              disabled
              {...field}
              value={ field.value ? formatDate(field.value, 'DD/MM/YYYY') : ''}
              label="Upload Date"
              placeholder="Upload Date"
            />
          )}
        />
        <Controller
          disabled
          name="createdBy"
          control={control}
          render={({ field }) => (
            <Input
              disabled
              {...field}
              type="text"
              label="Upload By"
              placeholder="Upload By"
            />
          )}
        />
      </Box>
      <Controller
        disabled
        name="documentCategoryLabel"
        control={control}
        render={({ field }) => (
          <Input
            disabled
            {...field}
            type="text"
            containerSx={{
              my: theme.spacing(1.5),
            }}
            label="Kategori Dokumen"
            placeholder="Kategori Dokumen"
          />
        )}
      />
      <Controller
        disabled
        name="documentGroupLabel"
        control={control}
        render={({ field }) => (
          <Input
            disabled
            {...field}
            type="text"
            containerSx={{
              my: theme.spacing(1.5),
            }}
            label="Grup Dokumen"
            placeholder="Grup Dokumen"
          />
        )}
      />
      <Controller
        disabled
        name="documentTypeLabel"
        control={control}
        render={({ field }) => (
          <Input
            disabled
            {...field}
            type="text"
            containerSx={{
              my: theme.spacing(1.5),
            }}
            label="Jenis Dokumen"
            placeholder="Jenis Dokumen"
          />
        )}
      />
      <Controller
        disabled
        name="document"
        control={control}
        render={({ field }) => {
          const value = {
            extension: ' ',
            name: watch('fileName'),
            url: field?.value,
          };
          return (
            <Box sx={{ alignItems: 'end', display: 'flex', flexDirection: 'row', gap: theme.spacing(1), width: '100%' }}>
              <Input
                value={value}
                showPreviewFile={false}
                isDownloadable={false}
                type="file"
                downloadOnly={true}
                label="Upload Dokumen"
                placeholder="Upload Dokumen"
                containerSx={{
                  my: theme.spacing(1.5),
                  width: '94%',
                }}
              />
              <a onClick={() => handleOpenWatermarkModal(document, 'preview')} style={{ cursor: 'pointer', padding: '15px 0', width: '3%' }}>
                <Icon iconName="preview-document" sx={{ height: 24, width: 24 }} />
              </a>
              <a onClick={() => handleOpenWatermarkModal(document, 'download')} style={{ cursor: 'pointer', padding: '15px 0', width: '3%' }}>
                <Icon iconName="download" sx={{ height: 24, width: 24 }} />
              </a>
            </Box>
          );
        }}
      />
      <Controller
        disabled
        name="fileName"
        control={control}
        render={({ field }) => (
          <Input
            disabled
            {...field}
            type="text"
            containerSx={{
              my: theme.spacing(1.5),
            }}
            label="Nama Dokumen"
            placeholder="Nama Dokumen"
          />
        )}
      />
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
          my: theme.spacing(1.5),
        }}
      >
        <Controller
          disabled
          name="documentNumber"
          control={control}
          render={({ field }) => (
            <Input
              disabled
              {...field}
              label="Nomor Dokumen"
              placeholder="Nomor Dokumen"
            />
          )}
        />
        <Controller
          disabled
          name="documentDate"
          control={control}
          render={({ field }) => (
            <Input
              disabled
              {...field}
              value={ field.value ? formatDate(field.value, 'DD/MM/YYYY') : ''}
              // format="DD-MM-YYYY HH:mm:ss"
              // type="date"
              label="Tanggal Dokumen"
              placeholder="Tanggal Dokumen"
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default FieldUploadDocument;
