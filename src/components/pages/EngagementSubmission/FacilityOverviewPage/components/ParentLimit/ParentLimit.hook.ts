/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable sort-keys */
import { useState, useEffect, useMemo } from 'react';

import { parseISO } from 'date-fns';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';


import { loanProcessingSummary } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailFinancingFacility from '@/hooks/services/bucket/financing-facility/useGetDetailFinancingFacility';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDetailProcessingType from '@/components/shared/SmiSection/PK/hooks/useGetDetailProcessingType';
import useGetDetailSyariahFacility from '@/components/shared/SmiSection/PK/hooks/useGetDetailSyariahFacility';
import useGetFinancingFacilityMapping from '@/components/shared/SmiSection/PK/hooks/useGetFinancingFacilityMapping';
import useGetListFinancingPk from '@/components/shared/SmiSection/PK/hooks/useGetListFinancingPk';
import useSendFacilityEmail from '@/components/shared/SmiTable/TablePaymentFacility/hooks/useSendFacilityEmail';

import useGetLovParentSyariah from '../hooks/useGetLovParentSyariah';
import useGetParentLimitData from '../hooks/useGetParentLimitData';
import useSaveChildLimit from '../hooks/useSaveChildLimit';
import useSaveParentLimit from '../hooks/useSaveParentLimit';

import { formData, validation } from './ParentLimit.form';


type DropdownOption = { id?: string | number; label: string; value?: string };

interface ParentLimitData {
  tracerId?: string;
  limitId: string;
  idPipeline: string;
  mataUang: DropdownOption | null;
  nominalFasilitasLimit: number;
  tanggalBerlaku: string | null;
  maksimalPenggunaan: number;
  tanggalInputLimit: string | null;
  tanggalBerakhir: string | null;
  frekuensiReview: string;
  cifKelompok: string;
  nilaiFasilitasOnline: number;
  totalOutstanding: number;
  nilaiKelonggaranTarik: number;
  penandaBMPK: boolean;
  catatan: string;
  availableMarker: boolean;
  countryOfRisk: DropdownOption | null;
  countryPercent: number;
  onlineUpdate: boolean;
  cabangPembukaan: DropdownOption | null;
  cifParent: string;
  keteranganBMPK: string;
  sebelumRestrukturisasi: number;
  datiLokasiProyek: DropdownOption | null;
  baruPerpanjang: number;
  golonganKredit: DropdownOption | null;
  jenisPenggunaan: DropdownOption | null;
  orientasiPenggunaan: DropdownOption | null;
  sifatPiutang: DropdownOption | null;
  dateFrekuensiReview: string | null;
  intervalFrekuensiReview: string | null;
  onlyDateFrekuensiReview: DropdownOption | null;
  parentType: DropdownOption | null;
  idLimitInduk: DropdownOption | null;
}

interface UseParentLimitProps {
  facilityId?: string | null;
  recordId?: string | null;
  financingFacilityId?: string | null;
  onSuccessCallback?: () => void;
}

