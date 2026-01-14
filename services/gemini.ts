// This service is deprecated. The application now uses Pollinations AI (services/pollinations.ts) 
// to access various models including Grok, ChatGPT, Claude, and Gemini.

export const initChat = () => {
  console.warn("services/gemini.ts is deprecated. Use services/pollinations.ts instead.");
};

export const sendMessageStream = async function* () {
  throw new Error("This service is deprecated. Please use the Pollinations service.");
};
