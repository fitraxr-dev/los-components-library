'use client';
import React from 'react';

import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';

import { TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useDetailDraftOfferingLetter } from './DetailDraftOfferingLetter.hook';


const DetailDraftOfferingLetter = (props) => {
  const [{ stepper, userData, currentRole, currentPosition }] = useApp();
  const theme = useTheme();
  const bucket = useSpfpBucketContext();
  const { viewOnly } = useViewOnly();
  const searchParams = useSearchParams();
  const mode = searchParams?.get('mode') || 'view'; // Default to 'view' if no mode specified

  // Try to get division from userDivision first, fallback to user.division array
  // userDivision ada di accessManagementActive.userDivision berdasarkan struktur API
  const userDivision = (userData?.user as any)?.accessManagementActive?.userDivision ||
    (userData?.user as any)?.userDivision ||
    (userData as any)?.userDivision;
  const division = userData?.user?.division;

  // Get userRoleRefactor from accessManagementActive
  const userRoleRefactor = (userData?.user as any)?.accessManagementActive?.userRoleRefactor ||
    (userData as any)?.userRoleRefactor;

  const isCreation = stepper?.from === 'SPFP_CREATION';
  const isComplianceSTAFF = stepper?.from === 'COMPLIANCE_STAFF';
  const isDpopStaffAssignment = stepper?.from === 'DPOP_STAFF_ASSIGNMENT';
  const isFinal = stepper?.from === 'SPFP_FINAL';
  const isDpop = userDivision?.divisionCode?.includes('DPOP') ||
    division?.some((div) => div?.divisionCode?.includes('DPOP'));
  const isMaker = currentRole?.includes('MAKER');
  const isChecker = currentRole?.includes('CHECKER');
  const isTaskForce = currentPosition?.includes('TASK_FORCE');
  const isDti = isMaker || isChecker || isTaskForce;
  const isSpdp = bucket.process === TypeProcess.SPDP;

  const {
    handleCancel,
    handleOnSave,
    offeringLetterData,
    noteContainer,
    noteReviewerContainer,
    setNoteContainer,
    setNoteReviewerContainer,
    statusDropdownList,
    masintonChange,
    masintonMultiChange,
    masintonForm,
    masintonWatch,
    onChangeStatus,
    valueStatus,
    handleSaveDPOP,
    isSaveLoading,
  } = useDetailDraftOfferingLetter(props);


  const isNoteReviewerFilled = offeringLetterData?.noteReviewer ? true : false;
  const isNoteFilled = offeringLetterData?.note ? true : false;
  const isDisableCycle = offeringLetterData?.cycles !== offeringLetterData?.initialCycle;
  const {
    file,
    fileName,
    noDraft,
  } = masintonForm;

  const isEdited = masintonWatch.edited;
  const isInvalidForm = !(valueStatus || offeringLetterData?.status);


  const onSubmit = (handleSave) => {
    const promise1 = convertToDocx(noteReviewerContainer);
    const promise2 = (noteContainer) ? convertToDocx(noteContainer) : null;
    Promise.all([promise1, promise2]).then((values) => {
      handleSave({ blob: values });
    });
  };

  // Determine mode from query parameter, not from actualViewOnly
  // mode = 'edit' means edit mode, mode = 'view' means detail/view mode
  const isEditMode = mode === 'edit';
  const isDetailMode = mode === 'view';
  const effectiveViewOnly = isDetailMode;


  const isNotComply = offeringLetterData?.status === 'NOT_COMPLY';

  // Determine title based on mode from query parameter
  // Requirement 12.A: Nama screen wajib "Edit Draft OL" untuk cycle 0 dengan status NOT_COMPLY
  // For cycle 0 with NOT_COMPLY status, always show "Edit Draft OL" (requirement 12.A)
  const pageTitle = (isNotComply && isEditMode) ? 'Edit Draft OL' : (isEditMode ? 'Edit Draft OL' : 'Detail Draft OL');

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <SectionTitle title={pageTitle} />
      <Input
        disabled
        label="No. Draft"
        type="text"
        placeholder="No. Draft"
        value={offeringLetterData?.noDraft}
      />
      <Input
        disabled
        label="Nama Dokumen"
        type="text"
        placeholder="Nama Dokumen"
        value={fileName.value}
        onChange={(val) => { masintonChange('fileName', val); }}
      />
      <Input
        downloadOnly
        type="file"
        label="Upload Dokumen"
        placeholder="Upload Dokumen"
        containerSx={{ flex: 1 }}
        value={{ extension: '.pdf', name: offeringLetterData?.fileName, url: offeringLetterData?.file }}
      />

      {(() => {
        // Determine mode: detail (viewOnly) or edit
        const isDetailMode = effectiveViewOnly;
        const isEditMode = !effectiveViewOnly;

        // Show Respon DPOP based on mode and role:
        // - Detail mode: Always show (all disabled)
        // - Edit mode + DPOP: Show and editable
        // - Edit mode + Bisnis: Show but all disabled
        const shouldShowResponDPOP = isDetailMode || isEditMode;

        if (!shouldShowResponDPOP) {
          return null;
        }

        // Determine disabled state for Respon DPOP:
        // - Detail mode: All disabled
        // - Edit mode + DPOP: Editable (not disabled)
        // - Edit mode + Bisnis: All disabled
        const isResponDPOPDisabled = isDetailMode || (isEditMode && (!isDpop && !isDti));

        return (
          <>
            <RowWrapper alignItems="center">
              <Title title="Respon DPOP" />
            </RowWrapper>

            <Input
              isMandatory
              type="dropdown"
              label="Comply / Not Comply"
              placeholder="Pilih Comply / Not Comply"
              containerSx={{ flex: 1 }}
              disabled={isResponDPOPDisabled || isDisableCycle}
              dropdownList={statusDropdownList}
              value={valueStatus || offeringLetterData?.status}
              onChange={(e) => onChangeStatus(e)}
            />
            <Input
              label="Tanggal"
              type="date"
              placeholder="dd/mm/yyyy"
              disabled={true}
              value={offeringLetterData?.noteReviewerDate || ''}
            />
            <p>Comment</p>
            <WordEditor
              id="noteReviewerContainer"
              container={noteReviewerContainer}
              setContainer={setNoteReviewerContainer}
              isReadOnly={isResponDPOPDisabled || isDisableCycle}
              initialValue={offeringLetterData?.noteReviewer}
            />
          </>
        );
      })()}

      {(() => {
        // Determine mode: detail (viewOnly) or edit
        const isDetailMode = effectiveViewOnly;
        const isEditMode = !effectiveViewOnly;

        // Show Respon Bisnis based on mode and role:
        // - Detail mode: Always show (all disabled)
        // - Edit mode + DPOP: Hide (only show Respon DPOP)
        // - Edit mode + Bisnis: Show and editable
        const shouldShowResponBisnis = isDetailMode || (isEditMode && (!isDpop && !isSpdp));

        if (!shouldShowResponBisnis) {
          return null;
        }

        // Determine disabled state for Respon Bisnis:
        // - Detail mode: All disabled
        // - Edit mode + Bisnis: Editable (not disabled)
        const isResponBisnisDisabled = isDetailMode || (isEditMode && isDpop);

        return (
          <>
            <RowWrapper alignItems="center">
              <Title title="Respon Bisnis" />
            </RowWrapper>

            <Input
              label="Tanggal"
              type="date"
              placeholder="dd/mm/yyyy"
              disabled={true}
              value={offeringLetterData?.noteDate || ''}
            />
            <p>Comment</p>
            <WordEditor
              id="noteContainer"
              container={noteContainer}
              setContainer={setNoteContainer}
              isReadOnly={isResponBisnisDisabled || isFinal}
              initialValue={offeringLetterData?.note}
            />
          </>
        );
      })()}

      <RowWrapper py={3} gap={2} justifyContent="end">
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isSaveLoading}
        >
          Close
        </Button>

        {(() => {
          // Determine mode: detail (viewOnly) or edit
          const isDetailMode = effectiveViewOnly;
          const isEditMode = !effectiveViewOnly;

          // Button Save muncul jika:
          // - Mode adalah edit (isEditMode = true), DAN
          // - Bukan creation (!isCreation), DAN
          // - Bukan final cycle (!isDisableCycle), DAN
          // - Respon bisa di-edit (untuk DPOP: Respon DPOP bisa di-edit, untuk Bisnis: Respon Bisnis bisa di-edit)
          const canEditResponDPOP = isEditMode && isDpop && !isDisableCycle;
          const canEditResponBisnis = isEditMode && !isDpop && !isFinal;
          const shouldShowSave = !isDetailMode && !isCreation && (canEditResponDPOP || canEditResponBisnis);

          if (!shouldShowSave) {
            return null;
          }

          return (
            <Button
              disabled={isEdited || isSaveLoading || isInvalidForm}
              onClick={() => {
                if (isDpop || (isDti && isSpdp)) {
                  onSubmit(handleSaveDPOP);
                } else {
                  onSubmit(handleOnSave);
                }
              }}
            >
              Save
            </Button>
          );
        })()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default DetailDraftOfferingLetter;