export const useParentLimit = ({
  facilityId,
  recordId,
  financingFacilityId,
  onSuccessCallback,
}: UseParentLimitProps = {}) => {
  const searchParams = useSearchParams();
  const { processId, debtorId, parentId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const router = useRouter();
  const path = usePathname();
  const isDetail = searchParams.get('viewOnly') === 'true';
  const lpsMode = searchParams.get('lpsMode') === 'true';
  const isFromLimitInduk = searchParams.get('fromLimitInduk') === 'true';
  const isLpsMode = lpsMode;
  const { recordActivity } = useRecordLog();
  const { mutate: saveMutate, isPending: isSaving } = useSaveParentLimit();
  const { mutate: getParentLimitData, isPending: isLoadingParentLimit } = useGetParentLimitData({
    onError: (error: any) => {
      console.log('error', error);
      showNiceModalV2({ title: error?.message, type: 'error' });
    },
  });
  const { mutate: saveChildLimit } = useSaveChildLimit({});
  const { mutate: sendFacilityEmail } = useSendFacilityEmail({});
  const [initialParentType, setInitialParentType] = useState<string | null>(null);
  const [isParent, setIsParent] = useState<boolean>(false);

  const {
    masintonForm: parentLimitData,
    masintonChange: setParentLimitDataField,
    masintonMultiChange: setParentLimitDataMulti,
    masintonSubmit,
    masintonReplace,
    masintonValidation,
    masintonReset,
  } = useMasintonForm(formData, isFromLimitInduk ? {
    ...validation,
    parentType: [],
  } : validation);
  const params = useSearchParams();

  const payload = {
    bucketProcessId: processId,
    facilityId: params.get('facilityId') ? params.get('facilityId')?.split(',')[0] : undefined,
    parentSyariahLimitId: params.get('parentSyariahLimitId') || undefined,
  };


  const { data: detailData, isLoading: isLoadingDetail } = useGetDetailSyariahFacility({ filter: payload }, !!params.get('parentSyariahLimitId'));

  const { data: detailDataParent } = useGetDetailFinancingFacility(payload, !!params.get('facilityId') || !!params.get('viewOnly'));

  const { data: countryOptions = []} = useGetParameterList(Modules.COUNTRY);
  const { data: sifatOptions = []} = useGetParameterList(Modules.LOAN_TYPE);
  const { data: useTypeOptions = []} = useGetParameterList(Modules.TYPE_OF_USE);
  const { data: districtOptions = []} = useGetParameterList(Modules.DISTRICT);
  const { data: golonganOptions = []} = useGetParameterList(Modules.GOLONGAN_KREDIT);
  const { data: orientasiOptions = []} = useGetParameterList(Modules.ORIENTASI_PENGGUNAAN);
  const { data: intervalFrequencyOptions = []} = useGetParameterList('intervalFrekuensiReview');
  const { data: parentTypeOptions = []} = useGetParameterList('parentType');
  const { data: idLimitIndukOptions } = useGetLovParentSyariah({ enabled: true, debtorId });

  const {
    data: pkDetail,
  } = useGetDetailProcessingType(
    { bucketProcessId: parentId, id: 0 },
    { enabled: lpsMode }
  );

  const { data: mappingData } = useGetFinancingFacilityMapping(
    {
      bucketParentId: processId,
    },
    true
  );

  const payloadFilter: any = {
    bucketProcessId: processId,
    module: lpsMode ? TypeModule.LPS : TypeModule.ENGAGEMENT_AGREEMENT,
    process: lpsMode ? TypeProcess.LPS_CORE : TypeProcess.ENGAGEMENT_AGREEMENT,
  };

  const { data: facilityListContents } = useGetListFinancingPk(
    {
      filter: payloadFilter,
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
    },
    {
      bucketParentId: lpsMode ? pkDetail?.bucketParentId : processId,
    }
  );

  const tableData = useMemo(() => {
    if (facilityListContents) {
      const listFacility = JSON.parse(localStorage.getItem('facilityhasUsed') || '[]');
      let transformedData = facilityListContents.map((data) => {
        if (lpsMode || viewOnly) {
          if (listFacility.includes(data.facilityId)) {
            return data;
          }
        } else {
          if (!listFacility.includes(data.facilityId)) {
            return data;
          }
        }
        return null;
      });

      transformedData = transformedData.filter((facility) => facility?.financingSegment === 'SYARIAH');

      if (lpsMode) {
        // Simple filter for LPS mode
        return transformedData;
      }

      return transformedData;
    }
    return [];
  }, [facilityListContents, lpsMode, viewOnly]);

  const selected = useMemo(() => {
    if (detailData?.contents.length > 0) {
      const childrenOfThisParent = detailData?.contents?.[0]?.childLimit?.map((item: any) => item.facilityId);
      return Array.from(new Set([...(facilityId?.split(',') || []), ...(childrenOfThisParent || [])]));
    }
    return facilityId?.split(',') || [];
  }, [detailData, facilityId]);

  const isWhiteListProcess = useMemo(() => {
    const currentModule = lpsMode ? TypeModule.LPS : TypeModule.ENGAGEMENT_AGREEMENT;
    const currentProcess = lpsMode ? TypeProcess.LPS_CORE : TypeProcess.ENGAGEMENT_AGREEMENT;

    return (currentModule === TypeModule.ENGAGEMENT_AGREEMENT && currentProcess === TypeProcess.ENGAGEMENT_AGREEMENT) ||
      (currentModule === TypeModule.LPS && currentProcess === TypeProcess.LPS_CORE);
  }, [lpsMode]);

  const isAnyFieldChanged = useMemo(() => {
    const data = detailData?.contents?.[0] || detailDataParent;
    if (!data) return false;

    const normalizeValue = (value: any) => {
      if (value === null || value === undefined) return '';

      // If it's a Date object (from form)
      if (value instanceof Date) return formatDate(value, 'YYYY-MM-DD');

      // If it's a date string from API (ISO format)
      if (typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value))) {
        try {
          return formatDate(parseISO(value), 'YYYY-MM-DD');
        } catch (e) {
          return value;
        }
      }

      const strValue = value.toString().trim().replace(/,/g, '');
      const numValue = parseFloat(strValue);

      // Only treat as number if its purely numeric (to avoid parsing dates 2024-01-01 as 2024)
      if (!isNaN(numValue) && /^-?\d+\.?\d*$/.test(strValue)) {
        return numValue.toFixed(2);
      }

      return strValue;
    };

    const fieldsToCompare = [
      { current: parentLimitData.nominalFasilitasLimit.value, name: 'nominalFasilitasLimit', original: data.orderValue },
      { current: parentLimitData.mataUang.value?.value, name: 'mataUang', original: data.currencyOrderValue },
      { current: parentLimitData.maksimalPenggunaan.value, name: 'maksimalPenggunaan', original: data.plafondCash },
      { current: parentLimitData.catatan.value, name: 'catatan', original: data.notes },
      { current: parentLimitData.cifKelompok.value, name: 'cifKelompok', original: data.cifGroup },
      { current: parentLimitData.keteranganBMPK.value, name: 'keteranganBMPK', original: data.bmppNotes },
      { current: parentLimitData.cifParent.value, name: 'cifParent', original: data.cifParent },
      { current: parentLimitData.countryOfRisk.value?.value, name: 'countryOfRisk', original: data.countryOfRisk },
      { current: parentLimitData.countryPercent.value, name: 'countryPercent', original: data.countryPercent },
      { current: parentLimitData.onlineUpdate.value ? 'Y' : null, name: 'onlineUpdate', original: data.onlineUpdate },
      { current: parentLimitData.sebelumRestrukturisasi.value, name: 'sebelumRestrukturisasi', original: data.plafondBefore },
      { current: parentLimitData.datiLokasiProyek.value?.value, name: 'datiLokasiProyek', original: data.projectLocate },
      { current: parentLimitData.baruPerpanjang.value, name: 'baruPerpanjang', original: data.newExtend },
      { current: parentLimitData.golonganKredit.value?.value, name: 'golonganKredit', original: data.creditCategory },
      { current: parentLimitData.jenisPenggunaan.value?.value, name: 'jenisPenggunaan', original: data.typeOfUse },
      { current: parentLimitData.orientasiPenggunaan.value?.value, name: 'orientasiPenggunaan', original: data.usageOrientation },
      { current: parentLimitData.sifatPiutang.value?.value, name: 'sifatPiutang', original: data.loanCharc },
      { current: parentLimitData.tanggalBerlaku.value, name: 'tanggalBerlaku', original: data.activationDate },
      { current: parentLimitData.tanggalBerakhir.value, name: 'tanggalBerakhir', original: data.maturityDate },
    ];

    for (const field of fieldsToCompare) {
      const current = normalizeValue(field.current);
      const original = normalizeValue(field.original);
      if (current !== original) {
        console.log(`[ParentLimit] Field "${field.name}" changed:`, { current, original });
        return true;
      }
    }

    return false;
  }, [parentLimitData, detailData, detailDataParent]);

  useEffect(() => {
    if (detailData?.contents || detailDataParent) {
      const data = detailData?.contents?.[0] || detailDataParent;
      const countryOption = countryOptions.find((option) => option.value === data?.countryOfRisk);
      const districtOption = districtOptions.find((option) => option.value === data?.projectLocate);
      const golonganOption = golonganOptions.find((option) => option.value === data?.creditCategory);
      const useTypeOption = useTypeOptions.find((option) => option.value === data?.typeOfUse);
      const orientasiOption = orientasiOptions.find((option) => option.value === data?.usageOrientation);
      const sifatOption = sifatOptions.find((option) => option.value === data?.loanCharc);

      if (initialParentType === null) {
        setInitialParentType(data?.parentLimitType);
      }
      setIsParent(!!data?.isParent);

      setParentLimitDataMulti({
        availableMarker: data?.availableMarker === 'Y',
        baruPerpanjang: data?.newExtend,
        cabangPembukaan: { label: 'Head Office - SMI', value: 'ID0010002' },
        catatan: data?.notes,
        cifKelompok: data?.cifGroup,
        countryOfRisk: countryOption,
        countryPercent: data?.countryPercent ? data?.countryPercent : 100,
        datiLokasiProyek: districtOption,
        frekuensiReview: data?.reviewFrequency,
        golonganKredit: golonganOption,
        idPipeline: data?.pipelineId,
        jenisPenggunaan: useTypeOption,
        keteranganBMPK: data?.bmppNotes,
        cifParent: data?.cifParent,
        limitId: '',
        maksimalPenggunaan: data?.plafondCash,
        mataUang: { label: data?.currencyOrderValue, value: data?.currencyOrderValue },
        nilaiFasilitasOnline: data?.onlineFacilityValue,
        nilaiKelonggaranTarik: data?.drawDownFlexibility,
        nominalFasilitasLimit: data?.orderValue,
        nominalFasilitasLimitInIDR: data?.totalOrderValue,
        onlineUpdate: data?.onlineUpdate === 'Y',
        orientasiPenggunaan: orientasiOption,
        penandaBMPK: data?.bmpkFlag === 'Y',
        sebelumRestrukturisasi: data?.plafondBefore,
        sifatPiutang: sifatOption,
        tanggalBerakhir: data?.maturityDate ? parseISO(data?.maturityDate) : null,
        tanggalBerlaku: data?.activationDate ? parseISO(data?.activationDate) : null,
        tanggalInputLimit: data?.facilityCreateDate ? parseISO(data?.facilityCreateDate) : null,
        totalOutstanding: data?.osPrincipal,
        ...(data?.reviewFrequency ? formatFrequencyReview(data?.reviewFrequency) : {
          dateFrekuensiReview: '',
          intervalFrekuensiReview: '',
          frekuensiReview: '',
          onlyDateFrekuensiReview: '',
        }),
        parentType: parentTypeOptions.find((option) => option.value === data?.parentLimitType) || null,
        idLimitInduk: idLimitIndukOptions.find((option) => option.label === data?.parentSyariahLimitIdExisting) || null,
      });
    }
  }, [
    detailData,
    countryOptions,
    districtOptions,
    golonganOptions,
    useTypeOptions,
    orientasiOptions,
    sifatOptions,
    parentTypeOptions,
    idLimitIndukOptions,
  ]);

  const handleChange = (field: string, value: any) => {
    if (field === 'parentType') {
      const isNewValue = value?.value === 'NEW';
      if (isParent && initialParentType === 'EXISTING' && isNewValue) {
        showNiceModalV2({
          cancelText: 'Tidak',
          onSubmit: () => {
            const previouslyMappedToThisParent =
              mappingData?.contents
                ?.filter((item) => item.financingFacilityId === Number(financingFacilityId))
                .map((item) => item.facilityId) || [];

            const selectedSet = new Set(selected);

            const allSelectedFacilities = selected.map((facId) => {
              const mappingInfo = mappingData?.contents?.find((item) => item.facilityId === facId);
              return {
                bucketProcessId: mappingInfo?.bucketProcessId || processId,
                facilityId: facId,
              };
            });

            const displayedFacilityIds = new Set(tableData.map((item) => item.facilityId));

            const toBeRemovedFacilities = previouslyMappedToThisParent
              .filter((facId) => !selectedSet.has(facId) && displayedFacilityIds.has(facId))
              .map((facId) => {
                const mappingInfo = mappingData?.contents?.find((item) => item.facilityId === facId);
                return {
                  bucketProcessId: mappingInfo?.bucketProcessId || processId,
                  facilityId: facId,
                };
              });

            const allFacilities = [...allSelectedFacilities, ...toBeRemovedFacilities];
            const listFacilityId = allFacilities.map((facility) => facility.facilityId);

            saveChildLimit({
              bucketProcessId: processId,
              facilityId: listFacilityId,
              module: lpsMode ? TypeModule.LPS : TypeModule.ENGAGEMENT_AGREEMENT,
              parentSyariahLimitIdPrevious: searchParams.get('parentSyariahLimitId') || null,
              process: lpsMode ? TypeProcess.LPS_CORE : TypeProcess.ENGAGEMENT_AGREEMENT,
            }, {
              onSuccess: (res: any) => {
                const queryParams = new URLSearchParams({
                  parentSyariahLimitId: res?.data?.content?.parentSyariahLimitId || '',
                  ...(lpsMode && { lpsMode: 'true' }),
                  ...(isFromLimitInduk && { fromLimitInduk: 'true' }),
                });

                router.push(`${path}?${queryParams.toString()}`);
                setParentLimitDataField(field, value);
              },
            });
          },
          submitText: 'Ya',
          title: 'Apakah anda yakin ingin mengubah tipe parent limit? perubahan yang anda ubah tidak akan disimpan',
          type: 'warning',
        });
        return;
      }
    }
    if (field === 'intervalFrekuensiReview') {
      masintonReplace({
        ...parentLimitData,
        intervalFrekuensiReview: { value: value, error: false, errorMessage: '' },
        frekuensiReview: { value: '', error: false, errorMessage: '' },
        onlyDateFrekuensiReview: { value: '', error: false, errorMessage: '' },
        dateFrekuensiReview: { value: '', error: false, errorMessage: '' },
      });
    }
    if (field === 'idLimitInduk' && value?.label) {
      getParentLimitData({ parentId: value?.label, parentSyariahLimitId: searchParams.get('parentSyariahLimitId') || value.value.toString() }, {
        onSuccess: (res) => {
          const data = res?.data;
          if (data) {
            setParentLimitDataMulti({
              idLimitInduk: value, // Tetapkan nilai yang dipilih agar tidak hilang
              availableMarker: data.availableMarker === 'Y',
              baruPerpanjang: data.newExtend ? 1 : 0,
              keteranganBMPK: data.bmppNotes,
              cabangPembukaan: { label: 'Head Office - SMI', value: 'ID0010002' },
              catatan: data.notes,
              cifKelompok: data.cifGroup,
              cifParent: data.cifParent,
              countryOfRisk: countryOptions.find((o) => o.value === data.countryOfRisk) || null,
              countryPercent: data.countryPercent,
              golonganKredit: golonganOptions.find((o) => o.value === data.creditCategory) || null,
              datiLokasiProyek: districtOptions.find((o) => o.value === data.projectLocate) || null,
              idPipeline: data.pipelineId,
              sifatPiutang: sifatOptions.find((o) => o.value === data.loanCharc) || null,
              maksimalPenggunaan: data.plafondCash,
              mataUang: { label: data.currencyOrderValue, value: data.currencyOrderValue },
              nilaiFasilitasOnline: data.onlineFacilityValue,
              nominalFasilitasLimitInIDR: data.totalOrderValue,
              nilaiKelonggaranTarik: data.drawDownFlexibility,
              nominalFasilitasLimit: data.orderValue,
              onlineUpdate: data.onlineUpdate,
              orientasiPenggunaan: orientasiOptions.find((o) => o.value === data.usageOrientation) || null,
              penandaBMPK: data.bmpkFlag === 'Y',
              sebelumRestrukturisasi: data.plafondBefore,
              tanggalBerakhir: data.maturityDate ? parseISO(data.maturityDate) : null,
              tanggalBerlaku: data.activationDate ? parseISO(data.activationDate) : null,
              tanggalInputLimit: data.facilityCreateDate ? parseISO(data.facilityCreateDate) : null,
              totalOutstanding: data.osPrincipal,
              jenisPenggunaan: useTypeOptions.find((o) => o.value === data.typeOfUse) || null,
              ...(data?.reviewFrequency
                ? formatFrequencyReview(data.reviewFrequency)
                : {
                  dateFrekuensiReview: '',
                  intervalFrekuensiReview: '',
                  frekuensiReview: '',
                  onlyDateFrekuensiReview: '',
                }),
            });
          }
        },
      });
      return;
    }

    setParentLimitDataField(field, value);
  };

  const getDropdownValue = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.id || field.value || '';
  };

  const formatFrequencyReview = (value: string) => {
    const splitValue = value.split('');
    type FrequencyReviewFormat = {
      dateFrekuensiReview?: string;
      intervalFrekuensiReview?: string;
      frekuensiReview?: string;
      onlyDateFrekuensiReview?: string;
    };

    let newFormattedValue: FrequencyReviewFormat = {
      dateFrekuensiReview: '',
      intervalFrekuensiReview: '',
      frekuensiReview: '',
      onlyDateFrekuensiReview: '',
    };

    let tempOnlyDateFrekuensiReview = '';
    let tempFrekuensiReview = '';

    for (let i = 0; i < splitValue.length; i++) {
      if (splitValue[i] !== undefined) {
        if (i <= 7) {
          newFormattedValue.dateFrekuensiReview += splitValue[i];
        } else if (Number.isNaN(Number(splitValue[i]))) {
          newFormattedValue.intervalFrekuensiReview += splitValue[i];
        } else if (value.includes('M') && i >= splitValue.length - 2) {
          tempOnlyDateFrekuensiReview += splitValue[i];
        } else {
          tempFrekuensiReview += splitValue[i];
        }
      }
    }
    return {
      ...newFormattedValue,
      intervalFrekuensiReview: intervalFrequencyOptions.find((option) =>
        option.value === newFormattedValue.intervalFrekuensiReview),
      onlyDateFrekuensiReview: {
        value: tempOnlyDateFrekuensiReview.charAt(0) === '0' ? tempOnlyDateFrekuensiReview.charAt(1) : tempOnlyDateFrekuensiReview,
        label: tempOnlyDateFrekuensiReview.charAt(0) === '0' ? tempOnlyDateFrekuensiReview.charAt(1) : tempOnlyDateFrekuensiReview,
      },
      frekuensiReview: tempFrekuensiReview.charAt(0) === '0' ? tempFrekuensiReview.charAt(1) : tempFrekuensiReview,
    };
  };

  const joinFrequencyReview = () => {
    const onlydate = parentLimitData.onlyDateFrekuensiReview.value?.value?.toString().length === 1 ?
      '0' + parentLimitData.onlyDateFrekuensiReview.value?.value?.toString() : parentLimitData.onlyDateFrekuensiReview.value?.value?.toString();
    const frekuensi = parentLimitData.intervalFrekuensiReview?.value?.value === 'M'
      && parentLimitData.frekuensiReview.value.toString().length === 1 ?
      '0' + parentLimitData.frekuensiReview.value : parentLimitData.frekuensiReview.value;
    const interval = parentLimitData.intervalFrekuensiReview?.value?.value;
    const date = parentLimitData.dateFrekuensiReview.value;

    console.log('parentLimitData', formatFrequencyReview(`${date || ''}${interval || ''}${frekuensi || ''}${onlydate || ''}`));
    return `${date || ''}${interval || ''}${frekuensi || ''}${onlydate || ''}`;
  };

  const mapFormToPayload = () => {
    const formValues = masintonSubmit() as any;

    const payload: any = {
      module: lpsMode ? TypeModule.LPS : TypeModule.ENGAGEMENT_AGREEMENT,
      process: lpsMode ? TypeProcess.LPS_CORE : TypeProcess.ENGAGEMENT_AGREEMENT,
      bucketProcessId: processId,
      pipelineId: formValues.idPipeline,
      currencyOrderValue: getDropdownValue(formValues.mataUang),
      orderValue: formValues.nominalFasilitasLimit || 0,
      totalOrderValue: getDropdownValue(formValues.mataUang) === 'USD' ? (formValues.nominalFasilitasLimitInIDR || 0) : (formValues.nominalFasilitasLimit || 0),
      plafondCash: formValues.maksimalPenggunaan || 0,
      activationDate: formValues.tanggalBerlaku
        ? formatDate(formValues.tanggalBerlaku, 'YYYY-MM-DD')
        : '',
      maturityDate: formValues.tanggalBerakhir
        ? formatDate(formValues.tanggalBerakhir, 'YYYY-MM-DD')
        : '',
      facilityCreatedDate: formValues.tanggalInputLimit
        ? formatDate(formValues.tanggalInputLimit, 'YYYY-MM-DD')
        : '',
      reviewFrequency: joinFrequencyReview(),
      cifGroup: formValues.cifKelompok,
      onlineFacilityValue: formValues.nilaiFasilitasOnline,
      osPrincipal: formValues.totalOutstanding,
      drawDownFlexibility: formValues.nilaiKelonggaranTarik,
      bmpkFlag: formValues.penandaBMPK ? 'Y' : 'N',
      notes: formValues.catatan,
      availableMarker: formValues.availableMarker ? 'Y' : 'N',
      countryOfRisk: getDropdownValue(formValues.countryOfRisk),
      countryPercent: formValues.countryPercent,
      onlineUpdate: formValues.onlineUpdate ? 'Y' : null,
      coBook: getDropdownValue(formValues.cabangPembukaan) + '-' + formValues.cabangPembukaan?.label,
      cif: formValues.cifParent,
      bmppNotes: formValues.keteranganBMPK,
      plafondBefore: formValues.sebelumRestrukturisasi,
      projectLocate: formValues.datiLokasiProyek?.value || getDropdownValue(formValues.datiLokasiProyek),
      newExtend: formValues.baruPerpanjang ? 1 : 0,
      creditCategory: formValues.golonganKredit?.value || getDropdownValue(formValues.golonganKredit),
      typeOfUse: formValues.jenisPenggunaan?.value || getDropdownValue(formValues.jenisPenggunaan),
      usageOrientation: formValues.orientasiPenggunaan?.value || getDropdownValue(formValues.orientasiPenggunaan),
      loanCharc: formValues.sifatPiutang?.value || getDropdownValue(formValues.sifatPiutang),
      parentLimitType: getDropdownValue(formValues.parentType),
      parentSyariahLimitIdTemenos: getDropdownValue(formValues.parentType) !== 'NEW' ? formValues.idLimitInduk?.label : null,
    };

    if (recordId && facilityId) {
      payload.tracerId = recordId;
      payload.idFacility = facilityId.split(',');
    }
    else if (facilityId && !recordId) {
      payload.idFacility = facilityId.split(',');
    } else {
      payload.idFacility = typeof detailData?.contents[0]?.facilityId === 'string' ? detailData?.contents[0]?.facilityId.split(',') : detailData?.contents[0]?.facilityId;
    }
    payload.parentSyariahLimitId = searchParams.get('parentSyariahLimitId') || undefined;
    return payload;
  };

  const autoSavePayload = useMemo(() => () => {
    const payload = mapFormToPayload();
    return Promise.resolve(payload);
  }, [parentLimitData, processId, facilityId, recordId, detailData]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly && !isDetail && !isLoadingDetail,
    payload: autoSavePayload,
    url: 'bucket.facilitySyariah.save',
  });

  // handle save
  const handleSave = () => {
    if (!masintonValidation({
      ignoreValidation: (isFromLimitInduk || parentLimitData.parentType.value?.value !== 'EXISTING') ? ['idLimitInduk'] : [],
    })) return;

    const payload = mapFormToPayload();

    console.log('Payload Parent Limit:', payload);

    const isExisting = parentLimitData.parentType.value?.value === 'EXISTING';
    const shouldShowAlertAndEmail = isWhiteListProcess && isAnyFieldChanged && isExisting;

    console.log('isWhiteListProcess', isWhiteListProcess);
    console.log('isAnyFieldChanged', isAnyFieldChanged);
    console.log('isExisting', isExisting);
    console.log('shouldShowAlertAndEmail', shouldShowAlertAndEmail);

    const executeSave = () => {
      saveMutate(payload, {
        onSuccess: (response) => {
          recordActivity({
            activity: ActivityType.SAVE,
            bucketProcessId: processId,
            changeAfter: JSON.stringify(payload),
            changeBefore: '',
            module: lpsMode ? TypeModule.LPS : TypeModule.ENGAGEMENT_AGREEMENT,
            process: lpsMode ? TypeProcess.LPS_CORE : TypeProcess.ENGAGEMENT_AGREEMENT,
            remarks: 'Save Parent Limit Data',
          });

          if (shouldShowAlertAndEmail) {
            sendFacilityEmail({
              bucketProcessId: processId,
              debtorId,
              facilityId: response?.data?.content?.facilityId,
            });
          }

          showNiceModalV2({
            title: 'Data Parent Limit berhasil disimpan',
            type: 'success',
            onClose: () => {
              if (lpsMode) {
                router.push(loanProcessingSummary.BUCKET_LPS_CORE + '/' + processId + '/financing-facility');
              } else {
                router.push('/loan-processing/engagement-submission/bucket-list/' + processId + '/facility-overview');
              }
            },
          });
        },
        onError: (error: any) => {
          showNiceModalV2({
            title: `Gagal menyimpan data: ${error.message || 'Unknown error'}`,
            type: 'error',
          });
        },
      });
    };

    if (shouldShowAlertAndEmail) {
      showNiceModalV2({
        onSubmit: () => {
          executeSave();
        },
        submitText: 'Yes',
        title: 'Data yang dipilih memerlukan pembaruan di Temenos. Kirim permintaan perubahan?',
        type: 'warning',
      });
    } else {
      executeSave();
    }
  };

  const checkValueEmpty = (value: string) => {
    return value === '' || value === null || value === undefined;
  };

  const checkValidationFrekuensiReview = (value: string) => {
    if (value === 'DAILY' || value === 'BSNSS') {
      return checkValueEmpty(parentLimitData.dateFrekuensiReview.value);
    } else if (value === 'WEEK') {
      return checkValueEmpty(parentLimitData.frekuensiReview.value)
        || checkValueEmpty(parentLimitData.dateFrekuensiReview.value);
    } else if (value === 'M') {
      return checkValueEmpty(parentLimitData.onlyDateFrekuensiReview.value?.value)
        || checkValueEmpty(parentLimitData.frekuensiReview.value)
        || checkValueEmpty(parentLimitData.dateFrekuensiReview.value);
    } else {
      return false;
    }
  };

  const isMandatory =
    parentLimitData.tanggalBerakhir?.value === null ||
    parentLimitData.tanggalInputLimit?.value === null ||
    parentLimitData.maksimalPenggunaan?.value === '' ||
    parentLimitData.tanggalBerlaku?.value === null ||
    parentLimitData.nominalFasilitasLimit?.value === '' ||
    parentLimitData.idPipeline?.value === '' ||
    (!isFromLimitInduk && parentLimitData.parentType?.value?.value === undefined) ||
    (!isFromLimitInduk && parentLimitData.parentType?.value?.value === 'EXISTING' && (parentLimitData.idLimitInduk.value === '' || parentLimitData.idLimitInduk.value === null || parentLimitData.idLimitInduk.value?.value === undefined)) ||
    parentLimitData.cabangPembukaan?.value?.value === undefined ||
    parentLimitData.mataUang?.value?.value === undefined ||
    checkValidationFrekuensiReview(parentLimitData.intervalFrekuensiReview?.value?.value);

  return {
    idLimitIndukOptions,
    isLoadingParentLimit,
    isAutoSaveFetching,
    isFromLimitInduk,
    isMandatory,
    handleSave,
    isSaving,
    parentTypeOptions,
    isLpsMode,
    parentLimitData,
    setParentLimitData: setParentLimitDataMulti,
    handleChange,
    masintonReset,
    viewOnly,
    isDetail,
    intervalFrequencyOptions,
  };
};
