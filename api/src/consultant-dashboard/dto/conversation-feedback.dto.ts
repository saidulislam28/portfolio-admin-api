import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateConversationFeedbackDto {
  @ApiProperty({
    description: 'Appointment ID for the conversation session',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  appointment_id: number;

  @ApiPropertyOptional({
    description: 'Test taker name',
    example: 'John Doe'
  })
  @IsString()
  @IsOptional()
  testTakerName?: string;

  // Fluency & Coherence
  @ApiPropertyOptional({
    description: 'Speaks fluently without hesitation',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  speaksFluently?: boolean;

  @ApiPropertyOptional({
    description: 'Occasional pauses during speech',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  occasionalPauses?: boolean;

  @ApiPropertyOptional({
    description: 'Often pauses during speech',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  oftenPauses?: boolean;

  @ApiPropertyOptional({
    description: 'Ideas are disorganized',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  disorganizedIdeas?: boolean;

  @ApiPropertyOptional({
    description: 'Needs to provide longer answers',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  needsLongerAnswers?: boolean;

  @ApiPropertyOptional({
    description: 'Uses linking words effectively',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  fluencyUseLinkingWords?: boolean;

  @ApiPropertyOptional({
    description: 'Needs practice in thinking before speaking',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  fluencyPracticeThinking?: boolean;

  @ApiPropertyOptional({
    description: 'Speaks with sufficient details',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  fluencySpeakWithDetails?: boolean;

  // Vocabulary
  @ApiPropertyOptional({
    description: 'Uses wide range of vocabulary',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  wideVocabularyRange?: boolean;

  @ApiPropertyOptional({
    description: 'Repeats basic words frequently',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  repeatsBasicWords?: boolean;

  @ApiPropertyOptional({
    description: 'Uses topic-specific terms appropriately',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  usesTopicTerms?: boolean;

  @ApiPropertyOptional({
    description: 'Makes word choice errors',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  wordChoiceErrors?: boolean;

  @ApiPropertyOptional({
    description: 'Lacks paraphrasing skills',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  lacksParaphrasing?: boolean;

  @ApiPropertyOptional({
    description: 'Should build vocabulary list',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  vocabBuildList?: boolean;

  @ApiPropertyOptional({
    description: 'Needs practice with synonyms',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  vocabPracticeSynonyms?: boolean;

  @ApiPropertyOptional({
    description: 'Could benefit from vocabulary games',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  vocabUseGames?: boolean;

  // Grammar
  @ApiPropertyOptional({
    description: 'Uses mostly correct grammar',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  mostlyCorrectGrammar?: boolean;

  @ApiPropertyOptional({
    description: 'Errors don\'t affect understanding',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  errorsDontAffect?: boolean;

  @ApiPropertyOptional({
    description: 'Uses limited sentence types',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  limitedSentenceTypes?: boolean;

  @ApiPropertyOptional({
    description: 'Makes frequent grammar mistakes',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  frequentGrammarMistakes?: boolean;

  @ApiPropertyOptional({
    description: 'Needs to use complex sentence structures',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  needsComplexStructures?: boolean;

  @ApiPropertyOptional({
    description: 'Should focus on verb tenses',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  grammarFocusTenses?: boolean;

  @ApiPropertyOptional({
    description: 'Needs practice with conditionals',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  grammarUseConditionals?: boolean;

  @ApiPropertyOptional({
    description: 'Should write before speaking to improve grammar',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  grammarWriteThenSpeak?: boolean;

  // Pronunciation
  @ApiPropertyOptional({
    description: 'Pronunciation is clear',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  pronunciationClear?: boolean;

  @ApiPropertyOptional({
    description: 'Has minor pronunciation issues',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  minorPronunciationIssues?: boolean;

  @ApiPropertyOptional({
    description: 'Mispronounces key words',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  mispronouncesKeyWords?: boolean;

  @ApiPropertyOptional({
    description: 'Lacks intonation and stress patterns',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  lacksIntonation?: boolean;

  @ApiPropertyOptional({
    description: 'Strong influence from first language',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  strongL1Influence?: boolean;

  @ApiPropertyOptional({
    description: 'Should practice shadowing native speakers',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  pronShadowSpeakers?: boolean;

  @ApiPropertyOptional({
    description: 'Should record and check pronunciation',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  pronRecordAndCheck?: boolean;

  @ApiPropertyOptional({
    description: 'Needs practice with specific phonemes',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  pronPracticePhonemes?: boolean;

  @ApiPropertyOptional({
    description: 'Overall proficiency level',
    example: 'B2 Intermediate'
  })
  @IsString()
  @IsOptional()
  overallLevel?: string;

  @ApiPropertyOptional({
    description: 'General comments and recommendations',
    example: 'Good overall performance. Needs to work on intonation and complex sentence structures.'
  })
  @IsString()
  @IsOptional()
  generalComments?: string;
}

export class ConversationFeedbackResponseDto {
  @ApiProperty({
    description: 'Email sending status',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Email message ID or status',
    example: 'Email sent successfully'
  })
  message: string;

  @ApiProperty({
    description: 'Feedback ID',
    example: 1
  })
  feedbackId: number;

  @ApiProperty({
    description: 'Recipient email address',
    example: 'student@example.com'
  })
  recipientEmail: string;
}

export class AppointmentUserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  full_name: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  email: string;
}

export class ConsultantDto {
  @ApiProperty({ description: 'Consultant full name', example: 'Jane Smith' })
  full_name: string;

  @ApiProperty({ description: 'Consultant email', example: 'jane@example.com' })
  email: string;
}

export class AppointmentDto {
  @ApiProperty({ type: AppointmentUserDto })
  User: AppointmentUserDto;
}

export class FullConversationFeedbackDto {
  @ApiProperty({ description: 'Feedback ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Appointment ID', example: 1 })
  appointment_id: number;

  @ApiProperty({ description: 'Test taker name', example: 'John Doe' })
  testTakerName: string;

  @ApiProperty({ type: AppointmentDto })
  Appointment: AppointmentDto;

  @ApiProperty({ type: ConsultantDto })
  Consultant: ConsultantDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}