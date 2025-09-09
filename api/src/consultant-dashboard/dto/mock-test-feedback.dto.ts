import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';

export class CreateMockTestFeedbackDto {
  @ApiProperty({
    description: 'Appointment ID for the mock test session',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  appointment_id: number;

  @ApiPropertyOptional({
    description: 'Test date',
    example: '2024-01-15T10:00:00.000Z'
  })
  @IsString()
  @IsOptional()
  testDate?: string;


  @ApiPropertyOptional({
    example: true
  })
  @IsBoolean()
  @IsOptional()
  mark_assignment_complete?: boolean;


  @ApiPropertyOptional({
    description: 'Test time',
    example: '10:00 AM'
  })
  @IsString()
  @IsOptional()
  testTime?: string;

  // Overall band score
  @ApiProperty({
    description: 'Overall band score (0.0 - 9.0)',
    example: 6.5,
    minimum: 0,
    maximum: 9
  })
  @IsNumber()
  @Min(0)
  @Max(9)
  overallBandScore: number;

  // Individual criteria scores
  @ApiProperty({
    description: 'Fluency and coherence score (0.0 - 9.0)',
    example: 7.0,
    minimum: 0,
    maximum: 9
  })
  @IsNumber()
  @Min(0)
  @Max(9)
  fluencyCoherence: number;

  @ApiProperty({
    description: 'Lexical resource score (0.0 - 9.0)',
    example: 6.0,
    minimum: 0,
    maximum: 9
  })
  @IsNumber()
  @Min(0)
  @Max(9)
  lexicalResource: number;

  @ApiProperty({
    description: 'Grammatical range score (0.0 - 9.0)',
    example: 6.5,
    minimum: 0,
    maximum: 9
  })
  @IsNumber()
  @Min(0)
  @Max(9)
  grammaticalRange: number;

  @ApiProperty({
    description: 'Pronunciation score (0.0 - 9.0)',
    example: 7.5,
    minimum: 0,
    maximum: 9
  })
  @IsNumber()
  @Min(0)
  @Max(9)
  pronunciation: number;

  // Fluency & Coherence feedback
  @ApiPropertyOptional({
    description: 'Speaks fluently',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  fluencyFluent?: boolean;

  @ApiPropertyOptional({
    description: 'Has natural flow of speech',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  fluencyNaturalFlow?: boolean;

  @ApiPropertyOptional({
    description: 'Needs better coherence',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  fluencyNeedsCoherence?: boolean;

  @ApiPropertyOptional({
    description: 'Repeats ideas frequently',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  fluencyRepeatsIdeas?: boolean;

  // Lexical Resource feedback
  @ApiPropertyOptional({
    description: 'Uses good vocabulary variety',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  lexicalGoodVariety?: boolean;

  @ApiPropertyOptional({
    description: 'Uses repetitive vocabulary',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  lexicalRepetitive?: boolean;

  @ApiPropertyOptional({
    description: 'Vocabulary doesn\'t match topic',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  lexicalTopicMismatch?: boolean;

  @ApiPropertyOptional({
    description: 'Has limited vocabulary range',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  lexicalLimitedRange?: boolean;

  // Grammatical Range feedback
  @ApiPropertyOptional({
    description: 'Makes frequent grammar errors',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  grammarFrequentErrors?: boolean;

  @ApiPropertyOptional({
    description: 'Has tense-related issues',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  grammarTenseIssues?: boolean;

  @ApiPropertyOptional({
    description: 'Uses limited grammatical structures',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  grammarLimitedRange?: boolean;

  @ApiPropertyOptional({
    description: 'Grammar is mostly accurate',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  grammarMostlyAccurate?: boolean;

  // Pronunciation feedback
  @ApiPropertyOptional({
    description: 'Pronounces sounds clearly',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  pronunciationClearSounds?: boolean;

  @ApiPropertyOptional({
    description: 'Uses good word stress',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  pronunciationGoodStress?: boolean;

  @ApiPropertyOptional({
    description: 'Has mispronunciations',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  pronunciationMispronunciations?: boolean;

  @ApiPropertyOptional({
    description: 'Has accent-related issues',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  pronunciationAccentIssues?: boolean;

  // Section-wise feedback
  @ApiPropertyOptional({
    description: 'Confident in Part 1',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  part1Confident?: boolean;

  @ApiPropertyOptional({
    description: 'Gives short answers in Part 1',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  part1ShortAnswer?: boolean;

  @ApiPropertyOptional({
    description: 'Needs more details in Part 1',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  part1NeedsMoreDetails?: boolean;

  @ApiPropertyOptional({
    description: 'Well organized in Part 2',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  part2WellOrganized?: boolean;

  @ApiPropertyOptional({
    description: 'Missed points in Part 2',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  part2MissedPoints?: boolean;

  @ApiPropertyOptional({
    description: 'Answer too short in Part 2',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  part2TooShort?: boolean;

  @ApiPropertyOptional({
    description: 'Insightful in Part 3',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  part3Insightful?: boolean;

  @ApiPropertyOptional({
    description: 'Repetitive in Part 3',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  part3Repetitive?: boolean;

  @ApiPropertyOptional({
    description: 'Well developed answers in Part 3',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  part3WellDeveloped?: boolean;

  @ApiPropertyOptional({
    description: 'Answers too short in Part 3',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  part3TooShort?: boolean;

  // Recommendations
  @ApiPropertyOptional({
    description: 'Recommend practice with cue cards',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  recPracticeCueCard?: boolean;

  @ApiPropertyOptional({
    description: 'Recommend expanding topic vocabulary',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  recExpandTopicVocab?: boolean;

  @ApiPropertyOptional({
    description: 'Recommend reducing grammar mistakes',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  recReduceGrammarMistakes?: boolean;

  @ApiPropertyOptional({
    description: 'Recommend watching native conversations',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  recWatchNativeConversations?: boolean;

  @ApiPropertyOptional({
    description: 'Recommend using linking phrases',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  recUseLinkingPhrases?: boolean;

  @ApiPropertyOptional({
    description: 'Recommend improving fluency',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  recImproveFluency?: boolean;

  @ApiPropertyOptional({
    description: 'Recommend improving pronunciation',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  recImprovePronunciation?: boolean;

  @ApiPropertyOptional({
    description: 'Additional notes and comments',
    example: 'Good overall performance. Needs to work on complex sentence structures.'
  })
  @IsString()
  @IsOptional()
  additionalNotes?: string;
}

export class MockTestFeedbackResponseDto {
  @ApiProperty({
    description: 'Feedback ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Appointment ID',
    example: 1
  })
  appointment_id: number;

  @ApiProperty({
    description: 'Consultant ID',
    example: 1
  })
  consultant_id: number;

  @ApiProperty({
    description: 'Overall band score',
    example: 6.5
  })
  overallBandScore: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class MockTestFeedbackListResponseDto {
  @ApiProperty({
    type: [MockTestFeedbackResponseDto],
    description: 'List of mock test feedbacks'
  })
  data: MockTestFeedbackResponseDto[];

  @ApiProperty({
    description: 'Total count of feedbacks',
    example: 10
  })
  total: number;
}

// Additional DTOs for future use
export class UpdateMockTestFeedbackDto {
  @ApiPropertyOptional({
    description: 'Additional notes and comments',
    example: 'Updated feedback after review'
  })
  @IsString()
  @IsOptional()
  additionalNotes?: string;

  @ApiPropertyOptional({
    description: 'Overall band score (0.0 - 9.0)',
    example: 7.0,
    minimum: 0,
    maximum: 9
  })
  @IsNumber()
  @Min(0)
  @Max(9)
  @IsOptional()
  overallBandScore?: number;
}

export class MockTestFeedbackQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by appointment ID',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  appointment_id?: number;

  @ApiPropertyOptional({
    description: 'Filter by consultant ID',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  consultant_id?: number;

  @ApiPropertyOptional({
    description: 'Minimum band score',
    example: 5.0,
    minimum: 0,
    maximum: 9
  })
  @IsNumber()
  @Min(0)
  @Max(9)
  @IsOptional()
  min_score?: number;

  @ApiPropertyOptional({
    description: 'Maximum band score',
    example: 8.0,
    minimum: 0,
    maximum: 9
  })
  @IsNumber()
  @Min(0)
  @Max(9)
  @IsOptional()
  max_score?: number;
}