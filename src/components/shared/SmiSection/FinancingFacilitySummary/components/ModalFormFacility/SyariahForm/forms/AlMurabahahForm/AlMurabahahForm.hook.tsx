import { useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import Modules from '@/enums/Modules';
import { sumNominalValues, multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useFinancingSegment from '@/hooks/useFinancingSegment';
import useMasintonForm from '@/hooks/useMasintonForm';

import { AlMurabahahData } from './AlMurabahah.form';

import type { SyariahFormsProps } from '../forms.type';


const AlMurabahah = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, existing, facilityId } = props;

  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });


  const _financingSegment = useFinancingSegment();
  const _formData = Object.assign(AlMurabahahData, { financingSegment: { value: _financingSegment } });


  const {
    masintonForm,
    masintonChange,
    masintonMultiChange,
    masintonMagic,
    masintonReplace,
    masintonReset,
  } = useMasintonForm(_formData);


  const {
    exchange_rate_purchase_price: { value: exchange_rate_purchase_price },
    purchase_price: { value: purchase_price },
    down_payment: { value: down_payment },
    exchange_rate_down_payment: { value: exchange_rate_down_payment },
    murabahah_margin: { value: murabahah_margin },
    exchange_rate_murabahah_margin: { value: exchange_rate_murabahah_margin },
    murabahah_installment: { value: murabahah_installment },
    exchange_rate_murabahah_installment: { value: exchange_rate_murabahah_installment },
    exchange_rate_selling_price: { value: exchange_rate_selling_price },
    selling_price: { value: selling_price },

  } = masintonForm;

  useEffect(() => {
    const new_purchase_price_idr = multiplyNominalValues(purchase_price, exchange_rate_purchase_price);
    masintonChange('purchase_price_idr', new_purchase_price_idr);
  }, [purchase_price, exchange_rate_purchase_price]);

  useEffect(() => {
    const new_down_payment_idr =
    multiplyNominalValues(down_payment, exchange_rate_down_payment);
    masintonChange('down_payment_idr', new_down_payment_idr);
  }, [down_payment, exchange_rate_down_payment]);

  useEffect(() => {
    const new_murabahah_margin_idr = multiplyNominalValues(murabahah_margin, exchange_rate_murabahah_margin);
    masintonChange('murabahah_margin_idr', new_murabahah_margin_idr);
  }, [murabahah_margin, exchange_rate_murabahah_margin]);

  useEffect(() => {
    const new_murabahah_installment_idr =
    multiplyNominalValues(murabahah_installment, exchange_rate_murabahah_installment);
    masintonChange('murabahah_installment_idr', new_murabahah_installment_idr);
  }, [murabahah_installment, exchange_rate_murabahah_installment]);

  useEffect(() => {
    const new_selling_price_idr = multiplyNominalValues(selling_price, exchange_rate_selling_price);
    masintonChange('selling_price_idr', new_selling_price_idr);
  }, [selling_price, exchange_rate_selling_price]);

  useEffect(() => {
    if (financingFacilityData && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);
      const masintonData = Object.assign(newFinancingData, {
        projectId: financingFacilityData.project?.id,
      });
      masintonMagic(masintonData);
    }
  }, [financingFacilityData]);

  useEffect(() => {
    onChangeSyariahForm(
      {
        masintonChange: masintonChange,
        masintonForm: masintonForm,
        masintonReplace: masintonReplace,
      });
  }, [masintonForm]);

  useEffect(() => {
    return () => masintonReset();
  }, []);

  return {
    currencyDropdownList,
    governmentMandateList,
    masintonChange,
    masintonForm,
    masintonMultiChange,
  };
};

export default AlMurabahah;
