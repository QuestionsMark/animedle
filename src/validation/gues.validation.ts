import { object, string } from "yup";

export const guessSchema = object({
    title: string()
        .min(1, 'Guess value should contain 1 to 500 characters.')
        .max(500, 'Guess value should contain 1 to 500 characters.'),
});