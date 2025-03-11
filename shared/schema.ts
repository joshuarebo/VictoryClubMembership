import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  patron: text("patron").notNull(),
  registrationFee: decimal("registration_fee").notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  admissionNumber: text("admission_number").notNull().unique(),
  name: text("name").notNull(),
  class: text("class").notNull(),
});

export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  clubId: integer("club_id").notNull(),
  role: text("role", { enum: ["regular", "executive"] }).notNull(),
  position: text("position"),
  active: boolean("active").notNull().default(true),
  joinDate: timestamp("join_date").notNull(),
  exitDate: timestamp("exit_date"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").notNull(),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  revenue: decimal("revenue").notNull(),
});

// Insert schemas
export const insertClubSchema = createInsertSchema(clubs).extend({
  registrationFee: z.number().min(0),
});

export const insertStudentSchema = createInsertSchema(students).pick({
  admissionNumber: true,
  name: true,
  class: true,
});

export const insertMembershipSchema = createInsertSchema(memberships).extend({
  studentId: z.number(),
  clubId: z.number(),
  role: z.enum(["regular", "executive"]),
  position: z.string().nullable(),
  joinDate: z.string().transform((str) => new Date(str)),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  clubId: true,
  name: true,
  date: true,
  revenue: true,
});

// Types
export type Club = typeof clubs.$inferSelect;
export type InsertClub = z.infer<typeof insertClubSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = z.infer<typeof insertMembershipSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;