CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "email" TEXT,
  "emailVerified" DATETIME,
  "image" TEXT,
  "isGuest" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

CREATE TABLE IF NOT EXISTS "accounts" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "accounts_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_providerAccountId_key"
  ON "accounts"("provider", "providerAccountId");

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" DATETIME NOT NULL,
  CONSTRAINT "sessions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "sessions_sessionToken_key"
  ON "sessions"("sessionToken");

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" DATETIME NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_token_key"
  ON "verification_tokens"("token");

CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_identifier_token_key"
  ON "verification_tokens"("identifier", "token");

CREATE TABLE IF NOT EXISTS "conversations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "userQuestion" TEXT NOT NULL,
  "selectedPerspectives" TEXT NOT NULL,
  "aiResponse" TEXT NOT NULL,
  "title" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "conversations_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "conversations_userId_idx"
  ON "conversations"("userId");

CREATE TABLE IF NOT EXISTS "saved_conversations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "saved_conversations_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "saved_conversations_conversationId_fkey"
    FOREIGN KEY ("conversationId") REFERENCES "conversations"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "saved_conversations_userId_conversationId_key"
  ON "saved_conversations"("userId", "conversationId");
