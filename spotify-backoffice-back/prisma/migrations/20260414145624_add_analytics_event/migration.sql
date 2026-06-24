-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('PAGE_VIEW', 'CREATE_BAND', 'UPDATE_BAND', 'DELETE_BAND', 'CREATE_TRACK', 'UPDATE_TRACK', 'DELETE_TRACK', 'ERROR');

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "type" "AnalyticsEventType" NOT NULL,
    "page" TEXT NOT NULL,
    "action" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events"("created_at");

-- CreateIndex
CREATE INDEX "analytics_events_type_idx" ON "analytics_events"("type");

-- CreateIndex
CREATE INDEX "analytics_events_page_idx" ON "analytics_events"("page");
