import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { toCurrentDate, toDateStringNumber } from '@/helpers/date';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { ACCEPTED_FORMAT, modal } from './ModalUploadFile.constants';
import useModalUploadFile from './ModalUploadFile.hook';

import type { ModalUploadFileProps } from './ModalUploadFile.types';


const ModalUploadFile = NiceModal.create((props: ModalUploadFileProps) => {

  const theme = useTheme();
  const modalId = modal.MODAL_UPLOAD_FILE;
  const { visible } = useModal(modalId);

  const [state] = useApp();

  const {
    handleSave,
    masintonChange,
    masintonMultiChange,
    masintonForm,
    generateTitle,
    isSaveLoading,
    uploadProgress,
  } = useModalUploadFile(props);

  const {
    file,
    fileName,
    typeFile,
  } = masintonForm;

  const isMandatoryEmpty = !file.value;
  // const maxFileSize = 26214400; // 25MB - Conversion Megabytes to Bytes (in binary)

  return (
    <SectionModal
      title={generateTitle(props.id)}
      isOpen={visible}
      onClose={() => {}}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Input
            label="Upload By"
            placeholder="Upload By"
            containerSx={{ flex: 1 }}
            value={state?.userData?.user?.fullName}
            disabled
          />
          <Input
            label="Upload Date"
            placeholder="Upload Date"
            containerSx={{ flex: 1 }}
            value={toDateStringNumber(toCurrentDate())}
            disabled
          />
        </Box>
        <Input
          isMandatory
          type="file"
          label="Upload File"
          placeholder="Upload File"
          containerSx={{ flex: 1 }}
          value={file.value}
          onChange={(val) => {
            // if (val.file.size > maxFileSize) {
            //   masintonMultiChange({
            //     file: {
            //       error: true,
            //       errorMessage: 'Ukuran file terlalu besar',
            //     },
            //     fileName: null,
            //     typeFile: null,
            //   });
            //   return;
            // }

            if (!ACCEPTED_FORMAT.includes(val.extension?.toLowerCase())) {
              masintonMultiChange({
                file: {
                  error: true,
                  errorMessage: 'Format file tidak sesuai',
                },
                fileName: null,
                typeFile: null,
              });
              return;
            }

            masintonMultiChange({
              file: val,
              fileName: val.name,
              typeFile: val.extension.split('.')[1],
            });


          }}
          error={file.value.error || file.error}
          helperText={(file.value.error && file.value.errorMessage) || (file.error && file.errorMessage)}
          fileConstraint=".jpg, .jpeg, .png, .pdf, .mp4, .zip, application/x-zip-compressed, application/zip, application/x-compressed"
        />
        <Input
          disabled
          label="Nama File"
          placeholder="Input Nama File"
          containerSx={{ flex: 1 }}
          value={fileName.value}
          onChange={(val) => {masintonChange('fileName', val);}}
          error={fileName.error}
          helperText={fileName.error && fileName.errorMessage}
        />
        <Input
          disabled
          label="Type File"
          placeholder="Input Type File"
          containerSx={{ flex: 1 }}
          value={typeFile.value}
          onChange={(val) => {
            masintonChange('typeFile', val);
          }}
          error={typeFile.error}
          helperText={typeFile.error && typeFile.errorMessage}
        />

        <RowWrapper sx={{ justifyContent: 'end' }}>
          <Button
            variant="outlined"
            sx={{ mr: 3 }}
            onClick={() => closeNiceModal(modalId)}
            disabled={isSaveLoading}
          >
            Cancel
          </Button>
          <Button
            disabled={isMandatoryEmpty || isSaveLoading}
            isLoading={isSaveLoading}
            onClick={handleSave}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal >
  );
});

export default ModalUploadFile;
