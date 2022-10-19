CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
	"email" TEXT UNIQUE NOT NULL,
	"password" TEXT NOT NULL,
	"profilePic" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "likes" (
  "id" SERIAL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES users("id"),
	"postId" INTEGER NOT NULL REFERENCES posts("id"),
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "sessions" (
  "id" SERIAL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES users("id"),
	"token" TEXT UNIQUE NOT NULL,
	"active" BOOLEAN DEFAULT TRUE NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "metadata" (
  "id" SERIAL PRIMARY KEY,
  "image" TEXT,
  "title" TEXT,
  "description" TEXT
);

CREATE TABLE "posts" (
  "id" SERIAL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES users("id"),
  "metadataId" INTEGER NOT NULL REFERENCES metadata("id"),
	"url" TEXT NOT NULL,
	"content" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "hashtags" (
  "id" SERIAL PRIMARY KEY,
	"name" TEXT UNIQUE NOT NULL
);

CREATE TABLE "hashtagsPosts" (
  "id" SERIAL PRIMARY KEY,
	"postId" INTEGER NOT NULL REFERENCES posts("id"),
	"hashtagId" INTEGER NOT NULL REFERENCES hashtags("id")
);

CREATE TABLE "visits" (
  "id" SERIAL PRIMARY KEY,
	"postId" INTEGER UNIQUE NOT NULL REFERENCES posts("id"),
	"count" INTEGER DEFAULT 0
);
