'use client';

import * as React from 'react';

import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { Code } from '@tiptap/extension-code';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { Highlight } from '@tiptap/extension-highlight';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Strike } from '@tiptap/extension-strike';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Text } from '@tiptap/extension-text';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Dropcursor, Gapcursor, Placeholder, UndoRedo } from '@tiptap/extensions';
import { LinkBubbleMenuHandler } from 'mui-tiptap';

import type { AnyExtension } from '@tiptap/react';
import type { RichTextEditorRef } from 'mui-tiptap';


const CustomSubscript = Subscript.extend({
  excludes: 'superscript',
});

const CustomSuperscript = Superscript.extend({
  excludes: 'subscript',
});

const CustomLinkExtension = Link.extend({
  inclusive: false,
});

const useRichText = () => {
  const rteRef = React.useRef<RichTextEditorRef>(null);

  const extensions = React.useMemo<AnyExtension[]>(() => {
    return [
      BulletList,
      CodeBlock,
      Document,
      HardBreak,
      ListItem,
      OrderedList,
      Heading,
      Paragraph,
      CustomSubscript,
      CustomSuperscript,
      Text,

      Bold,
      Blockquote,
      Code,
      Underline,
      Italic,
      Strike,
      CustomLinkExtension.configure({
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
        },
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
      }),
      LinkBubbleMenuHandler,

      Gapcursor,
      TextAlign.configure({
        defaultAlignment: 'left',
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({ multicolor: true }),
      Dropcursor,

      Placeholder.configure({
        placeholder: ({ editor }) => editor.isEmpty ? 'Start typing…' : '',
      }),
      UndoRedo,
    ];
  }, []);

  return {
    extensions,
    rteRef,
  };
};

export default useRichText;
