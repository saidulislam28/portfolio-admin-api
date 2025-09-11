import { ApiProperty } from '@nestjs/swagger';

class BaseDataDto {
  @ApiProperty({ example: 'support@example.com' })
  email: string;

  @ApiProperty({ example: '<iframe ...></iframe>', description: 'Google Maps embed code' })
  map: string;

  @ApiProperty({ example: '+8801700000000' })
  phone: string;

  @ApiProperty({ example: '123 Main St, Anytown' })
  address: string;

  @ApiProperty({ example: 'http://example.com/logo.png' })
  logo: string;

  @ApiProperty({ example: 'http://example.com/favicon.ico' })
  favicon: string;

  @ApiProperty({ example: 'http://facebook.com/brand' })
  facebook: string;

  @ApiProperty({ example: 'http://twitter.com/brand' })
  twitter: string;

  @ApiProperty({ example: 'http://instagram.com/brand' })
  instagram: string;

  @ApiProperty({ example: 'http://youtube.com/brand' })
  youtube: string;

  @ApiProperty({ example: 'http://linkedin.com/brand' })
  linkedin: string;

  @ApiProperty({ example: 'Brand Name' })
  brand_name: string;

  @ApiProperty({ example: 'http://example.com' })
  brand_url: string;

  @ApiProperty({ example: 50, description: 'Delivery charge amount' })
  delivery_charge: number;
}

class SliderDataDto {
  @ApiProperty({ example: 1, description: 'Slider ID' })
  id: number;

  @ApiProperty({ example: 'Slider Title' })
  title: string;

  @ApiProperty({ example: 'http://example.com/slider1.jpg' })
  image: string;

  @ApiProperty({ example: 1, description: 'Sort order' })
  sort_order: number;
}

class VideoSliderDataDto {
  @ApiProperty({ example: 1, description: 'Video slider ID' })
  id: number;

  @ApiProperty({ example: 'Video Title' })
  title: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=123' })
  url: string;

  @ApiProperty({ example: 1, description: 'Sort order' })
  sort_order: number;
}

class IELTSRegistrationDto {
  @ApiProperty({ example: 'Description for IELTS registration' })
  values: string;

  @ApiProperty({ example: 'http://example.com/ielts.jpg' })
  image: string;
}

class OnlineCourseDto {
  @ApiProperty({ example: 'Description for online courses' })
  values: string;

  @ApiProperty({ example: 'http://example.com/course1.jpg' })
  image: string;

  @ApiProperty({ example: 'http://example.com/course2.jpg' })
  image1: string;

  @ApiProperty({ example: 'http://example.com/course3.jpg' })
  image2: string;
}

class StudyAbroadDto {
  @ApiProperty({ example: 'Description for study abroad' })
  values: string;

  @ApiProperty({ example: 'http://example.com/study1.jpg' })
  image: string;

  @ApiProperty({ example: 'http://example.com/study2.jpg' })
  image1: string;

  @ApiProperty({ example: 'http://example.com/study3.jpg' })
  image2: string;
}

export class GetHomeDataResponseDto {
  @ApiProperty({ type: BaseDataDto })
  base_data: BaseDataDto;

  @ApiProperty({ type: IELTSRegistrationDto })
  ielts_registration: IELTSRegistrationDto;

  @ApiProperty({ type: [SliderDataDto] })
  slider_data: SliderDataDto[];

  @ApiProperty({ type: OnlineCourseDto })
  online_course: OnlineCourseDto;

  @ApiProperty({ type: StudyAbroadDto })
  study_abroad: StudyAbroadDto;

  @ApiProperty({ type: [VideoSliderDataDto] })
  video_slider_data: VideoSliderDataDto[];
}