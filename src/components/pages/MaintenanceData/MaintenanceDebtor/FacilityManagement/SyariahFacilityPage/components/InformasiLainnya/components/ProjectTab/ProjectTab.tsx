import { Box } from '@mui/material';

import { formatDateTime } from '@/helpers/date';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';

import useProjectTab from './ProjectTab.hook';


const ProjectTab = () => {
  const { data, theme } = useProjectTab();
  const {
    facilityId,
    projectCode,
    projectName,
    projectDescription,
    projectStartDate,
    projectEndDate,
    sectorFunded,
    currency,
    projectValue,
    exchangeRateCurrency,
    exchangeRate,
    currencyInIdr,
    projectValueInIdr,
    projectClassification,
    projectCategory,
    projectOutput,
    projectOutputUnit,
    address,
    province,
    city,
    district,
    village,
    postalCode,
    status,
    modifiedBy,
    lastModified,
  } = data ?? {};

  return (
    <>
      <Title title="Project" />
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle isOpen title="ID Project" >
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: theme.spacing(2),
            }}
          >
            <Input
              label="Facility ID"
              placeholder="Facility ID"
              type="text"
              disabled
              value={facilityId}
            />
          </Box>
        </SectionTitle>

        <SectionTitle isOpen title="Project Information">
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            <Input
              label="ID Project"
              placeholder="ID Project"
              type="text"
              disabled
              value={projectCode}
            />

            <Input
              label="Nama Proyek"
              placeholder="Nama Proyek"
              type="text"
              disabled

              value={projectName}
            />

            <Input
              label="Project Start Date"
              placeholder="Project Start Date"
              type="date"
              disabled
              value={projectStartDate}
            />

            <Input
              label="Project End Date"
              placeholder="Project End Date"
              type="date"
              disabled
              value={projectEndDate}
            />

            <Input
              label="Sektor Yang Dibiayai"
              placeholder="Pilih Sektor"
              type="dropdown"
              dropdownPlaceholder="Sektor"
              key="sectorFinanced"
              dropdownList={[
                {
                  label: sectorFunded,
                  value: sectorFunded,
                }
              ]}
              disabled
              value={sectorFunded}
            />

            <Currency
              label="Nilai Proyek"
              placeholder="Nilai Proyek"
              containerSx={{ flex: 1 }}
              key="projectValue"
              currencyList={[
                {
                  label: currency,
                  value: currency,
                }
              ]}
              value={{
                currency: currency,
                value: projectValue,
              }}
              disabled
            />

            <Currency
              label="Exchange Rate"
              placeholder="Exchange Rate Dari Nilai Proyek"
              containerSx={{ flex: 1 }}
              currencyList={[
                {
                  label: exchangeRateCurrency,
                  value: exchangeRateCurrency,
                },
                {
                  label: 'IDR',
                  value: 'IDR',
                },
              ]}
              value={{
                currency: exchangeRateCurrency || 'IDR',
                value: exchangeRate,
              }}
              disabled
            />

            <Currency
              label="Nilai Proyek (dalam Rp)"
              placeholder="Nominal"
              containerSx={{ flex: 1 }}
              currencyList={[
                {
                  label: currencyInIdr,
                  value: currencyInIdr,
                },
                {
                  label: 'IDR',
                  value: 'IDR',
                },
              ]}
              value={{
                currency: currencyInIdr || 'IDR',
                value: projectValueInIdr,
              }}
              disabled
              disabledCurrency
            />

            <Input
              label="Klasifikasi Proyek"
              placeholder="Klasifikasi Proyek"
              type="dropdown"
              disabled
              dropdownList={[
                {
                  label: projectClassification,
                  value: projectClassification,
                }
              ]}
              value={projectClassification}
            />

            <Input
              label="Kategori Proyek"
              placeholder="Kategori Proyek"
              type="dropdown-search"
              dropdownList={[
                {
                  label: projectCategory,
                  value: projectCategory,
                }
              ]}
              disabled
              value={projectCategory}
            />

            <Input
              label="Output Proyek"
              placeholder="Output Proyek"
              type="area"
              rows={3}
              disabled

              value={projectOutput}
            />

            <Input
              label="Satuan Output Proyek"
              placeholder="Satuan Output Proyek"
              type="dropdown"
              disabled
              dropdownList={[
                {
                  label: projectOutputUnit,
                  value: projectOutputUnit,
                }
              ]}
              value={projectOutputUnit}
            />

            <Box sx={{ gridColumn: 'span 2' }}>
              <Input
                label="Project Description"
                placeholder="Project Description"
                type="area"
                rows={3}
                disabled
                value={projectDescription}
              />
            </Box>

            <Box sx={{ gridColumn: 'span 2' }}>
              <Input
                label="Alamat"
                placeholder="Alamat"
                type="area"
                rows={3}
                disabled
                value={address}
              />
            </Box>

            <Input
              label="Lokasi Proyek (Provinsi)"
              placeholder="Lokasi Proyek (Provinsi)"
              type="dropdown"
              disabled
              dropdownList={[
                {
                  label: province,
                  value: province,
                }
              ]}
              value={province}
            />

            <Input
              label="Lokasi Proyek (Kota-Kabupaten)"
              placeholder="Lokasi Proyek (Kota-Kabupaten)"
              type="dropdown"
              disabled
              dropdownList={[
                {
                  label: city,
                  value: city,
                }
              ]}
              value={city}
            />

            <Input
              label="Lokasi Proyek (Kecamatan)"
              placeholder="Lokasi Proyek (Kecamatan)"
              type="dropdown"
              disabled
              dropdownList={[
                {
                  label: district,
                  value: district,
                }
              ]}
              value={district}
            />

            <Input
              label="Lokasi Proyek (Kelurahan)"
              placeholder="Lokasi Proyek (Kelurahan)"
              type="dropdown"
              disabled
              dropdownList={[
                {
                  label: village,
                  value: village,
                }
              ]}
              value={village}
            />

            <Input
              label="Postal Code"
              placeholder="Postal Code"
              type="dropdown"
              disabled
              dropdownList={[
                {
                  label: postalCode,
                  value: postalCode,
                }
              ]}
              value={postalCode}
            />

            <Input
              label="Status Project Phase"
              placeholder="Status Project Phase"
              type="dropdown"
              disabled
              dropdownList={[
                {
                  label: status,
                  value: status,
                }
              ]}
              value={status}
            />

            <Input
              label="Modified By"
              placeholder="Modified By"
              type="text"
              disabled

              value={modifiedBy}
            />

            <Input
              label="Last Modified"
              placeholder="Last Modified"
              type="text"
              disabled

              value={lastModified && formatDateTime(lastModified)}
            />
          </Box>
        </SectionTitle>
      </ColumnWrapper>
    </>
  );
};
export default ProjectTab;
