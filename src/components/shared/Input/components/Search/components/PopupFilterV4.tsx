'use client';
import React, { useMemo, useState } from 'react';

import { useTheme } from '@mui/material';
import dayjs from 'dayjs';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import ButtonGroupSelect from './ButtonGroupSelect';
import InputAreaProyek from './InputAreaProyek/InputAreaproyek';
import InputAutocomplete from './InputAutocomplete';
import InputAutocompleteV2 from './InputAutocompleteV2';
import InputDate from './InputDate';
import InputDateRange from './InputDateRange';
import InputSelect from './InputSelect';
import InputSelectSort from './InputSelectSort/InputSelectSort';
import InputText from './InputText';
import InputTextRange from './InputTextRange';
import InputVirtualAccount from './InputVirtualAccount';
import MultipleAutoComplete from './MultipleAutoComplete';

import type { FilterArea } from './InputAreaProyek/InputAreaproyek.types';
import type { PopupFilterProps } from './types';
import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';


const PopUpFilterV4 = ({
  data,
  listContent,
  onChange,
  onClose,
}: PopupFilterProps) => {
  const theme = useTheme();

  const [localValue, setLocalValue] = useState(data);

  useMemo(() => {
    setLocalValue((prev) => ({ ...prev, filter: { ...prev.filter, status: data.filter?.status } }));
  }, [data.filter]);

  const buttonSx = {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  };

  const handleChangeFilter = (type, key, value) => {

    if (type === 'sort') {
      if (value?.columnName) {
        setLocalValue((prevState) => ({ ...prevState, [key]: { ...value } }));
      } else {
        setLocalValue((prevState) => ({ ...prevState, [key]: undefined }));
      }
    } else if (type === 'period' || type === 'textPeriod') {
      setLocalValue((prevState) => ({
        ...prevState,
        filter: { ...prevState?.filter, ...value },
      }));
    } else if (type === 'textPeriod') {
      setLocalValue((prevState) => ({
        ...prevState,
        filter: { ...prevState?.filter, ...value },
      }));
    } else if (key === 'dropdown') {
      setLocalValue((prevState) => ({
        ...prevState,
        filter: { ...prevState?.filter, [key]: { ...value } },
      }));
    } else {
      setLocalValue((prevState) => ({
        ...prevState,
        filter: { ...prevState?.filter, [key]: value },
      }));
    }
  };

  const handleApply = () => {
    const valueToApply = { ...localValue };

    // Convert autocomplete value of { id, label } to { id }
    Object.keys(valueToApply?.filter ?? {})?.forEach((key) => {
      if ((valueToApply?.filter?.[key] as AutocompleteOption)?.id) {
        valueToApply.filter[key] = (valueToApply.filter[key] as AutocompleteOption).id.toString();
      }
    });

    // Remove empty array and null
    Object.keys(valueToApply?.filter ?? {})?.forEach((key) => {
      if (
        valueToApply?.filter?.[key] === null
          || (valueToApply?.filter?.[key] as string | string[])?.length === 0
      ) {
        delete valueToApply.filter[key];
      }
    });

    onChange(valueToApply);
    onClose();
  };

  const handleClearFilter = () => {

    setLocalValue((prev) => {
      if (prev) {
        return {};
      }
      return {
        ...prev,
      };
    });
  };

  const renderContent = (content) => {
    switch (content.type) {
      case 'sort':
        return (
          <InputSelectSort
            disabled={content.isDisabled}
            key={content.label}
            data={content.options}
            label={content.label}
            onChange={(value) => {
              if (content?.watch) {
                content.watch(value);
              }

              handleChangeFilter(content.type, content.key, value);
            }}
            value={localValue?.[content.key]}
          />
        );
      case 'autocomplete':
        return (
          <InputAutocomplete
            key={content.label}
            disabled={content.isDisabled}
            label={content.label}
            isLoading={content?.isLoading}
            dropdownList={content?.options}
            onChange={(value) => {
              if (content?.watch) {
                content.watch(value);
              }

              if (content.resetTargetAutocompleteKeys && !value.label) {
                for (let key of content.resetTargetAutocompleteKeys) {
                  setLocalValue((prev) => ({
                    ...prev,
                    filter: {
                      ...prev.filter,
                      [key]: { id: '', label: '' } as AutocompleteOption,
                    },
                  }));
                }
              }

              handleChangeFilter(content.type, content.key, value);
            }}
            onInputChange={(keyword) => {
              if (content?.onKeywordChange) {
                content.onKeywordChange(keyword);

                if (!keyword) {
                  handleChangeFilter(content.type, content.key, null);
                }
              }
            }}
            value={localValue?.filter?.[content.key] as AutocompleteOption}
          />
        );
      case 'autocomplete-v2':
        return (
          <InputAutocompleteV2
            key={content.label}
            disabled={content.isDisabled}
            label={content.label}
            isLoading={content?.isLoading}
            dropdownList={content?.options}
            onChange={(value) => {
              if (content?.watch) {
                content.watch(value);
              }

              const newValue = value.id === '' && value.label === '' ? null : value;

              handleChangeFilter(content.type, content.key, newValue);
            }}
            onInputChange={(keyword) => {
              if (content?.onKeywordChange) {
                content.onKeywordChange(keyword);

                if (!keyword) {
                  handleChangeFilter(content.type, content.key, null);
                }
              }
            }}
            value={localValue?.filter?.[content.key] as AutocompleteOption}
          />
        );
      case 'single-select':
        return (
          <ButtonGroupSelect
            key={content.label}
            disabled={content.isDisabled}
            data={content.options}
            label={content.label}
            value={[localValue?.filter?.[content.key]] as Array<string>}
            onChange={(value) => {
              if (content?.watch) {
                content.watch(value);
              }

              handleChangeFilter(content.type, content.key, value);
            }}
          />
        );
      case 'multiple-select':
        return (
          <ButtonGroupSelect
            key={content.label}
            disabled={content.isDisabled}
            data={content.options}
            label={content.label}
            value={localValue?.filter?.[content.key] as Array<string> || []}
            onChange={(value) => {
              if (content?.watch) {
                content.watch(value);
              }

              handleChangeFilter(content.type, content.key, value);
            }}
            multiple
          />
        );
      case 'date':
        return (
          <InputDate
            key={content.label}
            disabled={content.isDisabled}
            label={content.label}
            value={localValue?.filter?.[content.key] as string}
            onChange={(value) => {
              if (content?.watch) {
                content.watch(dayjs(value).format('YYYY-MM-DD'));
              }

              handleChangeFilter(content.type, content.key, dayjs(value).format('YYYY-MM-DD'));
            }}
          />
        );
      case 'period':
        return (
          <InputDateRange
            key={content.label}
            disabled={content.isDisabled}
            startDateValue={localValue?.filter?.[content.startKey] as string}
            endDateValue={localValue?.filter?.[content.endKey] as string}
            label={content.label}
            onChange={(value) => {
              const valueToSubmit = {
                [content.startKey]: value?.startDate ? dayjs(value.startDate).format('YYYY-MM-DD') : null,
                [content.endKey]: value?.endDate ? dayjs(value.endDate).format('YYYY-MM-DD') : null,
              };

              if (content?.watch) {
                content.watch(valueToSubmit);
              }

              handleChangeFilter(content.type, content.type, valueToSubmit);
            }}
          />
        );
      case 'textPeriod':
        return (
          <InputTextRange
            key={content.label}
            disabled={content.isDisabled}
            startValue={localValue?.filter?.[content.startKey] as number}
            endValue={localValue?.filter?.[content.endKey] as number}
            label={content.label}
            onChange={(value) => {
              const valueToSubmit = {
                [content.startKey]: value?.start ? value.start : null,
                [content.endKey]: value?.end ? value.end : null,
              };

              if (content?.watch) {
                content.watch(valueToSubmit);
              }

              handleChangeFilter(content.type, content.type, valueToSubmit);
            }}
          />
        );
      case 'dropdown':
        return (
          <InputSelect
            key={content.label}
            disabled={content.isDisabled}
            data={content.options}
            label={content.label}
            onChange={(value) => {
              if (content?.watch) {
                content.watch(value);
              }

              handleChangeFilter(content.type, content.key, value);
            }}
            value={localValue?.filter?.[content.key] as string}
          />
        );
      case 'text':
        return (
          <InputText
            key={content.label}
            disabled={content.isDisabled}
            label={content.label}
            value={localValue?.filter?.[content.key] as string}
            onChange={(value) => {
              if (content?.watch) {
                content.watch(value);
              }

              handleChangeFilter(content.type, content.key, value);
            }}
          />
        );
      case 'multiple-autocomplete':
        return (
          <MultipleAutoComplete
            key={content.label}
            disabled={content.isDisabled}
            dropdownList={content.options}
            label={content.label}
            placeholder="Search..."
            value={localValue?.filter?.[content.key] as string[]}
            onChange={(value) => {
              if (content?.watch) {
                content.watch(value);
              }
              handleChangeFilter(content.type, content.key, value);
            }}
            onInputChange={(keyword) => {
              if (content?.onKeywordChange) {
                content.onKeywordChange(keyword);
              }
            }}
          />
        );
      case 'virtual-account':
        return (
          <InputVirtualAccount
            bank={localValue?.filter?.bank}
            currency={localValue?.filter?.currency}
            vaType={localValue?.filter?.vaType}
            customerType={localValue?.filter?.customerType}
            onChange={(value) => {
              setLocalValue((prev) => ({
                ...prev,
                filter: {
                  ...prev.filter,
                  ...value,
                },
              }));
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ColumnWrapper sx={{ gap: 2, maxHeight: '71.92vh', overflowY: 'auto', padding: 2, width: '24.5vw  ' }}>
        <RowWrapper sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextStyle
            variant="body1"
            color={theme.palette.primary.main}
            weight={600}
          >
            Filter
          </TextStyle>
          <Button
            variant="text"
            textVariant="body4"
            textWeight={500}
            sx={{ padding: 0 }}
            onClick={handleClearFilter}
          >
            Clear All
          </Button>
        </RowWrapper>
        {listContent.map((content) => renderContent(content))}
        <RowWrapper
          sx={{
            borderColor: theme.palette.action.disabled,
            borderTop: 1,
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 2,
          }}
        >
          <Button
            isFull
            variant="outlined"
            textVariant="body4"
            sx={{ ...buttonSx, mr: 1 }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            isFull
            variant="contained"
            textVariant="body4"
            sx={buttonSx}
            onClick={handleApply}
          >
            Apply
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </>
  );
};

export default PopUpFilterV4;
