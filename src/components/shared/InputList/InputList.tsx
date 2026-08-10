import React from 'react';

import { Box, useTheme } from '@mui/material';

import Input from '@/components/shared/Input';

import type { InputListPlaceholder, InputListProps } from './InputList.types';
import type { InputFieldType } from '../Input/Input.types';


/**
 * InputList component for rendering multiple input fields.
 *
 * @component
 * @param {Array<InputListPlaceholder>} fieldList - List of input fields to be rendered.
 * @param {number} column - Number of columns to be displayed.
 * @returns {React.Component} Rendered InputList component.
 *
 * @example
 * const fieldList: Array<InputListPlaceholder> = [
 *
 * @example - For optimization, use useMemo to prevent re-rendering of the component.
 * const fieldList: Array<InputListPlaceholder> = useMemo(() => [
 * <InputList fieldList={fieldList} column={4} />
 *
 * @argument fieldList - List of input fields to be rendered.
 * @argument column - Number of columns to be displayed.
 *
 * @author
 * Fauzi Kurniawan
 */
const InputList = ({ fieldList, column = 2 }: InputListProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridGap: theme.spacing(3),
        gridTemplateColumns: `repeat(${column}, 1fr)`,
      }}
    >
      {fieldList.map((field: InputListPlaceholder) => {
        if (field.emptyField) {
          return <Box key={field.label} />;
        }

        return <Input key={field.label} {...field} type={field.type as InputFieldType} />;
      })}
    </Box>
  );
};

export default InputList;
