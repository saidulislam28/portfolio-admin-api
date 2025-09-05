// components/onboarding/OnboardingData.ts
export interface OnboardingItem {
  id: number;
  title: string;
  subtitle: string;
  image: any; // For local images
  imageDescription: string; // Description for suggested illustration
}

export const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    title: 'Welcome to Your Journey',
    subtitle: 'Discover amazing features that will transform the way you work and play. Get ready for an incredible experience.',
    image: require('@/assets/images/icon.png'), // You'll need to add this image
    imageDescription: 'Illustration of a person with a smartphone showing confetti and celebration elements, representing a warm welcome and new beginnings'
  },
  {
    id: 2,
    title: 'Stay Connected & Organized',
    subtitle: 'Keep track of everything that matters to you. Seamlessly sync across all your devices and never miss a beat.',
    image: require('@/assets/images/icon.png'), // You'll need to add this image
    imageDescription: 'Illustration of multiple connected devices (phone, tablet, laptop) with data syncing between them, showing connectivity and organization'
  },
  {
    id: 3,
    title: 'Achieve More Together',
    subtitle: 'Collaborate with others, share your progress, and reach your goals faster than ever before.',
    image: require('@/assets/images/icon.png'), // You'll need to add this image
    imageDescription: 'Illustration of diverse people working together around a large target/goal symbol, representing teamwork and achievement'
  }
];