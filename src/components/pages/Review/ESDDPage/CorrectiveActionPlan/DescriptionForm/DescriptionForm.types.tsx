import type { FieldArrayWithId } from 'react-hook-form';


export type DescriptionFormDto = {
  actionDescription?: string;
  grade?: string;
  gradeLabel?: string;
  parameter?: string;
  targetFullfillment?: string;

}

export type DescriptionFormProps = {
  index: number;
  fields: FieldArrayWithId<{
    descriptionList: {
      actionDescription: string;
      grade: string;
      parameter: string;
      targetFullfillment: string;
      businessResponse?: any;
    }[];
  }, 'descriptionList', 'id'>[];
  onDelete: () => void;
  isBusinessResponse?: boolean;
  viewOnly?: boolean;
  callback?: (e) => void;
}
