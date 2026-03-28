CREATE TABLE "jobs" (
  "id" uuid default uuidv7() not null primary key,
  "type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" TEXT NOT NULL,
  "assigned_to" TEXT,
  "result" JSONB,
  "error" TEXT,
  "started_at" timestamptz,
  "completed_at" timestamptz,
  "created_at" timestamptz default CURRENT_TIMESTAMP not null,
  "updated_at" timestamptz default CURRENT_TIMESTAMP not null
);
