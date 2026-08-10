'use client';

import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';


const schema = yup.object({
  active: yup.boolean().required('Active status is required'),
  bank: yup.string().required('Bank is required'),
  bankPrefix: yup.string().required('Bank Prefix is required'),
  currency: yup.string().required('Currency is required'),
  customerType: yup.string().required('Customer Type is required'),
  totalDigit: yup.string().required('Total Digit is required'),
  vaType: yup.string().required('VA Type is required'),
  vaTypeDigit: yup.string().required('VA Type Digit is required'),
});

type FormData = yup.InferType<typeof schema>;

interface DetailModalProps {
  data?: any;
  isViewOnly?: boolean;
  mode?: 'add' | 'update'; // 'add' for single section, 'update' for two sections
}

const DetailModal = NiceModal.create<DetailModalProps>(({ data, isViewOnly = true, mode = 'update' }) => {

  const modalId = 'DETAIL_MODAL_VA';
  const modal = useModal(modalId);
  const theme = useTheme();

  const form = useForm<FormData>({
    defaultValues: {
      active: data?.lastModified?.isActive ?? true,
      bank: data?.lastModified?.bankName || '',
      bankPrefix: data?.lastModified?.bankPrefix || '',
      currency: data?.lastModified?.currency || 'IDR',
      customerType: data?.lastModified?.customerType || '',
      totalDigit: data?.lastModified?.totalDigit || '',
      vaType: data?.lastModified?.vaType || '',
      vaTypeDigit: data?.lastModified?.vaTypeDigit || '',
    },
    resolver: yupResolver(schema),
  });

  // Component for form fields
  const FormFields = ({ dataSource, title }: { dataSource: any; title: string }) => (
    <>
      <TextStyle variant="title1" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
        {title}
      </TextStyle>
      <RowWrapper sx={{ gap: 3, width: '100%' }}>
        <Controller
          control={form.control}
          name="bank"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Bank"
              placeholder="Bank Name"
              disabled={isViewOnly}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              value={dataSource?.bankName || '-'}
              containerSx={{ flex: 1 }}
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  borderColor: 'inherit !important',
                  boxShadow: 'none !important',
                },
              }}
            />
          )}
        />
        <Controller
          control={form.control}
          name="currency"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Currency"
              placeholder="Currency"
              disabled={isViewOnly}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              value={dataSource?.currency || '-'}
              containerSx={{ flex: 1 }}
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  borderColor: 'inherit !important',
                  boxShadow: 'none !important',
                },
              }}
            />
          )}
        />
      </RowWrapper>
      <RowWrapper sx={{ gap: 3, width: '100%' }}>
        <Controller
          control={form.control}
          name="vaType"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="VA Type"
              placeholder="VA Type"
              disabled={isViewOnly}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              value={dataSource?.vaType || '-'}
              containerSx={{ flex: 1 }}
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  borderColor: 'inherit !important',
                  boxShadow: 'none !important',
                },
              }}
            />
          )}
        />
        <Controller
          control={form.control}
          name="vaTypeDigit"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Digit VA Type"
              placeholder="Digit VA Type"
              disabled={isViewOnly}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              value={dataSource?.vaTypeDigit || '-'}
              containerSx={{ flex: 1 }}
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  borderColor: 'inherit !important',
                  boxShadow: 'none !important',
                },
              }}
            />
          )}
        />
      </RowWrapper>
      <RowWrapper sx={{ gap: 3, width: '100%' }}>
        <Controller
          control={form.control}
          name="customerType"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Customer Type"
              placeholder="Customer Type"
              disabled={isViewOnly}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              value={dataSource?.customerType || '-'}
              containerSx={{ flex: 1 }}
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  borderColor: 'inherit !important',
                  boxShadow: 'none !important',
                },
              }}
            />
          )}
        />
        <Controller
          control={form.control}
          name="bankPrefix"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Prefix Bank"
              placeholder="Prefix Bank"
              disabled={isViewOnly}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              value={dataSource?.bankPrefix || '-'}
              containerSx={{ flex: 1 }}
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  borderColor: 'inherit !important',
                  boxShadow: 'none !important',
                },
              }}
            />
          )}
        />
      </RowWrapper>
      <RowWrapper sx={{ gap: 3, width: '100%' }}>
        <Controller
          control={form.control}
          name="totalDigit"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="number"
              label="Total Digit"
              placeholder="Total Digit"
              disabled={isViewOnly}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              value={dataSource?.totalDigit || '-'}
              containerSx={{ flex: 1 }}
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  borderColor: 'inherit !important',
                  boxShadow: 'none !important',
                },
              }}
            />
          )}
        />
        <Controller
          control={form.control}
          name="active"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="radio"
              label="Active"
              placeholder="Active Status"
              disabled={isViewOnly}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              value={dataSource?.isActive}
              containerSx={{ flex: 1 }}
              radioList={[
                { label: 'Ya', value: true },
                { label: 'Tidak', value: false }
              ]}
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent !important',
                  borderColor: 'inherit !important',
                  boxShadow: 'none !important',
                },
              }}
            />
          )}
        />
      </RowWrapper>
    </>
  );


  const footer = (
    <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 5 }}>
      <Button
        variant="outlined"
        onClick={() => closeNiceModal(modalId)}
      >
        Close
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title="Detail Virtual Account"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '50.5vw',
      }}
      customFooter={footer}
    >
      <ColumnWrapper sx={{ gap: 3, justifyContent: 'space-between' }}>
        {mode === 'update' ? (
          <>
            {/* Update Mode: Show both Previous and Last Modified sections */}
            <FormFields dataSource={data?.previous} title="Previous Data" />
            <FormFields dataSource={data?.lastModified} title="Last Modified Data" />
          </>
        ) : (
          <>
            {/* Add Mode: Show only one section */}
            <FormFields dataSource={data?.lastModified} title="Virtual Account Data" />
          </>
        )}
      </ColumnWrapper>
    </SectionModal>
  );
});

export default DetailModal;
