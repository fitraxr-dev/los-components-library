'use client';
import { Box, useTheme } from '@mui/material';

import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


const Text = ({
  children,
  ...props
}: any) => {
  const {
    labelProps,
    isMandatory = false,
    disabled = false,
    downloadOnly = false,
    onClick,
    redDotVisible = false,
  } = props;
  const theme = useTheme();


  return (
    <RowWrapper mb={children ? 1 : undefined}>
      {redDotVisible && (<Box
        sx={{
          backgroundColor: theme.palette.custom.softRed,
          borderRadius: '100%',
          height: theme.spacing(2),
          left: -1,
          position: 'relative',
          top: -3,
          width: theme.spacing(2),
        }}
      />)}
      <TextStyle
        variant="body4"
        weight={600}
        color={disabled || downloadOnly ? theme.palette.custom.gray30 : theme.palette.custom.text}
        {...labelProps}
        onClick={onClick}
      >
        {children}
      </TextStyle>
      {isMandatory ? (
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.error.main}
        >
          *
        </TextStyle>
      ) : null}
    </RowWrapper>
  );
};

export default Text;
