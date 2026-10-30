-- instants, not wall-clock times: existing values were written in UTC
ALTER TABLE "rendez_vous" ALTER COLUMN "scheduled_at" SET DATA TYPE timestamp with time zone USING "scheduled_at" AT TIME ZONE 'UTC';--> statement-breakpoint
-- every rendez-vous so far lasted 30 minutes
ALTER TABLE "rendez_vous" ADD COLUMN "ends_at" timestamp with time zone;--> statement-breakpoint
UPDATE "rendez_vous" SET "ends_at" = "scheduled_at" + interval '30 minutes';--> statement-breakpoint
ALTER TABLE "rendez_vous" ALTER COLUMN "ends_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rendez_vous" ADD COLUMN "guest_name" varchar(120);--> statement-breakpoint
ALTER TABLE "rendez_vous" ADD COLUMN "topic" varchar(500);--> statement-breakpoint
-- no two rendez-vous may overlap, even when two guests book at the same moment
ALTER TABLE "rendez_vous" ADD CONSTRAINT "rendez_vous_no_overlap" EXCLUDE USING gist (tstzrange("scheduled_at", "ends_at") WITH &&);
