'use client';
import { Grid, useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import Separator from './components/Separator';
import { useTemplateDocumentSection } from './TemplateDocumentSection.hooks';


type TemplateDocumentSectionProps = {
  onUploadComplete?: () => void;
};

const TemplateDocumentSection = ({ onUploadComplete }: TemplateDocumentSectionProps) => {
  const theme = useTheme();

  const {
    templateFile,
    setTemplateFile,
    handleFileChange,
    handleDownloadTemplate,
    handleUploadTemplate,
    isUploading,
  } = useTemplateDocumentSection({ onUploadComplete });

  return (
    <>
      <TextStyle
        variant="body4"
        weight={600}
        color={theme.palette.primary.main}
        sx={{ mb: 1, mt: 2 }}
      >
        Template Dokumen Parameter
      </TextStyle>

      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.spacing(1),
            py: 2,
          }}
        >
          <RowWrapper sx={{ alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleDownloadTemplate}
              startIcon="download"
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  borderColor: theme.palette.primary.dark,
                },
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              }}
            >
              Download Template
            </Button>

            <Separator
              height="3rem"
              width="2px"
              color={theme.palette.text.secondary}
            />

            <Input
              type="file"
              containerSx={{
                '& .MuiInputBase-input': {
                  fontSize: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
                '& .MuiInputBase-root': {
                  minHeight: '28px',
                },
                flex: 0.5,
                maxWidth: '475px',
              }}
              fileConstraint=".xls, .xlsx, .zip, application/x-zip-compressed, application/zip, application/x-compressed"
              placeholder="Upload File"
              value={templateFile}
              onChange={handleFileChange}
            />

            <Button
              color="success"
              disabled={isUploading}
              isLoading={isUploading}
              onClick={handleUploadTemplate}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </RowWrapper>
        </Grid>
      </Grid>
    </>
  );
};

export default TemplateDocumentSection;
