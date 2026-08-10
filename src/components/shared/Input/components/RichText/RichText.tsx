'use client';

import * as React from 'react';

import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { LinkBubbleMenu, RichTextEditor, TableBubbleMenu } from 'mui-tiptap';

import Toolbar from './components/Toolbar';
import useRichText from './RichText.hook';
import { isRichTextEmpty } from './RichText.types';

import type { RichTextProps } from './RichText.types';


const RichText = ({
  value = '<p></p>',
  onChange,
  editorHeight = '150px',
  disabled = false,
  ...props
}: RichTextProps) => {
  const theme = useTheme();

  const localTheme = React.useMemo(() => createTheme({
    ...theme,
    // @ts-expect-error
    typography: {
      fontFamily: 'Roboto, Inter, system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
    },
  }), [theme]);

  const {
    extensions,
    rteRef,
  } = useRichText();

  const editor = rteRef.current?.editor;
  const handleUpdate = React.useCallback(({ editor }) => {
    if (disabled) return;
    const html = editor.getHTML();
    onChange?.(html);
  }, [onChange, disabled]);

  React.useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (typeof value !== 'string') return;

    const current = editor.getHTML();

    if (current !== value && !(editor.isFocused && editor.isEditable)) {
      queueMicrotask(() => {
        const currentSelection = editor.state.selection;
        editor
          .chain()
          .setContent(value, { emitUpdate: false })
          .setTextSelection(currentSelection)
          .run();
      });
    }
  }, [value, editor, editor?.isEditable, editor?.isFocused]);

  return (
    <ThemeProvider theme={localTheme}>
      <RichTextEditor
        ref={rteRef}
        immediatelyRender={false}
        extensions={extensions}
        onUpdate={handleUpdate}
        editable={!disabled}
        content={value}
        editorProps={{
          attributes: {
            autocapitalize: 'sentences',
            autocorrect: 'on',
            spellcheck: 'true',
          },
        }}
        RichTextFieldProps={{
          MenuBarProps: {
            sx: {
              '& .MuiTiptap-MenuButton-root .MuiButtonBase-root:disabled': {
                opacity: 0.5,
              },
              '& svg.MuiSvgIcon-root': {
                color: 'primary.main',
              },

              backgroundColor: 'custom.chart10',
            },
          },
          RichTextContentProps: {
            sx: { backgroundColor: 'white.main', height: editorHeight, overflow: 'scroll' },
          },
          autoFocus: true,
        }}
        renderControls={() => <Toolbar disabled={disabled} />}
        {...props}
      >
        {() => (
          <>
            <TableBubbleMenu />
            <LinkBubbleMenu />
          </>
        )}
      </RichTextEditor>
    </ThemeProvider>
  );
};

export default RichText;
