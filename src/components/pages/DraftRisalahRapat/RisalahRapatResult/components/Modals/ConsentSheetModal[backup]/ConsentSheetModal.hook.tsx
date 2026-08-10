//TODO: Need Approval to be deleted, waiting for confirmation from BA before deletion

// import { useEffect, useState } from 'react';

// import NiceModal, { useModal } from '@ebay/nice-modal-react';
// import { useTheme } from '@mui/material';
// import * as yup from 'yup';

// import { MODAL as GLOBA_MODAL } from '@/configs/constants/modalId';
// import { TypeModule, TypeProcess } from '@/enums/Module';
// import showNiceModalV2 from '@/helpers/showNiceModalV2';
// import closeNiceModal from '@/hooks/useCloseNiceModal';

// import Icon from '@/components/shared/Icon';
// import TextStyle from '@/components/shared/TextStyle';

// import useDragAndDropUserAssigned from '../../../hooks/useDragAndDropUserAssigned';
// import useGetUserByAssigned from '../../../hooks/useGetUserByAssigned';
// import useGetUserCollaboration from '../../../hooks/useGetUserCollaboration';
// import useSaveUserAssignedDivision from '../../../hooks/useSaveUserAssignedCollaboration';
// import { MODAL, TABLE_HEADER_CONSENT_SHEET_CONSTANT } from '../../../RisalahRapatResult.contants';
// import useMeetingMinutesResult from '../../../RisalahRapatResult.hooks';

// import type { onDndProps, TableHeader } from '@/components/shared/Table/Table.types';


// const useConsentSheetModal = () => {

//   const {
//     assignmentParameter,
//     processId,
//     viewOnly } = useMeetingMinutesResult();

//   const modalId = MODAL.CONSENT_SHEET;
//   const modal = useModal(modalId);
//   const theme = useTheme();
//   const [useCollaborationList, setUseCollaborationList] = useState([]);
//   const [dataUserByAssigned, setDataUserByAssigned] = useState([]);
//   const [page, setPage] = useState(1);
//   const [itemPerPage, setItemPerPage] = useState(5);

//   const { data: getAllUserCollabolatorList, isLoading: getUserCollaborationLoading } = useGetUserCollaboration({
//     filter: {
//       bucketProcessId: processId,
//       module: TypeModule.RISALAH_RAPAT,
//       process: TypeProcess.RISALAH_RAPAT,
//     },
//     page: {
//       itemPerPage: itemPerPage,
//       noPage: page,
//     },
//   });

//   const userCollaboratorList = getAllUserCollabolatorList?.contents;
//   const userCollaboratorPage = getAllUserCollabolatorList?.page;
//   const totalPage = userCollaboratorPage?.totalPage;

//   const { data: getUserByAssigned, isLoading: getUserByAssignedLoading, isFetched } = useGetUserByAssigned({
//     bucketProcessId: processId,
//     module: TypeModule.RISALAH_RAPAT,
//     process: TypeProcess.RISALAH_RAPAT,
//   });

//   useEffect(() => {
//     if (isFetched) setDataUserByAssigned(getUserByAssigned);
//   }, [getUserByAssigned, isFetched]);

//   const { mutate: assignUserToDivision, isPending } = useSaveUserAssignedDivision({
//     onError: () => {
//          showNiceModalV2({
//              title: 'Terjadi kesalahan saat menyimpan user, silahkan coba beberapa saat lagi.',
//              type: 'error'
//         });
//     },
//     onSuccess: () => {
//       showNiceModalV2({ title: 'Data berhasil di simpan.', type: 'success' });
//     },
//   });

//   const { mutate: dragAndDrop } = useDragAndDropUserAssigned({});

//   useEffect(() => {
//     if (userCollaboratorList && !getUserCollaborationLoading) {
//       setUseCollaborationList(userCollaboratorList);
//     }
//   }, [userCollaboratorList, getUserCollaborationLoading]);

//   const tableUserCollaborationHeader: TableHeader[] = [
//     {
//       key: '',
//       label: '',
//       render: (row) => (
//         <Icon
//           iconName="drag-and-drop"
//           textVariant="title1"
//           sx={{
//             marginRight: theme.spacing(2),
//             path: {
//               stroke: theme.palette.common.white,
//             },
//           }}
//         />
//       ),
//     },
//     ...TABLE_HEADER_CONSENT_SHEET_CONSTANT,
//     {
//       key: 'action',
//       label: 'Action',
//       options: [
//         {
//           iconName: 'assign', onClick: (data) => handleAssignUser(data),
//         },
//       ],
//       type: 'action',
//     }
//   ];

