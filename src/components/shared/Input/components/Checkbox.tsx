import { Box, Checkbox as MUICheckbox, useTheme } from '@mui/material';

import ColumnWrapper from '../../ColumnWrapper';
import RowWrapper from '../../RowWrapper';
import TextStyle from '../../TextStyle';

import type { InputProps } from '../Input.types';


const Checkbox = ({
  ...props
}: InputProps) => {

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
    hasDataMaster,
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

  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FCE6E8',
    borderRadius: hasDataMaster && '4px',
    padding: hasDataMaster && theme.spacing(1),
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: position === 'horizontal' ? 'row' : 'column',
          ...styleDataMaster,
          ...sx,
        }}
      >
        {checkboxList?.map((item, index) => (
          <ColumnWrapper key={item.value ?? index}>
            <RowWrapper
              sx={{
                alignItems: 'center',
                ...(position === 'horizontal' && { mr: 3 }),
                ...(position === 'vertical' && { mt: 3 }),
                ...(item.additionalCheckboxSx && item.additionalCheckboxSx),
              }}
            >
              <MUICheckbox
                disabled={disabled ?? item.disabled}
                checked={(value as any[])?.includes(item.value) ?? false}
                onChange={(e) => handleChange(item.value, e.target.checked)}
              />
              <TextStyle
                color={disabled ?? item.disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}
                sx={inputSx}
              >
                {item.label ?? '-'}
              </TextStyle>
            </RowWrapper>
            {item.renderAdditionalContent && item.renderAdditionalContent()}
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
    </>
  );
};

export default Checkbox;
