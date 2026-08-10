import React, { useState } from 'react';

import NiceModal, { ModalDef, useModal } from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import ModalErrorUploadTemplate from '../ModalErrorUploadTemplate';
import { MODAL_ERROR_UPLOAD_TEMPLATE } from '../ModalErrorUploadTemplate/ModalErrorUploadTemplate';

import useDownloadTemplate from './hooks/downloadTemplate';
import useUploadTemplate from './hooks/uploadTemplate';

import type { ModalUploadTemplateProps } from './ModalUploadTemplate.types';


export const MODAL_UPLOAD_TEMPLATE = 'MODAL_UPLOAD_TEMPLATE';

const ModalUploadTemplate = NiceModal.create(({
  title = 'Upload Dokumen',
  onUpload,
  onDownloadTemplate,
  isLoading = false,
  acceptableFormatsText = 'xlsx',
  fileConstraint,
  acceptableMimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  processTemplateType,
  queryKeyList,
  checkboxList,
  titleCheckbox,
}: ModalUploadTemplateProps) => {

  const modalId = MODAL_UPLOAD_TEMPLATE;
  const { visible } = useModal(modalId);
  const [file, setFile] = useState<any>(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string>();

  const downloadTemplateMutation = useDownloadTemplate();

  const queryClient = useQueryClient();

  const uploadTemplateMutation = useUploadTemplate({
    onError: (error: any) => {
      console.log('error', error);
      const errorData = error?.data?.data.errors || error?.data?.errors || [];
      const formattedData = Array.isArray(errorData) ? errorData : [errorData];
      NiceModal.show(MODAL_ERROR_UPLOAD_TEMPLATE, {
        data: formattedData,
      });
    },
    onSuccess: () => {
      handleClose();
      showNiceModalV2({ title: 'Success Upload Dokumen', type: 'success' });
      if (queryKeyList) {
        queryClient.invalidateQueries({
          queryKey: queryKeyList,
        });
      }
    },
  });

  const { validateFile } = useCheckFileDokument({
    acceptableFormatsText: acceptableFormatsText,
    acceptableMimeTypes,
  });

  const displayAcceptedFormats = `Supported formats: ${acceptableFormatsText}`;

  const handleClose = () => {
    setFile(null);
    closeNiceModal(modalId);
  };

  const handleUpload = () => {
    if (file && !file.error) {
      if (onUpload) {
        onUpload(file);
      } else if (checkboxList && checkboxList.length > 0) {
        uploadTemplateMutation.mutate({ file, processTemplateType: selectedCheckboxes });
      } else if (processTemplateType) {
        uploadTemplateMutation.mutate({ file, processTemplateType });
      }
    }
  };

  const handleDownloadTemplate = () => {
    if (onDownloadTemplate) {
      onDownloadTemplate();
    } else if (checkboxList && checkboxList.length > 0) {
      downloadTemplateMutation.mutate({ processTemplateType: selectedCheckboxes });
    } else if (processTemplateType) {
      downloadTemplateMutation.mutate({ processTemplateType });
    }
  };

  const handleFileChange = (val: any) => {
    if (!val) {
      setFile(null);
      return;
    }
    const result = validateFile(val);
    if (!result.isValid) {
      setFile({ ...val, error: true, errorMessage: result.errorMessage });
      return;
    }
    setFile(val);
  };

  return (
    <SectionModal
      title={title}
      isOpen={visible}
      onClose={handleClose}
      customFooter={() => null}
      containerSx={{
        minWidth: '40vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        {checkboxList && checkboxList.length > 0 && (
          <Input
            type="radio"
            label={titleCheckbox}
            radioList={checkboxList}
            value={selectedCheckboxes}
            onChange={(e) => setSelectedCheckboxes(e.target.value)}
          />
        )}

        <Input
          type="file"
          label={title}
          placeholder={title}
          containerSx={{ flex: 1 }}
          value={file}
          onChange={handleFileChange}
          helperText={file?.error ? file.errorMessage : displayAcceptedFormats}
          error={!!file?.error}
          fileConstraint={fileConstraint}
        />

        <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
          <Button
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={handleClose}
          >
            Close
          </Button>
          {(onDownloadTemplate || processTemplateType || checkboxList) && (
            <Button
              color="warning"
              sx={{ mr: 2 }}
              disabled={(checkboxList && checkboxList.length > 0) ? !selectedCheckboxes : false}
              onClick={handleDownloadTemplate}
              isLoading={downloadTemplateMutation.isPending}
            >
              Download Template
            </Button>
          )}
          <Button
            disabled={((checkboxList && checkboxList.length > 0) ?
              (!selectedCheckboxes || !file) : (!file || file?.error))}
            isLoading={isLoading || uploadTemplateMutation.isPending}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={MODAL_ERROR_UPLOAD_TEMPLATE}
        component={ModalErrorUploadTemplate}
      />
    </SectionModal>
  );
});

export default ModalUploadTemplate;
