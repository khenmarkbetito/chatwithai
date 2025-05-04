import * as FileSystem from 'expo-file-system';
import { Message } from '@/services/GeminiService';

// Path to the JSON file that will store the messages
const MESSAGES_FILE = `${FileSystem.documentDirectory}messages.json`;

/**
 * Stores messages in the file system
 * @param messages Array of messages to store
 */
export async function storeMessages(messages: Message[]): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(
      MESSAGES_FILE,
      JSON.stringify(messages),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  } catch (error) {
    console.error('Error storing messages:', error);
  }
}

/**
 * Retrieves stored messages from the file system
 * @returns Promise resolving to an array of messages
 */
export async function getStoredMessages(): Promise<Message[]> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(MESSAGES_FILE);
    
    if (!fileInfo.exists) {
      return [];
    }
    
    const fileContents = await FileSystem.readAsStringAsync(MESSAGES_FILE, {
      encoding: FileSystem.EncodingType.UTF8
    });
    
    return JSON.parse(fileContents) as Message[];
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return [];
  }
}

/**
 * Clears all stored messages
 */
export async function clearStoredMessages(): Promise<void> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(MESSAGES_FILE);
    
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(MESSAGES_FILE);
    }
  } catch (error) {
    console.error('Error clearing messages:', error);
  }
}