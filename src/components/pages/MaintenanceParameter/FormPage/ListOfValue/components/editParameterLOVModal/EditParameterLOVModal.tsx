'use client';

import React, { useState, useEffect } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';


interface EditParameterLOVModalProps {
  data?: {
    id: string;
    code: string;
    value: string;
    description: string;
    isActive: boolean;
  };
  onSuccess?: () => void;
}

const EditParameterLOVModal = NiceModal.create<EditParameterLOVModalProps>(({ data, onSuccess }) => {
  const modal = useModal();
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    isActive: true,
    value: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        code: data.code,
        description: data.description,
        isActive: data.isActive,
        value: data.value,
      });
    }
  }, [data]);

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
      console.log('Updating parameter LOV:', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess?.();
      modal.resolve();
    } catch (error) {
      console.error('Error updating parameter LOV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    modal.hide();
  };

  return (
    <Box sx={{ p: 3, width: 600 }}>
      <Title title="Edit Parameter LOV" />

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
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </Box>
  );
});

export default EditParameterLOVModal;
