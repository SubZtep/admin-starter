CREATE TABLE nodes (
  node_id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  capabilities JSONB,
  
  status TEXT NOT NULL DEFAULT 'idle', -- idle | busy | inactive
  current_job_id UUID,
  
  last_seen TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_nodes_status ON nodes(status);
CREATE INDEX idx_nodes_last_seen ON nodes(last_seen);
