ALTER TABLE "rendez_vous" ALTER COLUMN "contact_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rendez_vous" ADD COLUMN "manage_token_hash" varchar(64);