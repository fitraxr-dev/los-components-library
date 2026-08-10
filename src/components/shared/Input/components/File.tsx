'use client';
import { useRef } from 'react';

import { Box, useTheme } from '@mui/material';

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
  // 'image/TIFF',
  // 'image/GIF',
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
    ...(value?.url && {
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
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const fileName = file.name.match(/(.*)\.(?:\w+)$/)[1];
    const splitFileName = file.name.split('.');
    const extension = `.${splitFileName[splitFileName.length - 1]}`;

    onChange({
      extension: extension,
      file: file,
      name: fileName ?? '',
      url: URL.createObjectURL(file),
    });
  }

  const handlePrevieDocument = (e) => {
    e.stopPropagation();
    // setOverlay(
    //   IMAGE_EXTENSION.includes(value?.extension?.toLowerCase()?.replace('.', '')) ?
    //     value?.url : value?.file,
    //   (IMAGE_EXTENSION.includes(value?.extension?.toLowerCase()?.replace('.', ''))) ?
    //     'image' : value?.extension?.replace('.', ''),
    //   true);
    console.log('value', value);
    if (value?.url.includes('blob')) {
      window.open(value?.url, '_blank');
    } else {
      window.open(value?.url + '?preview=true', '_blank');
    }
  };

  function handleClick(e) {
    e.stopPropagation();

    if (value?.url && (downloadOnly || !disabled) && isDownloadable) {
      downloadFile(value?.url, renderValue());
    }
  }

  function handleClickFileUpload(e) {
    e.stopPropagation();
    fileUploadRef?.current?.click();
  }

  function renderValue() {
    if (value?.name && value?.extension) {
      return `${value?.name}${value?.extension}`;
    }

    return placeholder || 'Please select a file';
  }

  return (
    <>
      <RowWrapper
        sx={styRowWrapper}
        onClick={handleClickFileUpload}
      >
        <TextStyle
          sx={styTextStyle}
          variant="body4"
          weight={500}
          onClick={!value?.name ? handleClickFileUpload : handleClick}
          {...(!value?.name && { color: theme.palette.action.disabled })}
        >
          {renderValue()}
        </TextStyle>
        <Box display="flex">
          {showPreviewFile &&
            <Button
              onClick={value ? handlePrevieDocument : (e) => { e.stopPropagation(); }}
              sx={styButton}
              variant="text"
            >
              <Icon iconName="preview-document" textVariant="body4" />
            </Button>
          }
          <Button
            disabled={downloadOnly || disabled}
            onClick={handleClickFileUpload}
            sx={styButton}
            variant="text"
          >
            <Icon iconName={downloadOnly ? 'download' : 'upload'} textVariant="body4" />
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
      <input
        accept={fileConstraint}
        hidden
        onChange={(e) => handleChange(e)}
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
        ref={fileUploadRef}
        type="file"
        disabled={downloadOnly || disabled}
      />
    </>
  );
};

export default File;
