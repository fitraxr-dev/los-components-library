'use client';
import { useEffect, useState } from 'react';

import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';

import { maintenanceNotification } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { matchesPathname, replacePath } from '@/helpers/navigation';
import useGetCutOffMessage from '@/hooks/services/parameter/useGetCutOffMessage';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetDetailMaintenanceNotificationBucket from '@/components/pages/MaintenanceData/MaintenanceNotification/DetailPage/hooks/useGetDetailMaintenanceNotificationBucket';
import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import Title from '@/components/shared/Title';

import useGetDetailMaintenanceNotification from '../../pages/MaintenanceData/MaintenanceNotification/DetailPage/hooks/useGetDetailMaintenanceNotification';

import BreadCrumb from './BreadCrumb';
import CustomStepper from './components/CustomStepper/CustomStepper';
import TableInformation from './components/TableInformation';
import { WarningBox } from './components/WarningBox/WarningBox';
import { MaintenanceNotificationProvider } from './MaintenanceNotification.context';
import useMaintenanceNotification from './MaintenanceNotification.hook';


const MaintenanceNotificationLayout = ({ children }) => {
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
  const bucketResult = useGetDetailMaintenanceNotificationBucket({ id });
  const normalResult = useGetDetailMaintenanceNotification({ id });

  const { data, isLoading, isError } = action === 'detail-from-approval' || action === 'edit' ? bucketResult : normalResult;

  // fetch cut off
  const cutOffText = useGetCutOffMessage();
  const { redirectToFromPage } = useNavigationFromPage();
  // value form
  const methods = useForm({
    defaultValues: {
      tableGroup: {
        isActive: '',
        isActiveNotification: false,
        media: [],
        templateType: '',
      },
    },
  });

  useEffect(() => {
    if (data?.content) {
      const mediaInitial = [
        data.content.isSendEmail ? 'email' : null,
        data.content.isSendLos ? 'los' : null,
      ].filter(Boolean) as ('email' | 'los')[];

      methods.reset({
        tableGroup: {
          isActive: data.content.isActive ? 'Active' : 'Non Active',
          isActiveNotification: data.content.isActive ?? false,
          media: mediaInitial,
          templateType: data.content.templateType ?? '',
        },
      });

    }
  }, [data?.content, methods]);

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const isActiveNotification = values.tableGroup?.isActiveNotification;
      const currentActive = values.tableGroup?.isActive;
      const newActive = isActiveNotification ? 'Active' : 'Non Active';

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


  const [activeTab, setActiveTab] = useState('maintenance-notification');

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
      router.push(replacePath('/maintenance-data/maintenance-notification', {
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
  } = useMaintenanceNotification();

  const listMatch = [
    maintenanceNotification.LIST_PAGE,
  ];

  return (
    <MaintenanceNotificationProvider>
      <BreadCrumb />
      {listMatch.includes(path) ? null : <BackButton handleClick={handleBack} />}
      <BaseContainer sx={{ gap: 2 }}>
        {renderDetailLayout && (
          <>
            {(action === 'edit' || action === 'detail-from-approval' || isValidation) && (
              <>
                <CustomStepper
                  process={TypeProcess.MAINTENANCE_NOTIFICATION}
                  module={TypeModule.MAINTENANCE_NOTIFICATION}
                  id={id}
                  action={action}
                  flow={flow}
                />
              </>
            )}

            {(!isValidation) && (
              <>
                <Title title="Maintenance Template Notification" />

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
    </MaintenanceNotificationProvider>
  );
};

export default MaintenanceNotificationLayout;
