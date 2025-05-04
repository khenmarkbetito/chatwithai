import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  useColorScheme,
  Alert,
} from 'react-native';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { Message } from '@/services/GeminiService';
import Colors from '@/constants/Colors';
import { Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

interface MessageComponentProps {
  message: Message;
  isLastMessage: boolean;
}

export default function MessageComponent({ message, isLastMessage }: MessageComponentProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isUserMessage = message.sender === 'user';

  const handleCopyText = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await Clipboard.setStringAsync(message.content);
    Alert.alert('Copied', 'Message copied to clipboard');
  };

  const renderTimestamp = () => {
    const date = new Date(message.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format the message content to handle special characters and formatting
  const formatMessageContent = (content: string) => {
    // Replace ** with proper styling
    const parts = content.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove ** and apply bold styling
        const text = part.slice(2, -2);
        return (
          <Text key={index} style={styles.boldText}>
            {text}
          </Text>
        );
      }
      return (
        <Text key={index}>
          {part}
        </Text>
      );
    });
  };

  return (
    <Animated.View
      entering={isUserMessage ? FadeInRight.duration(300) : FadeInLeft.duration(300)}
      style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isUserMessage
            ? [styles.userBubble, { backgroundColor: colors.userBubble }]
            : [
                styles.aiBubble,
                { 
                  backgroundColor: colors.aiBubble,
                  borderColor: colors.border,
                  borderWidth: StyleSheet.hairlineWidth,
                },
              ],
          message.isError && styles.errorBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUserMessage
              ? { color: colors.userText }
              : { color: colors.aiText },
            message.isError && styles.errorText,
          ]}
        >
          {formatMessageContent(message.content)}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={[styles.timestamp, { color: colors.tabIconDefault }]}>
            {renderTimestamp()}
          </Text>
          {!isUserMessage && (
            <TouchableOpacity
              onPress={handleCopyText}
              style={styles.copyButton}
              activeOpacity={0.7}
            >
              <Copy size={14} color={colors.tabIconDefault} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 16,
    maxWidth: '90%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '100%',
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    backgroundColor: '#fee2e2',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  boldText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: '#b91c1c',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
});