'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ModalUploadDocument from '../FastTrackRequestResultPage/components/ModalUploadDocument';
import { modal } from '../FastTrackRequestResultPage/FastTrackRequestResult.constants';

import useMandatoryChecklist from './MandatoryChecklist.hooks';


const MandatoryChecklistPage = () => {
  const {
    filter,
    setFilter,
    filterContentList,
    filterDropdownList,
    theme,
    headerTable,
    mandatoryChecklistData,
    renderActionButtons,
    isLoading,
  } = useMandatoryChecklist();
  return (
    <ColumnWrapper gap={theme.spacing(2)}>
      <Title title="Pembahasan Fast Track" />

      {/* Informasi Customer */}
      <SectionTitle
        title="Informasi Customer"
        subtitle="Pemerintah Provinsi Sulawesi Tenggara | CIF: 2023102503 | GAM: Bryan Perdana"
        isOpen={false}
      />

      <SectionTitle
        title="Checklist Dokumen"
        isOpen={true}
      >
        <Box width="45vw">
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian"
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>

        <Table
          tableHeader={headerTable}
          tableData={mandatoryChecklistData || []}
          isLoading={isLoading}
        />
      </SectionTitle>


      {/* Action Buttons */}
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 4 }}>
        {renderActionButtons}
      </RowWrapper>

      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT}
        component={ModalUploadDocument}
      />
    </ColumnWrapper>
  );
};

export default MandatoryChecklistPage;
