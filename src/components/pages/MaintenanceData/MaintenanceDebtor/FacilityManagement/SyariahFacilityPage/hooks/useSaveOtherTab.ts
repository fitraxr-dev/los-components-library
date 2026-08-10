import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface PayloadSaveOtherTab {
  facilityId?: string;
  childFacilityId?: string;
  facilityNo?: string | number;
  relationshipManager?: string;
  division?: string;
  financingProvision?: string;
  guaranteeOrAssignment?: string;
  programSourceOfFund?: string;
  sourceOfFund?: string;
  remarkSourceOfFund?: string;
  akadInitialNumber?: string;
  akadInitialDate?: string | number;
  akadFinalNumber?: string;
  akadFinalDate?: string | number;
  effectiveDate?: string | number;
  accountOfficer?: string;
  accountOfficerDivision?: string;
  branchCode?: string | number;
  remark?: string;
  modifiedBy?: string;
  lastModified?: string;
  bucketProcessId?: string;
}

const useSaveOtherTab = ({
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: async (payload: PayloadSaveOtherTab) => {
      const res = await API('master.facilityManagementSyariahExisiting.saveOther', {
        data: payload,
      });

      return res.data?.data;
    },
    onError: (error: any) => {
      console.error('=== MUTATION ERROR ===', error);
      onError?.(error);
    },
    onSuccess: (data, variables, context) => {
      console.log('=== SUCCESS ===', data);
      queryClient.invalidateQueries({ queryKey: ['syariah-child-limit-other']});
      onSuccess?.(data, variables, context);
    },
  });
  return query;
};
export default useSaveOtherTab;
