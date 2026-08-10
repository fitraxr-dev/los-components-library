'use client';
import React from 'react';

import { Tooltip, Box, useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';

import Currency from '../Currency';
import Icon from '../Icon';
import RowWrapper from '../RowWrapper';
import TextStyle from '../TextStyle';

import Checkbox from './components/Checkbox';
import Date from './components/Date';
import Dropdown from './components/Dropdown';
import DropdownSearch from './components/DropdownSearch';
import File from './components/File';
import FileV2 from './components/FileV2';
import Media from './components/Media';
import Month from './components/Month';
import NPWP from './components/NPWP';
import Number from './components/Number';
import Password from './components/Password';
import RadioButton from './components/RadioButton';
import RichText from './components/RichText';
import Search from './components/Search';
import SearchV2 from './components/Search/SearchV2';
import SearchV3 from './components/Search/SearchV3';
import SearchV4 from './components/Search/SearchV4';
import Text from './components/Text';
import TextArea from './components/TextArea';
import TextInput from './components/TextInput';
import TimeInput from './components/TimeInput';
import Toggle from './components/Toggle';
import Year from './components/Year';

import type { InputProps } from './Input.types';


/**
 * Input component for rendering different types of input fields.
 *
 * @component
 * @param {string} type - Type of input field ('currency', 'date', 'dropdown', 'file', 'number', 'area', 'text').
 * @param {string} label - Label for the input field.
 * @param {object} labelProps - Additional properties for the label.
 * @param {object} inputProps - Properties specific to the chosen input type.
 * @param {string} inputProps.value - Value of the input field.
 * @param {Function} inputProps.onChange - Function to handle changes in the input field.
 * @returns {React.Component} Rendered Input component.
 *
 * @example
 * <Input type="text" label="Username" value="john_doe" onChange={handleUsernameChange} />
 */
const Input = ({
  type = 'text',
  label = '',
  containerSx,
  topComponent = null,
  rightComponent = null,
  showTooltip = false,
  tooltipText = '',
  ...inputProps
}: InputProps) => {

  const inputType = {
    'area': <TextArea {...inputProps} />,
    'checkbox': <Checkbox {...inputProps} />,
    'currency': <Currency {...inputProps} />,
    'date': <Date {...inputProps} />,
    'dropdown': <Dropdown {...inputProps} />,
    'dropdown-search': <DropdownSearch {...inputProps} />,
    'file': <File {...inputProps} />,
    'file2': <FileV2 {...inputProps} />,
    'media': <Media {...inputProps} />,
    'month': <Month {...inputProps} />,
    'npwp': <NPWP {...inputProps} />,
    'number': <Number {...inputProps} hasDataMaster={inputProps?.hasDataMaster} dataChanges={inputProps?.dataChanges} />,
    'password': <Password {...inputProps} />,
    'radio': <RadioButton {...inputProps} />,
    'richtext': <RichText {...inputProps} />,
    'search': <Search {...inputProps} />,
    'search2': <SearchV2 {...inputProps} />,
    'search3': <SearchV3 {...inputProps} />,
    'search4': <SearchV4 {...inputProps} />,
    'text': <TextInput {...inputProps} />,
    'time': <TimeInput {...inputProps} />,
    'toggle': <Toggle {...inputProps} />,
    'year': <Year {...inputProps} />,
  };

  const renderInput = inputType[type];
  const theme = useTheme();


  return (
    <ColumnWrapper sx={containerSx}>
      <RowWrapper justifyContent="space-between" alignItems="center">
        {showTooltip ? (
          <RowWrapper sx={{ alignItems: 'center' }}>
            <Text {...inputProps}>{label}</Text>
            <Tooltip
              title={tooltipText}
              placement="right"
              arrow
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 2,
                    mb: 1,
                    pb: 1,
                    pt: 1,
                  },
                },
              }}
            >
              <Box sx={{ alignItems: 'center', cursor: 'pointer', display: 'flex', pb: 1 }}>
                <Icon iconName="info-circle" />
              </Box>
            </Tooltip>
          </RowWrapper>
        ) : (
          <Text {...inputProps}>{label}</Text>
        )}
        {topComponent}
      </RowWrapper>
      {rightComponent ? (
        <RowWrapper alignItems="center" gap={2}>
          {renderInput}
          {rightComponent}
        </RowWrapper>
      ) : renderInput}
      {inputProps?.hasDataMaster &&
        <TextStyle sx={{ pt: 1 }} weight={500}>Data Sebelumnya : {inputProps?.hasDataMaster}</TextStyle>}
    </ColumnWrapper>
  );
};

export default Input;
