import { useState, useContext, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';


import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { legalSigning } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { API } from '@/helpers/api';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import {
  DocumentCreationRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/agreement-service/api';

import Button from '@/components/shared/Button';

import useGetAdditionalInformationById from '../../hooks/useGetAdditionalInformationById';
import useGetDetailAsumsi from '../../hooks/useGetDetailAsumsi';
import useGetDetailProcessingType from '../../hooks/useGetDetailProcessingType';
import useGetDocumentGroup from '../../hooks/useGetDocumentGroup';
import useSaveAssumsi from '../../hooks/useSaveAssumsi';

import type { ActionBtnProps } from './AssumedQualifications.types';


const useAssumedQualifications = ({
  actionBtn,
  handleNextTab,
}:
{
  actionBtn: ActionBtnProps;
  handleNextTab: () => void;
}) => {
  const [containerAssum, setContainerAssum] = useState(null);
  const [containerAdditional, setContainerAdditional] = useState(null);
  const [saveCallback, setSaveCallback] = useState<(() => void) | null>(null);
  const { childId, processId } = useIdentity();
  const [{ currentRole }] = useApp();
  const { viewOnly } = useViewOnly();
  const isTL = currentRole?.includes(roles.TL);
  const isStaff = currentRole?.includes(roles.RM);
  const isMaker = currentRole?.includes(roles.MAKER);
  const isKadiv = currentRole?.includes(roles.KADIV);
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const path = usePathname();
  const param = useParams();
  const idPath = Number(param && param?.id);
  const { setDirtyMsg } = useContext(DirtyContext);

  const currentPathModule = path?.split('/')[2];
  const pathModuleLegalSigning = legalSigning.LIST_PAGE?.split('/')[2];
  const isLegalSigning = currentPathModule === pathModuleLegalSigning;

  const { data: pkDetail } = useGetDetailProcessingType(
    {
      bucketProcessId: null,
      id: idPath,
    },
    {
      enabled: isLegalSigning,
    }
  );

  const isEffectiveDateMandatory = isLegalSigning &&
    !pkDetail?.legalProcessStatusRequirement?.startsWith('AWAITING_') &&
    pkDetail?.legalProcessStatusRequirement !== 'WAITING_BUSINESS_TEAM' &&
    !pkDetail?.effectiveDate;

  const isMandatoryFieldsFilled = isLegalSigning
    ? Boolean(
      pkDetail?.pkNumber &&
      pkDetail?.pkDate &&
      pkDetail?.legalProcessStatusRequirement &&
      (!isEffectiveDateMandatory || pkDetail?.effectiveDate)
    )
    : true;

  const {
    data: additionalInformationDetail,
    isFetching: isLoadingAdditional,
  } = useGetAdditionalInformationById({
    bucketProcessId: String(childId),
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.PROCESSING_TYPE_PK,
  });

  const {
    data: assumsiDetail,
    isFetching: isLoadingAssumsi,
  } = useGetDetailAsumsi({
    bucketProcessId: String(childId),
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.PROCESSING_TYPE_PK,
  });
  const { mutate: saveAssumsiAdditional } = useSaveAssumsi(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        setDirtyMsg(undefined);
        queryClient.invalidateQueries({ queryKey: ['validate-result-debtor']});
        queryClient.invalidateQueries({ queryKey: ['detail-pk-processing-type-report', idPath]});
        queryClient.invalidateQueries({
          queryKey: ['bucket-stepper', {
            bucketProcessId: childId,
            module: TypeModule.ENGAGEMENT_AGREEMENT,
            process: TypeProcess.PROCESSING_TYPE_PK,
          }],
        });
        showNiceModalV2({
          onClose: () => {
            if (saveCallback) {
              saveCallback();
              setSaveCallback(null);
            }
          },
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      },
    }
  );


  const { mutate: submitBucket } = useSubmitBucket(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        setDirtyMsg(undefined);

        queryClient.invalidateQueries({ queryKey: ['detail-pk-processing-type-report', idPath]});
        queryClient.invalidateQueries({
          queryKey: ['bucket-stepper', {
            bucketProcessId: childId,
            module: TypeModule.ENGAGEMENT_AGREEMENT,
            process: TypeProcess.PROCESSING_TYPE_PK,
          }],
        });

        showNiceModalV2({ onClose: () => handleBack(), title: 'Data berhasil disimpan', type: 'success' });
      },
    }
  );

  const formatRadioBtn = () => {
    let radioButtons = [
      { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
      { label: 'TL', value: 'ASK_FOR_INFO_TL' }
    ];
    if (isTL) {
      radioButtons = [
        { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
        { label: 'Kadiv', value: 'ASK_FOR_INFO_KADIV' }
      ];
    }
    return radioButtons;
  };


  const handleBack = () => {
    const pathModule = path.split('/')[3];
    const urlPath = legalSigning.PK_PROCESSING_TYPE_MONITORING.replace('[module]', pathModule)
      .replace('[processId]', processId);
    router.replace(urlPath);
  };

  const formattedActionButton = {};
  let isEdit = false; // TODO Dika, this flow may not require an EDIT process
  console.log('actionBtn', actionBtn);
  for (const key in actionBtn) {
    if (key === ('ASK_FOR_INFO')) {
      formattedActionButton['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else if (key === ('RETURN_TO_MAKER')) {
      formattedActionButton['RETURN_TO_MAKER'] = 'RETURN_TO_MAKER';
    } else if (key === ('APPROVE_ASK_FOR_INFO')) {
      formattedActionButton['APPROVE_ASK_FOR_INFO'] = 'SUBMIT';
    } else if (key.includes('EDIT')) {
      isEdit = true; // TODO Dika, this flow may not require an EDIT process
    } else {
      formattedActionButton[key] = actionBtn[key];
    }
  }

  const autoSavePayload = useMemo(() => async () => {
    if (!containerAssum || !containerAdditional) return null;

    const docxAssumsi = await convertToDocx(containerAssum);
    const docxAdditional = await convertToDocx(containerAdditional);

    return {
      bucketProcessId: childId,
      description: docxAdditional,
      descriptionAssumsi: docxAssumsi,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.PROCESSING_TYPE_PK,
    };
  }, [containerAssum, containerAdditional, childId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly,
    onSuccess: async (data) => {

      try {
        const payloadData = await autoSavePayload();
        if (payloadData) {
          await API('agreement.additional.saveQualify', {
            data: payloadData,
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          console.log('[AutoSave] Qualify synced successfully');
        }
      } catch (error) {
        console.error('[AutoSave] Qualify sync error', error);
      }
    },
    payload: autoSavePayload,
    url: 'agreement.additional.saveBisnis',
  });

  const handleSave = async () => {
    const docxAssumsi = await convertToDocx(containerAssum);
    const docxAdditional = await convertToDocx(containerAdditional);

    saveAssumsiAdditional({
      bucketProcessId: childId,
      description: docxAdditional,
      descriptionAssumsi: docxAssumsi,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.PROCESSING_TYPE_PK,
    });
  };

  const handleNext = () => {
    if (viewOnly) return handleNextTab();
    setSaveCallback(() => handleNextTab);
    handleSave();
  };

  const {
    data: conditionEffectiveList,
    isLoading: isEffectiveLoading,
    isSuccess: isSuccesEffective,
  } = useGetDocumentGroup({
    bucketProcessId: String(childId),
    documentCategory: DocumentCreationRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT,
    documentParent: DocumentTypeRequestDtoDocumentParentEnum.PKPTEFFECTIVECONDITIONS,
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    ownerId: null,
    ownership: null,
    process: TypeProcess.PROCESSING_TYPE_PK,
  });

  const cautionEffectiveConditions = (action: string) => {
    console.log('pkDetail?.effectiveConditions', !pkDetail?.effectiveConditions);
    if (pkDetail?.effectiveConditions) {
      if (conditionEffectiveList?.length === 0) {
        showNiceModalV2({
          title: 'Terdapat Syarat Efektif, Pastikan Syarat Efektif Telah Selesai',
          type: 'error',
        });
      } else {
        handleSubmit(action);
      }
    } else {
      handleSubmit(action);
    }
  };


  const handleSubmit = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: action,
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

  const handleDecline = () => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment, radioValue }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload = {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.ENGAGEMENT_AGREEMENT,
            process: TypeProcess.PROCESSING_TYPE_PK,
          };

          submitBucket({ submitRequestDto: payload });
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Cancelled', value: 'CANCEL' },
          { label: 'Rejected', value: 'REJECT' }
        ],
      },
    );
  };

  const handleAskForInfo = () => {
    const modalProps = {
      onSave: ({ comment, radioValue }) => {
        const action = isKadiv ? 'SUBMIT' : radioValue;
        submitBucket({
          submitRequestDto: {
            action,
            bucketProcessId: childId,
            comment,
            module: TypeModule.ENGAGEMENT_AGREEMENT,
            process: TypeProcess.PROCESSING_TYPE_PK,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    };

    if (!isKadiv) {
      Object.assign(modalProps, {
        radioLabel: 'Forward to:',
        radioOptions: formatRadioBtn(),
      });
    }

    NiceModal.show(MODAL.GLOBAL.COMMENT, modalProps);
  };

  let askForInfoBtnLabel = isTL ? 'Approve Ask For Info' : 'Ask For Info';
  let defaultBtnSubmitLabel = isMaker || isStaff || isTL ? 'Submit' : 'Approve';
  const handleButton = (key: string, value: string, isMandatoryFieldsFilled: boolean = true) => {
    switch (key) {
      case 'DECLINE':
        return (
          <Button
            variant="outlined"
            color="error"
            onClick={handleDecline}
          >
            Decline
          </Button>
        );
      case 'RETURN_TO_STAFF':
        return (
          <Button
            color="darkBlue"
            onClick={() => handleSubmit(value)}
            variant="contained"
          >
            Return to Staff
          </Button>
        );
      case 'RETURN_TO_TL':
        return (
          <Button
            color="info"
            onClick={() => handleSubmit(value)}
            variant="contained"
          >
            Return to TL
          </Button>
        );
      case 'RETURN_TO_MAKER':
        return (
          <Button
            color="info"
            onClick={() => handleSubmit(value)}
            variant="contained"
          >
            Return to Maker
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="success"
          >
            Approve
          </Button>
        );
      case 'APPROVE_ASK_FOR_INFO':
        return (
          <Button
            onClick={handleAskForInfo}
            variant="contained"
            color="warning"
          >
            {currentRole.includes(roles.TL) ? 'Submit' : 'Approve'}  Ask for Info
          </Button>
        );
      case 'SUBMIT':
        return (
          <Button
            onClick={() => cautionEffectiveConditions(value)}
            variant="contained"
            color="success"
            disabled={!isMandatoryFieldsFilled}
          >
            {defaultBtnSubmitLabel}
          </Button>
        );
      case 'ASK_FOR_INFO':
        return (
          <Button
            onClick={handleAskForInfo}
            variant="contained"
            color="warning"
          >
            {askForInfoBtnLabel}
          </Button>
        );
      default:
        return null;
    }
  };

  return {
    additionalInformationDetail,
    assumsiDetail,
    childId,
    containerAdditional,
    containerAssum,
    formattedActionButton,
    handleButton,
    handleNext,
    handleSave,
    isAutoSaveFetching,
    isLoadingAdditional,
    isLoadingAssumsi,
    isMandatoryFieldsFilled,
    setContainerAdditional,
    setContainerAssum,
    viewOnly,
  };

};

export default useAssumedQualifications;
