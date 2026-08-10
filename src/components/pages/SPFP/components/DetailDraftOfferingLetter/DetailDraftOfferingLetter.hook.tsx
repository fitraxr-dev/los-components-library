'use client';
import { useContext, useEffect, useState } from 'react';


import { DirtyContext } from '@/contexts/DirtyContext';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import useGetDetailOfferingLetter from '../../UploadOfferingLetterPage/hooks/useGetDetailOfferingLetter';

import { formData } from './DetailDraftOfferingLetter.form';
import useSaveResponsOfferingLetter from './hooks/useSaveResponOfferingLetter';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


export const useDetailDraftOfferingLetter = (props: any) => {
  const { setDirtyMsg } = useContext(DirtyContext);
  const bucket = useSpfpBucketContext();
  const { processId } = useIdentity();
  const [noteContainer, setNoteContainer] = useState<DocumentEditorContainerComponent>(null);
  const [noteReviewerContainer, setNoteReviewerContainer] = useState<DocumentEditorContainerComponent>(null);
  const [valueStatus, setValueStatus] = useState<string | null>(null);
  const router = useCustomRouter();

  const {
    masintonForm,
    masintonMultiChange,
    masintonChange,
    masintonMagic,
    masintonWatch,
  } = useMasintonForm(formData);

  const {
    noDraft: { value: noDraft },
    fileName: { value: fileName },
    file: { value: file },
  } = masintonForm;

  const { data: offeringLetterData, isLoading: offeringLetterLoading } = useGetDetailOfferingLetter({
    noDraft: props.params?.noDraft,
    ...bucket,
  });

  const handleBack = () => {
    router.back();
  };

  const { mutate: saveResponOfferingLetter, isPending: isSaveLoading } = useSaveResponsOfferingLetter({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon di coba kembali',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose: () => { handleBack(); },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  useEffect(() => {
    const {
      noDraft,
      file, fileName,
    } = offeringLetterData || {};

    if (offeringLetterData) {
      const newData = structuredClone(offeringLetterData);
      if (offeringLetterData.status !== 'COMPLY') {
        newData.noDraft = '-';
      }
      const data = Object.assign(newData,
        {
          file: file ? {
            extension: ' ',
            name: fileName,
            url: file,
          } : null,
        });
      masintonMagic(data ?? {});

      setValueStatus(
        (offeringLetterData?.status && offeringLetterData.status !== 'null')
          ? offeringLetterData.status
          : null
      );
    }

  }, [offeringLetterData]);

  const handleOnSave = (data) => {
    saveResponOfferingLetter({
      bucketProcessId: processId as string,
      draftParent: offeringLetterData.draftParent,
      file: undefined, // Convert null to undefined
      module: bucket.module,
      nameOL: offeringLetterData.nameOL || undefined, // Convert null to undefined
      noDraft: offeringLetterData.noDraft,
      note: data.blob[1],
      noteReviewer: data.blob[0],
      process: bucket.process,
      status: valueStatus,
    });
  };

  const handleSaveDPOP = (data) => {
    saveResponOfferingLetter({
      bucketProcessId: processId as string,
      draftParent: offeringLetterData.draftParent,
      file: undefined, // Convert null to undefined
      module: bucket.module,
      nameOL: offeringLetterData.nameOL || undefined, // Convert null to undefined
      noDraft: offeringLetterData.noDraft,
      note: data.blob[1] ? data.blob[1] : undefined,
      noteReviewer: data.blob[0],
      process: bucket.process,
      status: valueStatus,
    });
  };

  const statusDropdownList = [
    { label: 'Comply', value: 'COMPLY' },
    { label: 'Not Comply', value: 'NOT_COMPLY' },
  ];

  function handleCancel() {
    router.back();
  };

  const onChangeStatus = (value: string) => {
    setValueStatus(value);
  };

  return {
    handleCancel,
    handleOnSave,
    handleSaveDPOP,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    masintonWatch,
    noteContainer,
    noteReviewerContainer,
    offeringLetterData,
    offeringLetterLoading,
    onChangeStatus,
    setNoteContainer,
    setNoteReviewerContainer,
    statusDropdownList,
    valueStatus,
  };
};
