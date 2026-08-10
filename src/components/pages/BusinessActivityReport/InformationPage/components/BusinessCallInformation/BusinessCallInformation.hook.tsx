import React, { useEffect, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import { accessid, businessActivityReport } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useValidateCheckDk from '@/hooks/services/useValidateCheckDk';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';


import useBarInformation from '@/components/pages/BusinessActivityReport/InformationPage/Information.hook';
import TextStyle from '@/components/shared/TextStyle';

import useCreateNewDebtor from '../../hooks/useCreateNewDebtor';
import useSaveBarDetail from '../../hooks/useSaveBarDetail';
import useValidateName from '../../hooks/useValidateName';
import { modal } from '../../Information.constant';

import type { BusinessCallInformationProps } from './BusinessCallInformation.constants';
import type { DebtorListResponseDto } from '@/services/openapi/bucket-service';


const useBusinessCallInformation = ({ handleChangeTab }: BusinessCallInformationProps) => {
  const { processId }: { processId: string } = useParams();

  const { isNew, isBarCreation } = useBarInformation();
  const route = useCustomRouter();
  const { viewOnly } = useViewOnly();
  const canEditBAR = useCheckAccess(accessid.BUSINESS_ACTIVITY_REPORT_UPDATE);
  const canAddBAR = useCheckAccess(accessid.BUSINESS_ACTIVITY_REPORT_CREATE);
  const { recordActivity } = useRecordLog();
  const [{ stepper }] = useApp();
  const currentStatus = stepper.from;
  const isViewOnly = stepper.steps.find((step) => step.urlPath === 'information')?.bucketProcessId !== null ?
    !stepper.steps.find((step) => step.urlPath === 'information')?.enable : false;

  const methods = useFormContext();
  const watchFields = methods.watch();
  const { formState: { isValid } } = methods;
  const { mutate: saveDebtorDetail } = useCreateNewDebtor({
    onError() {
      showNiceModalV2({
        onClose: () => {},
        type: 'error',
      });
    },
    onSuccess(data) {
      showNiceModalV2({
        onClose: () => {
          route.push(replacePath(businessActivityReport.INFORMATION, {
            processId: data.data.content.bucketProcessId,
          }));
        },
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.CREATE,
        changeAfter: JSON.stringify({
          payload: {
            comment: 'Create New BAR',
            debtorName: watchFields.name,
            institutionType: watchFields.institution,
          },
          type: 'new',
        }),
        changeBefore: JSON.stringify({
          payload: {
            comment: '',
            debtorName: '',
            institutionType: '',
          },
          type: '',
        }),
        menuCode: 'business-activity-report',
        module: TypeModule.BAR,
        process: TypeProcess.BAR,
        remarks: 'create new bar with new debtor',
      });
    },
  });

  const { mutate: validateName } = useValidateName({
    onError() {
      showNiceModalV2({
        onClose: () => {},
        type: 'error',
      });
    },
    onSuccess(resp) {
      if (resp.similarDebtorList.length < 1) {
        saveDebtorDetail({
          payload: {
            comment: 'Create New BAR',
            debtorName: watchFields.name,
            institutionType: watchFields.institution,
          },
          type: 'new',
        });
      } else {
        NiceModal.show(modal.EXISTING_USER, {
          ...resp, payload: {
            comment: 'Create New BAR',
            debtorName: watchFields.name,
            institutionType: watchFields.institution,
          },
        });
      };
      recordActivity({
        activity: ActivityType.SUBMIT,
        changeAfter: JSON.stringify({ name: watchFields.name }),
        changeBefore: JSON.stringify({ name: '' }),
        menuCode: 'business-activity-report',
        module: TypeModule.BAR,
        process: TypeProcess.BAR,
        remarks: 'check if debtor is already exist',
      });
    },
  });

  const { mutate: saveBarDetail } = useSaveBarDetail({
    onError() {
      showNiceModalV2({
        onClose: () => {
        }, type: 'error',
      });
    },
    onSuccess() {
      showNiceModalV2({
        onClose: () => {
          handleChangeTab();
        },
        title: 'Data berhasil disimpan', type: 'success',
      });
    },
  });

  const { mutate: dkValidation } = useValidateCheckDk({
    onError: () => {},

  });

  const renderCallDescriptionComponent = watchFields?.businessCallType ? true : false;

  const handleViewData = (data: DebtorListResponseDto[]) => {
    NiceModal.show(modal.CUSTOMER_DK_VALIDATION, { data });
  };

  const handleButtonSave = async (isSaveAndNext: boolean) => {
    await methods.trigger().then((isValid) => handleSaveInformation(isValid, isSaveAndNext));
  };

  const handleSaveInformation = (isValid: boolean, isSaveAndNext: boolean) => {
    if ((canEditBAR === false || !isBarCreation) && !isNew) { handleChangeTab(); return; };
    const data = watchFields;
    const barPayload = {
      bucketProcessId: processId,
      callDate: data.callDate ? dayjs(data.callDate).format('YYYY-MM-DD') + 'T' + data.callTime : null,
      checklist: data.checklist,
      clientList: data.clientRepresentative[0].name !== null ? data.clientRepresentative?.map((dt) => ({
        jobPosition: dt.position?.id,
        jobPositionLabel: dt.position?.label,
        name: dt.name,
      })) : [],
      media: data.media,
      mediaOther: data.mediaOther,
      module: TypeModule.BAR,
      other: data?.other,
      process: TypeProcess.BAR,
      summaryAlert: data.summaryAlert,
      type: data.businessCallType,
      userList: data.smiRepresentative[0].person !== null ? data.smiRepresentative.map((dt) => +dt.person?.id) : [],
    };
    const debtorPayload = {
      bucketProcessId: processId,
      debtor: {
        infrastructureSector: data.sector?.id,
        infrastructureSectorOther: data.sectorOther,
      },
      groupId: data.group?.id || data.group?.value,
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
    };

    if (!isValid) {
      showNiceModalV2({
        onSubmit() {
          saveBarDetail({
            barPayload,
            debtorPayload,
          });
        },
        title: 'Data mandatory belum terisi, apakah anda yakng ingin melanjutkan?', type: 'warning',
      });
    } else {
      if (isNew) {
        dkValidation({
          debtorName: watchFields.name,
          feature: 'DK',
        }, {
          onSuccess: (data) => {
            if (data.hasDuplicate) {
              showNiceModalV2({
                cancelText: 'Close',
                title: 'Terdaftar dalam database DK. proses tidak dapat dilanjutkan.',
                type: 'error',
              });
            } else if (data.hasSimilar) {
              showNiceModalV2({
                cancelText: 'Cancel',
                onSubmit: () => validateName(watchFields.name),
                submitText: 'Save',
                title: (
                  <TextStyle sx={{ textAlign: 'center' }}>
                    Terdapat kemiripan dengan database DK.
                    <TextStyle
                      sx={{
                        color: '#0C8CE9',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                      onClick={() => handleViewData(data.similarDebtorList)}
                    >
                      View Data Details
                    </TextStyle>
                  </TextStyle>
                ),
                type: 'warning',
              });
            } else {
              validateName(watchFields.name);
            }
            recordActivity({
              activity: ActivityType.SUBMIT,
              changeAfter: JSON.stringify({
                debtorName: watchFields.name,
                feature: 'DK',
              }),
              changeBefore: JSON.stringify({
                debtorName: '',
                feature: '',
              }),
              menuCode: 'business-activity-report',
              module: TypeModule.BAR,
              process: TypeProcess.BAR,
              remarks: 'check if debtor is part of DK',
            });
          },
        });
      } else if (isSaveAndNext) {
        saveBarDetail({
          barPayload,
          debtorPayload,
        });
      } else {
        saveBarDetail({
          barPayload,
          debtorPayload,
        }, {
          onSuccess() {
            showNiceModalV2({
              onClose: () => {},
              title: 'Data berhasil disimpan', type: 'success',
            });
          },
        });
      }
    }
  };

  const isOpenRepresentative = useMemo(() => {
    const { institution, name, group, sector } = watchFields;

    if (institution === null || name === null || group === null || sector.id === null) {
      return false;
    }

    return true;
  }, [watchFields]);

  const isOpenDescription = useMemo(() => {
    const { callDate, callTime, media, businessCallType } = watchFields;

    if (callDate === null || callTime === null || media === null || businessCallType === null) {
      return false;
    }

    return true;
  }, [watchFields]);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'business-activity-report',
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
      remarks: 'view detail business call information',
    });
  }, []);

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const data = watchFields;

    const barPayload = {
      bucketProcessId: processId,
      callDate: data.callDate ? dayjs(data.callDate).format('YYYY-MM-DD') + 'T' + data.callTime : null,
      checklist: data.checklist,
      clientList: data.clientRepresentative[0]?.name !== null ? data.clientRepresentative?.map((dt) => ({
        jobPosition: dt.position?.id,
        jobPositionLabel: dt.position?.label,
        name: dt.name,
      })) : [],
      media: data.media,
      mediaOther: data.mediaOther,
      module: TypeModule.BAR,
      other: data?.other,
      process: TypeProcess.BAR,
      summaryAlert: data.summaryAlert,
      type: data.businessCallType,
      userList: data.smiRepresentative[0]?.person !== null ? data.smiRepresentative.map((dt) => +dt.person?.id) : [],
    };

    const debtorPayload = {
      bucketProcessId: processId,
      debtor: {
        infrastructureSector: data.sector?.id,
        infrastructureSectorOther: data.sectorOther,
      },
      groupId: data.group?.id || data.group?.value,
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
    };

    const payload = {
      ...barPayload,
      ...debtorPayload,
    };

    return Promise.resolve(payload);
  }, [watchFields, processId]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isNew && !isViewOnly && !!processId && (canEditBAR || isBarCreation),
    payload: autoSavePayload,
    url: 'bucket.bucket.save',
  });

  return {
    canAddBAR,
    canEditBAR,
    currentStatus,
    handleButtonSave,
    isAutoSaveFetching,
    isBarCreation,
    isNew,
    isOpenDescription,
    isOpenRepresentative,
    isValid,
    isViewOnly,
    renderCallDescriptionComponent,
  };
};

export default useBusinessCallInformation;
