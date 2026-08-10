import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { accessid, businessActivityReport } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { toHourMinute } from '@/helpers/date';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';
import { action } from '@/components/shared/SmiTable/TableUploadDocumentV2/TableUploadDocument.constants';

import { schema } from './components/BusinessCallInformation/BusinessCallInformation.constants';
import useGetBarDetail from './hooks/useGetBarDetail';
import useGetDebtorDetail from './hooks/useGetDebtorDetail';
import useSaveFollowUp from './hooks/useSaveFollowUp';
import { tab } from './Information.constant';


const useBarInformation = () => {
  const [activeTab, setActiveTab] = useState(tab.BUSINESSCALLINFORMATION);
  const [followUpContainer, setFollowUpContainer] = useState(null);
  const [businesCallContainer, setBusinessCallContainer] = useState(null);
  const { setDirtyMsg } = useContext(DirtyContext);
  const { recordActivity } = useRecordLog();
  const { processId }: { processId: string } = useParams();
  const { setDebtorId, setDebtorName } = useIdentity();
  const canEditBAR = useCheckAccess(accessid.BUSINESS_ACTIVITY_REPORT_UPDATE);
  const canViewBAR = useCheckAccess(accessid.BUSINESS_ACTIVITY_REPORT_VIEW);
  const canDownloadBAR = useCheckAccess(accessid.BUSINESS_ACTIVITY_REPORT_DOWNLOAD);
  const canDeleteBAR = useCheckAccess(accessid.BUSINESS_ACTIVITY_REPORT_DELETE);
  const canCreateBAR = useCheckAccess(accessid.BUSINESS_ACTIVITY_REPORT_CREATE);

  const route = useCustomRouter();
  const path = usePathname();
  const type = getLastPath(path);
  const isNew = type === 'new';

  const [state] = useApp();
  const isChecker = state.currentRole.includes('CHECKER');

  const isViewOnly = state.stepper.steps.find((step) => step.urlPath === 'information')?.bucketProcessId !== null ?
    !state.stepper.steps.find((step) => step.urlPath === 'information')?.enable : false;

  const renderActions = useMemo(() => {
    if (isViewOnly) {
      const { TABLE_UPLOAD_DOCUMENT_DOWNLOAD } = action;
      return TABLE_UPLOAD_DOCUMENT_DOWNLOAD;
    }
  }, []);

  const actions = state.stepper.steps.find((dt) => dt.urlPath === getLastPath(path))?.action;

  const methods = useForm({
    context: { isNew },
    defaultValues: {
      businessCallType: null,
      callDate: null,
      callTime: null,
      checklist: [],
      clientRepresentative: [{
        name: null,
        position: null,
      }],
      debtorId: null,
      debtorStatus: '',
      group: null,
      institution: null,
      isNewClient: true,
      media: null,
      name: null,
      other: null,
      sector: null,
      sectorOther: null,
      smiRepresentative: [{
        division: null,
        person: null,
        position: null,
      }],
      summaryAlert: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchFields = methods.watch();

  const { data: barDetail } = useGetBarDetail({
    bucketProcessId: processId,
    module: TypeModule.BAR,
    process: TypeProcess.BAR,
  }, { enabled: !isNew });

  const { data: debtorDetail } = useGetDebtorDetail({
    bucketProcessId: processId,
    module: TypeModule.BAR,
    process: TypeProcess.BAR,
  }, { enabled: !isNew });

  const { data } = useGetDetailBucketDebtor({
    bucketProcessId: debtorDetail?.bucketProcessId,
    module: TypeModule.BAR,
    process: TypeModule.BAR,
  }, { enabled: !!debtorDetail?.bucketProcessId });

  const { mutate: submitBucket } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data, variables) => {
      const submittedAction = variables?.submitRequestDto?.action;
      const isOverDue = submittedAction === 'OVERDUE';

      if (isOverDue && isMoreThan14DaysAgo(watchFields.callDate)) {
        NiceModal.show(MODAL.GLOBAL.WARNING, {
          closeText: 'Close',
          onClose: () => {
            route.push(businessActivityReport.LIST);
          },
          title: 'Sorry, you are not allowed to submit an overdue report. For next, please submit your report within 14 Calendar days from your activities',
        });
      } else {
        showNiceModalV2({
          onClose: () => {
            setDirtyMsg(undefined);
            route.push(businessActivityReport.LIST);
          },
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      }
    },
  });

  const { mutate: saveFollowUp } = useSaveFollowUp({
    onError() {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess() {
      showNiceModalV2({
        onClose() {
          setDirtyMsg(undefined);
        },
        type: 'success',
      });
    },
  });

  const isBarCreation: boolean = useMemo(() => debtorDetail?.status === 'BAR_CREATION'
    || debtorDetail?.status === 'RETURN_TO_STAFF'
    || debtorDetail?.status === 'RETURN_TO_MAKER'
    || debtorDetail?.status === 'RETURN_TO_TL', [debtorDetail?.status]);

  let modifiedObject = useMemo(() => {
    let actionObject = {};

    actionObject = isViewOnly || !isBarCreation || canEditBAR === false && !isNew ? {} : { SAVE: 'SAVE' };

    return actionObject;
  }, [isBarCreation, canEditBAR, actions]);

  const saveButtonDict = ['DECLINE', 'SAVE', 'RETURN_TO_STAFF', 'RETURN_TO_TL', 'RETURN_TO_MAKER', 'APPROVE', 'SUBMIT'];

  useEffect(() => {
    if (isNew) return;

    const defaultGroup = debtorDetail?.groupId ? { id: debtorDetail?.groupId, label: debtorDetail?.groupName } : { id: debtorDetail?.groupId, label: '' };

    methods.reset({
      businessCallType: barDetail?.type,
      callDate: barDetail?.callDate,
      callTime: barDetail?.callDate ? toHourMinute(barDetail?.callDate) : null,
      checklist: barDetail?.checklist?.length > 0 ? barDetail?.checklist : [],
      clientRepresentative: barDetail?.clientList.length > 0 ?
        barDetail?.clientList.map((dt) => (
          {
            name: dt.name,
            position: { id: dt.jobPosition, label: dt.jobPositionLabel },
          }
        )) : [{
          name: null,
          position: null,
        }],
      debtorId: debtorDetail?.debtorId,
      debtorStatus: data?.status,
      group: defaultGroup,
      institution: debtorDetail?.institutionType,
      isNewClient: debtorDetail?.isNewClient,
      media: barDetail?.media,
      mediaOther: barDetail?.mediaOther,
      name: debtorDetail?.debtorName,
      other: barDetail?.other,
      sector: { id: debtorDetail?.infrastructureSector, label: debtorDetail?.infrastructureSectorLabel },
      sectorOther: debtorDetail?.infrastructureSectorOther,
      smiRepresentative: barDetail?.userList.length > 0 ?
        barDetail?.userList.map((dt) => ({
          division: { id: dt.division, label: dt.divisionLabel },
          person: { id: dt.userId, label: dt.name },
          position: { id: dt.jobPosition, label: dt.jobPositionLabel },
        })) : [{
          division: null,
          person: null,
          position: null,
        }],
      summaryAlert: barDetail?.summaryAlert,
    });

    setDebtorId(debtorDetail?.debtorId);
    setDebtorName(debtorDetail?.debtorName);

  }, [debtorDetail, barDetail, data]);

  const isDisableSubmit = useMemo(() => {
    const res = !(
      barDetail?.type && // businessCallType
      barDetail?.callDate && // callDate
      toHourMinute(barDetail?.callDate) && // callTime
      barDetail?.clientList?.length > 0 && // clientRepresentative must not be empty
      debtorDetail?.debtorId && // debtorId is required
      debtorDetail?.institutionType && // institution must be present
      barDetail?.media && // media must be present
      debtorDetail?.debtorName && // name must be present
      debtorDetail?.infrastructureSector && // sector must be present
      barDetail?.userList?.length > 0 && // smiRepresentative must not be empty

      // Check if media is 'OTHER', then mediaOther must be present
      (barDetail?.media !== 'OTHER' || barDetail?.mediaOther) &&

      // Check if infrastructureSector is 'OTHER', then infrastructureSectorOther must be present
      (debtorDetail?.infrastructureSector !== 'OTHER' || debtorDetail?.infrastructureSectorOther)
    );

    return res;

  }, [barDetail, debtorDetail]);

  for (const key in actions) {
    if (key.includes('CANCEL') || key.includes('REJECT')) {
      modifiedObject['DECLINE'] = 'DECLINE';
    } else if (key.includes('RETURN_TO_STAFF')) {
      if (debtorDetail?.pic?.map((dt) => dt.jobPosition).includes('STAFF')) {
        modifiedObject['RETURN_TO_STAFF'] = 'RETURN_TO_STAFF';
      }
    } else if (key.includes('RETURN_TO_TL')) {
      if (debtorDetail?.pic?.map((dt) => dt.jobPosition).includes('TL')) {
        modifiedObject['RETURN_TO_TL'] = 'RETURN_TO_TL';
      }
    } else if (key.includes('RETURN_TO_MAKER')) {
      if (debtorDetail?.pic?.map((dt) => dt.jobPosition).includes('MAKER') || isChecker) {
        modifiedObject['RETURN_TO_MAKER'] = 'RETURN_TO_MAKER';
      }
    }
    else {
      modifiedObject[key] = actions[key];
    }
  }

  const sortedKeys = saveButtonDict.filter((key) => Object.keys(modifiedObject).includes(key));

  let sortedObject = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
  });

  const isMoreThan14DaysAgo = (callDate) => {
    const fourteenDaysAgo = dayjs().subtract(14, 'day');
    const callDateParsed = dayjs(callDate);

    return callDateParsed.isBefore(fourteenDaysAgo);
  };

  const handleSubmit = (action: string) => {
    const whiteList = ['SUBMIT', 'APPROVE'];
    const isWhiteList = whiteList.includes(action);

    if (isWhiteList && isMoreThan14DaysAgo(watchFields.callDate)) {
      submitBucket({
        submitRequestDto: {
          action: 'OVERDUE',
          bucketProcessId: processId,
          module: TypeModule.BAR,
          process: TypeProcess.BAR,
        },
      });

      recordActivity({
        activity: ActivityType.SUBMIT,
        changeAfter: JSON.stringify({
          submitRequestDto: {
            action: 'OVERDUE',
            bucketProcessId: processId,
            module: TypeModule.BAR,
            process: TypeProcess.BAR,
          },
        }),
        changeBefore: JSON.stringify({
          submitRequestDto: {
            action: '',
            bucketProcessId: '',
            module: '',
            process: '',
          },
        }),
        menuCode: 'business-activity-report',
        module: TypeModule.BAR,
        process: TypeProcess.BAR,
        remarks: 'submit overdue business activity report',
      });
    } else {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          submitBucket({
            submitRequestDto: {
              action: action,
              bucketProcessId: processId,
              comment,
              module: TypeModule.BAR,
              process: TypeProcess.BAR,
            },
          });
          closeNiceModal(MODAL.GLOBAL.COMMENT);

          recordActivity({
            activity: ActivityType.SUBMIT,
            changeAfter: JSON.stringify({
              submitRequestDto: {
                action: action,
                bucketProcessId: processId,
                comment,
                module: TypeModule.BAR,
                process: TypeProcess.BAR,
              },
            }),
            changeBefore: JSON.stringify({
              submitRequestDto: {
                action: '',
                bucketProcessId: '',
                comment: '',
                module: '',
                process: '',
              },
            }),
            menuCode: 'business-activity-report',
            module: TypeModule.BAR,
            process: TypeProcess.BAR,
            remarks: 'submit business activity report for review',
          });
        },
      });
    }

  };

  const handleRejectCollaboration = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.BAR,
            process: TypeProcess.BAR,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);

        recordActivity({
          activity: ActivityType.SUBMIT,
          changeAfter: JSON.stringify({
            submitRequestDto: {
              action: radioValue,
              bucketProcessId: processId,
              comment,
              module: TypeModule.BAR,
              process: TypeProcess.BAR,
            },
          }),
          changeBefore: JSON.stringify({
            submitRequestDto: {
              action: '',
              bucketProcessId: '',
              comment: '',
              module: '',
              process: '',
            },
          }),
          menuCode: 'business-activity-report',
          module: TypeModule.BAR,
          process: TypeProcess.BAR,
          remarks: 'reject or cancel business activity report',
        });
      },
      radioLabel: 'Choose Reason:',
      radioOptions: [
        { label: 'Cancel', value: actions.CANCEL },
        { label: 'Reject', value: actions.REJECT }
      ],
    });
  };


  const handleSaveInformation = async () => {
    const businessCall = await convertToDocx(businesCallContainer);
    const followUp = await convertToDocx(followUpContainer);

    saveFollowUp({
      bucketProcessId: processId,
      discussion: businessCall,
      followUp: followUp,
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
    });

    recordActivity({
      activity: ActivityType.SAVE,
      changeAfter: JSON.stringify({
        bucketProcessId: processId,
        discussion: businessCall,
        followUp: followUp,
        module: TypeModule.BAR,
        process: TypeProcess.BAR,
      }),
      changeBefore: JSON.stringify({
        bucketProcessId: '',
        discussion: '',
        followUp: '',
        module: '',
        process: '',
      }),
      menuCode: 'business-activity-report',
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
      remarks: 'save follow up business activity report',
    });
  };

  // Auto-save payload
  const autoSavePayload = useMemo(() => async () => {
    const businessCall = await convertToDocx(businesCallContainer);
    const followUp = await convertToDocx(followUpContainer);

    const payload = {
      bucketProcessId: processId,
      discussion: businessCall,
      followUp: followUp,
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
    };

    return Promise.resolve(payload);
  }, [businesCallContainer, followUpContainer, processId]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    isActive: !isNew && !isViewOnly && !!processId && (canEditBAR || isBarCreation),
    payload: autoSavePayload,
    url: 'master.barFollowUp.save',
  });


  const handleActionButton = (key: string, value: string) => {
    switch (key) {
      case 'DECLINE':
        return (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleRejectCollaboration()}
          >  Decline
          </Button>
        );
      case 'SAVE':
        return (
          <Button
            onClick={() => handleSaveInformation()}
            disabled={isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        );
      case 'RETURN_TO_STAFF':
        return (
          <Button
            onClick={() => handleSubmit(value)}
          >  Return to Staff
          </Button>
        );
      case 'RETURN_TO_TL':
        return (
          <Button
            variant="contained"
            color="info"
            onClick={() => handleSubmit(value)}
          >    Return to TL
          </Button>
        );
      case 'RETURN_TO_MAKER':
        return (
          <Button
            variant="contained"
            onClick={() => handleSubmit(value)}
          >    Return to Maker
          </Button>
        );
      case 'SUBMIT':
        return (
          <Button
            disabled={isDisableSubmit}
            onClick={(() => handleSubmit(value))}
            color="success"
          >Submit
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            color="success"
          >Approve
          </Button>
        );
      default:
        return <></>;

    }
  };


  const renderActionButtons = () => {
    return sortedObject ? Object.entries(sortedObject).map((dt: [string, string], index: number) => {
      const [key, value] = dt;
      return (handleActionButton(key, value));
    }) : null;
  };

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

  return {
    activeTab,
    businesCallContainer,
    canCreateBAR,
    canDeleteBAR,
    canDownloadBAR,
    canEditBAR,
    canViewBAR,
    followUpContainer,
    handleChangeTab,
    isBarCreation,
    isNew,
    isViewOnly,
    methods,
    renderActionButtons,
    renderActions,
    setBusinessCallContainer,
    setFollowUpContainer,
  };
};

export default useBarInformation;
