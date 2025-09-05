import { Ionicons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

export type HomeSectionType =
  | 'header'
  | 'search'
  | 'icon-carousel'
  | 'fullwidthbanner'
  | 'dualbanner'
  | 'image-carousel'
  | 'services'
  | 'video-carousel'
  | 'card-carousel'
  ;

export interface HomeSection {
  id: string;
  sortOrder: number;
  type: HomeSectionType;
  data?: any;
}

export type IconType =
  | { type: 'emoji'; value: string }
  | { type: 'image'; value: ImageSourcePropType }
  | { type: 'ionicons'; value: keyof typeof Ionicons.glyphMap };

export interface ServiceItem {
  id: string | number;
  name: string;
  icon: IconType;
}
