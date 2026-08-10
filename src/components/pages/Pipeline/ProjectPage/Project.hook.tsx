'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { roles } from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useDeleteProject from '@/components/pages/Pipeline/ProjectPage/hooks/useDeleteProject';
import TextStyle from '@/components/shared/TextStyle';

import useGetProjectList from './hooks/useGetProjectList';
import { modal, TABLE_HEADER_LIST } from './Project.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useProject = () => {
  const [state] = useApp();
  const { debtorId } = useParams();
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { viewOnly } = useViewOnly();

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const isSuperAdmin = state.currentRole.includes(roles.SUPER_ADMIN);

  const { data: projectListData, isLoading: isProjectListLoading } = useGetProjectList({
    filter: {
      bucketProcessId: String(processId),
      debtorId: String(debtorId),
      module: TypeModule.PIPELINE,
      process: TypeModule.PIPELINE,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  // Record activity when project list is loaded
  useEffect(() => {
    if (projectListData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view project list',
      });
    }
  }, [projectListData, processId, recordActivity]);

  const [lastDeletePayload, setLastDeletePayload] = useState<any>(null);

  const { isPending: isDeleteLoading, mutate: deleteProject } = useDeleteProject({
    onSuccess: () => {
      // Record activity for deleting project
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          debtorId: lastDeletePayload?.debtorId,
          projectCode: lastDeletePayload?.projectCode,
        }),
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully deleted project',
      });

      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const projectList = projectListData?.contents.map((project) => {
    if (project?.valueInIdr !== null && project?.valueInIdr !== '') {
      return {
        ...project,
        projectName: project?.name,
        value: project?.valueInIdr,
      };
    }
    return {
      ...project,
      projectName: project?.name,
      value: project.value,
    };
  });

  const totalPage = projectListData?.page.totalPage;

  const handleAddProject = () => {
    NiceModal.show(modal.PROJECT_EXISTING_PAGE);
  };

  const handleEditProject = async (id: string) => {
    // Record activity for viewing project edit form
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: `view project edit form (projectCode: ${id})`,
    });

    NiceModal.show(modal.PROJECT_PAGE, { id });
  };

  const handleViewDetailProject = async (id: string) => {
    // Record activity for viewing project detail
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: `view project detail (projectCode: ${id})`,
    });

    NiceModal.show(modal.PROJECT_PAGE, { id, viewOnly: true });
  };

  const handleDeleteProject = ({ projectCode }: HandlerProps) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        const payload = {
          bucketProcessId: processId,
          debtorId: String(debtorId),
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          projectCode,
        };
        setLastDeletePayload(payload);
        deleteProject(payload);
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
  };

  const tableHeader = () => {

    const res = [];
    TABLE_HEADER_LIST.map((dt) => {
      if (dt.key === 'valueInIdr') {
        res.push(
          {
            key: dt.key,
            label: dt.label,
            render: (row) => (
              <TextStyle variant="body4">
                {'IDR ' + row.valueInIdr}
              </TextStyle>
            ),
            sx: dt.sx,
          },
        );
      } else {
        res.push(
          {
            key: dt.key,
            label: dt.label,
            sx: dt.sx,
            type: dt.type,
          },
        );
      }
    });


    res.push({
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          isDisabled: isDeleteLoading || isSuperAdmin || viewOnly,
          onClick: (props) => handleViewDetailProject(props.projectCode),
        },
        {
          iconName: 'edit',
          isDisabled: isDeleteLoading || isSuperAdmin || viewOnly,
          isHidden: (props) => !props.isEditable,
          onClick: (props) => handleEditProject(props.projectCode),
        },
        // {
        //   iconName: 'delete',
        //   isDisabled: isDeleteLoading || isSuperAdmin || viewOnly,
        //   isHidden: (props) => !props.isEditable,
        //   onClick: (props) => handleDeleteProject(props),
        // },
      ],
      sx: {
        width: '8vw',
      },
      type: 'action',
    });

    return res;
  };

  return {
    handleAddProject,
    isProjectListLoading,
    noPage,
    projectList,
    setItemPerPage,
    setNoPage,
    tableHeader,
    totalPage,
  };
};
