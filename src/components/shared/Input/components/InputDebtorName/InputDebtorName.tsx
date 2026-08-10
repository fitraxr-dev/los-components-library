import React from 'react';

import { useTheme } from '@mui/material';
import Link from 'next/link';
import { useController } from 'react-hook-form';


import TextStyle from '@/components/shared/TextStyle';

import ColumnWrapper from '../../../ColumnWrapper';
import RowWrapper from '../../../RowWrapper';
import PopupInfoInput from '../PopupInfoInput';
import TextInput from '../TextInput';

import type { InputProps } from '../../Input.types';
import type { UseControllerProps } from 'react-hook-form';


const InputDebtorName = (
  props: InputProps & {
    inputProps: React.ComponentProps<typeof TextInput>;
    contentTooltip?: React.ReactNode;
    bg: string;
    suppressTooltipWhenError?: boolean;
  } & UseControllerProps<FormValues>) => {
  const theme = useTheme();

  const { label, containerSx, contentTooltip, bg, ...inputProps } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const {
    field,
    fieldState: { invalid },
  } = useController({ control: props.control, name: props.name });

  return (
    <ColumnWrapper sx={containerSx}>
      <RowWrapper sx={{ gap: theme.spacing(2) }}>
        <div
          style={{
            alignItems: 'center',
            color: 'inherit',
            display: 'flex',
            flexDirection: 'row',
            textDecoration: 'none',
          }}
          // href="#"
          // passHref
          // onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
          onMouseLeave={() => setAnchorEl(null)}
        >
          <RowWrapper mb={1} sx={{ pointerEvents: 'none' }}>
            <TextStyle
              variant="body4"
              weight={600}
              color={props.disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}
            >
              {label}
            </TextStyle>
            {props.isMandatory ? (
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            ) : null}

          </RowWrapper>
        </div>
        {!props.disabled && (!invalid || !props.suppressTooltipWhenError) && (
          <PopupInfoInput
            sx={{ height: '50%' }}
            status={Boolean(anchorEl) || (!props.suppressTooltipWhenError && invalid)}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            content={contentTooltip}
          />
        )}
      </RowWrapper>
      <TextInput
        {...field}
        {...inputProps}
        inputProps={{
          style: {
            backgroundColor: bg,
          },
        }}
        // onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
      />
    </ColumnWrapper>
  );
};

export default InputDebtorName;
