-- Recreate Project table with slug as NOT NULL
-- (SQLite does not support ALTER COLUMN ... NOT NULL directly)

-- Step 1: create new table with the desired schema
CREATE TABLE "Project_new" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "images" TEXT NOT NULL DEFAULT '[]',
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Step 2: copy all rows (every row already has a slug from the backfill)
INSERT INTO "Project_new" SELECT "id","name","slug","summary","description","tags","images","liveUrl","githubUrl","featured","order","visible","createdAt","updatedAt" FROM "Project";

-- Step 3: drop old table and its index
DROP INDEX "Project_slug_key";
DROP TABLE "Project";

-- Step 4: rename new table
ALTER TABLE "Project_new" RENAME TO "Project";

-- Step 5: recreate the unique index
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
