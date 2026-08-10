import type { RichTextEditor } from 'mui-tiptap';


/** Treats content as empty if it has no text (only empty/whitespace block tags). */
export const isRichTextEmpty = (html: string): boolean => {
  // eslint-disable-next-line eqeqeq -- intentional: catch both null and undefined
  if (html == null || typeof html !== 'string') return true;
  const trimmed = html.trim();
  if (!trimmed) return true;
  const text = trimmed.replace(/<[^>]+>/g, '').trim();
  return !text;
};

export type RichTextProps = {
  value: string;
  onChange: (value: string) => void;
  editorHeight?: string | number;
  disabled?: boolean;
} & Omit<React.ComponentProps<typeof RichTextEditor>, 'content' | 'editable' | 'onUpdate'>
