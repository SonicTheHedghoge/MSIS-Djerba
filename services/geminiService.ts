import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let chatSession: Chat | null = null;

export const initChat = () => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing for Gemini.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initChat();
    if (!chatSession) {
      return "I'm sorry, my connection to the server is currently unavailable. Please try calling us directly.";
    }
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I didn't catch that, could you rephrase?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble processing that request right now. Please try again later.";
  }
};