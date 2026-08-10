import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import TextStyle from '@/components/shared/TextStyle';

import type { ParameterSyariahDetailModalProps } from './ParameterSyariahDetailModal.types';


const ParameterSyariahDetailModal = NiceModal.create(({
  previousData,
  lastModifiedData,
}: ParameterSyariahDetailModalProps) => {
  const modal = useModal();
  const theme = useTheme();

  // Helper function to render a single data section
  const renderDataSection = (data: any, title: string) => {
    if (!data) return null;

    return (
      <ColumnWrapper gap={2}>
        {/* Section Title */}
        <TextStyle
          variant="title1"
          weight={600}
          color={theme.palette.primary.main}
          py={1}
        >
          {title}
        </TextStyle>

        {/* Product Information */}
        <RowWrapper gap={2}>
          <Input
            label="Nama Produk"
            value={data?.product || ''}
            disabled
            type="text"
            containerSx={{ flex: 1 }}
          />
          <Input
            label="Referensi"
            value={data?.productReference || ''}
            disabled
            type="text"
            containerSx={{ flex: 1 }}
          />
        </RowWrapper>

        <RowWrapper gap={2}>
          <Input
            type="radio"
            label="Active"
            value={data?.isActive}
            disabled
            radioList={[
              { label: 'Ya', value: true },
              { label: 'Tidak', value: false }
            ]}
            containerSx={{ flex: 1 }}
          />
        </RowWrapper>

        {/* Form Field Section */}
        <TextStyle
          variant="body1"
          weight={600}
          color={theme.palette.text.primary}
          py={1}
        >
          Form Field
        </TextStyle>

        <ColumnWrapper gap={2} sx={{ p: 2 }}>
          {!data?.attributes || data.attributes.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <EmptyPlaceholder status="data" imageOnly />
              <TextStyle variant="body2" weight={400} color={theme.palette.text.secondary} sx={{ mt: 2 }}>
                Tidak ada form field yang tersedia
              </TextStyle>
            </div>
          ) : (
            data.attributes.map((attribute: any, index: number) => (
              <RowWrapper key={attribute.attributeKey} gap={2} alignItems="center" mt={1} mb={1}>
                {/* Number */}
                <TextStyle
                  variant="body1"
                  weight={400}
                  fontSize="12px"
                  sx={{ flex: '0 0 40px', textAlign: 'center' }}
                >
                  {index + 1}.
                </TextStyle>

                {/* Label Input */}
                <Input
                  label="Field Name"
                  value={attribute.attributeLabel}
                  disabled
                  type="text"
                  containerSx={{ flex: 1 }}
                />

                {/* Type Input */}
                <Input
                  label="Type"
                  value={attribute.attributeType}
                  disabled
                  type="text"
                  containerSx={{ flex: 1 }}
                />
              </RowWrapper>
            ))
          )}
        </ColumnWrapper>
      </ColumnWrapper>
    );
  };

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modal.visible}
      onClose={() => modal.hide()}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          maxHeight: '90vh',
          maxWidth: '55vw',
          minWidth: '55vw',
          overflow: 'auto',
          padding: theme.spacing(4),
        },
      }}
    >
      <ColumnWrapper gap={3}>
        {/* Header */}
        <RowWrapper
          sx={{
            borderBottom: '0.1vw solid',
            borderColor: theme.palette.custom.gray30,
            justifyContent: 'center',
            marginBottom: theme.spacing(4),
            p: 1,
          }}
        >
          <TextStyle variant="body1" color={theme.palette.primary.main}>
            Detail Syariah
          </TextStyle>
        </RowWrapper>

        {/* Previous Data Section */}
        {previousData && renderDataSection(previousData, 'Previous')}

        {/* Separator if both exist */}
        {previousData && lastModifiedData && (
          <div
            style={{
              borderTop: `2px solid ${theme.palette.custom.gray30}`,
              margin: theme.spacing(3, 0),
            }}
          />
        )}

        {/* Last Modified Data Section */}
        {lastModifiedData && renderDataSection(lastModifiedData, 'Last Modified')}

        {/* Empty State */}
        {!previousData && !lastModifiedData && (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <EmptyPlaceholder status="data" imageOnly />
            <TextStyle variant="body2" weight={400} color={theme.palette.text.secondary} sx={{ mt: 2 }}>
              Tidak ada data yang tersedia
            </TextStyle>
          </div>
        )}

        {/* Footer */}
        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          <Button variant="outlined" onClick={() => modal.hide()}>
            Close
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </Dialog>
  );
});

export default ParameterSyariahDetailModal;
