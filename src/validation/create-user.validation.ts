import { object, string } from "yup";

export const createUserSchema = object({
    confirmPassword: string()
        .min(5, 'Password should contain 5 to 30 characters.')
        .max(30, 'Password should contain 5 to 30 characters.'),
    email: string()
        .email('Your e-mail is probably incorrect.'),
    password: string()
        .min(5, 'Password should contain 5 to 30 characters.')
        .max(30, 'Password should contain 5 to 30 characters.'),
    username: string()
        .min(1, 'Username should contain 5 to 30 characters.')
        .max(30, 'Username should contain 5 to 30 characters.'),
});