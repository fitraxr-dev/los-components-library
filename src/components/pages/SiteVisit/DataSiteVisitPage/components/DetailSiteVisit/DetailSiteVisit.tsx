import { Box } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Loader from '@/components/shared/Loader';
import SectionTitle from '@/components/shared/SectionTitle';
import TableUploadDocumentSiteVisit from '@/components/shared/SmiTable/TableUploadDocumentSiteVisit';
import TableUploadFileSiteVisit from '@/components/shared/SmiTable/TableUploadFileSiteVisit';
import Table from '@/components/shared/Table';

import SectionLabel from '../../../shared/components/SectionLabel/SectionLabel';

import useDetailSiteVisit from './DetailSiteVisit.hook';


const DetailSiteVisit = (props: any) => {
  const {
    clientVisitData,
    clientVisitHeader,
    othersVisitData,
    othersVisitHeader,
    smiVisitData,
    smiVisitHeader,
    isLoadingDetail,
    isOthersMediaSV,
    isVisitDetailLoading,
    detailData,
    debtorInfo,
    institutiontypeData,
    visitDetailData,
  } = useDetailSiteVisit();

  const isPemda = props?.isPemda;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Loader isLoading={isLoadingDetail} />
      {
        detailData && (
          <>
            <ColumnWrapper sx={{ gap: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridGap: 10,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                }}
              >
                <Input
                  type="dropdown"
                  label="Institution Type"
                  disabled
                  value={(debtorInfo as any)?.institutionType || '-'}
                  dropdownList={institutiontypeData}
                />
                <Input
                  type="text"
                  label="Nama Customer"
                  disabled
                  value={(debtorInfo as any)?.debtorName || '-'}
                />
                <Input
                  type="text"
                  label="Media Site Visit"
                  disabled
                  value={isOthersMediaSV ? 'Others' : detailData?.evidence}
                />
                { isOthersMediaSV &&
                  <Input
                    type="text"
                    label="Media Site Visit Others"
                    disabled
                    value={detailData?.evidence}
                  />
                }
              </Box>
              { isPemda &&
                <Box
                  sx={{
                    display: 'grid',
                    gridGap: 10,
                    gridTemplateColumns: 'repeat(2, 1fr)',
                  }}
                >
                  <Input
                    type="text"
                    label="Nomor Fasilitas"
                    placeholder="Nomor Fasilitas"
                    disabled
                    value={visitDetailData?.data?.content?.facilityNumber || '-'}
                  />
                  <Input
                    type="text"
                    label="Proyek"
                    placeholder="Proyek"
                    disabled
                    value={visitDetailData?.data?.content?.project || '-'}
                  />
                </Box>
              }

              {/* Customer Address */}
              <SectionLabel title="Alamat Customer :" />
              <Input
                type="area"
                label="Alamat"
                disabled
                rows={4}
                value={detailData?.debtorAddress?.address}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridGap: 10,
                  gridTemplateColumns: 'repeat(4, 1fr)',
                }}
              >
                <Input
                  type="dropdown"
                  label="Alamat (Provinsi)"
                  disabled
                  value={detailData?.debtorAddress?.province}
                  dropdownList={[
                    {
                      label: detailData?.debtorAddress?.province.replaceAll('_', ' '),
                      value: detailData?.debtorAddress?.province,
                    }
                  ]}
                />
                <Input
                  type="dropdown"
                  label="Alamat (Kota-Kabupaten)"
                  disabled
                  value={detailData?.debtorAddress?.city}
                  dropdownList={[
                    {
                      label: detailData?.debtorAddress?.city.replaceAll('_', ' '),
                      value: detailData?.debtorAddress?.city,
                    }
                  ]}
                />
                <Input
                  type="dropdown"
                  label="Alamat (Kecamatan)"
                  disabled
                  value={detailData?.debtorAddress?.district}
                  dropdownList={[
                    {
                      label: detailData?.debtorAddress?.district.replaceAll('_', ' '),
                      value: detailData?.debtorAddress?.district,
                    }
                  ]}
                />
                <Input
                  type="dropdown"
                  label="Alamat (Kelurahan)"
                  disabled
                  value={detailData?.debtorAddress?.subDistrict}
                  dropdownList={[
                    {
                      label: detailData?.debtorAddress?.subDistrict.replaceAll('_', ' '),
                      value: detailData?.debtorAddress?.subDistrict,
                    }
                  ]}
                />
                <Input
                  type="dropdown"
                  label="Kode Pos"
                  disabled
                  value={detailData?.debtorAddress?.postalCode}
                  dropdownList={[
                    {
                      label: detailData?.debtorAddress?.postalCode,
                      value: detailData?.debtorAddress?.postalCode,
                    }
                  ]}
                />
              </Box>
              {/* Loc Site Visit */}
              <SectionLabel title="Lokasi Site Visit :" />
              <Input
                type="area"
                label="Nama Lokasi"
                disabled
                rows={4}
                value={detailData?.visitAddress?.address}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridGap: 10,
                  gridTemplateColumns: 'repeat(4, 1fr)',
                }}
              >
                <Input
                  type="dropdown"
                  label="Lokasi Site Visit (Provinsi)"
                  disabled
                  value={detailData?.visitAddress?.province}
                  dropdownList={[
                    {
                      label: detailData?.visitAddress?.province.replaceAll('_', ' '),
                      value: detailData?.visitAddress?.province,
                    }
                  ]}
                />
                <Input
                  type="dropdown"
                  label="Lokasi Site Visit (Kota-Kabupaten)"
                  disabled
                  value={detailData?.visitAddress?.city}
                  dropdownList={[
                    {
                      label: detailData?.visitAddress?.city.replaceAll('_', ' '),
                      value: detailData?.visitAddress?.city,
                    }
                  ]}
                />
                <Input
                  type="dropdown"
                  label="Lokasi Site Visit (Kecamatan)"
                  disabled
                  value={detailData?.visitAddress?.district}
                  dropdownList={[
                    {
                      label: detailData?.visitAddress?.district.replaceAll('_', ' '),
                      value: detailData?.visitAddress?.district,
                    }
                  ]}
                />
                <Input
                  type="dropdown"
                  label="Lokasi Site Visit (Kelurahan)"
                  disabled
                  value={detailData?.visitAddress?.subDistrict}
                  dropdownList={[
                    {
                      label: detailData?.visitAddress?.subDistrict.replaceAll('_', ' '),
                      value: detailData?.visitAddress?.subDistrict,
                    }
                  ]}
                />
                <Input
                  type="dropdown"
                  label="Kode Pos"
                  disabled
                  value={detailData?.visitAddress?.postalCode}
                  dropdownList={[
                    {
                      label: detailData?.visitAddress?.postalCode,
                      value: detailData?.visitAddress?.postalCode,
                    }
                  ]}
                />
              </Box>

              <SectionTitle title="Pihak PT. SMI yang melakukan Kunjungan" />
              <Table
                isPaper
                tableHeader={smiVisitHeader}
                tableData={smiVisitData}
              />
              <Input
                type="area"
                label="Keterangan"
                disabled
                rows={4}
                value={detailData?.surveyorNote}
              />
              <SectionTitle title="Pihak Client / Customer" />
              <Table
                isPaper
                tableHeader={clientVisitHeader}
                tableData={clientVisitData}
              />
              <Input
                type="area"
                label="Keterangan"
                disabled
                rows={4}
                value={detailData?.clientNote}
              />
              <SectionTitle title="Pihak Lainnya" />
              <Table
                isPaper
                tableHeader={othersVisitHeader}
                tableData={othersVisitData}
              />
              <Input
                type="area"
                label="Keterangan"
                disabled
                rows={4}
                value={detailData?.externalNote}
              />
              <SectionTitle title="Informasi Site Visit" />
              <BaseContainer>
                <Box
                  sx={{
                    display: 'grid',
                    gridGap: 12,
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    mb: 3,
                  }}
                >
                  <Input
                    type="date"
                    label="Actual Start Site Visit"
                    disabled
                    value={detailData?.startDate}
                  />
                  <Input
                    type="date"
                    label="Actual End Site Visit"
                    disabled
                    value={detailData?.endDate}
                  />
                  <Input
                    type="date"
                    label="Tanggal Laporan"
                    disabled
                    value={detailData?.reportDate}
                  />
                </Box>
                <Input
                  type="area"
                  label="Remarks"
                  disabled
                  rows={4}
                  value={detailData?.remarks}
                />
              </BaseContainer>
              <TableUploadDocumentSiteVisit
                module={TypeModule.SITE_VISIT}
                process={TypeProcess.SITE_VISIT}
                ownership={DocumentTypeRequestDtoOwnershipEnum.DOCUMENTSITEVISIT}
                documentParent={DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL}
                documentCategory={DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT}
                isValid={true}
                disabled
                bucketProcessId={detailData?.bucketProcessId}
              />
              <TableUploadFileSiteVisit
                module={TypeModule.SITE_VISIT}
                process={TypeProcess.SITE_VISIT}
                ownership={DocumentTypeRequestDtoOwnershipEnum.DOCUMENTSITEVISIT}
                documentParent={DocumentTypeRequestDtoDocumentParentEnum.GALLERYSITEVISIT}
                documentCategory={DocumentTypeRequestDtoDocumentCategoryEnum.GALLERYSITEVISIT}
                isValid={true}
                disabled
                bucketProcessId={detailData?.bucketProcessId}
              />
            </ColumnWrapper>
          </>
        )
      }
    </ColumnWrapper>
  );
};

export default DetailSiteVisit;
