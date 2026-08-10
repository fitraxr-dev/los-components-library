'use client';
import { useEffect, useState } from 'react';

import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';

import { maintenanceReminder } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { matchesPathname, replacePath } from '@/helpers/navigation';
import useGetCutOffMessage from '@/hooks/services/parameter/useGetCutOffMessage';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetDetailMaintenanceReminderBucket from '@/components/pages/MaintenanceData/MaintenanceReminder/DetailPage/hooks/useGetDetailMaintenanceReminderBucket';
import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import Title from '@/components/shared/Title';

import useGetDetailMaintenanceReminder from '../../pages/MaintenanceData/MaintenanceReminder/DetailPage/hooks/useGetDetailMaintenanceReminder';

import BreadCrumb from './BreadCrumb';
import CustomStepper from './components/CustomStepper/CustomStepper';
import TableInformation from './components/TableInformation';
import { WarningBox } from './components/WarningBox/WarningBox';
import { MaintenanceReminderProvider } from './MaintenanceReminder.context';
import useMaintenanceReminder from './MaintenanceReminder.hook';


const MaintenanceReminderLayout = ({ children }) => {
  const path = usePathname();
  const router = useCustomRouter();
  const isDetailInformationLPA = path.includes('detail');
  const pathArray = path.split('/');
  const lpaType = pathArray[3];
  const moduleIndex = pathArray[4];

  const searchParams = useSearchParams();
  const params = useParams();
  const action = searchParams.get('action');
  const flow = searchParams.get('flow');
  const id = params?.id?.toString() ?? '';
  const isValidation = path.includes('validation');

  // fetch detail
  const bucketResult = useGetDetailMaintenanceReminderBucket({ id });
  const normalResult = useGetDetailMaintenanceReminder({ id });

  const { data, isLoading, isError } = action === 'edit' || action === 'detail-from-approval' ? bucketResult : normalResult;

  // fetch cut off
  const cutOffText = useGetCutOffMessage();
  const { redirectToFromPage } = useNavigationFromPage();
  // value form
  const methods = useForm({
    defaultValues: {
      tableGroup: {
        isActive: '',
        isActiveReminder: false,
        templateType: '',
      },
    },
  });

  useEffect(() => {
    if (data?.content) {
      methods.reset({
        tableGroup: {
          isActive: data.content.isActive ? 'Active' : 'Non Active',
          isActiveReminder: data.content.isActive ?? false,
          templateType: data.content.templateType ?? '',
        },
      });
    }
  }, [data?.content, methods]);

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const isActiveReminder = values.tableGroup?.isActiveReminder;
      const currentActive = values.tableGroup?.isActive;
      const newActive = isActiveReminder ? 'Active' : 'Non Active';

      // Hanya update kalau memang beda
      if (currentActive !== newActive) {
        methods.setValue('tableGroup.isActive', newActive, {
          shouldDirty: true,
          shouldValidate: false,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [methods]);


  const [activeTab, setActiveTab] = useState('maintenance-reminder');

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

  const [value, setValue] = useSessionStorage('maintenance-data', null);

  function handleBack() {
    if (redirectToFromPage()) return;
    if (isDetailInformationLPA) {
      router.back();
    }
    else if (value === null) {
      router.push(replacePath('/maintenance-data/maintenance-reminder', {
        lpa: lpaType,
        module: moduleIndex,
      }));
    }
    else {
      router.push(value);
    }
    setValue(null);
  };

  const {
    renderDetailLayout, isSubmission, isEdit, isRM, isTL,
  } = useMaintenanceReminder();

  const listMatch = [
    maintenanceReminder.LIST_PAGE,
  ];

  return (
    <MaintenanceReminderProvider>
      <BreadCrumb />
      {listMatch.includes(path) ? null : <BackButton handleClick={handleBack} />}
      <BaseContainer sx={{ gap: 2 }}>
        {renderDetailLayout && (
          <>
            {(action === 'edit' || action === 'detail-from-approval' || isValidation) && (
              <>
                <CustomStepper
                  process={TypeProcess.MAINTENANCE_REMINDER}
                  module={TypeModule.MAINTENANCE_REMINDER}
                  id={id}
                  action={action}
                  flow={flow}
                />
              </>
            )}

            {(!isValidation) && (
              <>
                <Title title="Maintenance Template Reminder" />

                {action !== 'detail' && (
                  <WarningBox text={cutOffText.data} />
                )}

                <FormProvider {...methods}>
                  <TableInformation action={action} />
                </FormProvider>
              </>
            )}
          </>
        )}

        {children}

      </BaseContainer>
    </MaintenanceReminderProvider>
  );
};

export default MaintenanceReminderLayout;
