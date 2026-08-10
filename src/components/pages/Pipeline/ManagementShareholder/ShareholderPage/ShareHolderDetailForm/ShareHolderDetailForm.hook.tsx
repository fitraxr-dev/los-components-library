import { useEffect, useMemo } from 'react';

import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import useGetShareholderById from '../../hooks/useGetShareholderById';
import useSaveShareholder from '../../hooks/useSaveShareholder';


const useShareHolderDetailForm = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { recordActivity } = useRecordLog();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { id } = useParams();
  const { debtorId } = useIdentity();
  const { processId } = useIdentity();

  const { control, handleSubmit, watch, setValue, getValues } = useForm({
    mode: 'onChange',
  });

  const isDetailPage = !pathname.includes('add') && !pathname.includes('edit');

  const pageBreadCrumb = useMemo(() => {
    if (pathname.includes('add')) return ({ label: 'Add Shareholder', url: '' });
    if (pathname.includes('edit')) return ({ label: 'Edit Shareholder', url: '' });
    return ({ label: 'Detail Shareholder', url: '' });
  }, []);


  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: '' },
      { label: 'Shareholder', url: `/maintenance-data/maintenance-debtor/maintenance/${processId}/management-shareholder/shareholder` },
      pageBreadCrumb
    ]);
  }, []);

  const { data: shareholderData } = useGetShareholderById({ id: Number(id) });

  // Record activity when shareholder detail is loaded
  useEffect(() => {
    if (shareholderData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view shareholder detail form',
      });
    }
  }, [shareholderData, processId, recordActivity]);

  const { isPending: isSaveLoading, mutate } = useSaveShareholder({
    onError: () => showNiceModalV2({ title: 'Gagal Menambahkan Shareholder', type: 'error' }),
    onSuccess: () => {
      showNiceModalV2({ onClose: () => {router.back();}, title: 'Berhasil Menambahkan Shareholder', type: 'success' });
    },
  });

  useEffect(() => {
    if (shareholderData) {
      Object.entries(shareholderData).forEach(([key, value]) => {
        setValue(key, value);
      });
      if (shareholderData.listDocuments.length > 0) {
        const npwpDoc = shareholderData.listDocuments?.find((item) => item.documentType === 'NPWP_SHAREHOLDER');
        const nikDoc = shareholderData.listDocuments?.find((item) => item.documentType === 'NIK_SHAREHOLDER');
        const deedofIncorporationDoc = shareholderData.listDocuments?.find((item) => item.documentType === 'DEED_OF_INCORPORATION_SHAREHOLDER');
        const applicationLetterDoc = shareholderData.listDocuments?.find((item) => item.documentType === 'APPLICATION_LETTER_SHAREHOLDER');
        const latestManagementDoc = shareholderData.listDocuments?.find((item) => item.documentType === 'LATEST_MANAGEMENT_SHAREHOLDER');

        const npwpFile = npwpDoc ? {
          extension: npwpDoc.documentExtension ? `.${npwpDoc.documentExtension}` : null,
          name: npwpDoc.documentName,
          url: npwpDoc.document,
        } : null;

        const ktpFile = nikDoc ? {
          extension: nikDoc.documentExtension ? `.${nikDoc.documentExtension}` : null,
          name: nikDoc.documentName,
          url: nikDoc.document,
        } : null;

        const deedofIncorporationFile = deedofIncorporationDoc ? {
          extension: deedofIncorporationDoc.documentExtension ? `.${deedofIncorporationDoc.documentExtension}` : null,
          name: deedofIncorporationDoc.documentName,
          url: deedofIncorporationDoc.document,
        } : null;

        const applicationLetterFile = applicationLetterDoc ? {
          extension: applicationLetterDoc.documentExtension ? `.${applicationLetterDoc.documentExtension}` : null,
          name: applicationLetterDoc.documentName,
          url: applicationLetterDoc.document,
        } : null;

        const latestManagementFile = latestManagementDoc ? {
          extension: latestManagementDoc.documentExtension ? `.${latestManagementDoc.documentExtension}` : null,
          name: latestManagementDoc.documentName,
          url: latestManagementDoc.document,
        } : null;
        setValue('npwpFile', npwpFile);
        setValue('ktpFile', ktpFile);
        setValue('deedofIncorporationUpload', deedofIncorporationFile);
        setValue('applicationLetterUpload', applicationLetterFile);
        setValue('latestManagementDocumentUpload', latestManagementFile);

      }
    }
  }, [shareholderData]);


  const handleSave = () => {
    const isEdit = pathname.includes('edit');
    const formValues = getValues();
    const payload = {
      ...formValues,
      debtorId,
      percentage: Number(formValues?.percentage),
    };

    recordActivity({
      activity: isEdit ? ActivityType.EDIT : ActivityType.ADD,
      bucketProcessId: processId || '',
      changeAfter: JSON.stringify(payload),
      changeBefore: isEdit ? JSON.stringify(shareholderData) : '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: `${isEdit ? 'edit' : 'add'} shareholder`,
    });

    mutate(payload);
  };


  return {
    control,
    handleSave,
    isDetailPage,
    pageBreadCrumb,
    router,
  };
};

export default useShareHolderDetailForm;
