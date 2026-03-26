-- Add slug as nullable with a unique constraint
ALTER TABLE "Project" ADD COLUMN "slug" TEXT;
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
