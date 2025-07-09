import { UserData, ChildData, OtherDetailsData, FormErrors } from './types';

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address.';
  }
  return null;
};

export const validateUserData = (user: UserData) => {
  const errors: FormErrors<UserData> = {};
  if (!user.name) errors.name = 'Your name is required.';
  if (!user.relationToChild) errors.relationToChild = 'Relation to child is required.';

  const emailError = validateEmail(user.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(user.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const validateChildData = (child: ChildData) => {
  const errors: FormErrors<ChildData> = {};
  if (!child.childName) errors.childName = 'Child\'s name is required.';
  if (!child.dob) errors.dob = 'Date of birth is required.';
  if (child.condition.length === 0) errors.condition = 'At least one condition must be selected.';
  if (child.condition.includes('Dyslexia') && child.dyslexiaSubtype.length === 0) {
    errors.dyslexiaSubtype = 'Please select at least one dyslexia subtype.';
  }
  if (child.condition.includes('Other (Specify)') && !child.otherConditionText.trim()) {
    errors.otherConditionText = 'Please specify the other condition.';
  }
  if (!child.diagnosed) errors.diagnosed = 'Diagnosis status is required.';
  if (!child.severity) errors.severity = 'Severity is required.';
  return errors;
};

export const validateOtherDetailsData = (otherDetails: OtherDetailsData) => {
  const errors: FormErrors<OtherDetailsData> = {};
  if (!otherDetails.specifications.trim()) errors.specifications = 'Specifications are required.';
  if (otherDetails.interests.length === 0) errors.interests = 'At least one interest must be selected.';
  if (otherDetails.learningAreasOfConcern.length === 0) errors.learningAreasOfConcern = 'At least one learning area of concern must be selected.';
  if (!otherDetails.goals.trim()) errors.goals = 'Learning goals are required.';
  return errors;
};