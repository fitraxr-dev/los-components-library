import { useEffect, useState } from 'react';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { capitalize } from '@/helpers/string';
import { formatNumber, multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetProjectList from '@/hooks/services/useGetProjectList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useSegmentFinancing from '@/hooks/useFinancingSegment';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import useGetFinancingFacility from '../../hooks/useGetFinancingFacility';
import useSaveFinancingFacility from '../../hooks/useSaveFinancingFacility';
import { modal } from '../TablePaymentFacility.constants';

import { formData, validation } from './ModalFormFacility.form';

import type { ProjectDto } from '@/services/openapi/master-service';


const useModalFormFacility = (props: SmiComponentProps) => {
  const { module, process, id, type } = props;
  const existing = type === 'existing';

  const { processId, facilityId } = useIdentity();
  const _segmentFinancing = useSegmentFinancing();
  const _formData = Object.assign(formData, { financingSegment: { value: _segmentFinancing } });

  const {
    masintonForm,
    masintonChange,
    masintonMagic,
    masintonReplace,
    masintonReset,
    masintonValidation,
    masintonSubmit,
  } = useMasintonForm(_formData, validation);

  const {
    financingSegment: { value: financingSegment },
    orderValue: { value: orderValue },
    currencyOrderValue: { value: currencyOrderValue },
    exchangeRate: { value: exchangeRate },
    orderValueAfterExchangeRate: { value: orderValueAfterExchangeRate },
    projectId: { value: projectId },
  } = masintonForm;

  const [productModule, setProductModule] = useState(`product${capitalize(financingSegment.toLowerCase())}`);
  const [projectDetail, setProjectDetail] = useState<ProjectDto>({});

  const { data: orderTypeListNonExisting } = useGetParameterList(Modules.ORDER_TYPE);
  const { data: orderTypeListExisting } = useGetParameterList(Modules.ORDER_TYPE_EXISTING);
  const { data: financingSegmentList } = useGetParameterList(Modules.FINANCING_SEGMENT);
  const { data: productList } = useGetParameterList(productModule);
  const { data: resultProject } = useGetProjectList();
  const { data: financingFacilityData } = useGetFinancingFacility({ id: Number(id) });
  const { mutate: saveFinancingFacility } = useSaveFinancingFacility({
    onError: () => {
      showNiceModalV2({ title: 'Failed to read request', type: 'error' });
    },
    onSuccess: () => {
      masintonReset();

      closeNiceModal(modal.PAYMENT_FACILITY_FORM);
      showNiceModalV2({ onClose: () => {
      }, title: 'Fasilitas pembiayaan berhasil ditambahkan', type: 'success' });
    },
  });

  useEffect(() => {
    if (financingSegment) {
      setProductModule(`product${capitalize(financingSegment.toLowerCase())}`);
      masintonChange('product', '');
    }
  }, [financingSegment]);

  useEffect(() => {
    const orderValueAfterExchangeRate = multiplyNominalValues(orderValue, exchangeRate);
    masintonChange('orderValueAfterExchangeRate', orderValueAfterExchangeRate);
  }, [orderValue, exchangeRate]);

  const projectList = resultProject
    .map((project) => ({ ...project, label: project.name, value: String(project.id), value2: project.value }));

  useEffect(() => {
    if (!projectId) {
      setProjectDetail({});
    }

    const project = projectList.find((project) => project.id === Number(projectId));
    if (project) setProjectDetail(project);

  }, [projectId]);

  useEffect(() => {
    if (financingFacilityData && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);
      const masintonData = Object.assign(newFinancingData, {
        projectId: financingFacilityData.project?.id,
        ...(existing && { orderType: 'NEW_FROM_EXISTING_FACILITY' }),
      });

      masintonMagic(masintonData);
      // setProjectDetail(financingFacilityData.project);
    }
  }, [financingFacilityData]);

  useEffect(() => {
    return () => masintonReset();
  }, []);

  function handleSubmit() {
    const ignoreValidation = [];
    if (currencyOrderValue === 'IDR') ignoreValidation.push('exchangeRate');
    if (!masintonValidation({ ignoreValidation })) return;


    const payload = Object.assign(masintonSubmit(), {
      bucketProcessId: processId,
      exchangeRate: formatNumber(exchangeRate),
      id: !existing ? Number(id) : null,
      module,
      orderValue: formatNumber(orderValue),
      orderValueAfterExchangeRate: formatNumber(orderValueAfterExchangeRate),
      process,
      projectId: projectId ? Number(projectId) : null,
    });

    saveFinancingFacility(payload);
  };

  let orderTypeList = orderTypeListNonExisting;
  if (financingFacilityData?.isExisting) {
    orderTypeList = orderTypeListExisting;
  }

  return {
    existing,
    financingSegmentList,
    handleSubmit,
    masintonChange,
    masintonForm,
    masintonReplace,
    orderTypeList,
    orderTypeListExisting,
    productList,
    projectDetail,
    projectList,
  };
};

export default useModalFormFacility;
