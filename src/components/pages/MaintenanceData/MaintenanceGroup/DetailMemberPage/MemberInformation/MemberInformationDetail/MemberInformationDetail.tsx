import { useEffect } from 'react';

import { Box, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';

import { roles } from '@/configs/constants';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import Checkbox from '@/components/shared/CheckBox';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import useMemberInformationDetail from './MemberInformationDetail.hook';


const MemberInformationDetail = ({
  isGroupEdit,
  isViewOnly,
  onSaveSuccess,
  onSaveButtonStateChange,
}: {
  isGroupEdit: boolean;
  isViewOnly?: boolean;
  onSaveSuccess?: () => void;
  onSaveButtonStateChange?: (isEnabled: boolean) => void;
}) => {
  const theme = useTheme();
  const router = useCustomRouter();
  const { control, handleSubmit, reset } = useFormContext();
  const {
    memberId,
    debtorDetail,
    isRM,
    isSuperAdminMaker,
    onSubmit,
    isFormDirty,
    setIsFormDirty,
    initialFormValues,
    setInitialFormValues,
    isSaving,
    memberInformation,
    isLoadingMemberInfo,
    isFieldDisabled,
    getFieldStyle,
    finalStatus,
    normalizedFinalStatus,
  } = useMemberInformationDetail(onSaveSuccess);

  // Get role and approval status from hook
  const [state] = useApp();
  const isTL = state.currentRole.includes(roles.TL);
  const isKadiv = state.currentRole.includes(roles.KADIV);
  const searchParams = useSearchParams();
  const fromApprovalStatus = searchParams.get('from') === 'approval-status';

  const showSaveButton = (isRM || isSuperAdminMaker) && isGroupEdit && !isFieldDisabled && !isViewOnly;

  useEffect(() => {
    const isButtonEnabled = showSaveButton && isFormDirty && !isSaving && !isFieldDisabled;
    onSaveButtonStateChange?.(isButtonEnabled);
  }, [showSaveButton, isFormDirty, isSaving, onSaveButtonStateChange, isFieldDisabled]);

  useEffect(() => {
    if (memberInformation?.data?.content) {
      const content = memberInformation.data.content as any;
      const formatLastModified = (dateString: string) => {
        if (!dateString || dateString === '-') return '-';

        try {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = date.getSeconds().toString().padStart(2, '0');

          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } catch (error) {
          return '-';
        }
      };

      const currentValues = {
        hasFinancialDependency: !!content.hasFinancialDependency,
        hasSharedDirectors: !!content.hasSharedDirectors,
        isControlledBySameParty: !!content.isControlledBySameParty,
        isControllingOther: !!content.isControllingOther,
        isGuarantorForOther: !!content.isGuarantorForOther,
        lastModified: formatLastModified(content.lastModified) || '-',
        modifiedBy: content.modifiedBy || '-',
        remark: content.remark || '-',
      };
      setInitialFormValues(currentValues);

      reset(currentValues);
    }
  }, [memberInformation, isLoadingMemberInfo, setInitialFormValues, reset]);

  // if (isLoadingMemberInfo) {
  //   return (
  //     <ColumnWrapper sx={{ gap: 3, paddingY: theme.spacing(2) }}>
  //       <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '200px' }}>
  //         <TextStyle>Loading...</TextStyle>
  //       </Box>
  //     </ColumnWrapper>
  //   );
  // }

  return (
    <SectionTitle title="Member Information Detail" isOpen>
      {/* Legend for member information changes */}
      <ColumnWrapper sx={{ gap: 3, paddingY: theme.spacing(2) }}>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            name="customerId"
            control={control}
            disabled
            render={({ field }) =>
              <Input {...field} label="Customer ID" placeholder="Customer ID" type="text" value={memberId} />
            }
          />
          <Controller
            name="cif"
            control={control}
            disabled
            render={({ field }) =>
              <Input {...field} label="CIF" placeholder="CIF" type="text" value={debtorDetail?.data?.content?.cif ?? '-'} />
            }
          />
          <Controller
            name="institutionType"
            control={control}
            disabled
            render={({ field }) =>
              <Input {...field} label="Institution Type" placeholder="Institution Type" type="text" value={debtorDetail?.data?.content?.institutionTypeLabel ?? '-'} />
            }
          />
          <Controller
            name="debtorName"
            control={control}
            disabled
            render={({ field }) =>
              <Input {...field} label="Nama Customer" placeholder="Nama Customer" type="text" value={debtorDetail?.data?.content?.name ?? '-'} />
            }
          />
          <Controller
            name="industrailSector"
            control={control}
            disabled
            render={({ field }) =>
              <Input {...field} label="Sektor Industri" placeholder="Sektor Industri" type="text" value={debtorDetail?.data?.content?.sectorLabel ?? '-'} />
            }
          />
          <Controller
            name="gam"
            control={control}
            disabled
            render={({ field }) =>
              <Input {...field} label="General Account Manager" placeholder="General Account Manager" type="text" value={debtorDetail?.data?.content?.gamName ?? '-'} />
            }
          />
        </Box>
        {((isTL && normalizedFinalStatus === 'WAITING_APPROVAL_TL') ||
          (isKadiv && normalizedFinalStatus === 'WAITING_APPROVAL_KADIV')) &&
         memberInformation?.data?.content &&
         ((memberInformation.data.content as any)?.fieldsSetTrue?.length > 0 ||
          (memberInformation.data.content as any)?.fieldsSetFalse?.length > 0 ||
          (memberInformation.data.content as any)?.remarkChanged === true) && (
          <Box display="flex" alignItems="center" py={2} gap={3} px={3}>
            <TextStyle variant="body4" sx={{ fontWeight: 600 }}>
              Legend:
            </TextStyle>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={16} height={16} sx={{ bgcolor: '#e8f5e8', border: '1px solid #ccc' }} />
              <TextStyle variant="body4">Field Set to True</TextStyle>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={16} height={16} sx={{ bgcolor: '#f8d7da', border: '1px solid #ccc' }} />
              <TextStyle variant="body4">Field Set to False</TextStyle>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={16} height={16} sx={{ bgcolor: '#fff3cd', border: '1px solid #ccc' }} />
              <TextStyle variant="body4">Field Changed</TextStyle>
            </Box>
          </Box>
        )}
        <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 2, padding: 2 }}>
          <TextStyle sx={{ color: '#284A63', fontSize: '0.9375vw', fontWeight: 500, mb: 2 }}>
            Dasar pengelompokan customer/client beserta anggotanya telah sesuai dengan ketentuan yang berlaku yaitu
            apabila customer/client mempunyai hubungan pengendalian dengan customer/client lain baik melalui hubungan
            kepemilikan, kepengurusan, dan/atau keuangan yang meliputi (dapat lebih dari satu):
            <span style={{ fontStyle: 'normal' }}>*</span>
          </TextStyle>

          <Box sx={{ color: '#284A63', display: 'flex', flexDirection: 'column', gap: 0, mt: 2 }}>
            {[
              { label: 'Customer merupakan pengendali customer lain.', name: 'isControllingOther' },
              { label: '1 (satu) pihak yang sama merupakan pengendali dari beberapa customer.', name: 'isControlledBySameParty' },
              { label: 'Customer memilki ketergantungan keuangan dengan customer lain.', name: 'hasFinancialDependency' },
              { label: 'Customer menerbitkan jaminan untuk mengambil alih dan/atau melunasi sebagian atau seluruh kewajiban customer lain jika customer lain tersebut gagal memenuhi kewajibannya (wanprestasi) kepada Perusahaan.', name: 'isGuarantorForOther' },
              { label: 'Dewan komisaris dan/atau direksi customer menjadi dewan komisaris dan/atau direksi pada customer lain.', name: 'hasSharedDirectors' }
            ].map((item) => (
              <Controller
                key={item.name}
                name={item.name}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      const currentValues = {
                        hasFinancialDependency: !!control._formValues.hasFinancialDependency,
                        hasSharedDirectors: !!control._formValues.hasSharedDirectors,
                        isControlledBySameParty: !!control._formValues.isControlledBySameParty,
                        isControllingOther: !!control._formValues.isControllingOther,
                        isGuarantorForOther: !!control._formValues.isGuarantorForOther,
                      };

                      const hasChanges = Object.keys(currentValues).some(
                        (key) => currentValues[key] !== initialFormValues[key]
                      );

                      setIsFormDirty(hasChanges);
                    }}
                    label={item.label}
                    disabled={!showSaveButton || isFieldDisabled || isViewOnly}
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        color: '#284A63',
                        fontSize: '0.875rem',
                        fontWeight: 400,
                      },
                      ...getFieldStyle(item.name),
                    }}
                  />
                )}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ gridTemplateColumns: '1fr' }}>
          <Controller
            name="remark"
            control={control}
            disabled={!showSaveButton || isFieldDisabled || isViewOnly}
            render={({ field }) =>
              <Input
                {...field}
                label="Keterangan"
                placeholder="Keterangan"
                type="area"
                inputSx={getFieldStyle('remark')}
              />
            }
          />
        </Box>

        <Box sx={{ display: 'grid', gap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Controller
            name="modifiedBy"
            control={control}
            disabled
            render={({ field }) => <Input {...field} label="Modified By" placeholder="Modified By" type="text" value={field.value || '-'} />}
          />
          <Controller
            name="lastModified"
            control={control}
            disabled
            render={({ field }) => <Input {...field} label="Last Modified" placeholder="Last Modified" type="text" value={field.value || '-'} />}
          />
        </Box>

        <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
            >
              Close
            </Button>
          </Box>
          {showSaveButton && !isFieldDisabled && !isViewOnly && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={!isFormDirty || isSaving}
                isLoading={isSaving}
              >
                Save
              </Button>
            </Box>
          )}
        </RowWrapper>
      </ColumnWrapper>
    </SectionTitle>
  );
};

export default MemberInformationDetail;
