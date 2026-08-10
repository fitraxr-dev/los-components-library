'use client';
import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';


import { roles } from '@/configs/constants';
import { formatDateTime } from '@/helpers/date';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';


import ModalUploadDocument from './components/ModalUploadDocument';
import ModalUploadDocumentExisting from './components/ModalUploadDocumentExisting';
import { modal } from './FastTrackRequestResult.constants';
import useFastTrackRequestResult from './useFastTrackRequestResult.hook';


const FastTrackRequestResultPage = () => {

  const {
    tableHeader,
    listDocument,
    filterDropdownList,
    selectedModule,
    setSelectedModule,
    filter,
    setFilter,
    handleAddDocument,
    remarks,
    setRemarks,
    renderActionButtons,
    theme,
    listModule,
    currentRole,
  } = useFastTrackRequestResult();

  return (
    <ColumnWrapper sx={{ flex: 6, gap: 2 }}>
      <Title title="Pembahasan Fast Track" />

      {/* Informasi Customer */}
      <SectionTitle
        title="Informasi Customer"
        subtitle="Pemerintah Provinsi Sulawesi Tenggara | CIF: 2023102503 | GAM: Bryan Perdana"
        isOpen={false}
      />

      <Box>
        <MultipleAutoComplete
          placeholder="Select Module"
          value={selectedModule.map((item: any) => item.value)}
          onChange={(values) => {
            const selectedItems = listModule.filter((opt) => values.includes(opt.value));
            setSelectedModule(selectedItems as any);
          }}
          dropdownList={listModule}
        />
      </Box>

      {/* Other Sections */}
      {selectedModule?.map((item) => {
        const title = item.label || item.value;

        const filteredListDocument = (listDocument || [])
          .filter((doc: any) => doc.sourceSection === item.value)
          .map((doc: any, index: number) => ({

            confirmedByName: doc.confirmedByName || '-',

            confirmedDate: doc.confirmedDate || '-',

            createdDate: doc.createdDate || '-',

            divisi: doc.divisionName || '-',

            documentId: doc.documentId || null,

            groupDokumen: doc.documentGroupLabel || doc.documentGroup || '-',

            id: doc.id,

            jenisDokumen: doc.documentTypeLabel || doc.documentType || '-',

            namaDokumen: doc.fileName || doc.documentName || '-',

            nomorDokumen: doc.documentNumber || '-',

            remarkDoc: doc.remarkDoc || '-',

            sourceSection: doc.sourceSection,

            statusName: doc.statusName || '-',

            tanggalDokumen: doc.documentDate ? formatDateTime(doc.documentDate) : '-',

            tlConfirmation: doc.isConfirmedTl || false,

            uploadedBy: doc.createdByName || '-',

          }));

        return (
          <SectionTitle key={title} title={'Upload ' + title}>
            <ColumnWrapper sx={{ gap: 2, pt: 2 }}>
              {/* Filter Row */}
              <RowWrapper sx={{ alignItems: 'center', gap: 2 }}>
                <Box>
                  <Input
                    type="search"
                    value={filter}
                    onChange={setFilter}
                    placeholder="Pencarian..."
                    dropdownList={filterDropdownList}
                    contentList={[]}
                  />
                </Box>
              </RowWrapper>

              {/* Table */}
              <Box sx={{ overflowX: 'auto' }}>
                <Table
                  tableHeader={tableHeader}
                  tableData={filteredListDocument}
                  footer={currentRole.includes(roles.STAFF) &&
                  <TableFooter onClick={() => handleAddDocument(item.value)} sx={{ mt: theme.spacing(3) }} />}
                />
              </Box>
              {/* Keterangan */}
              <Box sx={{ mt: 1 }}>
                <Input
                  type="area"
                  label="Keterangan"
                  disabled= {!currentRole.includes(roles.STAFF)}
                  placeholder="input keterangan"
                  value={remarks[item.value] || ''}
                  onChange={(val) => setRemarks((prev: any) => ({ ...prev, [item.value]: val }))}
                  multiline
                  rows={3}
                />
              </Box>
            </ColumnWrapper>
          </SectionTitle>
        );
      })}

      {/* Action Buttons */}
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 4 }}>
        {renderActionButtons}
      </RowWrapper>

      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT}
        component={ModalUploadDocument}
      />
      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT_EXISTING}
        component={ModalUploadDocumentExisting}
      />
    </ColumnWrapper>
  );
};

export default FastTrackRequestResultPage;
