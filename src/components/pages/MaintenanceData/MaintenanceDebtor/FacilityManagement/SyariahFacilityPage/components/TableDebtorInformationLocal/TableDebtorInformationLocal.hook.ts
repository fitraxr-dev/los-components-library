import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useIdentity from '@/hooks/useIdentity';


const useTableDebtorInformationLocal = () => {
  const { processId } = useIdentity();

  const isDebtor = processId?.includes('DEBT');

  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });

  return { debtorData, isDebtor };
};
export default useTableDebtorInformationLocal;
