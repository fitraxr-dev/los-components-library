import useGetFinancingFacilityExistingById from '../../hooks/useGetFinancingFacilityExistingById';


export const useModalDetailFinancingFacilityExisting = ({ id }) => {
  const { data } = useGetFinancingFacilityExistingById({ id });

  return { data };
};
