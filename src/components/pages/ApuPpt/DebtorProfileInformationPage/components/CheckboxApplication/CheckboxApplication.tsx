import { Box, Checkbox as MUICheckbox, useTheme } from '@mui/material';


import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { CheckboxApplicationProps } from './CheckboxApplication.types';


const CheckboxApplication = ({
  ...props
}: CheckboxApplicationProps) => {

  const theme = useTheme();

  const {
    checkboxList,
    disabled,
    error,
    helperText,
    inputSx,
    onChange,
    position = 'horizontal',
    sx,
    value,
    containerSx,
    label,
    needCheckMaster,
    valMasterData,
  } = props;


  const handleChange = (val, isChecked) => {
    let newValue = Array.isArray(value) ? [...value] : [];

    if (isChecked) {
      newValue.push(val);
    } else {
      newValue = newValue.filter((item) => item !== val);
    }
    onChange(newValue);
  };

  const isMasterData = (val) => {
    let color = '#FFFFFF';
    if (props.appliPurpose?.includes(val)) {
      color = '#FCE6E8';
    }
    return color;
  };

  const listVal = (val) => {
    const masterData = checkboxList?.find((res) => res?.value === val)?.label || '-';
    return masterData;
  };


  return (
    <ColumnWrapper sx={containerSx}>
      <RowWrapper justifyContent="space-between" alignItems="center">
        <Text {...props}>{label}</Text>
      </RowWrapper>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          ...sx,
        }}
      >
        {checkboxList?.map((item, index) => (
          <ColumnWrapper
            key={item.value ?? index}
          >
            <Box >
              <MUICheckbox
                disabled={disabled ?? item.disabled}
                checked={(value as any[])?.includes(item.value) ?? false}
                onChange={(e) => handleChange(item.value, e.target.checked)}
                sx={{
                  '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' },
                }}
              />
              <TextStyle
                color={disabled ?? item.disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}
                sx={{
                  backgroundColor: isMasterData(item?.value),
                }}
              >
                {item.label ?? '-'}
              </TextStyle>
            </Box>
          </ColumnWrapper>
        ))}
      </Box>
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
      {/* {needCheckMaster &&
      <RowWrapper sx={{ pb: 1, pl: 3 }}>
        {valMasterData?.split('|')?.map((item, idx) => (
          <TextStyle weight={500} key={idx}>
            {}
          </TextStyle>
        ))}


      </RowWrapper>
      } */}

    </ColumnWrapper>
  );
};

export default CheckboxApplication;
