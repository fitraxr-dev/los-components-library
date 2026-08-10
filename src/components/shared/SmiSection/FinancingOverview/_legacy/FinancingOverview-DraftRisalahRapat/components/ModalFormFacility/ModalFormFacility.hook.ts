import { useEffect, useState } from 'react';

import Modules from '@/enums/Modules';
import showNiceModal from '@/helpers/showNiceModal';
import { capitalize } from '@/helpers/string';
import { formatNumber, multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetProjectList from '@/hooks/services/useGetProjectList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useFinancingSegment from '@/hooks/useFinancingSegment';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { modal } from '../../FinancingOverview.constants';
import useGetDetailFinancingFacility from '../../hooks/useGetDetailFinancingFacility';
import useSaveFinancingFacility from '../../hooks/useSaveFinancingFacility';

import { formData, validation } from './ModalFormFacility.form';

import type { ProjectDto } from '@/services/openapi/loan-service';


const usePopupFormFacility = ({ existing, id, process, module }: any) => {
  const { processId } = useIdentity();
  const { facilityId } = useIdentity();
  const _financingSegment = useFinancingSegment();
  const _formData = Object.assign(formData, { financingSegment: { value: _financingSegment } });

  const {
    masintonForm,
    masintonChange,
    masintonMultiChange,
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
    outstanding: { value: outstanding },

  } = masintonForm;

  const [productModule, setProductModule] = useState(`product${capitalize(financingSegment?.toLowerCase())}`);
  const [projectDetail, setProjectDetail] = useState<ProjectDto>({});

  const { data: governmentMandateList } = useGetParameterList(Modules.GOVERMENT_MANDATE);
  const { data: orderTypeListNonExisting } = useGetParameterList(Modules.ORDER_TYPE);
  const { data: typeListExisting } = useGetParameterList(Modules.ORDER_TYPE_EXISTING);
  const { data: financingSegmentList } = useGetParameterList(Modules.FINANCING_SEGMENT);
  const { data: productList } = useGetParameterList(productModule);
  const { data: resultProject } = useGetProjectList();
  const { data: financingFacilityData } = useGetDetailFinancingFacility({ id });

  const { data: saveFinancingFacilityData, mutate } = useSaveFinancingFacility({
    onError: () => {
      showNiceModal('error', saveFinancingFacilityData.errorDetail);
    },
    onSuccess: () => {
      masintonReset();
      closeNiceModal(modal.FORM_FACILITY);
      showNiceModal('success', 'Fasilitas pembiayaan berhasil ditambahkan');
    },
  });

  useEffect(() => {
    if (financingSegment) {
      setProductModule(`product${capitalize(financingSegment.toLowerCase())}`);
      masintonChange('product', '');
    }
  }, [financingSegment]);

  useEffect(() => {
    const newOrderValueAfterExchangeRate = multiplyNominalValues(orderValue, exchangeRate);
    masintonChange('orderValueAfterExchangeRate', newOrderValueAfterExchangeRate);
  }, [orderValue, exchangeRate]);

  const projectList = resultProject.map((project) => ({ ...project, id: project.id, label: project.name }));

  useEffect(() => {
    if (projectDetail) {
      const project = projectList?.find((project) => projectId === project.name);
      if (project) setProjectDetail(project);
    }

  }, [projectId]);

  useEffect(() => {
    if (financingFacilityData && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);
      const masintonData = Object.assign(newFinancingData, {
        projectId: financingFacilityData.project.name,
        ...(existing && { orderType: 'NEW_FROM_EXISTING_FACILITY' }),
      });
      masintonMagic(masintonData);
      setProjectDetail(financingFacilityData.project);
    }
  }, [financingFacilityData]);

  function handleSubmit() {
    // const ignoreValidation = currencyOrderValue === 'IDR' && ['exchangeRate'];
    // if (!masintonValidation({ ignoreValidation })) return;

    const newProjectId = projectList?.find((project) => projectId === project.name)?.id;

    const payload = Object.assign(masintonSubmit(), {
      bucketProcessId: processId,
      exchangeRate: formatNumber(exchangeRate),
      id: existing ? null : id,
      module,
      orderValue: formatNumber(orderValue),
      orderValueAfterExchangeRate: formatNumber(orderValueAfterExchangeRate),
      outstanding: formatNumber(outstanding),
      process,
      projectId: newProjectId ? Number(newProjectId) : null,
    });

    mutate(payload);
  };

  let orderTypeList = orderTypeListNonExisting;
  if (financingFacilityData?.isExisting) {
    orderTypeList = typeListExisting;
  }

  return {
    financingSegmentList,
    governmentMandateList,
    handleSubmit,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    masintonReplace,
    masintonReset,
    orderTypeList,
    productList,
    projectDetail,
    projectList,
  };
};

export default usePopupFormFacility;
