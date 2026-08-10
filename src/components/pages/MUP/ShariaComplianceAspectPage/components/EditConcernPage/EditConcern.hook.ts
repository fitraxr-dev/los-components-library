import { useContext, useEffect, useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { mup } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailConcern from '@/hooks/services/mip/sharia-compliance/useGetDetailConcern';
import useSaveConcernBusinessResponse from '@/hooks/services/mip/sharia-compliance/useSaveConcernBusinessResponse';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMUPAccess } from '../../../hooks/useMUPAccess';
import { TYPE_EXTERNAL, TYPE_INTERNAL } from '../../ShariaComplianceAspect.constants';


const useEditConcern = () => {
  const path = usePathname();
  const pathArray = path.split('/');
  const isInternalPage = pathArray[5] === 'edit-internal-concern';
  const router = useCustomRouter();
  const { id } = useParams();
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { processId } = useIdentity();
  const [businessResponse, setBusinessResponse] = useState(null);
  const [businessResponseContainer, setBusinessResponseContainer] = useState(null);
  const [descriptionContainer, setDescriptionContainer] = useState(null);
  const { recordActivity } = useRecordLog();
  const { baseMUPAccess } = useMUPAccess();
  const canUpdate = baseMUPAccess.canUpdate;

  const { data: detailConcern } = useGetDetailConcern({
    id: Number(id),
  });

  useEffect(() => {
    if (detailConcern?.businessResponse) {
      setBusinessResponse(detailConcern?.businessResponse);
    }
  }, [detailConcern]);

  const { mutate: saveConcern, isPending: isSaveConcernLoading } = useSaveConcernBusinessResponse({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          setDirtyMsg(undefined);
          router.push(replacePath(mup.SHARIA_COMPLIANCE_ASPECT_PAGE, { processId }));
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });


  const handleOnSave = async () => {
    recordActivity({
      activity: ActivityType.SAVE,
      bucketProcessId: processId,
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `save business response for ${isInternalPage ? 'internal' : 'external'} concern`,
    });

    const businessResponseDescription = await convertToDocx(businessResponseContainer);

    saveConcern({
      bucketProcessId: processId,
      businessResponse: businessResponse,
      businessResponseDescription,
      id: Number(id),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      type: isInternalPage ? TYPE_INTERNAL : TYPE_EXTERNAL,
    });
  };


  const handleClickCancel = () => {
    recordActivity({
      activity: ActivityType.CANCEL,
      bucketProcessId: processId,
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `cancel edit ${isInternalPage ? 'internal' : 'external'} concern`,
    });

    router.push(replacePath(mup.SHARIA_COMPLIANCE_ASPECT_PAGE, { processId }));
  };

  const isDirty = (detailConcern?.businessResponse !== businessResponse) || dirtyMsg;

  return {
    businessResponse,
    businessResponseContainer,
    canUpdate,
    descriptionContainer,
    detailConcern,
    handleClickCancel,
    handleOnSave,
    isDirty,
    isInternalPage,
    isSaveConcernLoading,
    setBusinessResponse,
    setBusinessResponseContainer,
    setDescriptionContainer,
  };
};

export default useEditConcern;
