//TODO: Need Approval to be deleted, waiting for confirmation from BA before deletion

// import React from 'react';

// import { create } from '@ebay/nice-modal-react';
// import Box from '@mui/material/Box';

// import { TypeModule, TypeProcess } from '@/enums/Module';

// import BaseContainer from '@/components/shared/BaseContainer';
// import Button from '@/components/shared/Button';
// import Icon from '@/components/shared/Icon';
// import IconButton from '@/components/shared/IconButton';
// import RowWrapper from '@/components/shared/RowWrapper';
// import SectionTitle from '@/components/shared/SectionTitle';
// import SectionModal from '@/components/shared/SmiModal/SectionModal';
// import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
// import Table from '@/components/shared/Table';
// import Title from '@/components/shared/Title';

// import useConsentSheetModal from './ConsentSheetModal.hook';


// const ConsentSheetModal = create(() => {

//   const {
//     getUserByAssignedLoading,
//     handleCloseConsentSheet,
//     modal,
//     tableUserCollaborationHeader,
//     getUserCollaborationLoading,
//     useCollaborationList,
//     tableConsentDivisionHeader,
//     theme,
//     assignmentParameter,
//     viewOnly,
//     handleOnDragAndDrop,
//     handleTableData,
//     handleAddPenandatangan,
//     dataUserByAssigned,
//     isPending,
//     page,
//     setPage,
//     totalPage,
//     setItemPerPage,
//   } = useConsentSheetModal();

//   return (
//     <SectionModal
//       title="Lembar Persetujuan"
//       isOpen={modal.visible}
//       onClose={handleCloseConsentSheet}
//       customFooter={() => null}
//       containerSx={{
//         '-ms-overflow-style': 'none',
//         gap: 2,
//         minWidth: '75vw',
//         'scrollbar-width': 'none',
//       }}
//     >
//       <TableDebtorInformation module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />

//       <Title title="List User Collaboration" />
//       <BaseContainer
//         sx={{
//           boxShadow: 2,
//           maxWidth: '100%',
//           mt: theme.spacing(3),
//           padding: theme.spacing(2),
//         }}
//       >
//         <Table
//           tableHeader={tableUserCollaborationHeader}
//           tableData={useCollaborationList}
//           isLoading={getUserCollaborationLoading}
//           currentPage={page}
//           totalPage={totalPage}
//           handlePageChange={setPage}
//           onPageSizeChange={setItemPerPage}
//         />

//       </BaseContainer>

//       {assignmentParameter?.map((dt, index) =>
//         <SectionTitle key={index} title={dt.label} >
//           <BaseContainer
//             sx={{
//               boxShadow: 2,
//               maxWidth: '100%',
//               mt: theme.spacing(3),
//               padding: theme.spacing(2),
//             }}
//           >
//             <Table
//               tableHeader={tableConsentDivisionHeader}
//               tableData={dataUserByAssigned.find((item) => item.key === dt.key)?.data}
//               isLoading={getUserByAssignedLoading}
//               onDragAndDrop={(data) => handleOnDragAndDrop(data, index)}
//               setTableData={(result) => handleTableData(result, index)}
//               footer={!viewOnly ?
//                 <RowWrapper sx={{ justifyContent: 'end', mb: 3 }}>
//                   <Button
//                     variant="outlined"
//                     startIcon="add-2"
//                     startIconSx={{ fontSize: theme.spacing(3) }}
//                     sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
//                     onClick={() => handleAddPenandatangan(dt)}
//                   >
//                     Add New
//                   </Button>
//                 </RowWrapper> : null

//               }
//             />
//           </BaseContainer>
//         </SectionTitle>)}
//       <RowWrapper sx={{ gap: 4, justifyContent: 'end', mt: 4 }}>
//         <Button variant="outlined" disabled={isPending} onClick={handleCloseConsentSheet}>Cancel</Button>
//         <Button color="primary" disabled={isPending} onClick={handleCloseConsentSheet}>Save</Button>
//       </RowWrapper>
//     </SectionModal>
//   );
// });


// export default ConsentSheetModal;
