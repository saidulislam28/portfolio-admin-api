/*
  Warnings:

  - You are about to drop the `speaking_test_feedbacks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "speaking_test_feedbacks" DROP CONSTRAINT "speaking_test_feedbacks_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "speaking_test_feedbacks" DROP CONSTRAINT "speaking_test_feedbacks_consultant_id_fkey";

-- DropForeignKey
ALTER TABLE "speaking_test_feedbacks" DROP CONSTRAINT "speaking_test_feedbacks_userId_fkey";

-- DropTable
DROP TABLE "speaking_test_feedbacks";

-- CreateTable
CREATE TABLE "mock_test_feedbacks" (
    "id" SERIAL NOT NULL,
    "consultant_id" INTEGER,
    "appointment_id" INTEGER NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testTime" TEXT NOT NULL,
    "overallBandScore" DOUBLE PRECISION NOT NULL,
    "fluencyCoherence" DOUBLE PRECISION NOT NULL,
    "lexicalResource" DOUBLE PRECISION NOT NULL,
    "grammaticalRange" DOUBLE PRECISION NOT NULL,
    "pronunciation" DOUBLE PRECISION NOT NULL,
    "fluencyFluent" BOOLEAN NOT NULL DEFAULT false,
    "fluencyNaturalFlow" BOOLEAN NOT NULL DEFAULT false,
    "fluencyNeedsCoherence" BOOLEAN NOT NULL DEFAULT false,
    "fluencyRepeatsIdeas" BOOLEAN NOT NULL DEFAULT false,
    "lexicalGoodVariety" BOOLEAN NOT NULL DEFAULT false,
    "lexicalRepetitive" BOOLEAN NOT NULL DEFAULT false,
    "lexicalTopicMismatch" BOOLEAN NOT NULL DEFAULT false,
    "lexicalLimitedRange" BOOLEAN NOT NULL DEFAULT false,
    "grammarFrequentErrors" BOOLEAN NOT NULL DEFAULT false,
    "grammarTenseIssues" BOOLEAN NOT NULL DEFAULT false,
    "grammarLimitedRange" BOOLEAN NOT NULL DEFAULT false,
    "grammarMostlyAccurate" BOOLEAN NOT NULL DEFAULT false,
    "pronunciationClearSounds" BOOLEAN NOT NULL DEFAULT false,
    "pronunciationGoodStress" BOOLEAN NOT NULL DEFAULT false,
    "pronunciationMispronunciations" BOOLEAN NOT NULL DEFAULT false,
    "pronunciationAccentIssues" BOOLEAN NOT NULL DEFAULT false,
    "part1Confident" BOOLEAN NOT NULL DEFAULT false,
    "part1ShortAnswer" BOOLEAN NOT NULL DEFAULT false,
    "part1NeedsMoreDetails" BOOLEAN NOT NULL DEFAULT false,
    "part2WellOrganized" BOOLEAN NOT NULL DEFAULT false,
    "part2MissedPoints" BOOLEAN NOT NULL DEFAULT false,
    "part2TooShort" BOOLEAN NOT NULL DEFAULT false,
    "part3Insightful" BOOLEAN NOT NULL DEFAULT false,
    "part3Repetitive" BOOLEAN NOT NULL DEFAULT false,
    "part3WellDeveloped" BOOLEAN NOT NULL DEFAULT false,
    "part3TooShort" BOOLEAN NOT NULL DEFAULT false,
    "recPracticeCueCard" BOOLEAN NOT NULL DEFAULT false,
    "recExpandTopicVocab" BOOLEAN NOT NULL DEFAULT false,
    "recReduceGrammarMistakes" BOOLEAN NOT NULL DEFAULT false,
    "recWatchNativeConversations" BOOLEAN NOT NULL DEFAULT false,
    "recUseLinkingPhrases" BOOLEAN NOT NULL DEFAULT false,
    "recImproveFluency" BOOLEAN NOT NULL DEFAULT false,
    "recImprovePronunciation" BOOLEAN NOT NULL DEFAULT false,
    "additionalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "mock_test_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mock_test_feedbacks_appointment_id_key" ON "mock_test_feedbacks"("appointment_id");

-- AddForeignKey
ALTER TABLE "mock_test_feedbacks" ADD CONSTRAINT "mock_test_feedbacks_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_feedbacks" ADD CONSTRAINT "mock_test_feedbacks_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_feedbacks" ADD CONSTRAINT "mock_test_feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
