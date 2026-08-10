'use client';
import { useTheme } from '@mui/material';


import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input/';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import Text from '../../components/Text';

import type { DropdownProps } from './Dropdown.types';


const Dropdown = ({
  label = '',
  labelProps = {},
  containerSx = {},
  ...props
}: DropdownProps) => {
  const theme = useTheme();

  const {
    id,
    testId,
    disabled,
    disabledDropdown,
    onChange = () => { },
    placeholder = 'Please select something',
    dropdownList = [],
    value,
    error,
    helperText,
  } = props;

  const styDropdown = {
    '.MuiSelect-select': {
      minHeight: '0px !important',
    },
    mr: theme.spacing(1),
  };

  const handleDropdownChange = (val) => {
    onChange({
      dropdown: val,
      value: value?.value ?? '',
    });
  };

  const handleValueChange = (val) => {
    onChange({
      ...value,
      value: val,
    });
  };

  return (
    <ColumnWrapper sx={{ ...containerSx }}>
      <RowWrapper >
        <Text {...props}>{label}</Text>
      </RowWrapper>
      <RowWrapper>
        <Input
          id={`currency-${id}`}
          data-testid={`currency-${testId}`}
          containerSx={{ flex: 1, width: '100%' }}
          type="dropdown"
          disabled={disabled || disabledDropdown}
          dropdownList={dropdownList}
          value={value?.dropdown}
          onChange={handleDropdownChange}
          inputSx={styDropdown}
          error={error}
        />
        {value?.dropdown?.includes('OTHER') &&
          <Input
            id={`value-${id}`}
            data-testid={`value-${testId}`}
            containerSx={{ flex: 1 }}
            error={error}
            placeholder={placeholder}
            disabled={disabled}
            value={value?.value ?? ''}
            onChange={(values) => {
              handleValueChange(values);
            }}
          />}
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
    </ColumnWrapper>
  );
};

export default Dropdown;
