CREATE TABLE "contact" (
	"email" varchar(256) PRIMARY KEY NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rendez_vous" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_email" varchar,
	"scheduled_at" timestamp NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rendez_vous_scheduledAt_unique" UNIQUE("scheduled_at")
);
--> statement-breakpoint
ALTER TABLE "rendez_vous" ADD CONSTRAINT "rendez_vous_contact_email_contact_email_fk" FOREIGN KEY ("contact_email") REFERENCES "public"."contact"("email") ON DELETE cascade ON UPDATE cascade;