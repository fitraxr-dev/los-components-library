import { useForm } from 'react-hook-form';


const useLpaPageDetail = () => {

  const { control } = useForm({
    defaultValues: {
      creatorName: '',
      divisionCreator: '',
      idProcess: '',
      namaDokumen: '',
      namaJenis: '',
      noDokumen: '',
      status: '',
      tanggalDokumen: '',
      uploadedBy: '',
      uploadedDate: '',
    },
    reValidateMode: 'onBlur',
  });


  return {
    control,
  };

};

export default useLpaPageDetail;
