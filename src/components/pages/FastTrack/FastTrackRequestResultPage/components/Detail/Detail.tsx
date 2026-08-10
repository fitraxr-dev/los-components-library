// import useViewOnly from '@/hooks/useViewOnly';

// import ColumnWrapper from '@/components/shared/ColumnWrapper';
// import Input from '@/components/shared/Input';
// import SectionTitle from '@/components/shared/SectionTitle';
// import TextStyle from '@/components/shared/TextStyle';

// import useDetailRequest from './Detail.hook';

// import type { DetailProps } from './Detail.types';


// const DetailRequest = ({ form, onChange, multiChange }: DetailProps) => {
//   const { viewOnly } = useViewOnly();

//   const {
//     requestPurposeData,
//     typeSubmissionData,
//     checkThroughData,
//     isRequestMode,
//     isVerificationMode,
//     handleShowUrgencyWarning,
//     hasShownUrgencyWarning,
//     isVerifMode,
//     changeBgInput,
//     findDataMaster,
//     isSummary,
//     getDataLabel,
//     needCheckMaster,
//   } = useDetailRequest({ form, multiChange, onChange });

//   const {
//     checkThrough,
//     requestPurpose,
//     requestRemark,
//     requestType,
//     otherRequestPurpose,
//   } = form;

//   return (
//     <ColumnWrapper sx={{ gap: 3 }}>
//       <SectionTitle
//         title="Tipe Permohonan"
//         isOpen
//         isMandatory={isRequestMode}
//         sx={{ mb: 2 }}
//       >
//         <ColumnWrapper gap={2}>
//           <Input
//             disabled={isVerifMode ? true : viewOnly || !isRequestMode}
//             type="radio"
//             label=""
//             position="horizontal"
//             radioList={typeSubmissionData}
//             value={requestType.value}
//             onChange={(e) => {
//               const newValue = e.target.value;
//               onChange('requestType', newValue);
//               if (newValue === 'IMMEDIATE') {
//                 handleShowUrgencyWarning();
//               }
//             }}
//             sx={{ ml: 2 }}
//             sxOptions={{
//               backgroundColor: changeBgInput('requestType'),
//               borderRadius: changeBgInput('requestType') !== '#FFFFFF' ? 1 : 0,
//               display: 'grid',
//               gridTemplateColumns: 'repeat(3, 1fr)',
//               padding: changeBgInput('requestType') !== '#FFFFFF' ? 1 : 0,
//             }}
//           />
//           {needCheckMaster && findDataMaster('requestType') && (
//             <TextStyle weight={500}>
//               {getDataLabel()}: {findDataMaster('requestType') || '-'}
//             </TextStyle>
//           )}
//         </ColumnWrapper>
//       </SectionTitle>

//       <SectionTitle
//         title="Tujuan Permohonan"
//         isMandatory={isRequestMode}
//         isOpen
//         sx={{ mb: 2 }}
//       >
//         <ColumnWrapper gap={2}>
//           <Input
//             disabled={isVerifMode ? true : viewOnly || !isRequestMode}
//             type="checkbox"
//             checkboxList={requestPurposeData}
//             value={requestPurpose.value}
//             onChange={(val) => {
//               if (!val.includes('OTHERS')) {
//                 multiChange({
//                   otherRequestPurpose: '',
//                   requestPurpose: val,
//                 });
//               } else {
//                 onChange('requestPurpose', val);
//               }
//             }}
//             error={requestPurpose.error}
//             helperText={requestPurpose.error && requestPurpose.errorMessage}
//             sx={{
//               '& > *': { display: 'contents' },
//               backgroundColor: changeBgInput('requestPurpose'),
//               borderRadius: changeBgInput('requestPurpose') !== '#FFFFFF' ? 1 : 0,
//               display: 'grid',
//               gridAutoFlow: 'row dense',
//               gridTemplateColumns: 'repeat(2, 1fr)',
//               padding: changeBgInput('requestPurpose') !== '#FFFFFF' ? 1 : 0,
//             }}
//           />
//           {needCheckMaster && findDataMaster('requestPurpose') && (
//             <TextStyle weight={500}>
//               {getDataLabel()}: {findDataMaster('requestPurpose') || '-'}
//             </TextStyle>
//           )}
//           {/* Tampilkan otherRequestPurpose difference jika ada */}
//           {requestPurpose.value?.includes('OTHERS') && needCheckMaster && findDataMaster('otherRequestPurpose') && (
//             <TextStyle weight={500}>
//               {getDataLabel()} (Keterangan Lain): {findDataMaster('otherRequestPurpose') || '-'}
//             </TextStyle>
//           )}
//         </ColumnWrapper>
//       </SectionTitle>

//       <SectionTitle
//         title="Pengecekan Melalui"
//         isMandatory={isRequestMode}
//         isOpen
//         sx={{ mb: 2 }}
//       >
//         <ColumnWrapper sx={{ gap: 2 }}>
//           <ColumnWrapper gap={2}>
//             <Input
//               disabled={isVerifMode ? true : viewOnly || isVerificationMode || isSummary}
//               type="checkbox"
//               label=""
//               checkboxList={checkThroughData}
//               value={checkThrough.value}
//               onChange={(newValues: string[]) => {
//                 multiChange({
//                   checkThrough: newValues,
//                 });
//               }}
//               sx={{
//                 backgroundColor: changeBgInput('checkThrough'),
//                 borderRadius: changeBgInput('checkThrough') !== '#FFFFFF' ? 1 : 0,
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(3, 1fr)',
//                 padding: changeBgInput('checkThrough') !== '#FFFFFF' ? 1 : 0,
//               }}
//             />
//             {needCheckMaster && findDataMaster('checkThrough') && (
//               <TextStyle weight={500}>
//                 {getDataLabel()}: {findDataMaster('checkThrough') || '-'}
//               </TextStyle>
//             )}
//           </ColumnWrapper>

//           <ColumnWrapper gap={2}>
//             <Input
//               disabled={isVerifMode ? false : viewOnly}
//               type="area"
//               label="Keterangan"
//               placeholder="Input Keterangan"
//               value={requestRemark.value}
//               onChange={(val) => { onChange('requestRemark', val); }}
//               error={requestRemark.error}
//               helperText={requestRemark.error && requestRemark.errorMessage}
//               rows={4}
//               inputSx={{
//                 backgroundColor: changeBgInput('requestRemark'),
//               }}
//             />
//             {needCheckMaster && findDataMaster('requestRemark') && (
//               <TextStyle weight={500}>
//                 {getDataLabel()}: {findDataMaster('requestRemark') || '-'}
//               </TextStyle>
//             )}
//           </ColumnWrapper>
//         </ColumnWrapper>
//       </SectionTitle>
//     </ColumnWrapper>
//   );
// };

// export default DetailRequest;
