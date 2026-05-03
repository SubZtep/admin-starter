CREATE TABLE "nodes" (
  "id" uuid default uuidv7() not null primary key,
  "name" text not null,
  "capabilities" jsonb,
  "status" text not null default 'idle',
  "current_job_id" uuid,
  "last_seen" timestamptz default CURRENT_TIMESTAMP not null,
  "created_at" timestamptz default CURRENT_TIMESTAMP not null,
  "updated_at" timestamptz default CURRENT_TIMESTAMP not null,
  constraint "nodes_status_check" check ("status" in ('idle', 'busy', 'inactive'))
);

CREATE TABLE "jobs" (
  "id" uuid default uuidv7() not null primary key,
  "type" text not null,
  "payload" jsonb not null,
  "status" text not null,
  "assigned_to" uuid references "nodes" ("id") on delete set null,
  "result" jsonb,
  "error" text,
  "started_at" timestamptz,
  "completed_at" timestamptz,
  "created_at" timestamptz default CURRENT_TIMESTAMP not null,
  "updated_at" timestamptz default CURRENT_TIMESTAMP not null,
  constraint "jobs_status_check" check ("status" in ('queued', 'assigned', 'done', 'error'))
);

ALTER TABLE "nodes"
ADD CONSTRAINT "nodes_current_job_id_fkey"
FOREIGN KEY ("current_job_id") REFERENCES "jobs" ("id") ON DELETE SET NULL;

CREATE INDEX "nodes_status_idx" ON "nodes" ("status");
CREATE INDEX "nodes_last_seen_idx" ON "nodes" ("last_seen");
CREATE INDEX "jobs_status_created_at_idx" ON "jobs" ("status", "created_at");
CREATE INDEX "jobs_status_updated_at_idx" ON "jobs" ("status", "updated_at");
CREATE INDEX "jobs_assigned_to_idx" ON "jobs" ("assigned_to");
