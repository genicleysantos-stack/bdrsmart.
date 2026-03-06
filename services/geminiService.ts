
import { GoogleGenAI } from "@google/genai";

// Always use the environment variable directly for the API key as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLogisticsAdvice = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Você é o BDR BOT, especialista em logística de REPARO DE CELULARES do aplicativo "BDR SMART". 
        Sua especialidade é o sistema leva-e-traz exclusivo para smartphones.
        Identidade visual: PRETO, BRANCO e VERDE LIMÃO (#87ff00).
        Sempre que o usuário precisar de ajuda humana ou suporte direto, informe que o número oficial é (27) 99807-0773.
        Você ajuda com:
        - Dicas de como embalar o celular com segurança para transporte.
        - Estimativas de tempo para coleta de aparelhos (Apple, Samsung, etc).
        - Orientações sobre o que enviar junto (carregador, capinha, etc).
        - Encaminhamento para o suporte oficial no WhatsApp: (27) 99807-0773.
        Seja técnico porém amigável. Use o idioma Português do Brasil.
        Lembre-se: BDR SMART foca 100% em mobilidade de aparelhos celulares.`,
        temperature: 0.7,
      },
    });
    // The .text property is a getter, do not call it as a function.
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "O sistema BDR SMART para celulares está recalibrando. Tente novamente ou chame no WhatsApp: (27) 99807-0773.";
  }
};
