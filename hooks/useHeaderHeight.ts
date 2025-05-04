import { Platform, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Returns the height of the header for proper KeyboardAvoidingView offset
 */
export function useHeaderHeight(): number {
  const insets = useSafeAreaInsets();
  
  if (Platform.OS === 'ios') {
    return insets.top + 44; // Standard iOS header height
  }
  
  if (Platform.OS === 'android') {
    return (StatusBar.currentHeight || 0) + 56; // Standard Android header height
  }
  
  return 60; // Default for web
}