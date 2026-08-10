'use client';
import { useCallback, useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import useGetDetailComplianceCheckChild from '../ComplianceCheckPage/hooks/useGetDetailComplianceCheckChild';
import useSaveComplianceCheck from '../ComplianceCheckPage/hooks/useSaveComplianceCheck';


export type EditingMode = 'edit' | 'create';

export const useNoteComplianceCheck = () => {
  const bucket = useSpfpBucketContext();
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { recordActivity } = useRecordLog();
  const path = useParams<{ processId: string; complianceNumber: string }>();
  const router = useCustomRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<EditingMode>('edit');
  const pathname = usePathname().split('/');
  const isComplianceCheck = pathname[5] === 'compliance-check';
  const [formData, setFormData] = useState({
    catatan: undefined,
    status: undefined,
  });
  const [container, setContainer] = useState(null);
  const [isContentEmpty, setIsContentEmpty] = useState(true);
  const { control, handleSubmit, formState, watch, setValue } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    const mode = searchParams?.get('mode');
    switch (mode) {
      case 'edit':
        setMode('edit');
        break;
      case 'create':
        setMode('create');
        break;
      default:
        setMode('edit');
        break;
    }
  }, [searchParams]);

  const { data: dataDetail, isFetching: isDetailLoading } = useGetDetailComplianceCheckChild({
    complianceNumber: path.complianceNumber,
    ...bucket,
  });

  useEffect(() => {
    if (dataDetail && !isDetailLoading) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `view note compliance check detail: ${path.complianceNumber} (mode: ${mode})`,
      });
    }
  }, [dataDetail, isDetailLoading, bucket, path.complianceNumber, mode, recordActivity]);

  const { mutate, isPending: isSaveLoading } = useSaveComplianceCheck({
    onError: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `failed to save note compliance check: ${path.complianceNumber}`,
      });
    },
    onSuccess: () => {
      // changeAfter dan changeBefore sudah direcord di handleOnSave
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: bucket?.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        module: bucket?.module || '',
        process: bucket?.process || '',
        remarks: `successfully saved note compliance check: ${path.complianceNumber} (mode: ${mode})`,
      });
      setDirtyMsg(undefined);
      NiceModal.show(MODAL.GLOBAL.SUCCESS, {
        onClose: () => router.back(),
        title: 'Data berhasil di simpan',
      });
    },
  });

  useEffect(() => {
    if (dataDetail) {
      if (mode === 'edit') {
        setValue('status', dataDetail.open ? 1 : 2);
        setValue('catatan', dataDetail.complianceTitle);
        setFormData({
          catatan: dataDetail.complianceTitle,
          status: dataDetail.open ? 1 : 2,
        });
      }
    }
  }, [dataDetail]);

  useEffect(() => {
    if (formState.isSubmitted) {
      // Reset dirty message on form submit
      setDirtyMsg(undefined);
    } else {
      setDirtyMsg(JSON.stringify(watch()) === JSON.stringify(formData)
        ? undefined
        : 'Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    }
  }, [formState.isSubmitted, watch(), formData]);

  const handleBack = useCallback(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `back from note compliance check: ${path.complianceNumber}`,
    });
    router.back();
  }, [router, bucket, path.complianceNumber, recordActivity]);

  const handleOnSave = (data) => {
    const payload = {
      comment: data.blob[0],
      complianceNumber: mode === 'edit' ? path.complianceNumber : null,
      complianceParent: mode === 'edit' ? dataDetail.complianceParent : path.complianceNumber,
      complianceTitle: data.form.catatan,
      isOpen: data.form.status === 1 ? true : false,
      note: data.blob[1] ? data.blob[1] : undefined,
      ...bucket,
    };
    // Record activity before save
    recordActivity({
      activity: ActivityType.SAVE,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: JSON.stringify(payload),
      changeBefore: mode === 'edit' ? JSON.stringify(dataDetail) : '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `initiate save note compliance check: ${path.complianceNumber} (mode: ${mode})`,
    });
    mutate(payload);
  };

  const handleContentChange = useCallback((e: any) => {
    if (e.source.documentEditor) {
      const isEmpty = e.source.documentEditor.isDocumentEmpty;
      setIsContentEmpty(isEmpty);

    }
  }, [setDirtyMsg]);

  useEffect(() => {
    if (container && container.documentEditor) {
      const checkInitialContent = () => {
        const isEmpty = container.documentEditor.isDocumentEmpty;
        setIsContentEmpty(isEmpty);
      };

      checkInitialContent();

      setTimeout(checkInitialContent, 500);
    }
  }, [container]);

  return {
    container,
    control,
    dataDetail,
    formState,
    handleBack,
    handleContentChange,
    handleOnSave,
    handleSubmit,
    isComplianceCheck,
    isContentEmpty,
    isDetailLoading,
    isSaveLoading,
    mode,
    setContainer,
    watch,
  };
};
