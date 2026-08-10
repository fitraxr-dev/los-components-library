import { TypeModule, TypeProcess } from '@/enums/Module';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {
  return (
    <TableValidation
      module={TypeModule.BAR}
      process={TypeProcess.BAR}
    />
  );
};

export default ValidationPage;
