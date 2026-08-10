import {
  AlIjarahForm,
  AlMudharabahForm,
  AlMusyarakah,
  ImbtForm,
  ImfzForm,
  AlMusyarakahMutanaqisah,
  AlMurabahahForm,
  AlIstishnaForm,
  AlQardh,
} from './forms';

import type SyariahFormProps from './SyariahForm.type';


const SyariahForm = (props: SyariahFormProps) => {
  const { paymentScheme, onChangeSyariahForm, financingFacilityData, existing, facilityId } = props;

  switch (paymentScheme) {
    case 'AL_MUSYARAKAH':
      return <AlMusyarakah
        onChangeSyariahForm={onChangeSyariahForm}
        financingFacilityData={financingFacilityData}
        existing={existing}
        facilityId={facilityId}
      />;
    case 'AL_MUSYARAKAH_MUTANAQISAH_MMQ':
      return <AlMusyarakahMutanaqisah
        onChangeSyariahForm={onChangeSyariahForm}
        financingFacilityData={financingFacilityData}
        existing={existing}
        facilityId={facilityId}
      />;
    case 'AL_MURABAHAH':
      return <AlMurabahahForm
        onChangeSyariahForm={onChangeSyariahForm}
        financingFacilityData={financingFacilityData}
        existing={existing}
        facilityId={facilityId}
      />;
    case 'AL_ISTISHNA':
      return <AlIstishnaForm
        onChangeSyariahForm={onChangeSyariahForm}
        financingFacilityData={financingFacilityData}
        existing={existing}
        facilityId={facilityId}
      />;
    case 'AL_QARDH':
      return <AlQardh
        onChangeSyariahForm={onChangeSyariahForm}
        financingFacilityData={financingFacilityData}
        existing={existing}
        facilityId={facilityId}
      />;
    case 'AL_IJARAH':
      return <AlIjarahForm
        onChangeSyariahForm={onChangeSyariahForm}
        financingFacilityData={financingFacilityData}
        existing={existing}
        facilityId={facilityId}
      />;
    case 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ':
      return <ImfzForm
        onChangeSyariahForm={onChangeSyariahForm}
        financingFacilityData={financingFacilityData}
        existing={existing}
        facilityId={facilityId}
      />;
    case 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT':
      return <ImbtForm
        onChangeSyariahForm={onChangeSyariahForm}
        financingFacilityData={financingFacilityData}
        existing={existing}
        facilityId={facilityId}
      />;
    case 'AL_MUDHARABAH':
      return <AlMudharabahForm
        onChangeSyariahForm={onChangeSyariahForm}
        financingFacilityData={financingFacilityData}
        existing={existing}
        facilityId={facilityId}
      />;
    default:
      return <></>;
  }

};

export default SyariahForm;
