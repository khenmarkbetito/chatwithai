import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  ChevronRight,
  Info,
  Key,
  ExternalLink,
  Github,
  Send,
  FolderOpen,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { clearStoredMessages } from '@/utils/storage';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleCopyApiKey = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await Clipboard.setStringAsync('AIzaSyDqzpqarAbDUPOH-Qzf2M-EkoFaJjbXtw4');
    Alert.alert('API Key Copied', 'The Gemini API key has been copied to your clipboard.');
  };

  const handleClearHistory = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all chat history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearStoredMessages();
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            Alert.alert('Success', 'Chat history has been cleared.');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        entering={FadeInDown.duration(500)}
        style={[styles.header, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </Animated.View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>API Settings</Text>
          <TouchableOpacity
            style={[styles.setting, { backgroundColor: colors.cardBackground }]}
            onPress={handleCopyApiKey}
            activeOpacity={0.7}
          >
            <Key size={20} color={colors.tint} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Gemini API Key</Text>
              <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
                View or copy your API key
              </Text>
            </View>
            <ChevronRight size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
          <TouchableOpacity
            style={[styles.setting, { backgroundColor: colors.cardBackground }]}
            onPress={handleClearHistory}
            activeOpacity={0.7}
          >
            <FolderOpen size={20} color={colors.tint} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Clear Chat History</Text>
              <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
                Delete all saved conversations
              </Text>
            </View>
            <ChevronRight size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <TouchableOpacity
            style={[styles.setting, { backgroundColor: colors.cardBackground }]}
            onPress={() => Linking.openURL('https://ai.google.dev/docs/gemini_api_overview')}
            activeOpacity={0.7}
          >
            <Info size={20} color={colors.tint} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Gemini API Docs</Text>
              <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
                Learn more about the Gemini API
              </Text>
            </View>
            <ExternalLink size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.setting, { backgroundColor: colors.cardBackground }]}
            onPress={() => Linking.openURL('https://github.com/google-gemini')}
            activeOpacity={0.7}
          >
            <Github size={20} color={colors.tint} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>GitHub Repository</Text>
              <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
                View the source code
              </Text>
            </View>
            <ExternalLink size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.setting, { backgroundColor: colors.cardBackground }]}
            onPress={() => Linking.openURL('https://ai.google.dev/tutorials/rest_quickstart')}
            activeOpacity={0.7}
          >
            <Send size={20} color={colors.tint} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>API Tutorials</Text>
              <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
                Get more help with Gemini API
              </Text>
            </View>
            <ExternalLink size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>

        <View style={styles.appInfoContainer}>
        <Text style={[styles.appName, { color: colors.text }]}>Dev <Text style={[styles.appVersion, { color: colors.tabIconDefault }]}>
            Khenmark
          </Text></Text>
          <Text style={[styles.appName, { color: colors.text }]}>Nexus <Text style={[styles.appVersion, { color: colors.tabIconDefault }]}>
            Version 1.0.0
          </Text></Text>
        </View>
      </ScrollView>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 2,
  },
  appInfoContainer: {
    alignItems: 'center',
    marginVertical: 24,
    paddingBottom: 24,
  },
  appName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  },
});