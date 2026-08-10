import {
  AlIjarahForm,
  AlMudharabahForm,
  AlMusyarakah,
  ImbtForm,
  ImfzForm,
  AlMusyarakahMutanaqisahForm,
  AlMurabahahForm,
  AlIstishnaForm,
  AlQardh,
} from './forms';

import type SyariahFormProps from './SyariahForm.type';


const SyariahForm = (props: SyariahFormProps) => {
  const { paymentScheme, financingFacilityData } = props;


  switch (paymentScheme) {
    case 'AL_MUSYARAKAH':
      return <AlMusyarakah
        financingFacilityData={financingFacilityData}
      />;
    case 'AL_MUSYARAKAH_MUTANAQISAH_MMQ':
      return <AlMusyarakahMutanaqisahForm
        financingFacilityData={financingFacilityData}
      />;
    case 'AL_MURABAHAH':
      return <AlMurabahahForm
        financingFacilityData={financingFacilityData}
      />;
    case 'AL_ISTISHNA':
      return <AlIstishnaForm financingFacilityData={financingFacilityData} />;
    case 'AL_QARDH':
      return <AlQardh financingFacilityData={financingFacilityData} />;
    case 'AL_IJARAH':
      return <AlIjarahForm financingFacilityData={financingFacilityData} />;
    case 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ':
      return <ImfzForm financingFacilityData={financingFacilityData} />;
    case 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT':
      return <ImbtForm financingFacilityData={financingFacilityData} />;
    case 'AL_MUDHARABAH':
      return <AlMudharabahForm
        financingFacilityData={financingFacilityData}
      />;
    default:
      return <></>;
  }

};

export default SyariahForm;
