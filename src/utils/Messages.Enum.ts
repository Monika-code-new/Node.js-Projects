export enum ValidationMessage {
  INVALID_EMAIL = 'Please enter a valid email address',
  INVALID_PASSWORD = 'Please enter a valid Password',

  WEAK_PASSWORD =
    'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 6 characters',

  NAME_TOO_SHORT = 'Name must be at least 2 characters',
 
  NAME_REQUIRED = 'Name is required',
  EMAIL_REQUIRED = 'Email is required',
  PASSWORD_REQUIRED = 'Password is required',
}
