import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import {
  BUSINESS_DIVISION,
  roles,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { engagementSubmission } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';
import useViewOnly from '@/hooks/useViewOnly';
import { DocumentCreationRequestDtoDocumentCategoryEnum } from '@/services/openapi/agreement-service';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


import useConfirmDocument from '../../hooks/useConfirmDocument';
import useDeleteDocument from '../../hooks/useDeleteDocument';
import useGetDetailProcessingType from '../../hooks/useGetDetailProcessingType';
import useGetDocumentGroup from '../../hooks/useGetDocumentGroup';
import useSaveProcessingType from '../../hooks/useSaveProcessingType';
import { MODALPK } from '../../PK.constants';

import { formData, validation } from './PkProcessingType.form';

import type { PkProcessingTypeProps } from '../../PK.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const usePkProcessingType = ({
  module,
  process,
  handleNextTab,
  isAskForInfo,
  isLegalSigning,
}: PkProcessingTypeProps) => {
  const router = useCustomRouter();
  const { childId, parentId, processId } = useIdentity();
  const queryClient = useQueryClient();
  const [appState] = useApp();
  const currentStepper = appState?.stepper?.from;
  const [selected, setSelected] = useState([]);
  const { viewOnly, setViewOnly } = useViewOnly();
  const isStaff = appState?.currentRole?.includes(roles.RM);
  const isMaker = appState?.currentRole?.includes(roles.MAKER);
  const { divisionCode } = useDivision();
  const divisiBisnisArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION
  ];
  const isDivisiBisnis = divisiBisnisArray.includes(divisionCode);
  // di gunakan untuk viewOnly LpsCore
  const isLpsCore = process === TypeProcess.LPS_CORE;


  const formatTableActionEfektif = () => {
    let actionTable = [];
    if (isLegalSigning) {
      actionTable = [
        {
          iconName: 'detail',
          onClick: (data) => {
            openModalEdit('Detail Document Syarat Efektif', data?.id, true);
          },
        },
        {
          iconName: 'preview-document', onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          onClick: (data) => {
            downloadFile(data.document, data.fileName?.split('.')[0]);
          },
        }];
    } else {
      actionTable = [
        {
          iconName: 'edit',
          isDisabled: viewOnly,
          onClick: (data) => {
            openModalEdit('Edit Document Syarat Efektif', data?.id);
          },
        },
        {
          iconName: 'delete',
          isDisabled: viewOnly,
          onClick: (data) => handleDelete(data?.id),
        },
        {
          iconName: 'preview-document', onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          onClick: (data) => {
            downloadFile(data.document, data.fileName?.split('.')[0]);
          },
        },
      ];
    }
    return actionTable;
  };


  const formatTableActionPenandatanganan = () => {
    let actionTable = [];
    if (isLegalSigning || viewOnly) {
      actionTable = [
        {
          iconName: 'detail',
          onClick: (data) => {
            openModalEdit('Detail Document Syarat Penandatanganan ', data?.id, true);
          },
        },
        {
          iconName: 'preview-document', onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          onClick: (data) => {
            downloadFile(data.document, data.fileName?.split('.')[0]);
          },
        },
      ];
    } else {
      actionTable = [
        {
          iconName: 'edit',
          onClick: (data) => {
            openModalEdit('Edit Document Syarat Penandatanganan ', data?.id);
          },
        },
        {
          iconName: 'delete',
          onClick: (data) => handleDelete(data?.id),
        },
        {
          iconName: 'preview-document', onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          onClick: (data) => {
            downloadFile(data.document, data.fileName?.split('.')[0]);
          },
        },
      ];
    }
    return actionTable;
  };


  const {
    masintonForm,
    masintonChange,
    masintonValidation,
    masintonReplace,
  } = useMasintonForm(formData, validation);
  const [childPkProcessId, setPkChildProcessId] = useState('');

  /** Start get parameter options */
  const { data: descriptionList } = useGetParameterList('descriptionPKProcessingType');

  const { data: dataCommercialDescriptionList } = useGetParameterList('komersialDescriptionPKProcessingType');

  const commercialDescriptionList = [
    ...(dataCommercialDescriptionList || []),
    { label: 'Other', value: 'OTHER' },
  ];

  const { data: legalStatusListData } = useGetParameterList('legalProcessStatusRequirement');

  // FE handle re order so OTHER option always on the bottom
  const legalStatusList = legalStatusListData
    ? [
      ...legalStatusListData.filter((item) => item.value !== 'OTHER'),
      ...legalStatusListData.filter((item) => item.value === 'OTHER')
    ]
    : [];

  /** End get parameter options */
  const idPath = Number(usePathname().split('/')[6]);
  const todayDate = formatDate(new Date(), 'DD MMMM YYYY');

  /** Get PKPT Detail */
  const payload = isLpsCore
    ? { bucketProcessId: parentId, id: 0 }
    : { bucketProcessId: null, id: idPath };

  const {
    data: pkDetail,
    isSuccess,
  } = useGetDetailProcessingType(
    payload
  );

  const {
    data: conditionEffectiveList,
    isLoading: isEffectiveLoading,
    isSuccess: isSuccesEffective,
  } = useGetDocumentGroup({
    bucketProcessId: isLpsCore ? String(parentId) : String(childId),
    documentCategory: DocumentCreationRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT,
    documentParent: DocumentTypeRequestDtoDocumentParentEnum.PKPTEFFECTIVECONDITIONS,
    module: isLpsCore ? TypeModule.ENGAGEMENT_AGREEMENT : module,
    ownerId: null,
    ownership: null,
    process: isLpsCore ? TypeProcess.PROCESSING_TYPE_PK : process,
  });

  const {
    data: conditionSigningList,
    isLoading: isSigningLoading,
    isSuccess: isSuccesSigning,
  } = useGetDocumentGroup({
    bucketProcessId: isLpsCore ? String(parentId) : String(childId),
    documentCategory: DocumentCreationRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT,
    documentParent: DocumentTypeRequestDtoDocumentParentEnum.PKPTSIGNINGCONDITIONS,
    module: isLpsCore ? TypeModule.ENGAGEMENT_AGREEMENT : module,
    ownerId: null,
    ownership: null,
    process: isLpsCore ? TypeProcess.PROCESSING_TYPE_PK : process,
  });

  const [saveCallback, setSaveCallback] = useState<(() => void) | null>(null);

  const {
    isPending: isSaveLoading,
    mutate: saveProcessingType,
  } = useSaveProcessingType({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validate-result-debtor']});
      queryClient.invalidateQueries({ queryKey: ['detail-pk-processing-type-report', idPath]});
      queryClient.invalidateQueries({
        queryKey: ['bucket-stepper', {
          bucketProcessId: childId,
          module: TypeModule.ENGAGEMENT_AGREEMENT,
          process: TypeProcess.PROCESSING_TYPE_PK,
        }],
      });

      if (saveCallback) {
        showNiceModalV2(
          {
            onClose: () => {
              saveCallback();
              setSaveCallback(null);
            },
            type: 'success',
          }
        );
      } else {
        showNiceModalV2(
          {
            onClose: () => isAskForInfo ? null : handleBack(),
            type: 'success',
          }
        );
      }
    },
  });

  const {
    mutate: deleteDocument,
  } = useDeleteDocument({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' }),
    onSuccess: () => {
      showNiceModalV2({ type: 'success' });
    },
  });

  const {
    mutate: confirmDocument,
  } = useConfirmDocument({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' }),
    onSuccess: (data) => {
      onSuccessSelected(data?.data);
      showNiceModalV2({ type: 'success' });
    },
  });
  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        showNiceModalV2({ onClose: () => handleBack(), title: 'Data berhasil disimpan', type: 'success' });
        localStorage.removeItem('askForInfoEditPk');
        queryClient.invalidateQueries({ queryKey: ['validate-result-debtor']});
        queryClient.invalidateQueries({ queryKey: ['detail-pk-processing-type-report', idPath]});
        queryClient.invalidateQueries({
          queryKey: ['bucket-stepper', {
            bucketProcessId: childId,
            module: TypeModule.ENGAGEMENT_AGREEMENT,
            process: TypeProcess.PROCESSING_TYPE_PK,
          }],
        });

      },
    }
  );
  const signingList = conditionSigningList?.map((item) => ({
    ...item,
    description: item?.description ?? '-',
  })) || [];
  const effectiveList = conditionEffectiveList?.map((item) => ({
    ...item,
    description: item?.description ?? '-',
  })) || [];

  const {
    pkDate: { value: pkDate },
    description: { value: description },
    descriptionInformation: { value: descriptionInformation },
    effectiveDate: { value: effectiveDate },
    effectiveConditions: { value: effectiveConditions },
    pkNumber: { value: pkNumber },
    nonCommercialDescription: { value: nonCommercialDescription },
    pkName: { value: pkName },
    signingConditions: { value: signingConditions },
    commercialDescription: { value: commercialDescription },
    legalProcessStatusRequirement: { value: legalProcessStatusRequirement },
    otherLegalProcessStatusRequirement: { value: otherLegalProcessStatusRequirement },
    otherCommercialDescription: { value: otherCommercialDescription },
    assumptionsQualifications: { value: assumptionsQualifications },
  } = masintonForm;

  const openModalPenandatanganan = () => {
    NiceModal.show(MODALPK.MODAL_DOCUMENT_PROVISION, {
      docParent: DocumentTypeRequestDtoDocumentParentEnum.PKPTSIGNINGCONDITIONS,
      module,
      process,
      title: 'Add Document Syarat Penandatanganan',
    });
  };
  const openModalUploadEfektif = () => NiceModal.show(MODALPK.MODAL_DOCUMENT_PROVISION, {
    docParent: DocumentTypeRequestDtoDocumentParentEnum.PKPTEFFECTIVECONDITIONS,
    module,
    process,
    title: ' Add Document Syarat Efektif',
  });

  const openModalEdit = (title: string, id: number, isDetailDisabled?: boolean) =>
    NiceModal.show(MODALPK.MODAL_DOCUMENT_PROVISION, {
      id,
      isDetailDisabled,
      module,
      process,
      title: title,
    });

  const handleDelete = (id: number) => {
    NiceModal.show(
      MODAL.GLOBAL.CONFIRM,
      {
        onSubmit: () => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload = {
            id: id,
          };
          deleteDocument(payload);
        },
        title: 'Apakah anda yakin untuk menghapus data?',
      },
    );
  };


  const onSuccessSelected = (data) => {
    if (selected.some((el) => el.id === data.id)) {
      setSelected(selected.filter((el) => el.id !== data.id));
    } else {
      setSelected([...selected, data]);
    }
  };

  const handleConfirm = (id: number) => {
    confirmDocument({
      id: id,
    });
  };

  const [hasOther, setHasOther] = useState(false);
  useEffect(() => {
    if (Array.isArray(commercialDescription)) {
      const foundOther = commercialDescription?.some(
        (item) => item && item.includes('OTHER')
      );
      setHasOther(foundOther);
    }
  }, [commercialDescription]);


  const handleBack = () => {
    if (isLegalSigning) {
      return handleNextTab();
    }
    return router.back();
  };


  useEffect(() => {
    if (isSuccesEffective && isSuccesSigning) {
      const tempArray = [];
      const defaultList = [...effectiveList, ...signingList];
      defaultList?.forEach((item) => {
        if (item?.isConfirm) {
          tempArray?.push(item);
        }
      });
      setSelected(tempArray);
    }

  }, [isSuccesEffective, isSuccesSigning]);


  useEffect(() => {
    if (isSuccess) {
      const newMasintonForm = structuredClone(masintonForm);
      const {
        assumptionsQualifications,
        pkNumber,
        pkName,
        description,
        commercialDescription,
        nonCommercialDescription,
        descriptionInformation,
        legalProcessStatusRequirement,
        pkDate,
        effectiveDate,
        signingConditions,
        effectiveConditions,
        bucketProcessId,
        otherLegalProcessStatusRequirement,
      } = pkDetail;

      const temp = ['BUNGA', 'AVAILABILITY_PERIOD', 'JANGKA_WAKTU', 'GRACE_PERIOD', 'FEE', 'PLAFOND', 'OTHER'];
      let dataAfterOther = null;
      if (commercialDescription.includes('OTHER')) {
        dataAfterOther = commercialDescription.find((item) => !temp.includes(item)) || null;
      }
      const formatCommercialDescription = commercialDescription?.filter((res) => temp.includes(res)) || [];
      const formFields = {
        assumptionsQualifications,
        commercialDescription: formatCommercialDescription,
        description,
        descriptionInformation,
        effectiveConditions,
        effectiveDate,
        legalProcessStatusRequirement,
        nonCommercialDescription,
        otherCommercialDescription: dataAfterOther,
        otherLegalProcessStatusRequirement,
        pkDate,
        pkName,
        pkNumber,
        signingConditions,
      };

      Object.keys(formFields).forEach((key) => {
        if (newMasintonForm[key]) {
          newMasintonForm[key].value = formFields[key] !== null ? formFields[key] : '';
          newMasintonForm[key].error = false;
          newMasintonForm[key].errorMessage = '';
        }
      });

      setPkChildProcessId(bucketProcessId);
      masintonReplace(newMasintonForm);
    }
  }, [isSuccess]);


  const tableHeaderSignin: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '10vw' },
      type: 'index',
    },
    {
      key: 'description',
      label: 'Deskripsi',
      sx: { width: '10vw' },
    },
    {
      key: 'fileName',
      label: 'Nama Dokumen',
      sx: { width: '40vw' },
    },
    ,
    // {
    //   isDisabled: () => false || viewOnly,
    //   isSelected: (data) => selected.some((el) => el.id === data.id),
    //   key: 'isConfirm',
    //   label: 'Confirm',
    //   onSelectChange: (data) => handleConfirm(data?.id),
    //   sx: { minWidth: '10vw' },
    //   type: 'checkbox',
    // },
    {
      key: 'action',
      label: 'Action',
      options: formatTableActionPenandatanganan(),
      sx: {
        width: '8vw',
      },
      type: 'action',
    }
  ];

  const tableHeaderEffective: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '10vw' },
      type: 'index',
    },
    {
      key: 'description',
      label: 'Deskripsi',
      sx: { width: '10vw' },
    },
    {
      key: 'fileName',
      label: 'Nama Dokumen',
      sx: { width: '40vw' },
    },
    // {
    //   isDisabled: () => false || viewOnly,
    //   isSelected: (data) => selected.some((el) => el.id === data.id),
    //   key: 'isConfirm',
    //   label: 'Confirm',
    //   onSelectChange: (data) => handleConfirm(data?.id),
    //   sx: { width: '10vw' },
    //   type: 'checkbox',
    // },

    {
      key: 'action',
      label: 'Action',
      options: formatTableActionEfektif(),
      sx: {
        width: '12vw',
      },
      type: 'action',
    },
  ];

  const getIgnoreValidation = (
    description,
    legalProcessStatusRequirement,
    isLegalSigning,
    effectiveConditions
  ) => {
    const ignoreValidation = [];
    if (description === 'KOMERSIAL') {
      ignoreValidation.push('nonCommercialDescription');
    }
    if (description === 'NON_KOMERSIAL') {
      ignoreValidation.push('commercialDescription');
    }
    if (legalProcessStatusRequirement !== 'OTHER') {
      ignoreValidation.push('otherLegalProcessStatusRequirement');
    }
    if (legalProcessStatusRequirement && (legalProcessStatusRequirement.startsWith('AWAITING_') || legalProcessStatusRequirement === 'WAITING_BUSINESS_TEAM')) {
      ignoreValidation.push('effectiveDate');
    }
    if (!isLegalSigning) {
      ignoreValidation.push(
        'pkName',
        'pkNumber',
        'effectiveDate',
        'pkDate',
        'legalProcessStatusRequirement',
        'effectiveConditions'
      );
    }
    if (isLegalSigning) {
      if (effectiveConditions === 'false') {
        ignoreValidation.push(
          'effectiveDate',
          'effectiveConditions'
        );
      }
      ignoreValidation.push(
        'description',
        'pkName',
        'descriptionInformation',
        'commercialDescription',
        'nonCommercialDescription',
        'signingConditions'
      );
    }

    return ignoreValidation;
  };

  const autoSavePayload = useMemo(() => () => {
    const formValues = Object.fromEntries(
      Object.entries(masintonForm).map(([key, obj]: [string, any]) => [key, obj.value])
    );
    let otherPayload = hasOther ? `,${otherCommercialDescription}` : '';
    const isCommercial = description === 'KOMERSIAL';
    let updatedDescription = commercialDescription;

    if (!hasOther) {
      const lovCommercialList = commercialDescriptionList.map((item) => item.value);
      updatedDescription = commercialDescription.filter((item) => lovCommercialList.includes(item));
    }

    const payload = {
      agreementType: null,
      assumptionsQualifications: formValues.assumptionsQualifications,
      bucketParentId: processId,
      bucketProcessId: childPkProcessId,
      commercialDescription: isCommercial ? `${updatedDescription.toString()}${otherPayload}` : null,
      debtorCode: null,
      description: formValues.description,
      descriptionInformation: formValues.descriptionInformation,
      effectiveConditions: formValues.effectiveConditions,
      effectiveDate: formValues.effectiveDate,
      id: idPath,
      isDeleted: null,
      legalProcessStatusRequirement: formValues.legalProcessStatusRequirement,
      mapping: null,
      module: TypeProcess.ENGAGEMENT_AGREEMENT,
      nonCommercialDescription: !isCommercial ? formValues.nonCommercialDescription : null,
      otherLegalProcessStatusRequirement: formValues.otherLegalProcessStatusRequirement,
      pkDate: formValues.pkDate,
      pkName: formValues.pkName,
      pkNumber: formValues.pkNumber,
      process: TypeProcess.PROCESSING_TYPE_PK,
      processingTypeId: null,
      signingConditions: formValues.signingConditions,
      status: null,
    };

    return Promise.resolve(payload);
  }, [masintonForm,
    hasOther,
    otherCommercialDescription,
    commercialDescription,
    commercialDescriptionList,
    processId,
    childPkProcessId,
    idPath]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'agreement.add.saveProcess',
  });

  const handleSave = () => {
    const ignoreValidation = getIgnoreValidation(
      description,
      legalProcessStatusRequirement,
      isLegalSigning,
      effectiveConditions
    );

    const isFormValid = masintonValidation({ ignoreValidation });
    if (!isFormValid) {
      return;
    }

    let otherPayload = hasOther ? `,${otherCommercialDescription}` : '';
    const isCommercial = description === 'KOMERSIAL' ? true : false;
    let updatedDescription = commercialDescription;
    if (!hasOther) {
      const lovCommercialList = commercialDescriptionList.map((item) => item.value);
      updatedDescription = commercialDescription.filter((item) => lovCommercialList.includes(item));
    }

    const payload = {
      agreementType: null,
      assumptionsQualifications,
      bucketParentId: processId,
      bucketProcessId: childPkProcessId,
      commercialDescription: isCommercial ? `${updatedDescription.toString()}${otherPayload}` : null,
      debtorCode: null,
      description: description,
      descriptionInformation: descriptionInformation,
      effectiveConditions: effectiveConditions,
      effectiveDate: effectiveDate,
      id: idPath,
      isDeleted: null,
      legalProcessStatusRequirement,
      mapping: null,
      module: TypeProcess.ENGAGEMENT_AGREEMENT,
      nonCommercialDescription: !isCommercial ? nonCommercialDescription : null,
      otherLegalProcessStatusRequirement,
      pkDate: pkDate,
      pkName: pkName,
      pkNumber: pkNumber,
      process: TypeProcess.PROCESSING_TYPE_PK,
      processingTypeId: null,
      signingConditions: signingConditions,
      status: null,
    };

    setSaveCallback(() => () => { });
    saveProcessingType(payload);
  };

  useEffect(() => {
    const ignoreValidation = getIgnoreValidation(
      description,
      legalProcessStatusRequirement,
      isLegalSigning,
      effectiveConditions
    );
    if (legalProcessStatusRequirement && (legalProcessStatusRequirement.startsWith('AWAITING_') || legalProcessStatusRequirement === 'WAITING_BUSINESS_TEAM')) {
      const newMasintonForm = structuredClone(masintonForm);
      newMasintonForm['effectiveDate'].value = '';
      masintonReplace(newMasintonForm);
    }
    masintonValidation({ ignoreValidation });
  }, [legalProcessStatusRequirement]);

  const formatTableHeader = (tableHead: TableHeader[]) => {
    const isNotPengajuanPerikatan = isLegalSigning || isLpsCore;

    return isNotPengajuanPerikatan
      ? tableHead
      : tableHead.filter((item) => item.label !== 'Confirm');
  };


  const handleEdit = () => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => { closeNiceModal(MODAL.GLOBAL.CONFIRM); },
      onSubmit: () => {
        setViewOnly(false);
        localStorage.setItem('askForInfoEditPk', 'true');
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      title: 'Data sebelumnya akan dirubah dengan Penerbitan yang baru, apakah anda yakin?',
    });
  };


  const handleSubmit = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: 'SUBMIT',
            bucketProcessId: childId,
            comment,
            module: TypeModule.ENGAGEMENT_AGREEMENT,
            process: TypeProcess.PROCESSING_TYPE_PK,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleNext = () => {
    if (viewOnly) {
      return handleNextTab();
    }

    const ignoreValidation = getIgnoreValidation(
      description,
      legalProcessStatusRequirement,
      isLegalSigning,
      effectiveConditions
    );

    const isFormValid = masintonValidation({ ignoreValidation });
    if (!isFormValid) {
      return;
    }

    let otherPayload = hasOther ? `,${otherCommercialDescription}` : '';
    const isCommercial = description === 'KOMERSIAL' ? true : false;
    let updatedDescription = commercialDescription;
    if (!hasOther) {
      const lovCommercialList = commercialDescriptionList.map((item) => item.value);
      updatedDescription = commercialDescription.filter((item) => lovCommercialList.includes(item));
    }

    const payload = {
      agreementType: null,
      assumptionsQualifications,
      bucketParentId: processId,
      bucketProcessId: childPkProcessId,
      commercialDescription: isCommercial ? `${updatedDescription.toString()}${otherPayload}` : null,
      debtorCode: null,
      description: description,
      descriptionInformation: descriptionInformation,
      effectiveConditions: effectiveConditions,
      effectiveDate: effectiveDate,
      id: idPath,
      isDeleted: null,
      legalProcessStatusRequirement,
      mapping: null,
      module: TypeProcess.ENGAGEMENT_AGREEMENT,
      nonCommercialDescription: !isCommercial ? nonCommercialDescription : null,
      otherLegalProcessStatusRequirement,
      pkDate: pkDate,
      pkName: pkName,
      pkNumber: pkNumber,
      process: TypeProcess.PROCESSING_TYPE_PK,
      processingTypeId: null,
      signingConditions: signingConditions,
      status: null,
    };

    setSaveCallback(() => handleNextTab);
    saveProcessingType(payload);
  };

  const isAwaiting = legalProcessStatusRequirement?.startsWith('AWAITING_') ||
    legalProcessStatusRequirement === 'WAITING_BUSINESS_TEAM';

  const isEffectiveDateMandatory = !isAwaiting && effectiveDate === '';

  const isCommercialDescriptionMandatory = description === 'KOMERSIAL'
    ? commercialDescription.length === 0
    : nonCommercialDescription === '';

  const askForInfoEditPk = localStorage.getItem('askForInfoEditPk');
  const isMandatoryPK =
    askForInfoEditPk ? false :
      !description ||
      !descriptionInformation ||
      isCommercialDescriptionMandatory ||
      signingConditions === '' ||
      // effectiveConditions === '' ||
      (signingConditions ? (!signingList || signingList.length === 0) : false) ||
      (description === 'KOMERSIAL' && hasOther ? otherCommercialDescription === '' : false) ||
      (currentStepper === 'ASK_FOR_INFO' ? (effectiveConditions ? effectiveList.length === 0 : false) : false);

  const isMandatoryLS =
    !pkNumber ||
    isEffectiveDateMandatory ||
    pkDate === '' ||
    legalProcessStatusRequirement === '' ||
    (legalProcessStatusRequirement === 'OTHER' && otherLegalProcessStatusRequirement === '') ||
    effectiveConditions === '';

  return {
    commercialDescriptionList,
    descriptionList,
    effectiveList,
    formatTableHeader,
    handleEdit,
    handleNext,
    handleSave,
    handleSubmit,
    hasOther,
    isAutoSaveFetching,
    isAwaiting,
    isDivisiBisnis,
    isEffectiveLoading,
    isLegalSigning,
    isLpsCore,
    isMaker,
    isMandatoryLS,
    isMandatoryPK,
    isSaveLoading,
    isSigningLoading,
    isStaff,
    isSubmitLoading,
    legalStatusList,
    masintonChange,
    masintonForm,
    openModalPenandatanganan,
    openModalUploadEfektif,
    signingList,
    tableHeaderEffective,
    tableHeaderSignin,
    todayDate,
    viewOnly,
  };
};

export default usePkProcessingType;
