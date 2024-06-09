import { z } from "zod";

export const ScheduleConfigSchema = z.object({
  selected: z.boolean().default(false),
  startTime: z.date().optional(), // Format: 'HH:mm'
});

export const recurringClassSchema = z
  .object({
    type: z.string().min(1, "Field is required"),
    range: z.object({
      from: z.date(),
      to: z.date(),
    }),
    duration: z.string().min(1, "Field is required"),
    enrollmentId: z.string().min(1, "Field is required"),
    attendeeId: z.string().min(1, "Field is required"),
    classroomId: z.string().min(1, "Field is required"),
    substitutedTeacherId: z.string().optional(),
    substitute: z.boolean(),
    scheduleConfig: z.object({
      shifts: z.boolean().default(false),
      firstWeek: z.object({
        startTime: z.date(),
      }),
      secondWeek: z
        .object({
          startTime: z.date(),
        })
        .optional(),
    }),
  })
  .refine((data) => !data.substitute || data.substitutedTeacherId, {
    path: ["substitutedTeacherId"],
    message: "Fields is required",
  })
  .refine(
    (data) =>
      !data.scheduleConfig.shifts ||
      data.scheduleConfig.secondWeek !== undefined,
    {
      path: ["scheduleConfig.shifts"],
      // message: "Both firstWeekTime and secondWeekTime are required 'shift'",
    }
  );
