import { useCallback, useEffect, useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber, multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetProjectList from '@/hooks/services/useGetProjectList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useFinancingSegment from '@/hooks/useFinancingSegment';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';


import useGetDetailFinancingFacility from '../../hooks/useGetDetailFinancingFacility';
import useGetDetailFinancingPk from '../../hooks/useGetDetailFinancingPk';
import useSaveFinancingFacility from '../../hooks/useSaveFinancingFacility';
import { MODALPK } from '../../PK.constants';

import { formData, validation } from './ModalFormFacilityPengajuanPerikatan.form';

import type { ProjectDto } from '@/services/openapi/loan-service';


const usePopupFormFacilityPengajuanPerikatan = ({ existing, id }: any) => {
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
    mappingOrderType: { value: mappingOrderType },
    mappingFinancingSegment: { value: mappingFinancingSegment },
    mappingProduct: { value: mappingProduct },
  } = masintonForm;

  const [productModule, setProductModule] = useState('productkonven');
  const [mappingProductModule, setMappingProductModule] = useState('productkonven');

  const [projectDetail, setProjectDetail] = useState<ProjectDto>({});

  const [syariahFormData, setSyariahFormData] = useState(null);
  const [financingFacilityDataSyariah, setFinancingFacilityDataSyariah] = useState({});

  const { data: governmentMandateList } = useGetParameterList(Modules.GOVERMENT_MANDATE);
  const { data: orderTypeListNonExisting } = useGetParameterList(Modules.ORDER_TYPE);
  const { data: mapOrderTypeList } = useGetParameterList(Modules.MAPPING_ORDER_TYPE);
  const { data: typeListExisting } = useGetParameterList(Modules.ORDER_TYPE_EXISTING);
  const { data: financingSegmentList } = useGetParameterList(Modules.FINANCING_SEGMENT);
  const { data: productList } = useGetParameterList(productModule);
  const { data: mappingProductList } = useGetParameterList(mappingProductModule);
  const { data: resultProject } = useGetProjectList();
  const { data: financingFacilityData } = useGetDetailFinancingFacility({
    bucketProcessId: processId || null,
    facilityId: facilityId || null,
    id: id || null,
  });
  const { data: financingPk } = useGetDetailFinancingPk({ financingFacilityId: id });
  const mappingFinancingSegmentList = [
    {
      'label': 'Konven',
      'value': 'KONVEN',
    },
    {
      'label': 'Syariah',
      'value': 'SYARIAH',
    }
  ];

  const {
    mutate: saveFinancingFacility,
    isPending: isLoadingSave,
  } = useSaveFinancingFacility({
    onError: () => {
      showNiceModalV2({ title: 'Gagal menyimpan fasilitas pembiayaan', type: 'error' });
    },
    onSuccess: () => {
      closeNiceModal(MODALPK.FORM_FACILITY_PENGAJUAN_PERIKATAN).then(() => {
        showNiceModalV2({
          onClose: () => {
            masintonReset();
          }, title: 'Fasilitas pembiayaan berhasil ditambahkan', type: 'success',
        });
      });
    },
  });


  const formatMappingProductSegment = useCallback((coreMappingVal?: string) => {
    const segment = masintonForm.financingSegment.value;
    const valToUse = coreMappingVal || masintonForm.mappingFinancingSegment.value;
    let mappingProductParam = `product${valToUse.toLowerCase()}`;
    if (segment === 'SYARIAH' || valToUse === 'SYARIAH') {
      mappingProductParam = 'mappingProductSyariah';
    } else if (segment?.toLowerCase() === 'pemda' && valToUse?.toLowerCase() === 'konven') {
      mappingProductParam = 'mappingProductPemdaKonven';
    }
    setMappingProductModule(mappingProductParam);
  }, [masintonForm]);

  const onChangeSyariahForm = useCallback((params: {
    masintonForm: any;
    masintonChange: (key: string, value: any) => void;
    masintonReplace: (formData: any) => void;
  }) => {
    const { masintonForm } = params;
    const outputData = Object.fromEntries(
      Object.entries(masintonForm).map(([key, obj]) => [key, (obj as any).value])
    );

    if (outputData.remark) {
      masintonChange('remark', outputData.remark);
    }

    if (outputData.governmentMandate) {
      masintonChange('governmentMandate', outputData.governmentMandate);
    }

    if (outputData.timePeriod) {
      masintonChange('timePeriod', outputData.timePeriod);
    }

    setSyariahFormData(outputData);
  }, [masintonChange]);

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
        mapSegmenFinancing: financingFacilityData?.mappingFinancingSegment,
        mappingProduct: financingFacilityData?.mappingProduct,
      });
      // setMappingProductModule(`product${financingFacilityData?.financingSegment.toLowerCase() || 'konven'}`);
      setProductModule(`product${financingFacilityData?.financingSegment.toLowerCase()}`);
      masintonMagic(masintonData);
      setProjectDetail(financingFacilityData.project);
      formatMappingProductSegment(financingFacilityData.mappingFinancingSegment);

      const mappedAttributes =
        financingFacilityData.attributes?.reduce((acc: any, item: any) => {
          acc[item.attributeKey] = item.attributeValue;
          return acc;
        }, {}) || {};

      const attributesSyariah = Object.assign(mappedAttributes, {
        government_mandate: financingFacilityData?.governmentMandate,
        remarks: financingFacilityData?.remark,
      });
      setFinancingFacilityDataSyariah(attributesSyariah);
    }
  }, [financingFacilityData]);

  useEffect(() => {
    if (!id && !existing && financingSegment && !mappingFinancingSegment) {
      const coreMappingValue =
        financingSegment === 'SYARIAH' ? 'SYARIAH' : 'KONVEN';
      if (coreMappingValue) {
        masintonChange('mappingFinancingSegment', coreMappingValue);
      }
    }
  }, [
    id,
    existing,
    financingSegment,
    mappingFinancingSegment,
    masintonChange
  ]);

  function handleSubmit() {
    const ignoreValidation = [];

    if (currencyOrderValue === 'IDR') {
      ignoreValidation.push('exchangeRate');
    }

    if (financingSegment !== 'SYARIAH') {
      ignoreValidation.push('providingFacilities');
    }

    if (financingSegment === 'SYARIAH') {
      ignoreValidation.push('financingObjectives');
      ignoreValidation.push('exchangeRate');
      ignoreValidation.push('orderValue');
      ignoreValidation.push('timePeriod');
      ignoreValidation.push('withdrawalPeriod');
      ignoreValidation.push('gracePeriod');
      ignoreValidation.push('rates');
      ignoreValidation.push('governmentMandate');
    }

    if (!masintonValidation({ ignoreValidation })) return;

    const newProjectId = projectList?.find((project) => projectId === project.name)?.id;

    const tempSyariahData = financingSegment === 'SYARIAH' ? {
      ...syariahFormData,
      orderValue: formatNumber(syariahFormData?.orderValue),
    } : {};

    const temp = Object.assign(
      masintonSubmit(), {
        bucketProcessId: processId,
        exchangeRate: financingSegment === 'SYARIAH' ? '1' : formatNumber(exchangeRate),

        facilityId: existing ? null : financingFacilityData?.facilityId || null,
        id: existing ? null : financingFacilityData?.id || null,
        mappingFinancingSegment: mappingFinancingSegment,
        mappingOrderType: mappingOrderType,
        mappingProduct: mappingProduct,
        module: TypeModule.ENGAGEMENT_AGREEMENT,
        orderValue: financingSegment === 'SYARIAH' ? formatNumber(tempSyariahData.orderValue) : formatNumber(orderValue),
        orderValueAfterExchangeRate: formatNumber(orderValueAfterExchangeRate),
        outstanding: formatNumber(outstanding),
        process: TypeProcess.ENGAGEMENT_AGREEMENT,
        projectId: newProjectId ? Number(newProjectId) : null,
        ...(financingSegment === 'SYARIAH' && {
          timePeriod: tempSyariahData.timePeriod || tempSyariahData.financing_period || '',
        }),
      });

    const payloadFinancing = financingSegment === 'SYARIAH' ? {
      ...temp,
      attributes: Object.keys(tempSyariahData)
        .filter((item) => item !== 'remarks' && item !== 'government_mandate' && item !== 'orderValue' && item !== 'timePeriod')
        .map((item) => {
          return {
            attributeKey: item,
            attributeLabel: '',
            attributeValue: tempSyariahData[item] ? tempSyariahData[item] : '',
          };
        }),
      governmentMandate: tempSyariahData['government_mandate'],
      remark: tempSyariahData['remarks'],
    } : temp;

    saveFinancingFacility(payloadFinancing);
  };

  let orderTypeList = orderTypeListNonExisting;
  if (financingFacilityData?.isExisting) {
    orderTypeList = typeListExisting;
  }

  return {
    financingFacilityDataSyariah,
    financingPk,
    financingSegmentList,
    formatMappingProductSegment,
    governmentMandateList,
    handleSubmit,
    isLoadingSave,
    mapOrderTypeList,
    mappingFinancingSegmentList,
    mappingProductList,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    masintonReplace,
    masintonReset,
    onChangeSyariahForm,
    orderTypeList,
    productList,
    projectDetail,
    projectList,
    setProductModule,
    syariahFormData,
  };
};

export default usePopupFormFacilityPengajuanPerikatan;
