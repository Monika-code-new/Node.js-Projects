import { z } from 'zod';
import { RegexEnum } from '../utils/regex.enum';
import { ValidationMessage } from '../utils/messages.enum';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: ValidationMessage.NAME_TOO_SHORT })
    .optional(),

  email: z
    .string()
    .min(1, { message: ValidationMessage.EMAIL_REQUIRED })   
    .regex(new RegExp(RegexEnum.EMAIL), {
      message: ValidationMessage.INVALID_EMAIL,
    }),

  password: z
    .string()
    .min(1, { message: ValidationMessage.PASSWORD_REQUIRED }) 
    .regex(new RegExp(RegexEnum.PASSWORD_STRONG), {
      message: ValidationMessage.INVALID_PASSWORD,
    }),
});


export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: ValidationMessage.EMAIL_REQUIRED })   
    .regex(new RegExp(RegexEnum.EMAIL), {
      message: ValidationMessage.INVALID_EMAIL,
    }),

  password: z
    .string()
    .min(1, { message: ValidationMessage.PASSWORD_REQUIRED }) 
    .regex(new RegExp(RegexEnum.PASSWORD_STRONG), {
      message: ValidationMessage.INVALID_PASSWORD,
    }),
});
/* ---------------- UPDATE ---------------- */
export const updateSchema = z.object({
  name: z
    .string()
    .min(2, { message: ValidationMessage.NAME_TOO_SHORT })
    .optional(),

  email: z
    .string()
    .regex(new RegExp(RegexEnum.EMAIL), {
      message: ValidationMessage.INVALID_EMAIL,
    })
    .optional(),

  password: z
    .string()
    .regex(new RegExp(RegexEnum.PASSWORD_STRONG), {
      message: ValidationMessage.INVALID_PASSWORD,
    })
    .optional(),
});


