'use client';
import React, { useContext, useEffect, useState } from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { spfp } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile } from '@/helpers/utils';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import usePreviewWatermark from '@/hooks/usePreviewWatermark';
import useViewOnly from '@/hooks/useViewOnly';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import ModalUploadDocument from '@/components/shared/SmiModal/ModalUploadDocument';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';
import ModalAddDraftOL from '../components/ModalAddDraftOL/ModalAddDraftOL';
import ModalAddOL from '../components/ModalAddOL/ModalAddOL';
import ModalDetailOL from '../components/ModalDetailOL';
import ModalFinalDraftOL from '../components/ModalFinalDraftOL/ModalFinalDraftOL';
import TablePembaruanRisalahRapat from '../components/TablePembaruanRisalahRapat';
import TableUploadDocumentSPFP from '../components/TableUploadDocumentSPFP';
import TableTreeDraftOL from '../components/TreeTableDraftOL/TreeTableDraftOL';
import { action } from '../VerificationSheetPage/VerificationSheet.constants';

import SectionTitleOL from './components/SectionTitleOL';
import { getUserRole, type UserRole } from './helpers/offeringLetterHelpers';
import { shouldShowAddOLButton } from './helpers/roleStatusStepperHelper';
import useActionOL from './hooks/useActionOL';
import useCheckRisalahRapatExpired from './hooks/useCheckRisalahRapatExpired';
import useUpdateCustomerBanding from './hooks/useUpdateCustomerBanding';
import { modal, TABLE_HEADER_OL } from './UploadOfferingLetter.constants';
import { useUploadOfferingLetter } from './UploadOfferingLetter.hook';


