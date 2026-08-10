import * as React from 'react';

import { Box } from '@mui/material';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';

import TableDigitalMemo from '../../../TableDigitalMemo';
import TableFinancingDocument from '../../../TableFinancingDocument';
import TableSupportingDocument from '../../../TableSupportingDocument';


interface FormSelectTableProps {
  readonly onSelected: (selectedData: any[]) => void;
  readonly module: any;
  readonly process: any;
  readonly existingDocuments?: any[];
}

const FormSelectTable: React.FC<FormSelectTableProps> = ({ onSelected, module, process, existingDocuments = []}) => {
  const [selectedDocumentType, setSelectedDocumentType] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);

  const documentTypeOptions = [
    { id: 'DIGITAL_MEMO', label: 'Digital Memo' },
    { id: 'FINANCING_DOCUMENT', label: 'Document Pembiayaan' },
    { id: 'SUPPORTING_DOCUMENTS', label: 'Supporting Dokument' },
  ];

  // Reset selection when document type changes
  React.useEffect(() => {
    setSelectedItems([]);
    onSelected([]);
  }, [selectedDocumentType, onSelected]);

  // Handle item selection
  const handleItemSelection = (item: any, isSelected: boolean) => {
    let newSelectedItems;
    if (isSelected) {
      newSelectedItems = [...selectedItems, item];
    } else {
      newSelectedItems = selectedItems.filter((selected) => selected.id !== item.id);
    }
    setSelectedItems(newSelectedItems);
    onSelected(newSelectedItems);
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean, allItems: any[]) => {
    if (isSelected) {
      setSelectedItems(allItems);
      onSelected(allItems);
    } else {
      setSelectedItems([]);
      onSelected([]);
    }
  };

  const renderTable = () => {
    const commonProps = {
      existingDocuments,
      module,
      onItemSelection: handleItemSelection,
      onSelectAll: handleSelectAll,
      process,
      selectedItems,
      useSelected: true,
    };

    switch (selectedDocumentType) {
      case 'DIGITAL_MEMO':
        return <TableDigitalMemo {...commonProps} />;
      case 'FINANCING_DOCUMENT':
        return <TableFinancingDocument {...commonProps} />;
      case 'SUPPORTING_DOCUMENTS':
        return <TableSupportingDocument {...commonProps} />;
      default:
        return (
          <BaseContainer sx={{ boxShadow: 7, p: 3 }}>
            <Box sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Pilih jenis dokumen untuk melihat daftar dokumen
            </Box>
          </BaseContainer>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Autocomplete
        label="Dokumen"
        placeholder="Pilih jenis dokumen"
        dropdownList={documentTypeOptions}
        value={
          selectedDocumentType
            ? documentTypeOptions.find(
              (option) => option.id === selectedDocumentType
            ) || null
            : null
        }
        onChange={(value) => setSelectedDocumentType(String(value?.id || ''))}
        isMandatory
      />

      {selectedDocumentType && (
        <Box>
          <Box sx={{ mt: 2 }}>
            {selectedItems.length > 0 && (
              <Box sx={{ bgcolor: 'primary.light', borderRadius: 1, mb: 2, p: 2 }}>
                <strong>{selectedItems.length} Dokumen Dipilih</strong>
              </Box>
            )}
            {renderTable()}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FormSelectTable;
