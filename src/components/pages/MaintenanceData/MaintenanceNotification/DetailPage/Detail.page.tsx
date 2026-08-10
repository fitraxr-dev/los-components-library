'use client';

import { useEffect, useMemo, useState, useContext } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';

import {
  useMaintenanceNotificationContext,
} from '@/components/layouts/MaintenanceNotificationLayout/MaintenanceNotification.context';
import useGetCurrentModule from '@/components/pages/MaintenanceData/MaintenanceNotification/DetailPage/hooks/useGetCurrentModule';
import Button from '@/components/shared/Button';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder/EmptyPlaceholder';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import RowWrapper from '@/components/shared/RowWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import TableTemplateNotification from '../components/TableTemplateNotification';

import { DivisionRoleSelector } from './components/DivisionRoleSelector';
import RejectModal from './components/RejectModal';
import { useDetailPage } from './DetailPage.hooks';


const dummyValueDivision = ['DPB_DIVISION', 'DUS_DIVISION', 'BUSINESS_DIVISION'];

export type RoleType = { name: string; selected: boolean };
type DivisionType = {
  divisionCode: string;
  divisionName: string;
  roles: {
    id: number;
    positionCode: string;
    positionName: string;
    selected: boolean;
  }[];
};


const DetailPage = () => {
  // const [isFooterEmpty, setIsFooterEmpty] = useState(true);
  const [isFooterEmpty, setIsFooterEmpty] = useState(true);
  const [followUpContainer, setFollowUpContainer] = useState(null);

  const {
    data,
    isLoading,
    bucketProcessId,
    action,
    methods,
    divisionOptions,
    divisionsDisplay,
    flow,
    isIdBucket,
    isAutoSaveFetching,
    toggleDivision,
    toggleRole,
    deleteDivision,
    valueDivision,
    setValueDivision,
    addSelectedDivisions,
    handleSubmit,
    handleSaveNotification,
    selectedDivisionsWithRoles,
    hasFooter,
    hasSaved,
    hasChanged,
    // syncReceiversWithForm,
  } = useDetailPage(followUpContainer);

  // Record Activity
  const { recordActivity } = useRecordLog();
  const params = useParams();
  const processId = params.id as string;
  const processIdToUse = bucketProcessId ?? (isIdBucket ? processId : null);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processIdToUse,
      module: TypeModule.MAINTENANCE_NOTIFICATION,
      process: TypeProcess.MAINTENANCE_NOTIFICATION,
      remarks: 'view data maintenance notification',
    });
  }, []);

  const [state, _] = useApp();

  const isCHECKER = state.currentRole.includes(roles.CHECKER);

  const { formState, reset, watch, getValues, setValue } = methods;

  const onChange = (val: string[]) => {
    setValueDivision(val);
    // syncReceiversWithForm();
  };

  const onClickAddDivision = () => {
    addSelectedDivisions(valueDivision);
  };

  const router = useRouter();
  const { module, process } = useGetCurrentModule();

  // value context radiobutton dari layout
  const { isNotificationActive, activeType, notificationType } = useMaintenanceNotificationContext();

  useEffect(() => {
    console.log('value', valueDivision);
  }, [valueDivision]);

  // validasi form
  const { formState: { isValid } } = methods; // gagal update kebergantungan isNotificationActive
  const values = methods.watch();

  const isFormComplete = useMemo(() => {
    const { tableGroup } = values;
    if (!tableGroup) return false;

    // Cek field wajib umum
    const hasCommonFields =
    !!tableGroup.templateLosTitle &&
    !!tableGroup.templateLosMessage &&
    !!tableGroup.messageSubject;

    const umumComplete = hasCommonFields;

    if (isNotificationActive) {
      return umumComplete && !!tableGroup.startDate && !!tableGroup.startTime;
    }

    return umumComplete;
  }, [values, isNotificationActive]);

  useEffect(() => {
    console.log('isFormComplete:', isFormComplete);
  }, [isFormComplete]);

  useEffect(() => {
    if (!isNotificationActive) {
      // Reset value jadi kosong string (bukan null) biar gak langsung invalid
      methods.resetField('tableGroup.startDate', { defaultValue: '' });
      methods.resetField('tableGroup.startTime', { defaultValue: '' });

      // Hapus error yang tersisa
      methods.clearErrors(['tableGroup.startDate', 'tableGroup.startTime']);
    }
  }, [isNotificationActive, methods]);

  // pop up global ketika ada perubahan di form
  const { setDirtyMsg } = useContext(DirtyContext);
  useEffect(() => {
    if (hasChanged) {
      setDirtyMsg(
        'Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.'
      );
    }
  }, [hasChanged, setDirtyMsg]);


  return (
    <>
      <Box>
        <FormProvider {...methods}>
          <TableTemplateNotification
            disabledForm={action === 'detail' || action === 'detail-from-approval' || flow === 'waiting-approval'}
            isNotificationActive={isNotificationActive}
            onFooterEmptyChange={setIsFooterEmpty}
            onNotificationActiveChange={(active) => {
              // console.log('Notification active changed:', active);
            }}
            followUpContainer={followUpContainer}
            setFollowUpContainer={setFollowUpContainer}
            action={action}
          />
        </FormProvider>
      </Box>

      {action === 'detail' || action === 'detail-from-approval' ? (
        <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
          <Button variant="outlined" onClick={() => router.back()}>
            Close
          </Button>
        </RowWrapper>
      ) : action === 'edit' ? (
        flow === 'return-maker' ? (
        // Kondisi flow: return to maker
          <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
            <Button
              variant="outlined"
              color="error"
              disabled={!bucketProcessId && !isIdBucket}
              onClick={() => handleSubmit('CANCELED')}
            >
              Canceled
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!isFormComplete
                || !followUpContainer || (isFooterEmpty && !hasFooter)}
              onClick={() => handleSaveNotification(methods.getValues())}
            >
              Save
            </Button>
            <Button
              color="success"
              disabled={(hasChanged && !hasSaved)}
              onClick={() => handleSubmit('SUBMIT')}
            >
              Submit
            </Button>
          </RowWrapper>
        ) : flow === 'waiting-approval' ? (
        // Kondisi flow: waiting approval checker
          <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
            <Button
              variant="outlined"
              color="error"
              disabled={!bucketProcessId && !isIdBucket}
              onClick={() => handleSubmit('REJECTED')}
            >
              Rejected
            </Button>
            <Button
              disabled={!bucketProcessId && !isIdBucket}
              onClick={() => handleSubmit('RETURN_TO_MAKER')}
            >
              Return to Maker
            </Button>
            <Button
              color="success"
              disabled={(hasChanged && !hasSaved)}
              onClick={() => handleSubmit('SUBMIT')}
            >
              Approve
            </Button>
          </RowWrapper>
        ) : (
        // Kondisi edit default (tanpa flow) atau maintenance data dari submission
          <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
            <Button
              variant="outlined"
              color="error"
              disabled={!bucketProcessId && !isIdBucket}
              onClick={() => handleSubmit('CANCELED')}
            >
              Canceled
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!isFormComplete
          || !followUpContainer || (isFooterEmpty && !hasFooter) || isAutoSaveFetching}
              onClick={() => handleSaveNotification(methods.getValues(), (flow !== 'return-maker' && flow !== 'maintenance-data'))} // kembali ke listpage jika tamplate
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>

            {/* submit from Maintenance Data */}
            {flow === 'maintenance-data' && (
              <Button
                color="success"
                disabled={hasChanged && !hasSaved}
                onClick={() => handleSubmit('SUBMIT')}
              >
                Submit
              </Button>
            )}

            {/* submit has saved */}
            {flow !== 'maintenance-data' && hasSaved && (
              <Button
                color="success"
                disabled={hasChanged}
                onClick={() => handleSubmit('SUBMIT')}
              >
                Submit
              </Button>
            )}

            {/* submit not yet saved */}
            {flow !== 'maintenance-data' && !hasSaved && (
              <Button
                color="success"
                disabled={
                  bucketProcessId === null ||
                  !isIdBucket ||
                  !isFormComplete ||
                  !followUpContainer ||
                  (isFooterEmpty && !hasFooter)
                }
                onClick={() => handleSubmit('SUBMIT')}
              >
                Submit
              </Button>
            )}


          </RowWrapper>
        )
      ) : null}


      <ModalDef
        id={MODAL.DECLINE}
        component={RejectModal}
      />
    </>
  );
};

export default DetailPage;
