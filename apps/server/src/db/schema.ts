import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const defaultColumns = {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  deletedAt: timestamp({ withTimezone: true }),
};

export const memberRoles = [
  "project_manager",
  "tech_lead",
  "qa_engineer",
  "developer",
] as const;

export const taskStatuses = [
  "backlog",
  "ready_for_development",
  "in_progress",
  "code_review",
  "testing",
  "ready_for_release",
  "done",
  "blocked",
] as const;

export const roles = pgEnum("roles", memberRoles);
export const statuses = pgEnum("task_statuses", taskStatuses);

export const tasksTable = pgTable("tasks", {
  ...defaultColumns,
  title: varchar({ length: 255 }).notNull(),
  status: statuses("status").notNull().default("backlog"),
  dueDate: timestamp({ withTimezone: true }),
  creatorId: uuid()
    .notNull()
    .references(() => membersTable.id),
  ownerId: uuid().references(() => membersTable.id),
});

export const membersTable = pgTable("members", {
  ...defaultColumns,
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  userName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  role: roles("role").notNull().default("developer"),
});

export const tasksRelations = relations(tasksTable, ({ one }) => ({
  creator: one(membersTable, {
    fields: [tasksTable.creatorId],
    references: [membersTable.id],
    relationName: "taskCreator",
  }),
  owner: one(membersTable, {
    fields: [tasksTable.ownerId],
    references: [membersTable.id],
    relationName: "taskOwner",
  }),
}));

export const memberRelations = relations(membersTable, ({ many }) => ({
  createdTasks: many(tasksTable, { relationName: "taskCreator" }),
  ownedTasks: many(tasksTable, { relationName: "taskOwner" }),
}));
