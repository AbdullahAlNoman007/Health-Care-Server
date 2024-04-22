/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,scheduleId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Appointment_scheduleId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_scheduleId_key" ON "Appointment"("doctorId", "scheduleId");
