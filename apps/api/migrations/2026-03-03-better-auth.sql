create table "user" (
  "id" uuid default uuidv7() not null primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" boolean not null,
  "image" text,
  "role" text,
  "banned" boolean,
  "banReason" text,
  "banExpires" timestamptz,
  "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);
create table "session" (
  "id" uuid default uuidv7() not null primary key,
  "expiresAt" timestamptz not null,
  "token" text not null unique,
  "ipAddress" text,
  "userAgent" text,
  "impersonatedBy" uuid,
  "userId" uuid not null references "user" ("id") on delete cascade,
  "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);
create table "account" (
  "id" uuid default uuidv7() not null primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" uuid not null references "user" ("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope" text,
  "password" text,
  "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);
create table "verification" (
  "id" uuid default uuidv7() not null primary key,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);
create table "deviceCode" (
  "id" uuid default uuidv7() not null primary key,
  "deviceCode" text not null unique,
  "userCode" text not null unique,
  "userId" uuid references "user" ("id") on delete cascade,
  "clientId" text,
  "scope" text,
  "status" text not null,
  "expiresAt" timestamptz not null,
  "lastPolledAt" timestamptz,
  "pollingInterval" integer
);
create index "session_userId_idx" on "session" ("userId");
create index "account_userId_idx" on "account" ("userId");
create index "verification_identifier_idx" on "verification" ("identifier");
create index "deviceCode_userId_idx" on "deviceCode" ("userId");
create index "deviceCode_expiresAt_idx" on "deviceCode" ("expiresAt");
