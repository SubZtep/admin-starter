CREATE TABLE "nodes" (
  "id" uuid default uuidv7() not null primary key,
  "name" TEXT NOT NULL,
  "capabilities" JSONB,
  "status" TEXT NOT NULL DEFAULT 'idle',
  "current_job_id" UUID,
  "last_seen" timestamptz default CURRENT_TIMESTAMP not null,
  "created_at" timestamptz default CURRENT_TIMESTAMP not null,
  "updated_at" timestamptz default CURRENT_TIMESTAMP not null
);
CREATE INDEX "idx_nodes_status" ON "nodes" ("status");
CREATE INDEX "idx_nodes_last_seen" ON "nodes" ("last_seen");
