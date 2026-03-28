create table "jwks" (
  "id" uuid default uuidv7() not null primary key,
  "publicKey" text not null,
  "privateKey" text not null,
  "createdAt" timestamptz not null,
  "expiresAt" timestamptz
);
