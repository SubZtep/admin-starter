CREATE TABLE jobs (
  job_id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,

  status TEXT NOT NULL, -- queued | assigned | done | error
  assigned_to TEXT,

  result JSONB,
  error TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);
