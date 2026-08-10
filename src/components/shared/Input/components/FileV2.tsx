'use client';
import { useRef } from 'react';

import { Box, useTheme, Tooltip } from '@mui/material'; // Import Tooltip
import dayjs from 'dayjs'; // Import dayjs

import blobToBase64 from '@/helpers/imageToBase64';
import { downloadFile } from '@/helpers/utils';

import { IMAGE_EXTENSION } from '@/components/layouts/OverlayLayout/Overlay.constants';
import { useOverlayApiContext } from '@/components/layouts/OverlayLayout/Overlay.context';
import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { ChangeEvent } from 'react';


const fileType = [
  'image/JPG',
  'image/JPEG',
  'image/PNG',
  '.pdf',
  '.docx',
  '.doc',
  '.zip',
  '.rar',
  '.pptx',
  '.ppt',
  '.xls',
  '.xlsx',
  '.csv',
  '.html',
  '.htm',
  '.mp4',
];

const File = ({
  ...props
}: any) => {
  const theme = useTheme();
  const {
    disabled,
    error,
    helperText,
    noBorder,
    onChange,
    placeholder,
    value,
    isDownloadable = true,
    fileConstraint = fileType.join(','),
    downloadOnly = false,
    showPreviewFile = false,
  } = props;
  const fileUploadRef = useRef<HTMLInputElement>();

  const { setOverlay } = useOverlayApiContext();

  const handleDownloadFile = (file) => {
    if (file?.url) {
      downloadFile(file.url, `${file.name}${file.extension}`);
    }
  };

  const styRowWrapper = {
    '-moz-box-sizing': 'border-box',
    '-webkit-box-sizing': 'border-box',
    alignItems: 'center',
    border: noBorder ? 0 : 1,
    borderColor: error ? theme.palette.error.main : theme.palette.action.disabled,
    borderRadius: theme.radius(1),
    boxSizing: 'border-box',
    cursor: downloadOnly || disabled ? 'default' : 'pointer',
    height: `calc(${theme.typography.body4.fontSize} * ${theme.typography.body4.lineHeight} + ${theme.spacing(4)})`,
    justifyContent: 'space-between',
    px: theme.spacing(2),
  };

  const styTextStyle = {
    overflow: 'hidden',
    py: theme.spacing(2),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    ...(Array.isArray(value) && value.length > 0 && {
      '&:hover': {
        cursor: isDownloadable ? 'pointer' : 'default',
      },
      color: theme.palette.primary.main,
      fontWeight: 700,
      textDecoration: 'underline',
    }),
  };

  const styButton = {
    height: 'fit-content',
    minWidth: 0,
    padding: 1,
  };

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newFiles = e.target.files;
    if (!newFiles) return;

    const filesArray = Array.from(newFiles).map((file) => {
      const fileName = file.name.match(/(.*)\.(?:\w+)$/)?.[1] || '';
      const splitFileName = file.name.split('.');
      const extension = `.${splitFileName[splitFileName.length - 1]}`;

      return {
        extension: extension,
        file: file,
        name: fileName,
        url: URL.createObjectURL(file),
      };
    });
    const updatedFiles = Array.isArray(value) ? [...value, ...filesArray] : filesArray;
    onChange(updatedFiles);
  }

  const handlePrevieDocument = (e, file) => {
    e.stopPropagation();
    setOverlay(
      IMAGE_EXTENSION.includes(file?.extension?.toLowerCase()?.replace('.', '')) ?
        file?.url : file?.file,
      (IMAGE_EXTENSION.includes(file?.extension?.toLowerCase()?.replace('.', ''))) ?
        'image' : file?.extension?.replace('.', ''),
      true
    );
  };

  function handleClick(e) {
    e.stopPropagation();

    if (Array.isArray(value) && value.length > 0 && isDownloadable) {
      handleDownloadAll();
    }
  }

  function handleClickFileUpload(e) {
    e.stopPropagation();
    fileUploadRef?.current?.click();
  }


  const handleDownloadAll = () => {
    if (!Array.isArray(value)) return;
    value.forEach((file) => {
      downloadFile(file.url, `${file.name}${file.extension}`);
    });
  };

  const handleDeleteFile = (e, index) => {
    e.stopPropagation();
    if (!Array.isArray(value)) return;
    const updatedFiles = [...value];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles);
  };

  const handlePreviewFile = (e, file) => {
    handlePrevieDocument(e, file);
  };

  return (
    <>
      <RowWrapper
        sx={styRowWrapper}
      >
        <input
          accept={fileConstraint}
          hidden
          onChange={(e) => handleChange(e)}
          ref={fileUploadRef}
          type="file"
          disabled={disabled}
          multiple // Enable multiple file selection
        />
        <Box display="flex" flexGrow={1} onClick={handleClickFileUpload}>
          <TextStyle
            variant="body4"
            weight={500}
            color={theme.palette.action.disabled}
          >
            {placeholder || 'Please select a file'}
          </TextStyle>
        </Box>
        <Box display="flex">
          <Button
            disabled={downloadOnly || disabled}
            onClick={handleClickFileUpload}
            sx={styButton}
            variant="text"
          >
            <Icon iconName="upload" textVariant="body4" />
          </Button>
        </Box>
      </RowWrapper>
      {helperText && (
        <TextStyle
          variant="body7"
          color={error ? theme.palette.error.main : theme.palette.primary.main}
          weight={500}
          mt={1}
        >
          {helperText}
        </TextStyle>
      )}
      {Array.isArray(value) && (
        <Box mt={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {value.map((file, index) => (
            <RowWrapper
              key={index}
              sx={{
                alignItems: 'center',
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: theme.radius(5),
                px: 1,
                py: 0.5,
              }}
            >
              <TextStyle onClick={(e) => handlePreviewFile(e, file)} weight={500} color={theme.palette.primary.main} variant="body4" sx={{ cursor: 'pointer' }}>{`${file.name}${file.extension}`}</TextStyle>
              <Button
                onClick={(e) => handleDeleteFile(e, index)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  backgroundColor: 'transparent',
                  borderRadius: '50%',
                  color: 'white',
                  height: 12,
                  marginLeft: 1,
                  marginTop: 0.5,
                  minWidth: 0,
                  padding: 0,
                  width: 12,
                }}
              >
                <Icon iconName="close-icons" />
              </Button>
            </RowWrapper>
          ))}
        </Box>
      )}
    </>
  );
};

export default File;
