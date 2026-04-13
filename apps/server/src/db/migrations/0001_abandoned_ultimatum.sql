CREATE TYPE "public"."roles" AS ENUM('project_manager', 'tech_lead', 'qa_engineer', 'developer');--> statement-breakpoint
CREATE TYPE "public"."task_statuses" AS ENUM('backlog', 'ready_for_development', 'in_progress', 'code_review', 'testing', 'ready_for_release', 'done', 'blocked');--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	"deletedAt" timestamp with time zone,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"userName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "roles" DEFAULT 'developer' NOT NULL
);
--> statement-breakpoint
-- Insert a temporary placeholder member to satisfy FK constraints
INSERT INTO members ("id", "firstName", "lastName", "userName", "email", "password", "role", "createdAt")
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'User', 'Placeholder', 'placeholder', 'user.placeholder@jiraffe.com',
  'placeholder', 'project_manager',
  NOW()
);
--> statement-breakpoint
-- Add status column as proper enum type (replaces the boolean completed column)
ALTER TABLE "tasks" ADD COLUMN "status" "task_statuses" DEFAULT 'backlog' NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "completed";--> statement-breakpoint
-- Add FK columns as nullable first so existing rows don't violate NOT NULL
ALTER TABLE "tasks" ADD COLUMN "creatorId" uuid;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "ownerId" uuid;--> statement-breakpoint
-- Backfill existing tasks to point to the placeholder member
UPDATE tasks SET "creatorId" = '00000000-0000-0000-0000-000000000000' WHERE "creatorId" IS NULL;--> statement-breakpoint
UPDATE tasks SET "ownerId" = NULL WHERE "ownerId" IS NOT NULL AND "ownerId" NOT IN (SELECT id FROM members);--> statement-breakpoint
-- Now enforce NOT NULL on creatorId
ALTER TABLE "tasks" ALTER COLUMN "creatorId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_creatorId_members_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_ownerId_members_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
