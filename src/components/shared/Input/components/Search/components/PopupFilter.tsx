'use client';

import { useMemo, useState } from 'react';

import { FormControlLabel, Radio, RadioGroup, useTheme } from '@mui/material';
import dayjs from 'dayjs';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import StatusToggle from '@/components/shared/Input/components/StatusToggle';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import ButtonGroupSelect from './ButtonGroupSelect';
import InputAutocomplete from './InputAutocomplete';
import InputAutocompleteV2 from './InputAutocompleteV2';
import InputDate from './InputDate';
import InputDateRange from './InputDateRange';
import InputMonthPicker from './InputMonthPicker/InputMonthPicker';
import InputNumber from './InputNumber';
import InputSelect from './InputSelect';
import InputSelectSort from './InputSelectSort/InputSelectSort';
import InputText from './InputText';
import InputTextRange from './InputTextRange';
import InputYearPicker from './InputYearPicker/InputYearPicker';
import MultipleAutoComplete from './MultipleAutoComplete';

import type { PopupFilterProps } from './types';
import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';


const PopupFilter = ({
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

    // Clear values of disabled filter items
    listContent.forEach((content) => {
      if (content.isDisabled && content.key && valueToApply?.filter) {
        delete valueToApply.filter[content.key];
      }
    });

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

  const isPeriodValid = useMemo(() => {
    const periodFields = listContent.filter((content) => content.type === 'period');

    if (periodFields.length === 0) {
      return true;
    }

    const isValid = periodFields.every((field) => {
      const startValue = localValue?.filter?.[field.startKey] as string;
      const endValue = localValue?.filter?.[field.endKey] as string;

      const hasStart = startValue !== null && startValue !== undefined && startValue !== '';
      const hasEnd = endValue !== null && endValue !== undefined && endValue !== '';

      if (!hasStart && !hasEnd) return true;
      if (hasStart !== hasEnd) return false;

      if (startValue && !endValue) {
        const startDate = dayjs(startValue);
        const isStartValid = startDate.isValid() && startDate.year() >= 1900 && startDate.year() <= 2100;

        return isStartValid;
      }

      if (!startValue && endValue) {
        const endDate = dayjs(endValue);
        const isEndValid = endDate.isValid() && endDate.year() >= 1900 && endDate.year() <= 2100;

        return isEndValid;
      }

      const startDate = dayjs(startValue);
      const endDate = dayjs(endValue);

      const isStartValid = startDate.isValid() && startDate.year() >= 1900 && startDate.year() <= 2100;
      const isEndValid = endDate.isValid() && endDate.year() >= 1900 && endDate.year() <= 2100;
      const isRangeValid = startDate.isBefore(endDate) || startDate.isSame(endDate);

      const fieldValid = isStartValid && isEndValid && isRangeValid;

      return fieldValid;
    });

    return isValid;
  }, [localValue?.filter, listContent]);

  const isTextPeriodValid = useMemo(() => {
    const textPeriodFields = listContent.filter((content) => content.type === 'textPeriod');

    if (textPeriodFields.length === 0) {
      return true;
    }

    const isValid = textPeriodFields.every((field) => {
      const startValue = localValue?.filter?.[field.startKey] as unknown;
      const endValue = localValue?.filter?.[field.endKey] as unknown;

      const hasStart = startValue !== null && startValue !== undefined && startValue !== '';
      const hasEnd = endValue !== null && endValue !== undefined && endValue !== '';

      if (!hasStart && !hasEnd) return true;
      if (hasStart !== hasEnd) return false;

      const startNum = Number(startValue);
      const endNum = Number(endValue);

      if (Number.isNaN(startNum) || Number.isNaN(endNum)) {
        return false;
      }

      return startNum <= endNum;
    });

    return isValid;
  }, [localValue?.filter, listContent]);

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
            placeholder1="Start Date"
            placeholder2="End Date"
            allowFutureDates={Boolean(content.allowFutureDates)}
            disablePastDates={Boolean(content.disablePastDates)}
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
            placeholder1={content.placeholder1}
            placeholder2={content.placeholder2}
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
      case 'number':
        return (
          <InputNumber
            key={content.label}
            disabled={content.isDisabled}
            label={content.label}
            placeholder={content.placeholder}
            value={localValue?.filter?.[content.key] as string | number}
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
      case 'status-toggle':
        return (
          <ColumnWrapper key={content.label} sx={{ gap: 1 }}>
            <TextStyle variant="body4" weight={500}>
              {content.label}
            </TextStyle>
            <StatusToggle
              value={localValue?.filter?.[content.key] as string}
              onChange={(value) => {
                if (content?.watch) {
                  content.watch(value);
                }
                handleChangeFilter(content.type, content.key, value);
              }}
              options={content.options}
              disabled={content.isDisabled}
            />
          </ColumnWrapper>
        );
      case 'month':
        return (
          <InputMonthPicker
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
      case 'year':
        return (
          <InputYearPicker
            key={content.label}
            disabled={content.isDisabled}
            label={content.label}
            value={localValue?.filter?.[content.key] as string}
            onChange={(value) => {
              handleChangeFilter(content.type, content.key, value);
            }}
          />
        );
      case 'radio':
        return (
          <ColumnWrapper key={content.label} sx={{ mb: 1 }}>
            <TextStyle
              variant="body3"
              weight={600}
              sx={{ mb: 0.5 }}
            >
              {content.label}
            </TextStyle>

            <RadioGroup
              row
              value={localValue?.filter?.[content.key] || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                if (content.watch) content.watch(newValue);
                handleChangeFilter(content.type, content.key, newValue);
              }}
              sx={{
                '& .MuiFormControlLabel-root': {
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  },
                  margin: 0,
                },

                '& .MuiRadio-root': {
                  padding: '2px',
                  transform: 'scale(0.8)',
                },
                display: 'flex',
                gap: 1.5,
              }}
            >
              {content.options?.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio size="small" />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>
          </ColumnWrapper>
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
            disabled={!isPeriodValid || !isTextPeriodValid}
          >
            Apply
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </>
  );
};

export default PopupFilter;
