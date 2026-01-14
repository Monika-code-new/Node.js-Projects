export enum RegexEnum {
  EMAIL = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',

  PASSWORD_STRONG =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
}
