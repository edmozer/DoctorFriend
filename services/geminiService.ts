import { GoogleGenAI } from "@google/genai";

// Initialize the client
// In a real app, strict error handling for missing API keys is essential.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateClinicalSummary = async (rawNotes: string, patientName: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot generate summary.";

  try {
    const prompt = `
      You are an assistant to a psychologist. 
      Please rewrite the following raw session notes for patient "${patientName}" into a concise, professional clinical summary.
      Maintain a neutral, non-diagnostic tone. Focus on observations and reported feelings.
      
      Raw Notes:
      ${rawNotes}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with AI service.";
  }
};

export const generateReminderEmail = async (patientName: string, date: string, time: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";

  try {
    const prompt = `
      Draft a short, warm, and professional email reminder for a therapy session.
      Patient: ${patientName}
      Date: ${date}
      Time: ${time}
      
      The tone should be supportive but professional. Do not include subject lines, just the body.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate email draft.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with AI service.";
  }
};

export const suggestTherapeuticQuestions = async (context: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";

    try {
        const prompt = `
          Based on the following context, suggest 3 open-ended, non-intrusive questions a therapist might ask to facilitate reflection.
          Context: ${context}
          
          Format as a bulleted list.
        `;
    
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
    
        return response.text || "Could not generate suggestions.";
      } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error communicating with AI service.";
      }
}