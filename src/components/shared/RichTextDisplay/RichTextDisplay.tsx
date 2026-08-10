'use client';

import * as React from 'react';

import {
  Box,
  createTheme,
  ThemeProvider,
  useTheme,
  type SxProps,
  type Theme,
} from '@mui/material';

import { poppins } from '@/helpers/theme/generalTheme';


interface RichTextDisplayProps {
  html?: string;
  emptyFallback?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const RichTextDisplay = ({ html, emptyFallback = null, sx }: RichTextDisplayProps) => {
  const theme = useTheme();

  const localTheme = React.useMemo(() => createTheme({
    ...theme,
    // @ts-expect-error
    typography: {
      fontFamily: `${poppins.style.fontFamily}, Inter, system-ui, -apple-system, "Segoe UI", Arial, sans-serif`,
    },
  }), [theme]);

  if (!html) return <>{emptyFallback}</>;

  return (
    <ThemeProvider theme={localTheme}>
      <Box
        component="article"
        sx={{
          '& > :first-child': { mt: 0 },
          '& > :last-child': { mb: 0 },
          '& a': {
            '&:hover': { textDecoration: 'none' },
            color: 'primary.main',
            textDecoration: 'underline',
          },
          '& blockquote': (t) => ({
            ...t.typography.body1,
            borderLeft: `4px solid ${t.palette.divider}`,
            color: t.palette.text.secondary,
            m: 0,
            my: 1.5,
            pl: 2,
          }),
          '& code': (t) => ({
            backgroundColor: t.palette.action.hover,
            borderRadius: 0.5,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '0.875em',
            px: 0.5,
            py: 0.25,
          }),
          '& em': { fontStyle: 'italic' },
          '& h1': (t) => ({ ...t.typography.h4, mb: 1, mt: 2 }),
          '& h2': (t) => ({ ...t.typography.h5, mb: 1, mt: 2 }),
          '& h3': (t) => ({ ...t.typography.h6, mb: 1, mt: 2 }),
          '& h4': (t) => ({ ...t.typography.subtitle1, mb: 1, mt: 2 }),
          '& h5': (t) => ({ ...t.typography.subtitle2, mb: 1, mt: 2 }),
          '& h6': (t) => ({ ...t.typography.overline, mb: 1, mt: 2 }),
          '& img': { borderRadius: 1, height: 'auto', maxWidth: '100%' },
          '& li': (t) => ({ ...t.typography.body1, my: 0.5 }),
          '& p': (t) => ({ ...t.typography.body1, my: 1 }),
          '& pre': (t) => ({
            '& code': { backgroundColor: 'transparent', p: 0 },
            backgroundColor: t.palette.action.hover,
            borderRadius: 1,
            my: 1.5,
            overflow: 'auto',
            p: 1.5,
          }),
          '& s, & del': { textDecoration: 'line-through' },
          '& strong': (t) => ({ fontWeight: t.typography.fontWeightBold }),
          '& table': { borderCollapse: 'collapse', my: 2, width: '100%' },
          '& th': (t) => ({ backgroundColor: t.palette.action.hover, fontWeight: t.typography.fontWeightMedium }),
          '& th, & td': (t) => ({
            border: `1px solid ${t.palette.divider}`,
            p: 1,
            textAlign: 'left',
            verticalAlign: 'top',
          }),
          '& u': { textDecoration: 'underline' },
          '& ul, & ol': { my: 1.25, pl: 3 },
          ...sx,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </ThemeProvider>
  );
};

export default RichTextDisplay;
