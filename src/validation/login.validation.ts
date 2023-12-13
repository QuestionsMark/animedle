import { object, string } from "yup";

export const loginSchema = object({
    email: string()
        .email('Incorrect email or password.'),
    password: string()
        .min(5, 'Incorrect email or password.')
        .max(30, 'Incorrect email or password.'),
});