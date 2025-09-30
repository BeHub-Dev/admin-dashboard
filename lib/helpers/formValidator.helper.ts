import { z } from "zod";

const toNumberOrUndefined = (val: unknown) =>
  val === "" || val === null || val === undefined ? undefined : Number(val);

const serviceCategorySchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Max 100 characters"),
    icon: z.string().min(1, "Icon is required"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Max 500 characters"),
    color: z
      .string()
      .regex(
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Color must be a hex code like #ffb320"
      )
      .optional(),
    sortOrder: z
      .preprocess(toNumberOrUndefined, z.number().int().min(0))
      .optional()
      .default(1),
    averageDuration: z
      .preprocess(toNumberOrUndefined, z.number().min(15).max(480))
      .optional()
      .default(60),
    requiresLicense: z.boolean().optional().default(false),
    requiresSpecialEquipment: z.boolean().optional().default(false),
    isActive: z.boolean().optional(),
    metaTitle: z
      .string()
      .max(60, "Max 60 characters")
      .optional()
      .or(z.literal(""))
      .nullable(),
    metaDescription: z
      .string()
      .max(160, "Max 160 characters")
      .optional()
      .or(z.literal(""))
      .nullable(),
    priceMin: z.preprocess(toNumberOrUndefined, z.number().min(0)).optional(),
    priceMax: z.preprocess(toNumberOrUndefined, z.number().min(0)).optional(),
  })
  .refine(
    (data) =>
      !(
        typeof data.priceMin === "number" &&
        typeof data.priceMax === "number" &&
        data.priceMin > data.priceMax
      ),
    {
      message: "Minimum price cannot be greater than maximum price",
      path: ["priceMin"],
    }
  );

export function validateServiceCategory(input: unknown) {
  const result = serviceCategorySchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const { fieldErrors } = result.error.flatten();
  return { success: false, errors: fieldErrors };
}
