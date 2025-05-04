import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Send, Trash2 } from 'lucide-react-native';
import { Message, sendMessageToGemini } from '@/services/GeminiService';
import Colors from '@/constants/Colors';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import * as Haptics from 'expo-haptics';
import { storeMessages, getStoredMessages, clearStoredMessages } from '@/utils/storage';
import MessageComponent from '@/components/chat/MessageComponent';
import { WelcomeView } from '@/components/chat/WelcomeView';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const colors = Colors[colorScheme ?? 'light'];

  // Load stored messages on component mount
  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await getStoredMessages();
      if (storedMessages.length > 0) {
        setMessages(storedMessages);
      }
    };
    loadMessages();
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Store messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      storeMessages(messages);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Update messages state with user message
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setCharCount(0);
    setIsLoading(true);

    // Provide haptic feedback on send
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      // Send message to Gemini API
      const response = await sendMessageToGemini(inputText.trim());
      
      // Create AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      // Update messages state with AI response
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      // Handle errors
      console.error('Error sending message:', error);
      
      // Create error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true,
      };

      // Update messages state with error message
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setMessages([]);
    await clearStoredMessages();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        entering={FadeInDown.duration(500)} 
        style={[styles.header, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chat with Ai</Text>
        {messages.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearChat}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
        )}
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={headerHeight + 10}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            messages.length === 0 && styles.emptyMessagesContent
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <WelcomeView />
          ) : (
            messages.map((message, index) => (
              <MessageComponent
                key={message.id}
                message={message}
                isLastMessage={index === messages.length - 1}
              />
            ))
          )}

          {isLoading && (
            <Animated.View 
              entering={FadeInUp.duration(300)}
              style={[
                styles.loadingContainer, 
                { backgroundColor: colors.cardBackground }
              ]}
            >
              <ActivityIndicator color={colors.tint} size="small" />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Gemini is thinking...
              </Text>
            </Animated.View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground }]}>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground }]}
            placeholder="Ask Ai anything..."
            placeholderTextColor={colors.placeholderText}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              setCharCount(text.length);
            }}
            multiline
            maxLength={1000}
            onSubmitEditing={handleSendMessage}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? colors.tint : colors.tabIconDefault,
                opacity: inputText.trim() ? 1 : 0.5,
              },
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            activeOpacity={0.7}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.charCountContainer}>
          <Text style={[styles.charCount, { color: colors.tabIconDefault }]}>
            {charCount}/1000
          </Text>
        </View>
      </KeyboardAvoidingView>
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
  clearButton: {
    padding: 8,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyMessagesContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 16,
    marginTop: 16,
    maxWidth: '80%',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  charCountContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'flex-end',
  },
  charCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});