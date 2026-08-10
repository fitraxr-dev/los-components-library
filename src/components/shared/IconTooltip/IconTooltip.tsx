'use client';
import { forwardRef, useMemo } from 'react';

import { Box, styled } from '@mui/material';

import Icon from '@/components/shared/Icon';

import TextStyle from '../TextStyle';

import type { IconProps } from './types';


const IconTooltip = ({
  iconName,
  textVariant,
  sx,
}: IconProps) => {

  const IconComponent = forwardRef(function IconComponent(props: any, ref) {
    const { ...rest } = props;

    return (
      <Box {...rest} ref={ref}>
        <Icon
          iconName={iconName}
          textVariant={textVariant}
          sx={{
            ...sx,
          }}
        />
      </Box>
    );
  });

  const IconWrapper = styled('div')(() => ({
    '&:hover > .tooltip': {
      opacity: 1,
      visibility: 'visible',
    },
    position: 'relative',
  }));

  const StyledTooltip = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '4px',
    color: theme.palette.white.main,
    left: '10px',
    padding: theme.spacing(1),
    position: 'absolute',
    top: '-35px',
    transform: 'translateX(-50%)',
    transition: 'opacity 0.3s',
    visibility: 'hidden',
    width: 'max-content',
    zIndex: 1000,
  }));

  const iconShowName = useMemo(() => {
    switch (iconName) {
      case 'add':
        return 'Tambah';
      case 'edit':
        return 'Edit';
      case 'delete':
        return 'Hapus';
      case 'edit-2':
        return 'Edit';
      case 'preview-document':
        return 'Preview';
      case 'doc-upload':
        return 'Upload Dokumen';
      case 'doc-upload-primary':
        return 'Upload Dokumen';
      case 'lps':
        return 'Detail Induk';
      default:
        return iconName.charAt(0).toUpperCase() + iconName.slice(1);
    }
  }, [iconName]);

  return (
    <IconWrapper>
      <StyledTooltip className="tooltip">
        <TextStyle variant="body6">{iconShowName}</TextStyle>
      </StyledTooltip>
      <IconComponent />
    </IconWrapper>
  );
};

export default IconTooltip;
