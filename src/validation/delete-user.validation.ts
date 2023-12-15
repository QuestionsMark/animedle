import { object, string } from "yup";

export const deleteUserSchema = object({
    password: string()
        .min(5, 'Password should contain 5 to 30 characters.')
        .max(30, 'Password should contain 5 to 30 characters.'),
});