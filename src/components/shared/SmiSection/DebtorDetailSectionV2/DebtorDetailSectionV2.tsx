import { Box } from '@mui/material';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';


const DebtorDetailSectionV2 = (props: any) => {
  const { debtorInfoData } = props;
  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);
  const { data: institutionTypeDropdownList } = useGetParameterList('institutionType');

  return (
    <SectionTitle title="Detail Customer" isOpen>
      <BaseContainer sx={{ boxShadow: 2, padding: 2 }}>
        <Box sx={{ display: 'flex', gap: 3, padding: 0 }} mb={2}>
          <RowWrapper width="50%" gap={1}>
            <Input
              disabled
              containerSx={{
                flex: 1,
              }}
              type="dropdown"
              label="Institution Type"
              placeholder="Institution Type"
              value={debtorInfoData.institutionType}
              dropdownList={institutionTypeDropdownList}
            />
            <Input
              id="input-request-name"
              data-testid="input-request-name"
              isMandatory={false}
              containerSx={{
                flex: 1,
              }}
              type="text"
              label="Nama Customer"
              placeholder="Hubungan dengan SMI Sejak Tahun"
              value={debtorInfoData?.debtorName}
              disabled
            />
          </RowWrapper>
          <Box width="50%">
            <Input
              id="input-request-year-with-smi"
              data-testid="input-request-year-with-smi"
              isMandatory={false}
              type="text"
              label="Hubungan dengan SMI Sejak Tahun"
              placeholder="Hubungan dengan SMI Sejak Tahun"
              value={debtorInfoData?.relationshipSince}
              disabled
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, padding: 0 }} mb={2}>
          <Box width="50%">
            <Input
              id="input-request-year"
              data-testid="input-request-year"
              isMandatory={false}
              type="text"
              label="Tahun didirikan"
              placeholder="Tahun didirikan"
              value={debtorInfoData?.yearFounded}
              disabled
            />
          </Box>
          <Box width="50%">
            <Input
              id="input-request-year"
              data-testid="input-request-year"
              isMandatory={false}
              type="radio"
              label="Terafiliasi dengan SMI"
              radioList={[
                { label: 'Ya', value: true },
                { label: 'Tidak', value: false }
              ]}
              sx={{ flex: 1, marginY: 1 }}
              disabled
              value={debtorInfoData?.isAffiliate ? true : false}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, padding: 0 }} mb={2}>
          <Box width="50%">
            <Input
              disabled
              type="radio"
              label="Customer Memiliki Group"
              value={debtorInfoData.isGroup}
              radioList={[
                {
                  label: 'Ya',
                  value: true,
                },
                {
                  label: 'Tidak',
                  value: false,
                },
              ]}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box width="50%">
            <Input
              disabled
              type="radio"
              label="Terkait dengan SMI"
              value={debtorInfoData.isRelatedToSmi}
              radioList={[
                {
                  label: 'Ya',
                  value: true,
                },
                {
                  label: 'Tidak',
                  value: false,
                },
              ]}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>


        <Box sx={{ display: 'flex', gap: 1, padding: 0 }} mb={2}>
          <Box width="50%">
            <Input
              isMandatory={false}
              type="text"
              label="Jenis Customer"
              placeholder="Jenis Customer"
              value={debtorInfoData?.debtorOwnershipsLabel || debtorInfoData?.debtorTypeLabel}
              disabled
            />
          </Box>
          <Box width="25%" pl={1}>
            <Input
              isMandatory={false}
              type="text"
              label="Contact Person"
              placeholder="Contact Person"
              value={debtorInfoData?.contactPerson}
              disabled
            />
          </Box>
          <Box width="25%" pl={1}>
            <Input
              isMandatory={false}
              type="dropdown"
              label="Jabatan"
              dropdownList={jobPositionData}
              value={debtorInfoData?.positionId}
              disabled
            />
          </Box>
        </Box>
        <Box width="50%" py={1}>
          <Input
            isMandatory={false}
            type="text"
            label="Jenis Sektor Usaha"
            placeholder="Jenis Sektor Usaha"
            value={debtorInfoData?.sectorName ?? '-'}
            disabled
          />
        </Box>
      </BaseContainer>
    </SectionTitle>
  );
};

export default DebtorDetailSectionV2;
