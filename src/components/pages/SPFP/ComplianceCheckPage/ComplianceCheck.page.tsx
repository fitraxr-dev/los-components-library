'use client';
import * as React from 'react';
import { useRef } from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Divider, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Controller, useWatch } from 'react-hook-form';

import { MODAL as MODALGLOBAL } from '@/configs/constants/modalId';
import { spfp } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { replacePath } from '@/helpers/navigation';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import ModalUploadDocument from '@/components/shared/SmiModal/ModalUploadDocument';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';


import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';
import TableUploadDocumentSPFP from '../components/TableUploadDocumentSPFP';
import TreeTableComplianceCheck from '../components/TreeTableComplianceCheck/TreeTableComplianceCheck';

import { modal, STATUS_SPFP } from './ComplianceCheck.constants';
import { useComplianceCheck } from './ComplianceCheck.hook';
import BusinessPage from './components/Business/Business.page';
import DPOPPage from './components/DPOP/DPOP.page';
import ModalAddPerihal from './components/ModalAddOL/ModalAddPerihal';


const UploadOfferingLetter = (props) => {
  const router = useCustomRouter();
  const pathName = usePathname().split('/');
  const [state] = useApp();
  const theme = useTheme();
  const stepper = state.stepper;
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const bucket = useSpfpBucketContext();
  const { goToNextStep } = useSpfpContext();
  const businessPageRef = useRef(null);
  const dpopPageRef = useRef(null);
  const reviewBusinessPageRef = useRef(null);
  const reviewDpopPageRef = useRef(null);

  const progressCompleted = stepper?.progress === 100;

  const dropdownList = [
    { label: 'Comply', value: 'COMPLY' },
    { label: 'Not Comply', value: 'NOT_COMPLY' }
  ];

  const isDpop = (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode?.includes('DPOP');
  const isTaskForce = state.currentPosition.includes('TASK_FORCE');
  const isAskForInfoTlDpop = stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_DPOP_WAITING_TL;
  const isAskForInfoKadivDpop = stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_DPOP_WAITING_KADIV;
  const isAskForInfoTlBusiness = stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_WAITING_TL;
  const isAskForInfoKadivBusiness = stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_WAITING_KADIV;
  const isAskForInfoCheckerDpop = stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_DPOP_WAITING_CHECKER;
  const isAskForInfoKadivMakerDpop = stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_DPOP_WAITING_KADIV_MAKER;
  const isAskForInfoTlDpopReturn = stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_DPOP_RETURN_TL_MAKER;
  const isAskForInfo = stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO;
  const isAskForInfoWaitingChecker = stepper.from === STATUS_SPFP.SPFP_WAITING_APPROVAL_CHECKER_ASK_FOR_INFO;
  const isAskForInfoWaitingMaker = stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_WAITING_KADIV_MAKER;
  const isAskForInfoReturnMaker = stepper.from === STATUS_SPFP.SPFP_ASK_FOR_INFO_RETURN_MAKER;
  const isAskforInfoEdited = stepper.from?.includes('EDITED');

  const {
    activeTab,
    bucketDetail,
    data,
    control,
    activeTabReview,
    handleChangeTab,
    handleChangeTabReview,
    handleSubmitForm,
    handleSubmit,
    handleForwardToDpop,
    handleOnSave: originalHandleOnSave,
    handleSaveWithValidation: originalHandleSaveWithValidation,
    handleSaveWord,
    handleDeleteComplianceCheck,
    isLoading,
    isSaveLoading,
    isSaveWordLoading,
    isSubmitLoading,
    handleAddPerihal,
    isValid,
    isEnableAskForInfo,
    isEnableSubmitAskForInfo,
    isDirty,
    buttons,
    isComplianceCheck,
    handleSubmitAskForInfo,
    methods,
    verificationSheetData,
    isActionOnlySave,
    isRm,
    isTl,
    isKadiv,
    isBusiness,
    isMaker,
    isChecker,
  } = useComplianceCheck(props);

  const isDti = isMaker || isChecker || isTaskForce;

  const isComplyValue = useWatch({ control, name: 'isComply' });
  const isComplyEmpty = !isComplyValue || isComplyValue === '';

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `view compliance check page for bucket: ${bucket?.bucketProcessId}`,
    });
  }, [recordActivity, bucket?.bucketProcessId, bucket?.module, bucket?.process]);

  // Wrapper untuk handleOnSave yang juga memanggil handleSave dari Business/DPOP
  // goNext: jika true, akan pindah ke step selanjutnya setelah save berhasil
  const handleOnSave = async (formData?: any, goNext: boolean = false) => {
    // Save Business/DPOP WordEditor jika ada
    const activePageRef = activeTab === 0 ? businessPageRef.current : dpopPageRef.current;
    const activeReviewPageRef = activeTabReview === 0 ? reviewBusinessPageRef.current : reviewDpopPageRef.current;

    let responseBlob = null;
    let reviewBlob = null;

    if (activePageRef?.container) {
      try {
        responseBlob = await convertToDocx(activePageRef.container);
      } catch (error) {
        console.error('Error saving WordEditor:', error);
      }
    }

    if (activeReviewPageRef?.container) {
      try {
        reviewBlob = await convertToDocx(activeReviewPageRef.container);
      } catch (error) {
        console.error('Error saving Review WordEditor:', error);
      }
    }

    if (responseBlob || reviewBlob) {
      handleSaveWord({
        responseFile: responseBlob,
        reviewFile: reviewBlob,
      });
    }

    // Save ComplianceCheck form
    originalHandleOnSave(formData, goNext);
  };

  // Wrapper untuk handleSaveWithValidation
  const handleSaveWithValidation = handleSubmitForm(
    (formData) => {
      handleOnSave(formData);
    },
    () => {
      handleOnSave();
    }
  );

  const tableHeader = [
    {
      key: 'no',
      label: 'No',
      sx: { width: '4%' },
    },
    {
      headerRender: () => {
        return (
          <ColumnWrapper sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <RowWrapper sx={{ flexBasis: 0, gap: 2, width: '50%' }}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.primary.main}
              >
                Catatan
              </TextStyle>

            </RowWrapper>
          </ColumnWrapper>
        );
      },
      headerSx: {
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      key: 'note',
      label: 'Catatan',
      sx: { width: '25%' },
    },
    {
      key: 'status',
      label: 'Status',
      sx: { width: '25%' },
    },
    {
      key: 'action',
      label: 'Action',
      options: () => {
        const list = [];
        if (viewOnly) {
          list.push(
            {
              iconName: 'detail', onClick: (row) => {
                router.push(
                  `${replacePath(
                    spfp.NOTE_COMPLIANCE_CHECK_PAGE,
                    {
                      complianceNumber: row.complianceNumber,
                      module: pathName[3],
                      processId: row.bucketProcessId,
                    },
                  )}/?mode=view`,
                );
              },
            }
          );
        } else if (!viewOnly) {
          list.push(
            {
              iconName: 'edit', onClick: (row) => {
                router.push(
                  `${replacePath(
                    spfp.NOTE_COMPLIANCE_CHECK_PAGE,
                    {
                      complianceNumber: row.complianceNumber,
                      module: pathName[3],
                      processId: row.bucketProcessId,
                    },
                  )}/?mode=edit`,
                );
              },
            }
          );
        }
        if (isComplianceCheck && !viewOnly) {
          list.push(
            { iconName: 'delete', onClick: (row) => { handleDeleteComplianceCheck(row); } }
          );
        }
        return list;
      },
      sx: { width: '25%' },
      type: 'action',
    },
  ];

  const handleOnClickAskForInfo = (rowData, includeCompleteEdit = false) => {
    switch (true) {
      case isRm || isMaker:
        NiceModal.show(
          MODALGLOBAL.GLOBAL.COMMENT,
          {
            onSave: ({ comment, radioValue }) => {
              closeNiceModal(MODALGLOBAL.GLOBAL.COMMENT);
              if (radioValue === '1') {
                handleSubmitAskForInfo({ action: 'ASK_FOR_INFO', comment });
              } else {
                handleSubmitAskForInfo({ action: 'RETURN_TO_BUSINESS', comment });
              }
            },
            radioLabel: 'Forward to',
            radioOptions: [
              { label: 'Bisnis', value: '2' },
              { label: isMaker ? 'Checker' : 'TL', value: '1' },
            ],
          },
        );
        break;
      case isTl:
        NiceModal.show(
          MODALGLOBAL.GLOBAL.COMMENT,
          {
            onSave: ({ comment, radioValue }) => {
              closeNiceModal(MODALGLOBAL.GLOBAL.COMMENT);
              if (radioValue === '1') {
                handleSubmitAskForInfo({ action: 'ASK_FOR_INFO', comment });
              } else {
                handleSubmitAskForInfo({ action: 'RETURN_TO_BUSINESS', comment });
              }
            },
            radioLabel: 'Forward to',
            radioOptions: isAskForInfoTlDpop || isAskForInfoCheckerDpop || isAskForInfoTlDpopReturn
              ? [
                { label: 'Bisnis', value: '2' },
                { label: 'Kadiv', value: '1' }
              ]
              : [
                { label: 'Kadiv', value: '1' },
                { label: 'Bisnis', value: '2' }
              ],
          },
        );
        break;
      case isKadiv || isChecker:
        NiceModal.show(
          MODALGLOBAL.GLOBAL.COMMENT,
          {
            onSave: ({ comment, radioValue }) => {
              closeNiceModal(MODALGLOBAL.GLOBAL.COMMENT);
              handleSubmitAskForInfo({ action: 'SUBMIT', comment, isCompleteEditAskForInfo: includeCompleteEdit });
            },
          },
        );
        break;
    }
  };

  const renderActionButtons = () => {
    const canRmAct = isRm && stepper?.from !== 'SPFP_FINAL';
    const nonComplianceButtons = [
      {
        color: 'error' as const,
        isLoading: isSubmitLoading,
        label: 'Decline',
        onClick: () => handleSubmit({ action: 'CANCEL' }),
        show: buttons['CANCEL'] || buttons['REJECT'],
        variant: 'outlined' as const,
      },
      {
        color: 'lightYellow' as const,
        isLoading: isSubmitLoading,
        label: 'Ask For Info',
        onClick: () => handleOnClickAskForInfo({ action: 'ASK_FOR_INFO' }),
        show: (canRmAct || isTl || isDti) && buttons['ASK_FOR_INFO'],
      },
      {
        isLoading: isSaveLoading || isSaveWordLoading,
        label: 'Save',
        onClick: () => handleOnSave(),
        show: (isRm || isTl || isKadiv || isDti) && buttons['SAVE'] && activeTab === 0,
      },
      {
        color: 'darkBlue' as const,
        isLoading: isSubmitLoading,
        label: 'Return to Maker',
        onClick: () => handleSubmit({ action: 'RETURN_TO_MAKER' }),
        show: (isTl || isKadiv || isChecker) && buttons['RETURN_TO_MAKER'],
      },
      {
        color: 'darkBlue' as const,
        isLoading: isSubmitLoading,
        label: 'Return to Staff',
        onClick: () => handleSubmit({ action: 'RETURN_TO_STAFF' }),
        show: (isTl || isKadiv || isDti) && buttons['RETURN_TO_STAFF'],
      },
      {
        color: 'info' as const,
        isLoading: isSubmitLoading,
        label: 'Return to TL',
        onClick: () => handleSubmit({ action: 'RETURN_TO_TL' }),
        show: (isKadiv || isDti) && buttons['RETURN_TO_TL'],
      },
      {
        color: 'success' as const,
        disabled: isBusiness && !isEnableSubmitAskForInfo,
        isLoading: isSubmitLoading,
        label: (isKadiv || isChecker) ? 'Approve' : 'Submit',
        onClick: () => handleSubmit({ action: 'SUBMIT' }),
        show: (canRmAct || isTl || (isDti && (isAskForInfo || isAskForInfoTlBusiness || isAskForInfoReturnMaker || isAskforInfoEdited))) && buttons['SUBMIT'],
      },
      {
        color: 'success' as const,
        isLoading: isSubmitLoading,
        label: (isKadiv || isChecker) ? 'Approve' : 'Submit',
        onClick: handleForwardToDpop,
        show: buttons['FORWARD_SUBMIT'],
      },
      {
        color: 'lightYellow' as const,
        isLoading: isSubmitLoading,
        label: 'Ask For Info',
        onClick: () => handleOnClickAskForInfo({ action: 'ASK_FOR_INFO' }, true),
        show: (isKadiv || isDti) && buttons['ASK_FOR_INFO'],
      },
      {
        color: 'success' as const,
        isLoading: isSubmitLoading,
        label: 'Approve',
        onClick: () => handleSubmit({ action: 'SUBMIT' }),
        show: (isKadiv || (isDti && (isAskForInfoWaitingChecker || isAskForInfoKadivBusiness || isAskForInfoWaitingMaker))) && buttons['SUBMIT'],
      },
      {
        isLoading: isSaveLoading || isSaveWordLoading,
        label: 'Next',
        onClick: () => handleOnSave(undefined, true),
        show: isActionOnlySave && activeTab === 0,
      },
    ];

    const complianceButtons = [
      {
        color: 'lightYellow' as const,
        disabled: !isEnableAskForInfo,
        isLoading: isSubmitLoading,
        label: 'Ask For Info',
        onClick: () => handleOnClickAskForInfo({ action: 'ASK_FOR_INFO' }),
        show: (canRmAct || (isDti && !isAskForInfoCheckerDpop && !isAskForInfoKadivMakerDpop)) && buttons['ASK_FOR_INFO'],
      },
      {
        isLoading: isSaveLoading || isSaveWordLoading,
        label: 'Save',
        onClick: handleSaveWithValidation,
        show: (activeTab === 0 && (canRmAct || isTl || isKadiv || isDti)) || ((activeTab === 1 && (isDpop || isDti))),
      },
      {
        isLoading: isSaveLoading || isSaveWordLoading,
        label: 'Next',
        onClick: () => handleOnSave(undefined, true),
        show: isActionOnlySave && activeTab === 0,
      },
      {
        color: 'darkBlue' as const,
        isLoading: isSubmitLoading,
        label: 'Return to Maker',
        onClick: () => handleSubmit({ action: 'RETURN_TO_MAKER' }),
        show: (isTl || isKadiv || isChecker) && buttons['RETURN_TO_MAKER'],
      },
      {
        color: 'darkBlue' as const,
        isLoading: isSubmitLoading,
        label: 'Return to Staff',
        onClick: () => handleSubmit({ action: 'RETURN_TO_STAFF' }),
        show: (isTl || isKadiv || isDti) && buttons['RETURN_TO_STAFF'],
      },
      {
        color: 'info' as const,
        isLoading: isSubmitLoading,
        label: 'Return to TL',
        onClick: () => handleSubmit({ action: 'RETURN_TO_TL' }),
        show: (isKadiv || isDti) && buttons['RETURN_TO_TL'],
      },
      {
        color: 'info' as const,
        isLoading: isSubmitLoading,
        label: 'Return to Compliance',
        onClick: () => handleSubmit({ action: 'RETURN_TO_COMPLIANCE' }),
        show: (isKadiv || isDti) && buttons['RETURN_TO_COMPLIANCE'],
      },
      {
        color: 'lightYellow' as const,
        isLoading: isSubmitLoading,
        label: 'Approve Ask For Info',
        onClick: () => handleOnClickAskForInfo({ action: 'ASK_FOR_INFO' }),
        show: (isTl || (isDti && isAskForInfoTlDpop)) && buttons['ASK_FOR_INFO'], //ganti iskadiv jadi status
      },
      {
        color: 'lightYellow' as const,
        isLoading: isSubmitLoading,
        label: 'Approve Ask For Info',
        onClick: () => handleOnClickAskForInfo({ action: 'ASK_FOR_INFO' }),
        show: (isKadiv || (isDti && isAskForInfoKadivDpop) || (isDti && isAskForInfoCheckerDpop) || (isDti && isAskForInfoKadivMakerDpop)) && buttons['ASK_FOR_INFO'], //ganti istl jadi status
      },
      {
        color: 'success' as const,
        disabled: !progressCompleted || !isEnableAskForInfo || (isBusiness && !isEnableSubmitAskForInfo),
        isLoading: isSubmitLoading,
        label: (isKadiv || isChecker) ? 'Approve' : 'Submit',
        onClick: () => handleSubmit({ action: 'SUBMIT' }),
        show: (canRmAct || isTl || isDti) && buttons['SUBMIT'],
      },
      {
        color: 'success' as const,
        isLoading: isSubmitLoading,
        label: (isKadiv || isChecker) ? 'Approve' : 'Submit',
        onClick: handleForwardToDpop,
        show: buttons['FORWARD_SUBMIT'],
      },
      {
        color: 'success' as const,
        isLoading: isSubmitLoading,
        label: 'Approve',
        onClick: () => handleSubmit({ action: 'FINAL' }),
        show: (isKadiv || isDti) && buttons['FINAL'],
      },
    ];

    const actionButtons = isComplianceCheck ? complianceButtons : nonComplianceButtons;

    return actionButtons
      .filter(({ show }) => show)
      .map(({ label, show, ...buttonProps }, i) => {
        const isSaveButton = label === 'Save';
        const shouldDisable = (isSaveButton && isComplianceCheck && isComplyEmpty);
        return (
          <Button key={i} disabled={shouldDisable} {...buttonProps}>
            {label}
          </Button>
        );
      });
  };

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        {isDpop && (
          <ConfirmationLatest />
        )}
        <RowWrapper alignItems="center" justifyContent="space-between">
          <Title title={isComplianceCheck ? 'Compliance Check' : 'Tanggapan Compliance Check'} />
        </RowWrapper>
        <TableDebtorInformation
          {...bucket}
        />

        <SectionTitle title="Definisi" isOpen sx={{ mb: 3 }}>
          <Tabs
            activeTab={activeTab}
            onChange={(val) => handleChangeTab(val as number)}
            items={[
              { label: 'Bisnis' },
              { label: 'DPOP' },
            ]}
          />

          <TabItem activeValue={activeTab} value={0}>
            <BusinessPage
              id="definisi-business"
              activeTab={activeTab}
              data={verificationSheetData?.businessResponse}
              isLoading={isLoading}
              bucketData={bucketDetail}
              formMethods={methods}
              onSaveExternal={(ref) => {
                businessPageRef.current = ref;
              }}
            />
          </TabItem>

          <TabItem activeValue={activeTab} value={1}>
            <DPOPPage
              id="definisi-dpop"
              activeTab={activeTab}
              data={verificationSheetData?.response}
              isLoading={isLoading}
              bucketData={bucketDetail}
              onSaveExternal={(ref) => {
                dpopPageRef.current = ref;
              }}
            />
          </TabItem>
        </SectionTitle>

        <SectionTitle title="Hasil Review DPOP" isOpen sx={{ mb: 3 }}>
          <Tabs
            activeTab={activeTabReview}
            onChange={(val) => handleChangeTabReview(val as number)}
            items={[
              { label: 'Bisnis' },
              { label: 'DPOP' },
            ]}
          />

          <TabItem activeValue={activeTabReview} value={0}>
            <BusinessPage
              id="review-business"
              activeTab={activeTabReview}
              data={verificationSheetData?.reviewBusiness}
              isLandscape={true}
              isLoading={isLoading}
              bucketData={bucketDetail}
              formMethods={methods}
              saveType="review"
              onSaveExternal={(ref) => {
                reviewBusinessPageRef.current = ref;
              }}
            />
          </TabItem>

          <TabItem activeValue={activeTabReview} value={1}>
            <DPOPPage
              id="review-dpop"
              activeTab={activeTabReview}
              data={verificationSheetData?.reviewDpop}
              isLandscape={true}
              isLoading={isLoading}
              bucketData={bucketDetail}
              saveType="review"
              onSaveExternal={(ref) => {
                reviewDpopPageRef.current = ref;
              }}
            />
          </TabItem>
        </SectionTitle>
        <Divider sx={{ borderColor: '#284A63', borderWidth: 0.5, my: 1 }} />
        <RowWrapper sx={{ flexDirection: 'column', gap: 3, p: 3 }}>
          <RowWrapper>
            <Controller
              control={control}
              name="isComply"
              render={({ field: { ref, ...field }, fieldState: { isDirty, invalid } }) => (
                <Input
                  {...field}
                  isMandatory
                  disabled={!isComplianceCheck || viewOnly}
                  type="dropdown"
                  error={isDirty && invalid}
                  label="Kesimpulan Hasil Compliance Check"
                  placeholder="Input Comply/Not Comply"
                  dropdownList={dropdownList}
                  containerSx={{ flex: 1 }}
                />
              )}
            />
          </RowWrapper>
          <RowWrapper>
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState: { invalid } }) => (
                <Input
                  {...field}
                  disabled={!isComplianceCheck || viewOnly}
                  type="area"
                  error={invalid}
                  label="Keterangan"
                  placeholder="Input Keterangan"
                  containerSx={{ flex: 1 }}
                />
              )}
            />
          </RowWrapper>
          {/* <TreeTableComplianceCheck
            isPaper
            tableData={data}
            hidden={!isComplianceCheck || viewOnly}
            isLoading={isLoading}
            tableHeader={tableHeader}
            footer={(isComplianceCheck && !viewOnly) && (
              <RowWrapper sx={{ justifyContent: 'end', mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon="add-2"
                  startIconSx={{ fontSize: theme.spacing(3) }}
                  sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                  onClick={handleAddPerihal}
                >
                  Add New
                </Button>
              </RowWrapper>
            )}
          /> */}
          <RowWrapper>
            <Controller
              control={control}
              name="disclaimer"
              render={({ field: { ref, ...field }, fieldState: { invalid } }) => (
                <Input
                  {...field}
                  disabled={!isComplianceCheck || viewOnly}
                  type="area"
                  error={invalid}
                  label="Disclaimer"
                  placeholder="Input Disclaimer"
                  containerSx={{ flex: 1 }}
                  rows={4}
                />
              )}
            />
          </RowWrapper>
        </RowWrapper>


        <TableUploadDocumentSPFP
          documentParent={DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL}
          title="Upload Dokumen"
          showButton={!viewOnly}
          showModalSelector
          module={bucket?.module}
          process={bucket?.process}
        />

        <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
          {viewOnly && (
            <Button
              sx={{ mr: 2 }}
              onClick={() => {
                goToNextStep();
              }}
            >
              Next
            </Button>
          )}
          {renderActionButtons()}
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT}
        component={ModalUploadDocument}
      />

      <ModalDef
        id={modal.MODAL_ADD_PERIHAL}
        component={ModalAddPerihal}
      />
    </>
  );
};

export default UploadOfferingLetter;
