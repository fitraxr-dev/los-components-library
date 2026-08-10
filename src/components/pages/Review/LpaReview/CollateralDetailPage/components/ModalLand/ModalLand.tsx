import NiceModal from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';


import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import FormUploadDocument from '../FormUploadDocument';

import useModalLand from './ModalLand.hook';


const ModalLand = NiceModal.create((
  {
    processId,
    parentId,
    id = null,
    viewOnly = false }: { processId: string; parentId: string; id: string; viewOnly: boolean }) => {
  const {
    control,
    documentType,
    formState,
    handleSubmit,
    handleSubmitData,
    methods,
    modalId,
    theme,
    visible,
    isValidForm,
  } = useModalLand({ id, parentId, processId, viewOnly });

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 4 }}>
      {viewOnly ?
        <Button

          sx={{ mr: 1 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button> :
        <>
          <Button
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handleSubmitData)}
            disabled={!isValidForm}
          >
            Save
          </Button>
        </>}
    </RowWrapper>
  );

  return (
    <SectionModal
      title={id ? 'Edit Tanah' : 'Add Tanah'}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '80vh',
        maxWidth: '52vw',
        minWidth: '52vw',
      }}
      customFooter={footer}
    >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >

        <Controller
          name="documentType"
          control={control}

          render={({ field }) =>
            <Input
              {...field}
              type="dropdown"
              label="Jenis Dokumen"
              placeholder="Choose Jenis Dokumen"
              dropdownList={documentType}
              disabled={viewOnly}
            />
          }
        />

        <Controller
          name="documentNo"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              disabled={viewOnly}
              label="Nomor Dokumen"
              placeholder="Input Nomor Dokumen"

            />
          }
        />

        <Controller
          name="rightsHolders"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              disabled={viewOnly}
              label="Pemegang Hak"
              placeholder="Input Pemegang Hak"
            />
          }
        />

        <Controller
          name="publicationDate"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              disabled={viewOnly}
              type="date"
              label="Tanggal Penerbitan"
            />
          }
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              disabled={viewOnly}
              type="date"
              label="Tanggal Berakhir"
            />
          }
        />

        <Controller
          name="measuringLetterNo"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              disabled={viewOnly}
              label="No Surat Ukur"
              placeholder="Input No Surat Ukur"
            />
          }
        />

        <Controller
          name="measuringLetterDate"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              disabled={viewOnly}
              type="date"
              label="Tanggal Surat Ukur"
            />
          }
        />

        <Controller
          name="wide"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              disabled={viewOnly}
              type="number"
              label="Luas(m2)"
              placeholder="Input Luas"
            />
          }
        />

        <Controller
          name="remark"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              disabled={viewOnly}
              type="area"
              rows={4}
              label="Keterangan"
              placeholder="Input Keterangan"
              containerSx={{ gridColumn: '1 / 3' }}
            />
          }
        />
      </Box>

      <ColumnWrapper
        sx={{
          gap: 3,
        }}
      >
        <RowWrapper
          sx={{
            borderBottom: '0.1vw solid',
            borderColor: theme.palette.custom.gray30,
            justifyContent: 'center',
            py: 3,
          }}
        >
          <TextStyle variant="body1" color={theme.palette.primary.main} sx={{ justifyContent: 'center' }}>
            Upload Dokumen
          </TextStyle>
        </RowWrapper>
        <FormProvider {...methods} >
          <FormUploadDocument />
        </FormProvider>
      </ColumnWrapper>


    </SectionModal>
  );
});

export default ModalLand;
