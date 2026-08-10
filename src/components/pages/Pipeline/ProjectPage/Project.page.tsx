'use client';
import { ModalDef } from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import ModalExistingProject from './components/ModalExistingProject';
import PopupProject from './components/PopupProject';
import { modal } from './Project.constants';
import { useProject } from './Project.hook';


const ProjectPage = () => {
  const { viewOnly } = useViewOnly();

  const {
    handleAddProject,
    isProjectListLoading,
    noPage,
    projectList,
    setItemPerPage,
    setNoPage,
    tableHeader,
    totalPage,
  } = useProject();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Proyek" />
        <TableDebtorInformation
          module={TypeModule.PIPELINE}
          process={TypeProcess.PIPELINE}
          showDifferentDataAlert={false}
        />
        <Table
          tableHeader={tableHeader()}
          tableData={projectList}
          footer={!viewOnly && <TableFooter onClick={() => handleAddProject()} />}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          totalPage={totalPage}
          isLoading={isProjectListLoading}
        />
      </ColumnWrapper>
      <ModalDef
        id={modal.PROJECT_PAGE}
        component={PopupProject}
      />
      <ModalDef
        id={modal.PROJECT_EXISTING_PAGE}
        component={ModalExistingProject}
      />

    </>
  );
};

export default ProjectPage;
