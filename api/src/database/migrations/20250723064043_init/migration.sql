/*
  Warnings:

  - You are about to drop the `feedbacks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_consultant_id_fkey";

-- DropTable
DROP TABLE "feedbacks";

-- CreateTable
CREATE TABLE "conversation_feedbacks" (
    "id" SERIAL NOT NULL,
    "appointment_id" INTEGER,
    "testTakerName" TEXT,
    "date" TIMESTAMP(3),
    "consultant_id" INTEGER,
    "speaksFluently" BOOLEAN DEFAULT false,
    "occasionalPauses" BOOLEAN DEFAULT false,
    "oftenPauses" BOOLEAN DEFAULT false,
    "disorganizedIdeas" BOOLEAN DEFAULT false,
    "needsLongerAnswers" BOOLEAN DEFAULT false,
    "fluencyUseLinkingWords" BOOLEAN DEFAULT false,
    "fluencyPracticeThinking" BOOLEAN DEFAULT false,
    "fluencySpeakWithDetails" BOOLEAN DEFAULT false,
    "wideVocabularyRange" BOOLEAN DEFAULT false,
    "repeatsBasicWords" BOOLEAN DEFAULT false,
    "usesTopicTerms" BOOLEAN DEFAULT false,
    "wordChoiceErrors" BOOLEAN DEFAULT false,
    "lacksParaphrasing" BOOLEAN DEFAULT false,
    "vocabBuildList" BOOLEAN DEFAULT false,
    "vocabPracticeSynonyms" BOOLEAN DEFAULT false,
    "vocabUseGames" BOOLEAN DEFAULT false,
    "mostlyCorrectGrammar" BOOLEAN DEFAULT false,
    "errorsDontAffect" BOOLEAN DEFAULT false,
    "limitedSentenceTypes" BOOLEAN DEFAULT false,
    "frequentGrammarMistakes" BOOLEAN DEFAULT false,
    "needsComplexStructures" BOOLEAN DEFAULT false,
    "grammarFocusTenses" BOOLEAN DEFAULT false,
    "grammarUseConditionals" BOOLEAN DEFAULT false,
    "grammarWriteThenSpeak" BOOLEAN DEFAULT false,
    "pronunciationClear" BOOLEAN DEFAULT false,
    "minorPronunciationIssues" BOOLEAN DEFAULT false,
    "mispronouncesKeyWords" BOOLEAN DEFAULT false,
    "lacksIntonation" BOOLEAN DEFAULT false,
    "strongL1Influence" BOOLEAN DEFAULT false,
    "pronShadowSpeakers" BOOLEAN DEFAULT false,
    "pronRecordAndCheck" BOOLEAN DEFAULT false,
    "pronPracticePhonemes" BOOLEAN DEFAULT false,
    "overallLevel" TEXT,
    "generalComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_feedbacks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "conversation_feedbacks" ADD CONSTRAINT "conversation_feedbacks_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_feedbacks" ADD CONSTRAINT "conversation_feedbacks_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
