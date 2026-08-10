import { useMemo } from 'react';


export type UseCheckFileDokumentOptions = {
  // maxFileSizeBytes?: number;
  acceptableMimeTypes?: string[];
  acceptableFormatsText?: string;
};

export type ValidateResult = {
  isValid: boolean;
  errorMessage: string;
};

// Default: 100MB (disabled - no file size limit)
// export const DEFAULT_MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

// Default acceptable types used across the app
export const DEFAULT_ACCEPTABLE_MIME_TYPES: string[] = [
  // Images
  'image/jpg',
  'image/jpeg',
  // 'image/tiff',
  'image/png',
  // 'image/gif',
  // Office documents
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  // PDF
  'application/pdf',
  // Video/Audio
  // 'audio/mpeg', // .mp3
  // 'video/mp4', // .mp4
  //ZIP
  '.zip',
  'application/x-zip-compressed',
  'application/zip',
  'application/x-compressed'
];

export const DOCX_ONLY_MIME_TYPES: string[] = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const XLSX_ONLY_MIME_TYPES: string[] = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
];

export const PDF_ONLY_MIME_TYPES: string[] = [
  'application/pdf',
];

// Utility to safely extract File, size and type from various input shapes used in the codebase
// Accepts either a native File, or objects like { file: File, name: string }
function extractFileLike(input: any): { size: number; type: string } | null {
  const candidate = input?.file instanceof File ? input.file : (input instanceof File ? input : null);
  if (candidate) {
    return { size: candidate.size ?? 0, type: candidate.type ?? '' };
  }
  // Fallbacks if consumers pass plain objects with size/type
  if (typeof input?.size === 'number' || typeof input?.type === 'string') {
    return { size: Number(input?.size ?? 0), type: String(input?.type ?? '') };
  }
  return null;
}

export default function useCheckFileDokument(
  options?: UseCheckFileDokumentOptions,
) {
  // const maxFileSizeBytes = options?.maxFileSizeBytes ?? DEFAULT_MAX_FILE_SIZE_BYTES;
  const acceptableMimeTypes = options?.acceptableMimeTypes ?? DEFAULT_ACCEPTABLE_MIME_TYPES;

  const acceptedFormatsText = useMemo(() => {
    // Human-friendly list tailored to the formats we actually communicate to users
    return options?.acceptableFormatsText || 'docx, doc, xlsx, xls, ppt, pptx, pdf, jpg, png, zip';
  }, []);

  function validateOne(input: any): ValidateResult {
    const fileLike = extractFileLike(input);
    if (!fileLike) {
      return { errorMessage: 'File tidak ditemukan', isValid: false };
    }

    // if (fileLike.size > maxFileSizeBytes) {
    //   return { errorMessage:
    //     `Ukuran file terlalu besar`, isValid: false };
    // }

    if (!acceptableMimeTypes.includes(fileLike.type)) {
      // Special-case messaging for DOCX-only and XLSX-only configs
      const isDocxOnly = acceptableMimeTypes.length === 1 && acceptableMimeTypes[0] === DOCX_ONLY_MIME_TYPES[0];
      const isXlsxOnly = acceptableMimeTypes.length === 2 &&
        acceptableMimeTypes.includes(XLSX_ONLY_MIME_TYPES[0]) &&
        acceptableMimeTypes.includes(XLSX_ONLY_MIME_TYPES[1]);
      const isPdfOnly = acceptableMimeTypes.length === 1 && acceptableMimeTypes[0] === PDF_ONLY_MIME_TYPES[0];

      let errorMessage = `Format file tidak didukung. Gunakan format: ${acceptedFormatsText}`;

      if (isDocxOnly) {
        errorMessage = 'Format file tidak didukung. Hanya file DOCX yang diperbolehkan';
      } else if (isXlsxOnly) {
        errorMessage = 'Format file tidak didukung. Hanya file XLSX & XLS yang diperbolehkan';
      } else if (isPdfOnly) {
        errorMessage = 'Format file tidak didukung. Hanya file PDF yang diperbolehkan';
      } else {
        errorMessage = `Format file tidak didukung. Gunakan format: ${acceptedFormatsText}`;
      }

      return {
        errorMessage,
        isValid: false,
      };
    }

    return { errorMessage: '', isValid: true };
  }

  function validateMany(inputs: any[]): ValidateResult {
    if (!Array.isArray(inputs)) {
      return { errorMessage: 'File tidak valid', isValid: false };
    }

    for (const item of inputs) {
      const result = validateOne(item);
      if (!result.isValid) {
        return result;
      }
    }

    return { errorMessage: '', isValid: true };
  }

  return {
    acceptableMimeTypes,
    acceptedFormatsText,
    // maxFileSizeBytes,
    presets: {
      docxOnly: {
        acceptableMimeTypes: DOCX_ONLY_MIME_TYPES,
        // maxFileSizeBytes: DEFAULT_MAX_FILE_SIZE_BYTES,
      } as UseCheckFileDokumentOptions,
      pdfOnly: {
        acceptableMimeTypes: PDF_ONLY_MIME_TYPES,
        // maxFileSizeBytes: DEFAULT_MAX_FILE_SIZE_BYTES,
      } as UseCheckFileDokumentOptions,
      xlsxOnly: {
        acceptableMimeTypes: XLSX_ONLY_MIME_TYPES,
        // maxFileSizeBytes: DEFAULT_MAX_FILE_SIZE_BYTES,
      } as UseCheckFileDokumentOptions,
    },
    validateFile: validateOne,
    validateFiles: validateMany,
  };
}
