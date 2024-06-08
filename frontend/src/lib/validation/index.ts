import * as z from "zod";

export const SignupValidationSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    password_repeat: z.string(),
}).refine(data => data.password === data.password_repeat, {
    message: 'Пароли не совпадают',
    path: ['password_repeat'],
});


export const SigninValidationSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const PostValidationSchema = z.object({
    caption: z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string(),
})