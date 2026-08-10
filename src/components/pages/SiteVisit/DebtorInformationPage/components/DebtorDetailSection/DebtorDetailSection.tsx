import { Box, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';

import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';


const DebtorDetailSection = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.SITE_VISIT,
    process: TypeProcess.SITE_VISIT,
  });
  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);
  const { data: institutiontypeData } = useGetParameterList(Modules.INSTITUTION_TYPE);

  return (
    <Box sx={{ mb: 3 }}>
      <SectionTitle title="Detail Customer" sx={{ mb: 3 }} isOpen>
        <BaseContainer
          sx={{
            boxShadow: 2,
            maxWidth: '100%',
            mt: theme.spacing(2),
            padding: theme.spacing(2),
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Input
                disabled
                type="dropdown"
                label="Institution Type"
                placeholder="Select Institution Type"
                value={debtorInfoData.institutionType}
                dropdownList={institutiontypeData}
                containerSx={{ flex: 1 }}
              />
              <Input
                disabled
                type="text"
                label="Nama Customer"
                value={debtorInfoData.debtorName}
                containerSx={{ flex: 1 }}
              />
            </Box>
            <Input
              disabled
              type="text"
              label="Hubungan dengan SMI Sejak Tahun"
              placeholder="contoh: Sejak 2020"
              value={debtorInfoData.relationshipSince}
              containerSx={{ flex: 1 }}
            />
            <Input
              disabled
              type="text"
              label="Tahun Didirikan"
              placeholder="contoh: Sejak 2020"
              value={debtorInfoData.yearFounded}
              containerSx={{ flex: 1 }}
            />
            <Input
              disabled
              type="radio"
              label="Terafiliasi dengan SMI"
              value={debtorInfoData.isAffiliate}
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
            <Input
              disabled
              type="radio"
              label="Terkait dengan SMI"
              value={debtorInfoData.isRelation}
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
            <Input
              disabled
              type="text"
              label="Jenis Customer"
              placeholder="Input Jenis Customer"
              value={debtorInfoData.debtorType}
              containerSx={{ flex: 1 }}
            />
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Input
                disabled
                type="text"
                label="Contact Person"
                placeholder="Input Contact Person"
                value={debtorInfoData.contactPerson}
                containerSx={{ flex: 1 }}
              />
              <Input
                disabled
                type="dropdown"
                label="Jabatan"
                placeholder="Select Jabatan"
                value={debtorInfoData.positionId}
                dropdownList={jobPositionData}
                containerSx={{ flex: 1 }}
              />
            </Box>
            <Input
              disabled
              type="text"
              label="Jenis Sektor Usaha"
              placeholder="Input Jenis Sektor Usaha"
              value={debtorInfoData.sectorName}
              containerSx={{ flex: 1 }}
            />
          </Box>
        </BaseContainer>
      </SectionTitle>
    </Box>
  );
};

export default DebtorDetailSection;
