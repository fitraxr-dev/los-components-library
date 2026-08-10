'use client';

import React, { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';


interface AddParameterLOVModalProps {
  onSuccess?: () => void;
}

const AddParameterLOVModal = NiceModal.create<AddParameterLOVModalProps>(({ onSuccess }) => {
  const modal = useModal();
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    isActive: true,
    value: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Implement API call here
      console.log('Adding parameter LOV:', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess?.();
      modal.resolve();
    } catch (error) {
      console.error('Error adding parameter LOV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    modal.hide();
  };

  return (
    <Box sx={{ p: 3, width: 600 }}>
      <Title title="Add Parameter LOV" />

      <ColumnWrapper sx={{ gap: 2, mt: 2 }}>
        <Input
          type="text"
          label="Code"
          value={formData.code}
          onChange={(value) => handleInputChange('code', value)}
          placeholder="Enter code"
          required
        />

        <Input
          type="text"
          label="Value"
          value={formData.value}
          onChange={(value) => handleInputChange('value', value)}
          placeholder="Enter value"
          required
        />

        <Input
          type="text"
          label="Description"
          value={formData.description}
          onChange={(value) => handleInputChange('description', value)}
          placeholder="Enter description"
          required
        />

        <RowWrapper sx={{ gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add'}
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </Box>
  );
});

export default AddParameterLOVModal;