//   const tableConsentDivisionHeader: TableHeader[] = [
//     {
//       key: '',
//       label: '',
//       render: () => (
//         <Icon
//           iconName="drag-and-drop"
//           textVariant="title1"
//           sx={{
//             cursor: 'pointer',
//             marginRight: theme.spacing(2),
//             path: {
//               stroke: theme.palette.common.white,
//             },
//           }}
//         />
//       ),
//     },
//     ...TABLE_HEADER_CONSENT_SHEET_CONSTANT,
//     {
//       key: 'consentRoleLabel',
//       label: 'Role',
//     },
//     {
//       key: 'sku',
//       label: 'SKU',
//       render: (row) => (
//         <TextStyle variant="body4">
//           {row.sku ? 'Ya' : 'Tidak'}
//         </TextStyle>
//       ),
//     },
//     {
//       key: 'action',
//       label: 'Action',
//       options: [
//         {
//           iconName: 'edit', onClick: (data) => handleEditPenandatangan(data),
//         },
//         {
//           iconName: 'delete', onClick: (data) => handleDeletePenandatangan(data),
//         }],
//       type: 'action',
//     }
//   ];

//   const handleOnDragAndDrop = (data: onDndProps, index: number) => {
//     const { previousItem, nextItem, currentItem, currentIndex, newTableData } = data;


//     dragAndDrop({
//       id: currentItem.id,
//       nextSequence: nextItem?.sequence ?? null,
//       previousSequence: previousItem?.sequence ?? null,
//     });

//     if (previousItem === null) {
//       currentItem.sequence = nextItem?.sequence - 512;
//     } else if (nextItem === null) {
//       currentItem.sequence = previousItem?.sequence + 512;
//     } else {
//       currentItem.sequence = (previousItem?.sequence + nextItem?.sequence) / 2;
//     }

//     const array = [...dataUserByAssigned];
//     array[index] = [...newTableData];
//     array[index][currentIndex] = currentItem;

//     setDataUserByAssigned(array);
//     console.log(array);
//   };

//   const handleTableData = (result: any, index: number) => {
//     const array = [...dataUserByAssigned];
//     array[index] = result;
//     setDataUserByAssigned(array);
//   };

//   const handleAddPenandatangan = (dt: {value: string; key: string}) => {
//     NiceModal.show(MODAL.SIGNATORY, { assignedTo: dt.key, id: null });
//   };

//   const handleEditPenandatangan = (data: {id: number}) => {
//     NiceModal.show(MODAL.SIGNATORY, { id: data.id, mode: 'Edit' });
//   };

//   const handleDeletePenandatangan = (data: {id: number}) => {
//     showNiceModalV2({ onSubmit: () => {
//       assignUserToDivision({
//         assignedTo: null,
//         id: data.id,
//       });
//     }, title: 'Apakah anda yakin ingin menghapus data?', type: 'warning' });
//   };

//   const handleCloseConsentSheet = () => {
//     closeNiceModal(modalId);
//   };

//   const handleAssignUser = (props: any) => {
//     NiceModal.show(GLOBA_MODAL.GLOBAL.SELECTOR, {
//       data: assignmentParameter,
//       onSubmit: (data) => {assignUserToDivision({
//         assignedTo: data,
//         id: props.id,
//       });},
//       submitText: 'Save',
//       title: 'Assign User Collaboration',
//     });
//   };

//   return {
//     assignmentParameter,
//     dataUserByAssigned,
//     getUserByAssigned,
//     getUserByAssignedLoading,
//     getUserCollaborationLoading,
//     handleAddPenandatangan,
//     handleCloseConsentSheet,
//     handleOnDragAndDrop,
//     handleTableData,
//     isPending,
//     modal,
//     page,
//     setItemPerPage,
//     setPage,
//     tableConsentDivisionHeader,
//     tableUserCollaborationHeader,
//     theme,
//     totalPage,
//     useCollaborationList,
//     viewOnly,
//   };
// };

// export default useConsentSheetModal;
