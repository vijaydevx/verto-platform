import { z } from "zod";

export const campusEmailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu(\.[a-zA-Z]{2,})?|ac\.[a-zA-Z]{2,}|college|university)$/i;

const itemTypeSchema = z.enum(["lost", "found"]);

const maxFileSizeBytes = 5 * 1024 * 1024;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(80, "Full name must be 80 characters or fewer."),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .regex(campusEmailRegex, "Use a valid campus email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be 128 characters or fewer.")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/[a-z]/, "Password must include at least one lowercase letter.")
      .regex(/[0-9]/, "Password must include at least one number."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .regex(campusEmailRegex, "Use your campus email address."),
  password: z.string().min(1, "Password is required."),
});

export const itemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description must be 1000 characters or fewer."),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters.")
    .max(120, "Location must be 120 characters or fewer."),
  reportedDate: z
    .string()
    .min(1, "Pick the date the item was reported.")
    .refine((value) => {
      const date = new Date(value);
      const now = new Date();
      return !Number.isNaN(date.getTime()) && date <= now;
    }, "Reported date cannot be in the future."),
  type: itemTypeSchema,
  image: z
    .instanceof(File, { message: "Add an image for the item." })
    .refine((file) => file.size > 0, "Add an image for the item.")
    .refine((file) => file.size <= maxFileSizeBytes, "Image must be 5MB or smaller.")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Upload a JPG, PNG, or WebP image.",
    ),
});

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name must be 80 characters or fewer."),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(128, "New password must be 128 characters or fewer.")
      .regex(/[A-Z]/, "New password must include at least one uppercase letter.")
      .regex(/[a-z]/, "New password must include at least one lowercase letter.")
      .regex(/[0-9]/, "New password must include at least one number."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .superRefine(({ currentPassword, newPassword, confirmPassword }, context) => {
    if (newPassword === currentPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "New password must be different from the current password.",
      });
    }

    if (newPassword !== confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export const itemFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  location: z.string().trim().max(120).optional().default(""),
  type: z.union([itemTypeSchema, z.literal("all")]).default("all"),
  includeArchived: z.boolean().optional().default(false),
});

export const uploadSignRequestSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1, "File name is required.")
    .max(180, "File name is too long."),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type ItemFiltersInput = z.infer<typeof itemFiltersSchema>;
export type UploadSignRequestInput = z.infer<typeof uploadSignRequestSchema>;
export type ItemType = z.infer<typeof itemTypeSchema>;
