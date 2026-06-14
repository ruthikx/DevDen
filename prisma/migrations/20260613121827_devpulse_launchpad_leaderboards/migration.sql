-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "frameworks" TEXT[],
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "version" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "pulseScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "projects"("createdAt");

-- CreateIndex
CREATE INDEX "projects_views_idx" ON "projects"("views");

-- CreateIndex
CREATE INDEX "projects_clerkUserId_idx" ON "projects"("clerkUserId");
