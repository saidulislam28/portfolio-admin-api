import { View, Text } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

export default function RichTextRenderer({ html }) {
  const { width } = useWindowDimensions();
  
  return (
    <RenderHtml
      contentWidth={width}
      source={{ html }}
      baseStyle={{ color: '#333', lineHeight: 22 }}
    />
  );
}