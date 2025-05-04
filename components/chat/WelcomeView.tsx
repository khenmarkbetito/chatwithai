import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

interface SuggestionProps {
  title: string;
  description: string;
  onPress: () => void;
}

function Suggestion({ title, description, onPress }: SuggestionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.suggestionCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.suggestionTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.suggestionDescription, { color: colors.tabIconDefault }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

export function WelcomeView() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  // Example prompts that will be passed to the chat input when clicked
  const suggestions = [
    {
      title: 'Explain AI and machine learning',
      description: 'Get a simple explanation of AI concepts',
      prompt: 'Explain artificial intelligence and machine learning in simple terms.',
    },
    {
      title: 'Creative writing assistant',
      description: 'Get help with creative writing',
      prompt: 'Help me write a short story about a space traveler who discovers a new planet.',
    },
    {
      title: 'Code review and help',
      description: 'Get coding assistance',
      prompt: 'Can you help me improve this React Native code snippet: \n\nconst App = () => {\n  return <View><Text>Hello World</Text></View>;\n}',
    },
    {
      title: 'Learning recommendations',
      description: 'Get personalized learning resources',
      prompt: 'I want to learn React Native. What resources do you recommend for beginners?',
    },
  ];

  return (
    <Animated.View 
      entering={FadeIn.duration(600)}
      style={styles.container}
    >
      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
          Welcome to Nexus
        </Text>
        <Text style={[styles.welcomeDescription, { color: colors.tabIconDefault }]}>
          Ask me anything or try one of these suggestions
        </Text>
      </View>

      <View style={styles.suggestionsContainer}>
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            title={suggestion.title}
            description={suggestion.description}
            onPress={() => {
              // This would ideally set the input text and trigger send, 
              // but for simplicity we'll just navigate back to the chat screen
              router.replace({
                pathname: "/chat",
                params: { prompt: suggestion.prompt }
              });
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 24,
  },
  suggestionsContainer: {
    width: '100%',
  },
  suggestionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  suggestionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  suggestionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});