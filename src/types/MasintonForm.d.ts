type MasintonForm = {
  [key: string]: MasintonField;
}

type MasintonField = {
  value: any;
  error: boolean;
  errorMessage: string;
}

type MasintonValidation = {
  [key: string]: MasintonValidationRule[];
}

type MasintonValidationRule = {
  rule: RegExp;
  errorMessage: string;
}

type MasintonValidationOptions = {
  ignoreValidation?: string[];
}

type MasintonData = {
  [key: string]: any;
}
