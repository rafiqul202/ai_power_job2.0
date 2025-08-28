import { ExperienceLevel, experienceLevels } from "@/drizzle/schema";
import z from "zod";

export const jobInfoSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  title: z.string().min(1).trim().nullable(),
  experienceLevel: z.custom<ExperienceLevel>(
    (val) =>
      typeof val === "string" &&
      (experienceLevels as readonly string[]).includes(val),
    { message: "Experience level is required" }
  ) as unknown as z.ZodType<ExperienceLevel>,
  description: z.string().trim().min(1, "Description is required"),
});
