import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import useViewOnly from '@/hooks/useViewOnly';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Loader from '@/components/shared/Loader';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableUploadDocumentSiteVisit from '@/components/shared/SmiTable/TableUploadDocumentSiteVisit';
import TableUploadFileSiteVisit from '@/components/shared/SmiTable/TableUploadFileSiteVisit';
import Table from '@/components/shared/Table';

import SectionLabel from '../../../shared/components/SectionLabel/SectionLabel';
import useGetVisitDetail from '../../../shared/hooks/useGetVisitDetail';
import useSiteVisitContext from '../../../shared/hooks/useSiteVisitContext';
import useViewAllDocument from '../../../ViewAllDocumentPage/ViewAllDocument.hook';
import { modalSiteVisit } from '../../SiteVisit.constants';

import useAddSiteVisit, { PartyType, type PartySiteVisit } from './AddNewSIteVisit.hook';
import AddressForm from './components/AddressForm';

import type { VisitResponseDto } from '@/services/openapi/site-visit-service';


const AddSiteVisit = ({ visible, isLoading, isValidForm }) => {
  const { isPemda } = useViewAllDocument();
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const { siteVisitDetail } = useSiteVisitContext();
  const [isOthersMediaSV, setIsOthersMediaSV] = useState<'Others' | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const isDisabledForm = siteVisitDetail?.isFromHistory && !siteVisitDetail?.isRefina;
  const disableEdit = viewOnly || isDisabledForm;

  const { control, ...form } = useFormContext<any, VisitResponseDto>();

  const normalize = (val?: string | number | null) =>
    (val ?? '').toString().trim().toLowerCase();

  const isSameParty = (a: PartySiteVisit, b: PartySiteVisit) => {
    if (!a || !b) return false;

    // Untuk internal SMI, utamakan staffId (satu staff hanya boleh sekali)
    if (a.staffId && b.staffId) {
      return a.staffId === b.staffId;
    }

    // Selain itu, anggap duplikat kalau kombinasi input-nya sama
    return (
      normalize(a.division) === normalize(b.division) &&
      normalize(a.name) === normalize(b.name) &&
      normalize(a.position) === normalize(b.position) &&
      normalize(a.instance) === normalize(b.instance)
    );
  };

  const isDuplicateParty = (list: PartySiteVisit[] = [], data: PartySiteVisit, skipIndex?: number) =>
    list.some((item, index) => index !== skipIndex && isSameParty(item, data));

  // Fetch visit detail data using custom hook
  const { data: visitDetailData, isLoading: isLoadingVisitDetail } = useGetVisitDetail({
    bucketMasterId: siteVisitDetail?.bucketMasterId,
    bucketProcessId: siteVisitDetail?.bucketProcessId || '',
    enabled: !!siteVisitDetail?.bucketProcessId,
    visitCode: siteVisitDetail?.visitCode,
  });

  const handleEditParty = (type: PartyType, data: PartySiteVisit, index: number) => {
    switch (type) {
      case PartyType.OWNER:
        NiceModal.show(modalSiteVisit.ADD_NEW_PIHAK_SMI, {
          editData: data,
          editIndex: index,
          storeData: (editType: PartyType, editData: PartySiteVisit) => {
            const tempValueOwner = form.getValues('internalParty') || [];

            if (isDuplicateParty(tempValueOwner, editData, index)) {
              NiceModal.show(MODAL.GLOBAL.WARNING, {
                title: 'Data pihak PT. SMI sudah ada.',
              });
              return;
            }

            tempValueOwner[index] = editData;
            form.setValue('internalParty', tempValueOwner);
          },
        });
        break;
      case PartyType.CLIENT:
        NiceModal.show(modalSiteVisit.ADD_NEW_PIHAK_CLIENT, {
          editData: data,
          editIndex: index,
          storeData: (editType: PartyType, editData: PartySiteVisit) => {
            const tempValueClient = form.getValues('clientParty') || [];

            if (isDuplicateParty(tempValueClient, editData, index)) {
              NiceModal.show(MODAL.GLOBAL.WARNING, {
                title: 'Data pihak Client / Customer sudah ada.',
              });
              return;
            }

            tempValueClient[index] = editData;
            form.setValue('clientParty', tempValueClient);
          },
        });
        break;
      case PartyType.OTHER:
        NiceModal.show(modalSiteVisit.ADD_NEW_PIHAK_LAIN, {
          editData: data,
          editIndex: index,
          storeData: (editType: PartyType, editData: PartySiteVisit) => {
            const tempValueOthers = form.getValues('externalParty') || [];

            if (isDuplicateParty(tempValueOthers, editData, index)) {
              NiceModal.show(MODAL.GLOBAL.WARNING, {
                title: 'Data pihak lainnya sudah ada.',
              });
              return;
            }

            tempValueOthers[index] = editData;
            form.setValue('externalParty', tempValueOthers);
          },
        });
        break;
      default:
        console.error('Party error');
        break;
    }
  };

  const handleDeleteParty = (type: PartyType, index: number) => {
    switch (type) {
      case PartyType.OWNER:
        const tempValueOwner = form.getValues('internalParty');
        const deletedOwner = tempValueOwner[index];
        // Jika party punya ID, tambahkan ke deletedPartyIds di form state
        if (deletedOwner?.id) {
          const currentDeletedIds = form.getValues('deletedPartyId') || [];
          const updatedDeletedIds = [...currentDeletedIds, deletedOwner.id];
          form.setValue('deletedPartyId', updatedDeletedIds);
        }
        tempValueOwner.splice(index, 1);
        form.setValue('internalParty', tempValueOwner);
        break;
      case PartyType.CLIENT:
        const tempValueClient = form.getValues('clientParty');
        const deletedClient = tempValueClient[index];
        // Jika party punya ID, tambahkan ke deletedPartyIds di form state
        if (deletedClient?.id) {
          const currentDeletedIds = form.getValues('deletedPartyId') || [];
          const updatedDeletedIds = [...currentDeletedIds, deletedClient.id];
          form.setValue('deletedPartyId', updatedDeletedIds);
        }
        tempValueClient.splice(index, 1);
        form.setValue('clientParty', tempValueClient);
        break;
      case PartyType.OTHER:
        const tempValueOthers = form.getValues('externalParty');
        const deletedOther = tempValueOthers[index];
        // Jika party punya ID, tambahkan ke deletedPartyIds di form state
        if (deletedOther?.id) {
          const currentDeletedIds = form.getValues('deletedPartyId') || [];
          const updatedDeletedIds = [...currentDeletedIds, deletedOther.id];
          form.setValue('deletedPartyId', updatedDeletedIds);
        }
        tempValueOthers.splice(index, 1);
        form.setValue('externalParty', tempValueOthers);
        break;
      default:
        console.error('Party error');
        break;
    }
  };

  const {
    clientVisitHeader,
    othersVisitHeader,
    smiVisitHeader,
    mediaVisitList,
    institutiontypeData,
  } = useAddSiteVisit({
    disableEdit,
    form,
    onDeleteParty: handleDeleteParty,
    onEditParty: handleEditParty,
  });

  const mediaSiteVisit = form.watch('evidence');

  const mediaSiteVisitOpt = ['On Site', 'Video Call'];

  useEffect(() => {
    if (mediaSiteVisitOpt.includes(mediaSiteVisit)) {
      setIsOthersMediaSV(null);
      setSelectedMediaType(mediaSiteVisit);
    }

    if (mediaSiteVisit !== undefined && !mediaSiteVisitOpt.includes(mediaSiteVisit)) {
      // If evidence is not in the standard options, treat it as "Others"
      setIsOthersMediaSV('Others');
      setSelectedMediaType('Others');
      form.setValue('evidence', mediaSiteVisit);
      // Keep the original value in evidence field for display in input
    }

    // If evidence is null, automatically set to "Others"
    if (mediaSiteVisit === null) {
      setIsOthersMediaSV('Others');
      setSelectedMediaType('Others');
    }
  }, [mediaSiteVisit]);


  // Set facilityNumber and project from visitDetailData
  useEffect(() => {
    if (visitDetailData?.data?.content) {
      const visitData = visitDetailData.data.content;

      // Set facilityNumber from visitDetailData
      if (visitData.facilityNumber) {
        form.setValue('facilityNumber', visitData.facilityNumber);
      }

      // Set project from visitDetailData
      if (visitData.project) {
        form.setValue('project', visitData.project);
      }
    }
  }, [visitDetailData, form]);

  const addParty = (type: PartyType, data: PartySiteVisit) => {
    switch (type) {
      case PartyType.OWNER:
        const tempValueOwner = form.getValues('internalParty') || [];

        if (isDuplicateParty(tempValueOwner, data)) {
          NiceModal.show(MODAL.GLOBAL.WARNING, {
            title: 'Data pihak PT. SMI sudah ada.',
          });
          return;
        }

        tempValueOwner.push(data);
        form.setValue('internalParty', tempValueOwner);
        break;
      case PartyType.CLIENT:
        const tempValueClient = form.getValues('clientParty') || [];

        if (isDuplicateParty(tempValueClient, data)) {
          NiceModal.show(MODAL.GLOBAL.WARNING, {
            title: 'Data pihak Client / Customer sudah ada.',
          });
          return;
        }

        tempValueClient.push(data);
        form.setValue('clientParty', tempValueClient);
        break;
      case PartyType.OTHER:
        if (data && !!Object.keys(data)?.length) {
          const tempValueOthers = form.getValues('externalParty') || [];

          if (isDuplicateParty(tempValueOthers, data)) {
            NiceModal.show(MODAL.GLOBAL.WARNING, {
              title: 'Data pihak lainnya sudah ada.',
            });
            return;
          }

          tempValueOthers.push(data);
          form.setValue('externalParty', tempValueOthers);
        }
        break;
      default:
        console.error('Party error');
        break;
    }
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Loader isLoading={isLoading} />
      {
        (visible) && (
          <ColumnWrapper sx={{ gap: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gridGap: 10,
                gridTemplateColumns: isOthersMediaSV ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
              }}
            >
              <Controller
                control={control}
                name={'institutionType' as any}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    {...field}
                    type="dropdown"
                    label="Institution Type"
                    placeholder="Choose institution type"
                    dropdownList={institutiontypeData}
                    value={field.value}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    disabled
                    isMandatory={!isDisabledForm && !isPemda}
                  />)}
              />

              <Controller
                control={control}
                name={'debtorName' as any}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    {...field}
                    type="text"
                    label="Nama Customer"
                    placeholder="Nama Customer"
                    disabled
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    isMandatory={!isDisabledForm && !isPemda}
                  />
                )}
              />

              <Controller
                control={control}
                name="evidence"
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    {...field}
                    type="dropdown"
                    label="Media Site Visit"
                    placeholder="Choose media site visit"
                    dropdownList={mediaVisitList}
                    value={selectedMediaType || field.value}
                    onChange={(value) => {
                      setSelectedMediaType(value);
                      field.onChange(value);
                      // Set selectedMediaType to form values for validation
                      form.setValue('selectedMediaType', value);
                      if (value === 'Others') {
                        form.setValue('evidence', null);
                      }
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message || ''}
                    disabled={disableEdit}
                  />)}
              />
              {isOthersMediaSV && <Controller
                control={control}
                name="evidence"
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    {...field}
                    type="text"
                    label=""
                    placeholder="Input Keterangan Media"
                    error={false}
                    helperText=""
                    disabled={disableEdit}
                    isMandatory={false}
                    containerSx={{
                      '& .MuiFormControl-root': {
                        justifyContent: 'flex-end',
                      },
                      '& .MuiInputLabel-root': {
                        display: 'none !important',
                      },
                      '& > div:first-of-type': {
                        display: 'none',
                      },
                    }}
                  />
                )}
              />}
            </Box>
            {isPemda && (
              <Box
                sx={{
                  display: 'grid',
                  gridGap: 10,
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}
              >
                <Controller
                  control={control}
                  name={'facilityNumber' as any}
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Nomor Fasilitas"
                      placeholder="Nomor Fasilitas"
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      disabled
                    />)}
                />

                <Controller
                  control={control}
                  name={'project' as any}
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Proyek"
                      placeholder="Proyek"
                      disabled
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                    />
                  )}
                />
              </Box>
            )}
            {/* Customer Address */}
            <SectionLabel title="Alamat Customer :" />

            <Controller
              control={control}
              name="debtorAddress.address"
              render={({ field: { ref, ...field }, fieldState }) => (
                <Input
                  {...field}
                  isMandatory={!isDisabledForm && !isPemda}
                  type="area"
                  label="Alamat"
                  rows={4}
                  placeholder="Input Alamat"
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message || ''}
                  disabled={disableEdit}
                />
              )}
            />
            <AddressForm disableEdit={disableEdit} isDataFromHistory={isDisabledForm} target="Customer" skipValidation={isPemda} />

            {/* Loc Site Visit */}
            <SectionLabel title="Lokasi Site Visit :" />
            <Controller
              control={control}
              name="visitAddress.address"
              render={({ field: { ref, ...field }, fieldState }) => (
                <Input
                  {...field}
                  type="area"
                  label="Nama Lokasi"
                  placeholder="Input Nama Lokasi"
                  rows={4}
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message || ''}
                  disabled={disableEdit || isPemda}
                />)}
            />
            <AddressForm disableEdit={disableEdit || isPemda} isDataFromHistory={isDisabledForm} skipValidation={true} target="site-visit" />

            <SectionTitle title="Pihak PT. SMI yang melakukan Kunjungan" isMandatory={!isDisabledForm && !isPemda} isOpen>
              <ColumnWrapper gap={2}>
                <BaseContainer sx={{ boxShadow: 7 }}>
                  <Table
                    tableHeader={smiVisitHeader}
                    tableData={form.watch('internalParty')}
                    footer={
                      disableEdit || isPemda ? undefined :
                        (
                          <RowWrapper
                            sx={{ justifyContent: 'end', mb: 2 }}
                          >
                            <Button
                              variant="outlined"
                              startIcon="add-2"
                              startIconSx={{ fontSize: theme.spacing(3) }}
                              sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                              onClick={() => NiceModal.show(modalSiteVisit.ADD_NEW_PIHAK_SMI, { storeData: addParty })}
                            >
                              Add New
                            </Button>
                          </RowWrapper>
                        )
                    }
                  />
                </BaseContainer>
                <Controller
                  control={control}
                  name="surveyorNote"
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <Input
                      {...field}
                      type="area"
                      label="Keterangan"
                      rows={4}
                      placeholder="Input Keterangan"
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      disabled={disableEdit}
                    />)}
                />
              </ColumnWrapper>
            </SectionTitle>
            <SectionTitle title="Pihak Client / Customer" isMandatory={!isDisabledForm && !isPemda} isOpen>
              <ColumnWrapper gap={2}>
                <Table
                  isPaper
                  tableHeader={clientVisitHeader}
                  tableData={form.watch('clientParty')}
                  footer={
                    disableEdit || isPemda ? undefined :
                      (
                        <RowWrapper
                          sx={{ justifyContent: 'end', mb: 2 }}
                        >
                          <Button
                            variant="outlined"
                            startIcon="add-2"
                            startIconSx={{ fontSize: theme.spacing(3) }}
                            sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                            onClick={() => NiceModal.show(modalSiteVisit.ADD_NEW_PIHAK_CLIENT, { storeData: addParty })}
                          >
                            Add New
                          </Button>
                        </RowWrapper>
                      )
                  }
                />
                <Controller
                  control={control}
                  name="clientNote"
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <Input
                      {...field}
                      type="area"
                      label="Keterangan"
                      rows={4}
                      placeholder="Input Keterangan"
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      disabled={disableEdit}
                    />)}
                />
              </ColumnWrapper>
            </SectionTitle>
            <SectionTitle title="Pihak Lainnya" isOpen>
              <ColumnWrapper gap={2}>
                <Table
                  isPaper
                  tableHeader={othersVisitHeader}
                  tableData={form.watch('externalParty')}
                  footer={
                    disableEdit ? undefined :
                      (
                        <RowWrapper
                          sx={{ justifyContent: 'end', mb: 2 }}
                        >
                          <Button
                            variant="outlined"
                            startIcon="add-2"
                            startIconSx={{ fontSize: theme.spacing(3) }}
                            sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                            onClick={() => NiceModal.show(modalSiteVisit.ADD_NEW_PIHAK_LAIN, { storeData: addParty })}
                          >
                            Add New
                          </Button>
                        </RowWrapper>
                      )
                  }
                />
                <Controller
                  control={control}
                  name="externalNote"
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <Input
                      {...field}
                      type="area"
                      label="Keterangan"
                      rows={4}
                      placeholder="Input Keterangan"
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      disabled={disableEdit}
                    />)}
                />
              </ColumnWrapper>
            </SectionTitle>
            <SectionTitle title="Informasi Site Visit" isOpen>
              <BaseContainer>
                <Box
                  sx={{
                    display: 'grid',
                    gridGap: 12,
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    mb: 3,
                  }}
                >
                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Input
                        {...field}
                        isMandatory={!isDisabledForm && !isPemda}
                        type="date"
                        label="Actual Start Site Visit"
                        placeholder="Input Actual Start Site Visit"
                        onChange={(val) => field.onChange(formatDate(val, 'YYYY-MM-DD'))}
                        error={!!fieldState?.error}
                        helperText={fieldState?.error?.message}
                        disabled={disableEdit || isPemda}
                      />)}
                  />

                  <Controller
                    control={control}
                    name="endDate"
                    render={({ field: { ref, ...field }, fieldState }) => {
                      const startDate = form.watch('startDate');
                      const minDate = startDate || undefined;

                      return (
                        <Input
                          {...field}
                          isMandatory={!isDisabledForm && !isPemda}
                          type="date"
                          label="Actual End Site Visit"
                          placeholder="Input Actual End Site Visit"
                          onChange={(val) => field.onChange(formatDate(val, 'YYYY-MM-DD'))}
                          error={!!fieldState?.error}
                          helperText={fieldState?.error?.message}
                          disabled={disableEdit || isPemda}
                          minDate={minDate}
                        />
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name="reportDate"
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Input
                        {...field}
                        isMandatory={!isDisabledForm && !isPemda}
                        type="date"
                        label="Tanggal Laporan"
                        placeholder="Input Tanggal Laporan"
                        onChange={(val) => field.onChange(formatDate(val, 'YYYY-MM-DD'))}
                        error={!!fieldState?.error}
                        helperText={fieldState?.error?.message}
                        disabled={disableEdit || isPemda}
                      />)}
                  />
                </Box>
                <Controller
                  control={control}
                  name="remarks"
                  render={({ field: { ref, ...field }, fieldState }) => (
                    <Input
                      {...field}
                      type="area"
                      label="Remarks"
                      placeholder="Input Remarks"
                      rows={4}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      disabled={disableEdit}
                    />)}
                />
              </BaseContainer>
            </SectionTitle>
            <TableUploadDocumentSiteVisit
              module={TypeModule.SITE_VISIT}
              process={TypeProcess.SITE_VISIT}
              ownership={DocumentTypeRequestDtoOwnershipEnum.DOCUMENTSITEVISIT}
              documentParent={DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL}
              documentCategory={DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT}
              disabled={disableEdit || isPemda}
              isValid={isValidForm}
              bucketProcessId={visitDetailData?.data?.content?.bucketProcessId || siteVisitDetail?.bucketProcessId}
            />
            <TableUploadFileSiteVisit
              module={TypeModule.SITE_VISIT}
              process={TypeProcess.SITE_VISIT}
              disabled={disableEdit || isPemda}
              ownership={DocumentTypeRequestDtoOwnershipEnum.DOCUMENTSITEVISIT}
              documentParent={DocumentTypeRequestDtoDocumentParentEnum.GALLERYSITEVISIT}
              documentCategory={DocumentTypeRequestDtoDocumentCategoryEnum.GALLERYSITEVISIT}
              isValid={isValidForm}
              bucketProcessId={visitDetailData?.data?.content?.bucketProcessId || siteVisitDetail?.bucketProcessId}
            />
          </ColumnWrapper>
        )
      }
    </ColumnWrapper>
  );
};

export default AddSiteVisit;
