-- CreateTable
CREATE TABLE "settings" (
    "upload_prhase" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_upload_prhase_key" ON "settings"("upload_prhase");
