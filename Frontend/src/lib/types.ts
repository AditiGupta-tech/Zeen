export interface UserData {
  name: string;
  email: string;
  password: string;
  relationToChild: string;
}

export type ChildConditionType =
  | 'Dyslexia'
  | 'Reading Difficulty'
  | 'Learning Difficulty'
  | 'Other (Specify)';
export type DyslexiaSubType =
  | 'Phonological Dyslexia'
  | 'Surface Dyslexia'
  | 'Visual Dyslexia'
  | 'Attentional Dyslexia';

export interface ChildData {
  childName: string;
  dob: string; 
  age: number | null; 
  condition: ChildConditionType[];
  dyslexiaSubtype: DyslexiaSubType[];
  diagnosed: 'Yes' | 'No' | '';
  severity: 'Mild' | 'Moderate' | 'Severe' | '';
  otherConditionText: string; 
}

export interface OtherDetailsData {
  specifications: string;
  interests: string[];
  learningAreasOfConcern: string[];
  goals: string;
}

export interface SignupFormData {
  user: UserData;
  child: ChildData;
  otherDetails: OtherDetailsData;
  agreedToTerms: boolean;
}

export type FormErrors<T> = {
  [K in keyof T]?: string;
} & {
  [key: string]: string | undefined;
};

