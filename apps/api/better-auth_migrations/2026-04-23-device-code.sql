CREATE TABLE IF NOT EXISTS "deviceCode" (
	"id" uuid default uuidv7() not null primary key,
	"deviceCode" text NOT NULL,
	"userCode" text NOT NULL,
	"userId" text references "user" ("id") on delete cascade,
	"clientId" text,
	"scope" text,
	"status" text NOT NULL,
	"expiresAt" timestamptz NOT NULL,
	"lastPolledAt" timestamptz,
	"pollingInterval" integer
);
