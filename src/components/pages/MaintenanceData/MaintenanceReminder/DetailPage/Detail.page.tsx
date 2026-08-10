'use client';

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Typography } from '@mui/material';
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
  useMaintenanceReminderContext,
} from '@/components/layouts/MaintenanceReminderLayout/MaintenanceReminder.context';
import useGetCurrentModule from '@/components/pages/MaintenanceData/MaintenanceReminder/DetailPage/hooks/useGetCurrentModule';
import Button from '@/components/shared/Button';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder/EmptyPlaceholder';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import RowWrapper from '@/components/shared/RowWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import TableTemplateReminder from '../components/TableTemplateReminder';

import { DivisionRoleSelector } from './components/DivisionRoleSelector';
import RejectModal from './components/RejectModal';
import { useDetailPage } from './DetailPage.hooks';


const TAB_ITEMS = [
  { label: 'Template Reminder', value: 'TAB_REMINDER' },
  { label: 'Receiver', value: 'TAB_RECEIVER' }
];

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

const waitingProcessText = '*Reminder WAITING PROCESS untuk Pipeline & Business Activity Report (BAR) akan dikirim sesuai divisi dan datanya.';

const DetailPage = () => {
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
    handleSaveReminder,
    selectedDivisionsWithRoles,
    hasFooter,
    hasSaved,
    hasChanged,
    handleToggleDivision,
    handleToggleRole,
    handleDeleteDivision,
    syncReceiversWithForm,
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
      module: TypeModule.MAINTENANCE_REMINDER,
      process: TypeProcess.MAINTENANCE_REMINDER,
      remarks: 'view data maintenance reminder',
    });
  }, []);

  const [state, _] = useApp();

  const { formState, reset, watch, getValues, setValue } = methods;
  const onChange = (val: string[]) => {
    setValueDivision(val);
    // hanya sync dan mark dirty kalau sedang edit
    if (action === 'edit' && flow !== 'waiting-approval') {
      syncReceiversWithForm(true);
    } else {
    // sinkronisasi silent (jika perlu) => syncReceiversWithForm(false);
      syncReceiversWithForm(false);
    }
  };

  const onClickAddDivision = () => {
    addSelectedDivisions(valueDivision);
  };

  const router = useRouter();
  const { module, process } = useGetCurrentModule();

  // value context radiobutton dari layout
  const { isReminderActive, activeType, reminderType } = useMaintenanceReminderContext();

  useEffect(() => {
    console.log('value', valueDivision);
  }, [valueDivision]);

  // state handling tabs
  const [activeTab, setActiveTab] = useState('TAB_REMINDER');
  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

  // validasi form
  const { formState: { isValid } } = methods; // gagal update kebergantungan isReminderActive
  const values = methods.watch();
  const [isReminderActiveFromInput, setIsReminderActiveFromInput] = useState(false);

  const isFormComplete = useMemo(() => {
    const { tableGroup } = values;
    if (!tableGroup) return false;

    // Cek field wajib umum
    const hasCommonFields =
    !!tableGroup.reminderHeader &&
    !!tableGroup.reminderSubject &&
    !!tableGroup.time &&
    !!tableGroup.scheduleType;

    // Cek day2/date2 sesuai scheduleType
    const hasScheduleSpecificField =
    tableGroup.scheduleType === 'weekly'
      ? !!tableGroup.day
      : tableGroup.scheduleType === 'monthly'
        ? !!tableGroup.date
        : true; // untuk scheduleType lain (misal daily)

    const umumComplete = hasCommonFields && hasScheduleSpecificField;

    if (isReminderActiveFromInput) {
      return umumComplete && !!tableGroup.startDate && !!tableGroup.startTime;
    }

    return umumComplete;
  }, [values, isReminderActiveFromInput]);

  useEffect(() => {
    if (!isReminderActiveFromInput) {
      // Reset value jadi kosong string (bukan null) biar gak langsung invalid
      methods.resetField('tableGroup.startDate', { defaultValue: '' });
      methods.resetField('tableGroup.startTime', { defaultValue: '' });

      // Hapus error yang tersisa
      methods.clearErrors(['tableGroup.startDate', 'tableGroup.startTime']);
    }
  }, [isReminderActiveFromInput, methods]);


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
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={TAB_ITEMS}
        activeBackgroundColor
      />
      {/* <h3>bucket id: {bucketProcessId}</h3> */}
      <Box sx={{ display: activeTab === 'TAB_REMINDER' ? 'block' : 'none' }}>
        <FormProvider {...methods}>
          <TableTemplateReminder
            disabledForm={action === 'detail' || action === 'detail-from-approval' || flow === 'waiting-approval'}
            isReminderActive={isReminderActive}
            onFooterEmptyChange={setIsFooterEmpty}
            onReminderActiveChange={(active) => {
              // console.log('Reminder active changed:', active);
            }}
            followUpContainer={followUpContainer}
            setFollowUpContainer={setFollowUpContainer}
            action={action}
          />
        </FormProvider>
      </Box>

      <Box sx={{ display: activeTab === 'TAB_RECEIVER' ? 'block' : 'none' }}>
        {reminderType === 'Waiting Process' &&
          <Typography variant="body3" sx={{ color: '#FF0000', display: 'block', mb: 3 }}>{waitingProcessText}</Typography>
        }
        <RowWrapper sx={{ alignItems: 'flex-end', gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <MultipleAutoComplete
              label="Penerima Reminder (Divisi)"
              placeholder="Pilih Penerima Reminder (Divisi)"
              dropdownList={divisionOptions}
              disabled={action === 'detail' || action === 'detail-from-approval' || flow === 'waiting-approval'}
              isMandatory={action === 'edit' && flow !== 'waiting-approval'}
              onChange={onChange}
              value={valueDivision}
              {...((action === 'detail' || action === 'detail-from-approval') && {
                inputSx: {
                  // alignItems: 'flex-start',
                  flexWrap: 'wrap',
                },
              })}
            />
          </Box>
          <Button startIcon="add" disabled={action === 'detail' || action === 'detail-from-approval'} onClick={onClickAddDivision}>Add Divisi</Button>
        </RowWrapper>

        {divisionsDisplay.length > 0 ? (
          <Box sx={{ mt: 4 }}>
            <DivisionRoleSelector
              data={divisionsDisplay}
              // onToggleDivision={toggleDivision}
              // onToggleRole={toggleRole}
              // onDeleteDivision={deleteDivision}
              onToggleDivision={handleToggleDivision}
              onToggleRole={handleToggleRole}
              onDeleteDivision={handleDeleteDivision}
              isDisabled={action === 'detail' || action === 'detail-from-approval' || flow === 'waiting-approval'}
              divisionOptions={divisionOptions}
            />
          </Box>
        ) : (
          <Box sx={{ my: 10 }}>
            <EmptyPlaceholder status="data" />
          </Box>
        )}
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
              disabled={!isFormComplete || selectedDivisionsWithRoles.length === 0
          || !followUpContainer || (isFooterEmpty && !hasFooter) || isAutoSaveFetching}
              onClick={() => handleSaveReminder(methods.getValues())}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
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
              disabled={!isFormComplete || selectedDivisionsWithRoles.length === 0
                || !followUpContainer || (isFooterEmpty && !hasFooter)}
              onClick={() => handleSaveReminder(methods.getValues(), (flow !== 'return-maker' && flow !== 'maintenance-data'))} // kembali ke listpage jika tamplate
            >
              Save
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
                  selectedDivisionsWithRoles.length === 0 ||
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
