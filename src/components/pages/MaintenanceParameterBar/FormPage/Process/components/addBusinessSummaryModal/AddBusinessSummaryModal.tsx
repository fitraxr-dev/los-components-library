'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller, useFieldArray } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import useAddBusinessSummaryModal from './AddBusinessSummaryModal.hooks';


const AddBusinessSummaryModal = NiceModal.create(() => {
  const modalId = 'MODAL_ADD_BUSINESS_SUMMARY';
  const modal = useModal(modalId);

  // Get parameters from modal args instead of context
  const onSuccess = modal.args?.onSuccess as (() => void) | undefined;
  const subModule = modal.args?.subModule as string | undefined;
  const code = modal.args?.code as string | undefined;
  const bucketProcessId = modal.args?.bucketProcessId as string | undefined;
  const {
    businessSummaryOptions,
    fields,
    form,
    handleAddItem,
    handleRemoveItem,
    handleSave,
    isLoading,
    isLoadingBusinessSummary,
  } = useAddBusinessSummaryModal(subModule || undefined, code || undefined, bucketProcessId || undefined, onSuccess);
  const theme = useTheme();

  const footer = (
    <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 5 }}>
      <Button
        disabled={isLoading}
        onClick={() => closeNiceModal(modalId)}
        variant="outlined"
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        isLoading={isLoading}
        onClick={handleSave((data) => {
          closeNiceModal(modalId);
        })}
      >
        Save
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      containerSx={{
        maxWidth: '80vw',
        minWidth: '60vw',
      }}
      customFooter={footer}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      title="Add Business Summary"
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        {/* Header - Tipe Business Call */}
        <Controller
          control={form.control}
          name="kodeBusinessCall"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              id="input-kode-business-call"
              label="Tipe Business Call"
              placeholder="Tipe Business Call"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              isMandatory
              disabled
            />
          )}
        />

        {/* Item Business Summary Section */}
        <ColumnWrapper sx={{ gap: 2 }}>
          <RowWrapper
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 2,
            }}
          >
            <TextStyle color="primary.main" variant="body4" weight={600}>
              Item Business Summary
            </TextStyle>
          </RowWrapper>

          {fields.map((field, index) => (
            <RowWrapper
              key={field.id}
              sx={{
                alignItems: 'flex-start',
                backgroundColor: 'white',
                gap: 2,
                p: 2,
              }}
            >
              {/* Item Number */}
              <Box sx={{ minWidth: '24px', pt: 2 }}>
                <TextStyle variant="body4" weight={500}>
                  {index + 1}.
                </TextStyle>
              </Box>

              {/* Kode Business Summary Input */}
              <Box sx={{ flex: 1 }}>
                <Controller
                  control={form.control}
                  name={`items.${index}.kodeBusinessSummary`}
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <Autocomplete
                      {...field}
                      dropdownList={(() => {
                        const items = (form.getValues('items') || []) as any[];
                        const selectedLabels = items
                          .map((it) => it?.kodeBusinessSummary)
                          .filter(Boolean) as string[];
                        const currentValue = field?.value || '';
                        return (businessSummaryOptions || []).filter((opt) =>
                          opt.label === currentValue || !selectedLabels.includes(opt.label)
                        );
                      })()}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      isMandatory
                      label="Kategori Business Summary"
                      placeholder="Pilih Kategori Business Summary"
                      isLoading={isLoadingBusinessSummary}
                      value={
                        field?.value ? businessSummaryOptions?.find((opt) => opt.label === field.value) || null : null
                      }
                      onChange={(option) => {
                        field.onChange(option?.label || '');
                      }}
                    />
                  )}
                />
              </Box>

              {/* Active Status */}
              <Box sx={{ minWidth: '100px' }}>
                <Controller
                  control={form.control}
                  name={`items.${index}.active`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Active"
                      position="horizontal"
                      radioList={[
                        { label: 'Ya', value: 'Ya' },
                        { label: 'Tidak', value: 'Tidak' },
                      ]}
                      type="radio"
                    />
                  )}
                />
              </Box>

              {/* Delete Button */}
              <Button
                color="error"
                disabled={fields.length === 1}
                onClick={() => handleRemoveItem(index)}
                sx={{
                  '&:hover': {
                    borderColor: fields.length === 1 ? 'rgba(0, 0, 0, 0.12)' : 'error.dark',
                  },
                  borderColor: fields.length === 1 ? 'rgba(0, 0, 0, 0.12)' : 'error.main',
                  minWidth: 'auto',
                  p: 1,
                }}
                variant="outlined"
              >
                <Icon
                  iconName="delete"
                  sx={{
                    color: fields.length === 1 ? 'rgba(0, 0, 0, 0.26)' : 'error.main',
                    fontSize: '20px',
                  }}
                />
              </Button>
            </RowWrapper>
          ))}

          {/* Add Item Button */}
          <RowWrapper sx={{ justifyContent: 'start', mb: 2 }}>
            <Button
              onClick={handleAddItem}
              startIcon="add-2"
              startIconSx={{ fontSize: theme.spacing(3) }}
              sx={{
                height: theme.spacing(6),
                padding: theme.spacing(1),
              }}
              variant="outlined"
            >
              Add Item
            </Button>
          </RowWrapper>
        </ColumnWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default AddBusinessSummaryModal;
