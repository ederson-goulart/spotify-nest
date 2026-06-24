/*
  Warnings:

  - Added the required column `band_id` to the `tracks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "band_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "tracks_band_id_idx" ON "tracks"("band_id");

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_band_id_fkey" FOREIGN KEY ("band_id") REFERENCES "bands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
