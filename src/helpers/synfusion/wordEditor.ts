import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


export const convertToDocx = (container: DocumentEditorContainerComponent) => {
  return container.documentEditor.saveAsBlob('Docx');
};
