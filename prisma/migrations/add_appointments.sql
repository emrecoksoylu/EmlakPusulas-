-- First, run this to see your actual table names:
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- After you see the table names, use the correct version below:
-- (Replace TABLENAME with the actual name you see)

-- Create enums
DO $$ BEGIN
    CREATE TYPE "AppointmentType" AS ENUM ('PROPERTY_VIEWING', 'LAND_REGISTRY', 'NOTARY', 'CLIENT_MEETING', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Appointment table
CREATE TABLE IF NOT EXISTS "Appointment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "address" TEXT,
    "agentId" TEXT NOT NULL,
    "customerId" TEXT,
    "listingId" TEXT,
    "notes" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- Create index
CREATE INDEX IF NOT EXISTS "Appointment_agentId_startTime_idx" ON "Appointment"("agentId", "startTime");

-- IMPORTANT: Replace AGENT_TABLE, CUSTOMER_TABLE, LISTING_TABLE with actual names from the query above
-- Common possibilities: Agent, agent, "Agent", Customer, customer, "Customer", etc.

-- Add foreign keys (EDIT THESE LINES with correct table names):
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_agentId_fkey" 
    FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customerId_fkey" 
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_listingId_fkey" 
    FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
