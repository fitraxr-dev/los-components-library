'use client';
import React from 'react';

import { Box, IconButton, Popover } from '@mui/material';

import Icon from '@/components/shared/Icon';
import TextStyle from '@/components/shared/TextStyle';

import type { BoxProps } from '@mui/material';


const PopupInfoInput = ({ status, anchorEl, setAnchorEl, content, sx, index,
  setCurrentPopoverId, iconName = 'information', showIconButton = true, customListText }:
{
  status?: boolean;
  anchorEl: HTMLElement | null;
  setAnchorEl: (value: HTMLElement | null) => void;
  sx?: BoxProps['sx'];
  content?: React.ReactNode;
  index?: number | null;
  setCurrentPopoverId?: (value: number) => void;
  iconName?: string;
  showIconButton?: boolean;
  customListText?: string[];
}
) => {
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, index?: number) => {
    setAnchorEl(event.currentTarget);
    if (index) {
      setCurrentPopoverId(index);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    if (index) {
      setCurrentPopoverId(null);
    }
  };


  const defaultListText = [
    'Nama Diketik Tanpa Tipe Institusi (PT/PEMKOT/PEMKAB/DLL)',
    'Nama lengkap tanpa singkatan',
    'Huruf Kapital Hanya Di Awal Nama',
    'Tanpa Akhiran Persero / TBK',
    'Tanpa QQ Atau Atas Nama Selain Customer Yang Dibiayai',
    'Tanpa gelar depan dan belakang untuk persorangan'
  ];

  const listText = customListText || defaultListText;

  return (
    <Box
      ref={(e) => e}
      sx={{
        alignItems: 'end',
        display: 'flex',
        ...sx,
      }}
    >
      { showIconButton &&
        <IconButton
          sx={{ height: '50%', padding: 0 }}
          onMouseEnter={(e) => handlePopoverOpen(e, index)}
          onMouseLeave={handlePopoverClose}
        >
          <Icon iconName={iconName} />
        </IconButton>
      }

      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={status}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        onClose={handlePopoverClose}
        disableAutoFocus
        disableEnforceFocus
      >
        {content ?
          content :
          <Box sx={{ width: '100%' }}>
            <ul style={{ paddingInline: '40px' }}>
              {listText.map((dt) => (
                <li key={dt}>
                  <TextStyle variant="body5" >
                    {dt}
                  </TextStyle>
                </li>
              ))}
            </ul>
          </Box>}
      </Popover>
    </Box>
  );
};

export default PopupInfoInput;
