import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';


export const CurrencyLOV = () => {
  const { data: currencyLOVList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', value: 'key' });
  return currencyLOVList;
};

export const JobPositionLOV = () => {
  const { data: jobPositionLOVList } = useGetParameterList(Modules.JOB_POSITION, { label: 'value1', value: 'key' });
  return jobPositionLOVList;
};

export const EthnicOriginLOV = () => {
  const { data: ethnicOriginLOVList } = useGetParameterList('ethnicOrigin', { label: 'value1', value: 'key' });
  return ethnicOriginLOVList;
};
