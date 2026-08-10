'use client';;
import { useRef } from 'react';

import { useTheme } from '@mui/material';

import { downloadFile } from '@/helpers/utils';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { ChangeEvent } from 'react';


const Media = ({
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
  } = props;
  const fileUploadRef = useRef<HTMLInputElement>();

  const styRowWrapper = {
    '-moz-box-sizing': 'border-box',
    '-webkit-box-sizing': 'border-box',
    alignItems: 'center',
    border: noBorder ? 0 : 1,
    borderColor: error ? theme.palette.error.main : theme.palette.action.disabled,
    borderRadius: theme.radius(1),
    boxSizing: 'border-box',
    cursor: 'pointer',
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
    const fileName = file?.name.match(/(.*)\.(?:\w+)$/)[1];
    if (fileName) {
      const splitFileName = file.name.split('.');
      const extension = `.${splitFileName[splitFileName.length - 1]}`;

      onChange({
        extension: extension,
        file,
        name: fileName ?? '',
        url: URL.createObjectURL(file),
      });
    }
  }

  function handleClick(e) {
    e.stopPropagation();

    if (value?.url && !disabled && isDownloadable) {
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
          onClick={handleClick}
          {...(!value?.name && { color: theme.palette.action.disabled })}
        >
          {renderValue()}
        </TextStyle>
        <Button
          disabled={disabled}
          onClick={handleClickFileUpload}
          sx={styButton}
          variant="text"
        >
          <Icon iconName="upload" textVariant="body4" />
        </Button>
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
        accept="image/PNG, image/JPG, image/JPEG, video/mp4"
        hidden
        onChange={(e) => handleChange(e)}
        ref={fileUploadRef}
        type="file"
        disabled={disabled}
      />
    </>
  );
};

export default Media;
