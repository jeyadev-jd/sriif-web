-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL,
    "designation" TEXT NOT NULL DEFAULT '',
    "expertise" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "kyc" JSONB,
    "startupId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpCode" (
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Startup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL DEFAULT '',
    "pitchDeck" JSONB,
    "gstin" TEXT NOT NULL DEFAULT '',
    "trl" INTEGER NOT NULL DEFAULT 1,
    "sectors" TEXT[],
    "stage" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "onboardedOn" TEXT NOT NULL,
    "website" TEXT NOT NULL DEFAULT '',
    "linkedin" TEXT NOT NULL DEFAULT '',
    "regAddress" TEXT NOT NULL DEFAULT '',
    "commAddress" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "oneLiner" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL,
    "mentorIds" TEXT[],
    "seat" JSONB NOT NULL,
    "equityTaken" BOOLEAN NOT NULL DEFAULT false,
    "founders" JSONB NOT NULL DEFAULT '[]',
    "holdings" JSONB NOT NULL DEFAULT '[]',
    "shareClasses" TEXT NOT NULL DEFAULT '',
    "capTableFile" TEXT,
    "annual" JSONB NOT NULL DEFAULT '[]',
    "meetings" JSONB NOT NULL DEFAULT '[]',
    "memberRequests" JSONB NOT NULL DEFAULT '[]',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Startup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "uploadedOn" TEXT NOT NULL,
    "expiry" TEXT,
    "financial" BOOLEAN NOT NULL DEFAULT false,
    "data" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funding" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "round" TEXT NOT NULL,
    "proof" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Funding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "link" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "milestones" TEXT NOT NULL,
    "users" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "pilots" INTEGER NOT NULL,
    "partnerships" INTEGER NOT NULL,
    "challenges" TEXT NOT NULL,
    "support" TEXT NOT NULL,
    "submittedOn" TEXT NOT NULL,
    "submittedBy" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "byAdmin" BOOLEAN,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "issued" TEXT NOT NULL,
    "due" TEXT NOT NULL,
    "lines" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "kind" TEXT,
    "title" TEXT,
    "discount" DOUBLE PRECISION,
    "notes" TEXT,
    "payments" JSONB,
    "paidOn" TEXT,
    "receiptNo" TEXT,
    "utr" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "raisedBy" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "by" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "at" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "startupName" TEXT NOT NULL,
    "idea" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "via" TEXT NOT NULL,
    "receivedOn" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "JoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEntry" (
    "id" SERIAL NOT NULL,
    "at" TEXT NOT NULL,
    "by" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "AuditEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityBlock" (
    "id" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FacilityBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "at" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_startupId_idx" ON "User"("startupId");

-- CreateIndex
CREATE INDEX "Document_startupId_idx" ON "Document"("startupId");

-- CreateIndex
CREATE INDEX "Funding_startupId_idx" ON "Funding"("startupId");

-- CreateIndex
CREATE INDEX "Award_startupId_idx" ON "Award"("startupId");

-- CreateIndex
CREATE INDEX "Report_startupId_idx" ON "Report"("startupId");

-- CreateIndex
CREATE INDEX "Booking_startupId_idx" ON "Booking"("startupId");

-- CreateIndex
CREATE INDEX "Booking_facility_date_idx" ON "Booking"("facility", "date");

-- CreateIndex
CREATE INDEX "Invoice_startupId_idx" ON "Invoice"("startupId");

-- CreateIndex
CREATE INDEX "Ticket_startupId_idx" ON "Ticket"("startupId");

-- CreateIndex
CREATE INDEX "Message_startupId_idx" ON "Message"("startupId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
