import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "Field is required").email("Enter a valid email"),
  password: z.string().min(1, "Field is required"),
});
