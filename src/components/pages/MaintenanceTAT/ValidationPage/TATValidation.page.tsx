import { TypeModule, TypeProcess } from '@/enums/Module';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {
  return (
    <TableValidation
      module={TypeModule.MIP_REVIEW}
      process={TypeProcess.MIP_REVIEW}
    />
  );
};

export default ValidationPage;
