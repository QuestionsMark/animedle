import { object, string } from "yup";

export const deleteUserSchema = object({
    password: string()
        .min(5, 'Incorrect password.')
        .max(30, 'Incorrect password.'),
});