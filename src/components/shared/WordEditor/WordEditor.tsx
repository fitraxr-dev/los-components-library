'use client';
import { useContext, useEffect } from 'react';

import { Paper } from '@mui/material';
import { DocumentEditorContainerComponent, Inject, Toolbar } from '@syncfusion/ej2-react-documenteditor';

import { SYNCFUSION_SERVICE_URL } from '@/configs/constants/general';
import '@/public/styles/base/_index.scss';
import { DirtyContext } from '@/contexts/DirtyContext';
import { hasInitialSectionFormat } from '@/helpers/object';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';

import Loader from '@/components/shared/Loader';

import type {
  EventContentChange,
  EventDocumentContentChange,
  ExcludeIdDefaultValueIfNotExplicit,
  IsWordEditorEmpty,
  WordEditorProps,
} from './types';
import type {
  DocumentEditorKeyDownEventArgs,
  CustomToolbarItemModel,
  SectionFormatProperties,
} from '@syncfusion/ej2-react-documenteditor';


const WordEditor = <
  K extends string,
  ExplicitId extends boolean = false
>({
  container,
  setContainer = () => { },
  paperProps = {},
  editorHeight = '90vh',
  initialValue = '',
  initialSectionFormat = {},
  isLoading = false,
  isReadOnly = false,
  onSave,
  id = 'container' as ExcludeIdDefaultValueIfNotExplicit<K, ExplicitId>,
  setIsWordEditorEmpty = (e) => { },
  enableAutoFocus = false,
  enableTrackChanges = false,
  onContentChange,
  isLandscape = false,
  showRuler = true,
}: WordEditorProps<K, ExplicitId>) => {
  const { setDirtyMsg } = useContext(DirtyContext);

  // Function to handle ruler toggle
  const handleRulerToggle = () => {
    if (container) {
      container.documentEditorSettings.showRuler = !container.documentEditorSettings.showRuler;
    }
  };

  const handleRevisionToggle = () => {
    if (container) {
      container.documentEditor.showRevisions = !container.documentEditor.showRevisions;
    }
  };

  const handleOrientationToggle = () => {
    if (container) {
      const { pageWidth, pageHeight } = container.documentEditor.selection.sectionFormat;
      container.documentEditor.selection.sectionFormat.pageWidth = pageHeight;
      container.documentEditor.selection.sectionFormat.pageHeight = pageWidth;
    }
  };

  const handleInsertSectionBreak = () => {
    if (container) {
      container.documentEditor.editor.insertSectionBreak();
    }
  };

  const initializeCommentsPanel = () => {
    if (container && container.documentEditor) {
      const commentsPane = container.documentEditor.showComments;
      if (commentsPane !== undefined) {
        container.documentEditor.showComments = false;
        setTimeout(() => {
          if (container && container.documentEditor) {
            container.documentEditor.showComments = true;
          }
        }, 100);
      }
    }
  };

  // Custom toolbar item for disabling images
  const onWrapText = (text: string): string => {
    let content = '';
    const index = text.lastIndexOf(' ');

    if (index !== -1) {
      content = `${text.slice(0, index)}<div class='e-de-text-wrap'>${text.slice(index + 1)}</div>`;
    } else {
      content = text;
    }

    return content;
  };

  let showHideRuler: CustomToolbarItemModel = {
    id: 'container_ruler_button',
    prefixIcon: 'e-change-scale-ratio',
    text: onWrapText('Show/Hide Ruler'),
    tooltipText: 'Show/Hide Ruler',
  };

  let showRevisionPanel: CustomToolbarItemModel = {
    id: 'container_show_revision_panel',
    prefixIcon: 'e-refresh-2',
    text: onWrapText('Track Updates'),
    tooltipText: 'Show/hide the Track Changes panel for revisions.',
  };

  let toggleOrientation: CustomToolbarItemModel = {
    id: 'container_toggle_orientation',
    prefixIcon: 'e-print-layout',
    text: onWrapText('Toggle Orientation'),
    tooltipText: 'Toggle between Portrait and Landscape for this section.',
  };

  let insertSectionBreak: CustomToolbarItemModel = {
    id: 'container_insert_section_break',
    prefixIcon: 'e-plus',
    text: onWrapText('Section Break'),
    tooltipText: 'Insert a Section Break (new page with a new section).',
  };

  let defaultDocumentFormatting = {
    'characterFormat': {
      'allCaps': false,
      'baselineAlignment': 'Normal',
      'bold': false,
      'fontColor': 'empty',
      'fontFamily': 'Times New Roman',
      'fontFamilyBidi': 'Times New Roman',
      'fontSize': 12.0,
      'fontSizeBidi': 12.0,
      'highlightColor': 'NoColor',
      'italic': false,
      'strikethrough': 'None',
      'underline': 'None',
    },
    'defaultTabWidth': 36.0,
    'enforcement': false,
    'paragraphFormat': {
      'afterSpacing': 0.0,
      'beforeSpacing': 0.0,
      'bidi': false,
      'firstLineIndent': 0.0,
      'leftIndent': 0.0,
      'lineSpacing': 1.0791666507720947,
      'lineSpacingType': 'Multiple',
      'listFormat': {},
      'rightIndent': 0.0,
      'textAlignment': 'Left',
    },
    'sections': [
      {
        'blocks': [
          {
            'characterFormat': {},
            'inlines': [
              {
                'characterFormat': {},
                'text': '',
              }
            ],
            'paragraphFormat': {
              'afterSpacing': 0,
              'listFormat': {},
              'styleName': '',
            },
          }
        ],
        'headersFooters': {
          'footer': {
            'blocks': [
              {
                'characterFormat': {},
                'inlines': [],
                'paragraphFormat': { 'listFormat': {} },
              }
            ],
          },
          'header': {
            'blocks': [
              {
                'characterFormat': {},
                'inlines': [],
                'paragraphFormat': { 'listFormat': {} },
              }
            ],
          },
        },
        'sectionFormat': {
          'bidi': false,
          'bottomMargin': 5.0,
          'differentFirstPage': false,
          'differentOddAndEvenPages': false,
          'footerDistance': 0,
          'headerDistance': 0,
          'leftMargin': 5.0,
          'pageHeight': 792.0,
          'pageWidth': 447.3,
          'rightMargin': 5.0,
          'topMargin': 0,
        },
      }
    ],
    'styles': [
      {
        'characterFormat': { 'fontFamily': 'Times New Roman' },
        'name': 'Normal',
        'paragraphFormat': {
          'lineSpacing': 1.149999976158142,
          'lineSpacingType': 'Multiple',
        },
        'type': 'Paragraph',
      }
    ],
    'trackChanges': false,
  };

  useEffect(() => {
    setDirtyMsg(undefined);
  }, [container]);

  useEffect(() => {
    if (container) {
      // Enable/Disable 'Restrict Editing' Toolbar
      container.toolbar.enableItems(0, !isReadOnly);
      container.toolbar.enableItems(1, !isReadOnly);
      container.toolbar.enableItems(26, !isReadOnly);

      container.documentEditor.isReadOnly = isReadOnly;

      setTimeout(() => {
        initializeCommentsPanel();
      }, 200);
    }

    // Add event listener for ruler toggle
    const rulerButton = document.getElementById('container_ruler_button');
    rulerButton?.addEventListener('click', handleRulerToggle);

    // Add event listener for ruler toggle
    const revisionButton = document.getElementById('container_show_revision_panel');
    revisionButton?.addEventListener('click', handleRevisionToggle);

    // Add event listener for orientation toggle
    // const orientationButton = document.getElementById('container_toggle_orientation');
    // orientationButton?.addEventListener('click', handleOrientationToggle);

    // const sectionBreakButton = document.getElementById('container_insert_section_break');
    // sectionBreakButton?.addEventListener('click', handleInsertSectionBreak);

    return () => {
      rulerButton?.removeEventListener('click', handleRulerToggle);
      revisionButton?.removeEventListener('click', handleRevisionToggle);
      // orientationButton?.removeEventListener('click', handleOrientationToggle);
      // sectionBreakButton?.removeEventListener('click', handleInsertSectionBreak);
    };
  }, [container, isReadOnly]);

  // Override ctrl + s
  useEffect(() => {
    if (container) {
      container.documentEditor.keyDown = function (args: DocumentEditorKeyDownEventArgs) {
        let keyCode = args.event.which || args.event.keyCode;
        let isCtrlKey = args.event.ctrlKey || args.event.metaKey || keyCode === 17;

        // 83 is the character code for 'S'
        if (isCtrlKey && keyCode === 83) {
          args.isHandled = true;
          args.event.preventDefault();
          if (!isReadOnly) {
            convertToDocx(container).then((blob: Blob) => {
              onSave && onSave(blob);
            });
          }
        };
      };
    }
  }, [container, isReadOnly, onSave]);

  useEffect(() => {
    if (container && initialValue) {
      container.documentEditor.open(
        structuredClone(initialValue)
      );
    }
  }, [container, initialValue]);

  useEffect(() => {
    if (container || initialValue) {
      // For Initiate Blank Page without initialValue
      if (!initialValue) {
        let format = { ...defaultDocumentFormatting.sections[0].sectionFormat };
        if (isLandscape) {
          const w = format.pageWidth;
          const h = format.pageHeight;
          format.pageWidth = Math.max(w, h);
          format.pageHeight = Math.min(w, h);
        }

        defaultDocumentFormatting.sections[0].sectionFormat = {
          ...format,
          ...initialSectionFormat,
        };
        const result = JSON.stringify(defaultDocumentFormatting);
        container.documentEditor.open(result);
      }
    }
  }, [container, initialValue]);

  const handleContentChange = (e: EventContentChange) => {
    setIsWordEditorEmpty((prev: IsWordEditorEmpty<K>) => ({
      ...prev,
      [e.source.id]: e.source.documentEditor.isDocumentEmpty,
    }));

    setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    onContentChange?.(e);
  };
  const handleDocumentChange = (e: EventDocumentContentChange) => {
    setIsWordEditorEmpty((prev: IsWordEditorEmpty<K>) => ({
      ...prev,
      [e.source.id]: e.source.documentEditor.isDocumentEmpty,
    }));
    onContentChange?.(e);
  };

  const onCreate = () => {
    if (container) {
      container.documentEditor.setDefaultCharacterFormat({
        fontFamily: 'Times New Roman',
        fontSize: 12,
      });
      container.documentEditorSettings.fontFamilies = ['Times New Roman'];
      container.documentEditorSettings.showRuler = showRuler; // Use the prop value
      container.documentEditor.showRevisions = false; // Hide revisions pane

      let format: any = {};
      if (isLandscape) {
        const defaultFormat = defaultDocumentFormatting.sections[0].sectionFormat;
        format = {
          pageHeight: Math.min(defaultFormat.pageWidth, defaultFormat.pageHeight),
          pageWidth: Math.max(defaultFormat.pageWidth, defaultFormat.pageHeight),
        };
      }

      if (hasInitialSectionFormat(initialSectionFormat) || isLandscape) {
        // For Create New Page
        container.documentEditor.setDefaultSectionFormat({
          ...format,
          ...initialSectionFormat,
        });
      }

      setTimeout(() => {
        initializeCommentsPanel();
      }, 300);
    }
  };

  const [state] = useApp();
  const username = state.userData?.user.fullName;
  const userId = state.userData?.user.userId;

  return (
    <>
      <Loader isLoading={isLoading} />
      <Paper
        sx={{
          width: '100%',
          ...paperProps.sx,
        }}
        {...paperProps}
      >
        <DocumentEditorContainerComponent
          id={id}
          ref={(scope) => { setContainer(scope); }}
          style={{ display: 'block' }}
          enableToolbar
          height={editorHeight}
          locale="en-US"
          serviceUrl={SYNCFUSION_SERVICE_URL}
          contentChange={handleContentChange}
          documentChange={handleDocumentChange}
          created={onCreate}
          enableTrackChanges={enableTrackChanges}
          enableAutoFocus={enableAutoFocus}
          showPropertiesPane={false}
          currentUser={`${username} (${userId})`}
          toolbarItems={[
            'New',
            'Open',
            'Separator',
            showHideRuler,
            showRevisionPanel,
            'TrackChanges',
            'Comments',
            'Separator',
            'Undo',
            'Redo',
            'Separator',
            'Image',
            'Table',
            'Hyperlink',
            'Bookmark',
            'TableOfContents',
            'Separator',
            'Header',
            'Footer',
            'PageSetup',
            // toggleOrientation,
            // insertSectionBreak,
            'PageNumber',
            // 'Break',
            'InsertFootnote',
            'InsertEndnote',
            'Separator',
            'Find',
            'Separator',
            'LocalClipboard',
            'RestrictEditing',
            'Separator',
            'FormFields',
            'UpdateFields',
            'ContentControl'
          ]}
        >
          <Inject services={[Toolbar]} />
        </DocumentEditorContainerComponent>
      </Paper>
    </>
  );
};

export default WordEditor;
