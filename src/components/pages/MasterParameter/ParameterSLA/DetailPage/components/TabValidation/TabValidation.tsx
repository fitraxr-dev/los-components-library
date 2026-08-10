import { TypeModule, TypeProcess } from '@/enums/Module';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import TableValidation from '@/components/shared/SmiTable/TableValidation';


const TabValidation = () => {
  const { isBucketProcessId, processId } = useMasterParameter();

  return (
    <TableValidation
      id={isBucketProcessId ? processId : null}
      module={TypeModule.PARAMETER_SLA}
      process={TypeProcess.PARAMETER_SLA}
    />
  );
};

export default TabValidation;
