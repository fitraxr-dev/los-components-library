'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import useEditBusinessSummaryModal from './EditBusinessSummaryModal.hooks';


const EditBusinessSummaryModal = NiceModal.create(() => {
  const modalId = 'MODAL_EDIT_BUSINESS_SUMMARY';
  const modal = useModal(modalId);

  // Get parameters from modal args
  const onSuccess = modal.args?.onSuccess as (() => void) | undefined;
  const subModule = modal.args?.subModule as string | undefined;
  const code = modal.args?.code as string | undefined;
  const bucketProcessId = modal.args?.bucketProcessId as string | undefined;
  const itemData = modal.args?.itemData as any[] | undefined;

  const {
    form,
    isLoading,
    handleSave,
    businessSummaryOptions,
    fields,
    isAutoSaveFetching,
    isLoadingBusinessSummary,
  } = useEditBusinessSummaryModal({
    bucketProcessId,
    code,
    itemData,
    onSuccess,
    subModule,
  });

  const footer = (
    <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 5 }}>
      <Button
        variant="outlined"
        onClick={() => closeNiceModal(modalId)}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        color="info"
        onClick={handleSave((data) => {
          closeNiceModal(modalId);
        })}
        isLoading={isLoading}
        disabled={isAutoSaveFetching}
      >
        {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
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
      title="Edit Business Summary"
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
            <TextStyle variant="body4" weight={600} color="primary.main">
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
                        (() => {
                          const currentValue = field?.value;

                          // Try multiple matching strategies
                          let foundOption = null;

                          if (currentValue) {
                            // Strategy 1: Exact match
                            foundOption = businessSummaryOptions?.find((opt) => opt.label === currentValue);

                            // Strategy 2: Match by extracting the label part (after " - ")
                            if (!foundOption && currentValue.includes(' - ')) {
                              const labelPart = currentValue.split(' - ')[1];
                              foundOption = businessSummaryOptions?.find((opt) => opt.label === labelPart);
                            }

                            // Strategy 3: Match by extracting the key part (before " - ")
                            if (!foundOption && currentValue.includes(' - ')) {
                              const keyPart = currentValue.split(' - ')[0];
                              foundOption = businessSummaryOptions?.find((opt) => opt.value === keyPart);
                            }

                            // Strategy 4: Partial match (contains)
                            if (!foundOption) {
                              foundOption = businessSummaryOptions?.find((opt) =>
                                opt.label.toLowerCase().includes(currentValue.toLowerCase()) ||
                                currentValue.toLowerCase().includes(opt.label.toLowerCase())
                              );
                            }
                          }

                          return foundOption || null;
                        })()
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

            </RowWrapper>
          ))}

        </ColumnWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default EditBusinessSummaryModal;
