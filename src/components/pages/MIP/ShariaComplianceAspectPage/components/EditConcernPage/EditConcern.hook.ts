import { useContext, useEffect, useState } from 'react';

import { useParams, useRouter, usePathname } from 'next/navigation';


import { mip } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailConcern from '@/hooks/services/mip/sharia-compliance/useGetDetailConcern';
import useSaveConcernBusinessResponse from '@/hooks/services/mip/sharia-compliance/useSaveConcernBusinessResponse';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';

import { TYPE_EXTERNAL, TYPE_INTERNAL } from '../../ShariaComplianceAspect.constants';


const useEditConcern = () => {
  const path = usePathname();
  const pathArray = path.split('/');
  const isInternalPage = pathArray[6] === 'edit-internal-concern';
  const router = useCustomRouter();
  const { id } = useParams();
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const [businessResponse, setBusinessResponse] = useState(null);
  const [businessResponseContainer, setBusinessResponseContainer] = useState(null);
  const [descriptionContainer, setDescriptionContainer] = useState(null);

  const { data: detailConcern } = useGetDetailConcern({
    id: Number(id),
  });

  console.log('detailConcern', detailConcern);
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
          router.push(replacePath(mip.SHARIA_COMPLIANCE_ASPECT_PAGE, { processId }));
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });


  const handleOnSave = async () => {
    const businessResponseDescription = await convertToDocx(businessResponseContainer);

    saveConcern({
      bucketProcessId: processId,
      businessResponse: businessResponse,
      businessResponseDescription,
      id: Number(id),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.MIP_REVIEW,
      type: isInternalPage ? TYPE_INTERNAL : TYPE_EXTERNAL,
    });
  };


  const handleClickCancel = () => {
    router.push(replacePath(mip.SHARIA_COMPLIANCE_ASPECT_PAGE, { processId }));
  };

  const isDirty = (detailConcern?.businessResponse !== businessResponse) || dirtyMsg;

  return {
    businessResponse,
    businessResponseContainer,
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
    viewOnly,
  };
};

export default useEditConcern;