const UploadOfferingLetter = (props) => {
  const bucket = useSpfpBucketContext();
  const { setDirtyMsg } = useContext(DirtyContext);
  const router = useCustomRouter();
  const { viewOnly } = useViewOnly();
  const { goToNextStep } = useSpfpContext();
  const path = usePathname();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[3];

  // Initialize form first
  const { control, setValue, handleSubmit, watch } = useForm({
    defaultValues: {
      bocDate: '',
      description: '',
    },
    mode: 'onChange',
  });

  const bocDate = watch('bocDate');
  const description = watch('description');

  // Create formValues object
  const formValues = {
    bocDate,
    description,
  };

  // Pass formValues to hook
  const {
    handleAddOL,
    offeringLetterData,
    handleDeleteData,
    bocDecisionData,
    handleSaveAndNext,
    handleEdit,
    offeringLetterLoading,
    isSaveLoading,
    isDivisiBisnis,
    isDivisiDpop,
    isEdit,
    isRm,
    isSubmitLoading,
    isSuperAdmin,
    isAutoSaveFetching,
    handleDecline,
    isKadiv,
    isTl,
    isMaker,
    isChecker,
    handleOpenSubmitModal,
    handleOpenSubmitWarningModal,
    buttons,
    setShouldGoNext,
  } = useUploadOfferingLetter(props, formValues);

  // Local state untuk melacak nilai checkbox Customer Banding (hanya untuk UI)
  const [customerBandingState, setCustomerBandingState] = useState<Record<string, boolean>>({});

  const { data: expiredData } = useCheckRisalahRapatExpired({
    bucketProcessId: bucket?.bucketProcessId,
    module: bucket?.module,
    process: bucket?.process,
  });

  const isExpired = expiredData?.isExpired ?? false;
  const isTerminated = expiredData?.isTerminated ?? false;

  // Hook for updating customer banding
  const { mutate: updateCustomerBanding } = useUpdateCustomerBanding({
    onError: () => {
    },
    onSuccess: () => {
    },
  });

  // Use useActionOL hook for action visibility logic
  const [{ stepper, userData, currentRole, currentPosition }] = useApp();
  // Try to get division from userDivision first, fallback to user.division array
  // userDivision ada di accessManagementActive.userDivision berdasarkan struktur API
  const userDivision = (userData?.user as any)?.accessManagementActive?.userDivision ||
    (userData?.user as any)?.userDivision ||
    (userData as any)?.userDivision;
  const division = userData?.user?.division;
  const divisionForRole = userDivision || division;

  const progressCompleted = stepper?.progress === 100;

  // Get userRoleRefactor from accessManagementActive
  const userRoleRefactor = (userData?.user as any)?.accessManagementActive?.userRoleRefactor ||
    (userData as any)?.userRoleRefactor;

  const isDpop = userDivision?.divisionCode?.includes('DPOP') ||
    division?.some((div) => div?.divisionCode?.includes('DPOP'));

  const isTaskForce = currentPosition?.includes('TASK_FORCE');
  const isDti = isTaskForce || isMaker || isChecker;
  const isFinal = bucket?.process === TypeProcess.SPFP_FINAL || bucket?.process === TypeProcess.SPFP_CREATION_FINAL;
  const isSPFP = bucket?.process === TypeProcess.SPFP;

  // Get user role using helper - prefer userRoleRefactor and userDivision from accessManagementActive
  const userRole: UserRole | null = getUserRole(
    currentRole || [],
    divisionForRole,
    userRoleRefactor,
    userDivision
  );

  const { mutate: setWatermark } = usePreviewWatermark({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      showNiceModalV2({
        onClose: () => {
          window.open(data?.data?.content, '_blank');
          closeNiceModal(MODAL.GLOBAL.WATERMARK);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: downloadWatermark } = useDownloadWatermark({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      showNiceModalV2({
        onClose: () => {
          window.open(data?.data?.content, '_blank');
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const desc = useWatch({
    control: control,
    name: 'description',
  });

  const handleSave = (data: any) => {
    setShouldGoNext(false);
    handleSaveAndNext(data);
  };

  const handleNext = (data: any) => {
    setShouldGoNext(true);
    handleSaveAndNext(data);
  };

  useEffect(() => {
    setValue('bocDate', bocDecisionData?.bocDate);
    setValue('description', bocDecisionData?.description);
  }, [bocDecisionData]);

  useEffect(() => {
    if (!!bocDecisionData) {
      if (desc !== bocDecisionData?.description) {
        setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
      } else {
        setDirtyMsg(undefined);
      }
    }
  }, [desc, bocDecisionData]);

  // Update TABLE_HEADER_OL to add customer banding logic
  const tableHeaderWithCustomerBanding = TABLE_HEADER_OL.map((header) => {
    if (header.key === 'isCustomerBanding') {
      return {
        ...header,
        isDisabled: (row) => {
          const isNotFromRevision = stepper?.from !== TypeProcess.SPFP_REVISION
            && stepper?.from !== 'SPFP_REVISION_WAITING_TL'
            && stepper?.from !== 'SPFP_REVISION_WAITING_KADIV'
            && stepper?.from !== 'SPFP_REVISION_RETURN_STAFF'
            && stepper?.from !== 'SPFP_REVISION_RETURN_TL';
          const isNotComply = row?.status !== 'COMPLY';

          // finding parent using draftParent
          const parentDraft = row?.draftParent;
          const parentData = offeringLetterData?.contents?.find(
            (parent) => parent.noDraft === parentDraft
          );
          const hasFinalSibling = parentData?.children?.some(
            (child: any) => child.isFinal === true
          ) || false;

          // Disable if: not from revision, or not comply, or has a final sibling, or process spfp
          return isNotFromRevision || isNotComply || hasFinalSibling || !isSPFP;
        },
        isSelected: (row) => {
          const key = row?.noDraft ?? '';
          if (!key) return row.isCustomerBanding || false;
          // Prioritaskan state lokal, fallback ke nilai dari API
          return customerBandingState[key] ?? (row.isCustomerBanding || false);
        },
        onSelectChange: (row) => {
          const key = row?.noDraft ?? '';
          if (!key) return;

          const current = customerBandingState[key] ?? (row.isCustomerBanding || false);
          const newValue = !current;

          // Update local state
          setCustomerBandingState((prev) => ({
            ...prev,
            [key]: newValue,
          }));

          // Call API to update customer banding
          updateCustomerBanding({
            bucketProcessId: bucket?.bucketProcessId || '',
            isCustomerBanding: newValue,
            module: bucket?.module || '',
            noDraft: key,
            process: bucket?.process || '',
          });
        },
      };
    }
    return header;
  });

  // Handling di sisi BE,
  // untuk show hide berdasarkan logic isEditable x isEditableResponse, d BE tidak akan mereturn true true

  const tableHeader = [
    ...tableHeaderWithCustomerBanding,
    {
      key: 'action',
      label: 'Action',
      options: (row, index, parentData) => {
        const list = [];

        // PENTING: Action detail harus selalu muncul jika isDetail: true
        if (row?.isDetail === true) {
          list.push({
            iconName: 'detail',
            onClick: (data) => {
              NiceModal.show(modal.MODAL_ADD_DRAFT_OL, {
                bucketProcessId: bucket?.bucketProcessId,
                editData: data,
                isDetail: true,
                // Flag untuk disable semua field
                isFinalOl: data?.isFinal === true,
                module: bucket?.module,
                nomorDraft: data?.noDraft,
                process: bucket?.process,
              });
            },
          });
        }

        // Use property from data to determine actions
        // Jika isEditable true maka modal Add Draft OL atau Final Draft OL
        if (row?.isEditable) {
          list.push({
            iconName: 'edit',
            onClick: (data) => {
              const isFinalOL = data?.isFinalOL === true;
              NiceModal.show(isFinalOL ? modal.MODAL_FINAL_DRAFT_OL : modal.MODAL_ADD_DRAFT_OL, {
                bucketProcessId: bucket?.bucketProcessId,
                editData: data,
                module: bucket?.module,
                nomorDraft: data?.noDraft,
                process: bucket?.process,
              });
            },
          });
        }

        // Jika isEditableResponse maka ke Detail Draft OL Page dengan mode=edit
        if (row?.isEditableResponse) {
          list.push({
            iconName: 'edit',
            onClick: (data) => {
              router.push(
                `${replacePath(spfp.DETAIL_DRAFT_OL_PAGE, {
                  module: moduleIndex || '',
                  noDraft: data?.noDraft,
                  processId: bucket?.bucketProcessId,
                })}?mode=edit`
              );
            },
          });
        }

        // Jika isDetailResponse maka Detail Draft OL Page dengan mode=view
        if (row?.isDetailResponse) {
          list.push({
            iconName: 'detail',
            onClick: (data) => {
              router.push(
                `${replacePath(spfp.DETAIL_DRAFT_OL_PAGE, {
                  module: moduleIndex || '',
                  noDraft: data?.noDraft,
                  processId: bucket?.bucketProcessId,
                })}?mode=view`
              );
            },
          });
        }

        // Jika isDelete true maka delete action
        if (row?.isDelete) {
          list.push({
            iconName: 'delete',
            onClick: (data) => {
              handleDeleteData(data.noDraft);
            },
          });
        }

        // Add View/Preview action with watermark (always available if file exists)
        list.push({
          iconName: 'preview-document',
          onClick: (data) => {
            if (data?.file) {
              NiceModal.show(MODAL.GLOBAL.WATERMARK, {
                onSave: ({ watermark }: { watermark: string }) => {
                  let encodedWatermark = watermark;
                  if (watermark) {
                    encodedWatermark = encodeURI(watermark);
                  }
                  setWatermark({
                    document: data.file,
                    documentExtension: data.fileExt,
                    fileName: data.fileName,
                    watermark: encodedWatermark,
                  });
                },
              });
            } else {
              NiceModal.show(MODAL.GLOBAL.WARNING, {
                title: 'File tidak ditemukan',
                type: 'warning',
              });
            }
          },
        });

        // Add Download action (always available if file exists)
        list.push({
          iconName: 'download',
          onClick: (data) => {
            if (data?.file) {
              NiceModal.show(MODAL.GLOBAL.WATERMARK, {
                onSave: ({ watermark }: { watermark: string }) => {
                  let encodedWatermark = watermark;
                  if (watermark) {
                    encodedWatermark = encodeURI(watermark);
                  }
                  downloadWatermark({
                    document: data.file,
                    documentExtension: data.fileExt || 'pdf',
                    fileName: data.fileName,
                    watermark: encodedWatermark,
                  });
                },
              });
            } else {
              NiceModal.show(MODAL.GLOBAL.WARNING, {
                title: 'File tidak ditemukan',
                type: 'warning',
              });
            }
          },
        });

        return list;
      },
      sx: {
        minWidth: '30vw',
      },
      type: 'action',
    },
  ];

  const handleApprove = () => {
    // Check if condition for confirmation modal is met
    const needsConfirmation = bucket?.process === TypeProcess.SPFP_FINAL && stepper?.from !== 'SPFP_FINAL';

    if (needsConfirmation) {
      NiceModal.show(MODAL.GLOBAL.CONFIRM, {
        agreeText: 'Ya',
        cancelText: 'Close',
        onCancel: () => {
          closeNiceModal(MODAL.GLOBAL.CONFIRM);
        },
        onSubmit: () => {
          handleOpenSubmitModal({ action: action.SUBMIT });
        },
        title: 'Apakah Anda Yakin Final OL Sudah Ditandatangani?',
      });
    } else {
      handleOpenSubmitModal({ action: action.SUBMIT });
    }
  };

  // Check if all parent OLs child with isFinal: true
  const isAllOLHasFinal = offeringLetterData?.contents?.length > 0 &&
    offeringLetterData.contents.every((parent) =>
      parent.children?.some((child: any) => child.isFinal === true)
    );
  const isSubmitDisabledByFinal = (stepper?.from === 'SPFP_CREATION_FINAL' || stepper?.from === 'SPFP_FINAL') && !isAllOLHasFinal;

  const renderActionButtons = () => {
    const actionButtons = [
      // Final state buttons
      {
        color: 'error' as const,
        disabled: viewOnly,
        isLoading: isSubmitLoading,
        label: 'Decline',
        onClick: handleDecline,
        show: (buttons[action.CANCELED] || buttons[action.REJECTED]),
        variant: 'outlined' as const,
      },
      {
        color: 'warning' as const,
        disabled: viewOnly,
        isLoading: isSubmitLoading,
        label: 'Revisi',
        onClick: () => handleOpenSubmitModal({ action: action.REVISION }),
        show: buttons[action.REVISION],
      },
      {
        color: 'darkBlue' as const,
        disabled: viewOnly,
        isLoading: isSubmitLoading,
        label: 'Return to Staff',
        onClick: () => handleOpenSubmitModal({ action: action.RETURN_STAFF }),
        show: (isTl || isKadiv) && buttons['RETURN_TO_STAFF'],
      },
      {
        color: 'info' as const,
        disabled: viewOnly,
        isLoading: isSubmitLoading,
        label: 'Return to TL',
        onClick: () => handleOpenSubmitModal({ action: action.KADIV_TO_TL }),
        show: isKadiv && buttons['RETURN_TO_TL'],
      },
      {
        color: 'success' as const,
        disabled: viewOnly,
        isLoading: isSubmitLoading,
        label: 'Approve',
        onClick: handleApprove,
        show: buttons[action.SUBMIT] && isKadiv,
      },
      {
        disabled: isSaveLoading || isAutoSaveFetching,
        isLoading: isSaveLoading,
        label: isAutoSaveFetching ? 'Auto Save ...' : 'Save',
        onClick: handleSubmit(handleSave),
        show: buttons[action.SAVE],
      },
      {
        color: 'success' as const,
        disabled: viewOnly || !progressCompleted || isSubmitDisabledByFinal,
        isLoading: isSubmitLoading,
        label: stepper?.from === 'SPFP_CREATION_FINAL' ? 'Submit Final OL' : 'Submit',
        onClick: () => handleOpenSubmitWarningModal({ action: action.SUBMIT }),
        show: buttons[action.SUBMIT] && !isKadiv && buttons[action.REVISION],
      },
      {
        color: 'success' as const,
        disabled: viewOnly || !progressCompleted || isSubmitDisabledByFinal,
        isLoading: isSubmitLoading,
        label: stepper?.from === 'SPFP_CREATION_FINAL' ? 'Submit Final OLs' : 'Submit',
        onClick: () => handleOpenSubmitModal({ action: action.SUBMIT }),
        show: buttons[action.SUBMIT] && !isKadiv && !buttons[action.REVISION],
      },
      // Non-final state buttons
      {
        label: 'Next',
        onClick: goToNextStep,
        show: !buttons[action.REVISION] && !buttons[action.CANCELED] && !buttons[action.REJECTED] && viewOnly,
      },
      {
        disabled: isSaveLoading,
        isLoading: isSaveLoading,
        label: 'Next',
        onClick: handleSubmit(handleNext),
        show: !buttons[action.REVISION] && !buttons[action.CANCELED] && !buttons[action.REJECTED] && !viewOnly,
      },
    ];

    return actionButtons
      .filter(({ show }) => show)
      .map(({ label, show, ...buttonProps }, i) => (
        <Button key={i} sx={{ mr: 2 }} {...buttonProps}>
          {label}
        </Button>
      ));
  };

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        {isDivisiDpop && (
          <ConfirmationLatest />
        )}
        <RowWrapper alignItems="center" gap={1}>
          <Title title="Upload Offering Letter" />
          {(isRm || isMaker) && (isDivisiBisnis || isSuperAdmin) && isEdit && (
            <IconButton
              iconName="edit-2"
              onClick={handleEdit}
            />
          )}
        </RowWrapper>
        <TableDebtorInformation
          {...bucket}
        />


        <SectionTitleOL
          title="Offering Letter"
          isOpen
          rightComponent={
            (() => {
              if (viewOnly || isDpop) return null;

              // Use shouldShowAddOLButton helper based on role, division, and status/stepper
              // This is for parent level (cycle 0) Add OL button
              // Get roleCode and divisionCode for more accurate checking
              const roleCode = userRoleRefactor?.roleCode;
              const divisionCode = userDivision?.divisionCode;

              const showAddOL = shouldShowAddOLButton(
                userRole,
                bucket?.process || '',
                divisionForRole,
                roleCode,
                divisionCode
              );

              if (showAddOL || (isDti && isSPFP)) {
                return (
                  <Button
                    sx={{ padding: 2.7, width: '150px' }}
                    onClick={handleAddOL}
                  >
                    Add OL
                  </Button>
                );
              }

              return null;
            })()
          }
        >
          <TableTreeDraftOL
            isPaper
            isLoading={offeringLetterLoading}
            maxHeight="82vh"
            tableHeader={tableHeader}
            tableData={offeringLetterData?.contents}
            hidden={viewOnly || stepper.from === 'COMPLIANCE_CHECK'}
            isDti={isDti}
          />
        </SectionTitleOL>


        {/* <RowWrapper alignItems="center" justifyContent="space-between">
          <SectionTitle title="Keputusan BOC" />
        </RowWrapper> */}
        {/* <SectionTitle title="Konsultasi Dewan Komisaris" isOpen sx={{ mb: 3 }} >
          <ColumnWrapper gap={2}>
            <RowWrapper>
              <Controller
                name="bocDate"
                control={control}
                render={({ field: { ref, value, ...field } }) => (
                  <Input
                    {...field}
                    disabled={viewOnly || isDpop || isFinal || (isDti && !isSPFP)}
                    label="Tanggal"
                    type="date"
                    containerSx={{ width: '50%' }}
                    value={value}
                    onChange={(value) => field.onChange(value ? formatDate(value, 'YYYY-MM-DD') : null)}
                    placeholder="dd/mm/yyyy"
                  />
                )}
              />
            </RowWrapper>
            <RowWrapper>
              <Controller
                name="description"
                control={control}
                render={({ field: { ref, value, ...field } }) => (
                  <Input
                    {...field}
                    disabled={viewOnly || isDpop || isFinal || (isDti && !isSPFP)}
                    label="Keterangan"
                    type="area"
                    containerSx={{ flex: 1 }}
                    rows={4}
                    value={value}
                    onChange={(value) => setValue('description', value)}
                  />
                )}
              />
            </RowWrapper>
          </ColumnWrapper>
        </SectionTitle> */}

        <TableUploadDocumentSPFP
          title="Memo Persetujuan PBM"
          documentParent={DocumentTypeRequestDtoDocumentParentEnum.OFFERINGLETTER}
          showButton={(isDpop && !viewOnly) || viewOnly || isDpop || (isDti && !isSPFP) || isFinal ? false : true}
        />
        <TablePembaruanRisalahRapat
          title="Pembaruan Risalah Rapat"
          documentParent={DocumentTypeRequestDtoDocumentParentEnum.OFFERINGLETTER}
          isExpired={isExpired}
          isTerminated={isTerminated}
        />
        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          {renderActionButtons()}
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT}
        component={ModalUploadDocument}
      />

      <ModalDef
        id={modal.MODAL_ADD_OL}
        component={ModalAddOL}
      />

      <ModalDef
        id={modal.MODAL_ADD_DRAFT_OL}
        component={ModalAddDraftOL}
      />

      <ModalDef
        id={modal.MODAL_FINAL_DRAFT_OL}
        component={ModalFinalDraftOL}
      />

      <ModalDef
        id={modal.OFFERING_LETTER_DETAIL}
        component={ModalDetailOL}
      />
    </>
  );
};

export default UploadOfferingLetter;
