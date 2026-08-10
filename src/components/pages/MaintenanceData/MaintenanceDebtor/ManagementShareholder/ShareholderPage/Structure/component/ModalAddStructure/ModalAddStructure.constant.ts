import * as yup from 'yup';


export const structureSchema = yup.object().shape({
  beneficialOwner: yup.string().nullable(),
  informationSource: yup.string().nullable(),
  level: yup.number().nullable(),
  name: yup.string()
    .required('Nama tidak boleh kosong')
    .test(
      'no-institution-words',
      'Nama diketik tanpa tipe institusi (PT/PEMKOT/PEMKAB/DLL)',
      (value) => {
        if (!value) return true;
        const banned = ['PT', 'PEMKOT', 'PEMKAB', 'PEMPROV', 'BUMN', 'BUMD', 'CV', 'KEMEN', 'PEMDES', 'BPD'];
        const upper = value.toUpperCase();
        return !banned.some((word) => new RegExp(`(^|\\s)${word}(\\s|$)`, 'i').test(upper));
      },
    )
    .test(
      'capitalization-first-only-in-every-word',
      'Huruf kapital hanya di awal nama setiap kata',
      (value) => {
        if (!value) return true;
        const words = value.split(' ');
        return words.every((word) => {
          const trimmed = word.trim();
          const rest = trimmed.slice(1);
          return !/[A-Z]/.test(rest);
        });
      },
    ),
  parentId: yup.string().required('Nama Shareholder Tingkat Sebelumnya wajib diisi'),
  percentage: yup.string().nullable(),
  prefix: yup.string().nullable(),
  shareholderCode: yup.string().nullable(),
  shares: yup.string().nullable(),
  suffix: yup.string().nullable(),
  type: yup.string().required('Tipe wajib diisi'),
});
