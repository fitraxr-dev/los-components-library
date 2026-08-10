import type { PaperProps } from '@mui/material';
import type {
  ContainerContentChangeEventArgs,
  DocumentEditorContainerComponent,
  ContainerDocumentChangeEventArgs,
  SectionFormatProperties,
} from '@syncfusion/ej2-react-documenteditor';
import type { Dispatch, SetStateAction } from 'react';


export type EventContentChange = ContainerContentChangeEventArgs & {
  source: {
    id: string;
  };
}
export type EventDocumentContentChange = ContainerDocumentChangeEventArgs & {
  source: {
    id: string;
  };
}

export type IsWordEditorEmpty<K extends string> = {
  [key in K]?: boolean;
}

export type SetIsWordEditorEmpty <K extends string> = Dispatch<SetStateAction<IsWordEditorEmpty<K>>>

export type ExcludeIdDefaultValueIfNotExplicit<K extends string, Explicit extends boolean> = Explicit extends true ? K : Exclude<'container' | K, 'container'>

export type WordEditorProps<
  K extends string,
  ExplicitId extends boolean = false
> = {
  id?: ExcludeIdDefaultValueIfNotExplicit<K, ExplicitId>;
  isWordEditorEmpty?: IsWordEditorEmpty<K>;
  setIsWordEditorEmpty?: SetIsWordEditorEmpty<K>;
  container: DocumentEditorContainerComponent;
  setContainer: (container: DocumentEditorContainerComponent) => void;
  paperProps?: PaperProps;
  editorHeight?: string;
  initialValue?: string;
  initialSectionFormat?: SectionFormatProperties;
  isLoading?: boolean;
  isReadOnly?: boolean;
  onSave?: (sfdt: Blob) => void;
  enableAutoFocus?: boolean;
  enableTrackChanges?: boolean;
  onContentChange?: (container: any) => void;
  isLandscape?: boolean;
  showRuler?: boolean;
}
