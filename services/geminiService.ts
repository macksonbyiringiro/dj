import { GoogleGenAI, Type } from "@google/genai";
import { ProductDescription } from '../types';

// This check is to prevent crashing in environments where process.env is not defined.
const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY
  ? process.env.API_KEY
  : '';

if (!apiKey) {
  console.warn("API_KEY environment variable not set. Gemini API calls will be mocked.");
}

const ai = new GoogleGenAI({ apiKey });

const MOCKED_API_KEY = !apiKey;

const descriptionSchema = {
  type: Type.OBJECT,
  properties: {
    english: {
      type: Type.STRING,
      description: "An engaging and appealing product description in English, under 40 words."
    },
    kinyarwanda: {
      type: Type.STRING,
      description: "A translation of the English description into Kinyarwanda."
    },
  },
  required: ["english", "kinyarwanda"],
};


export const generateProductDescription = async (
  productName: string
): Promise<ProductDescription> => {
    if (MOCKED_API_KEY) {
        console.log("Using mocked Gemini response.");
        return {
            english: `Discover the amazing ${productName}. Perfect for all your needs and built to last.`,
            kinyarwanda: `Vumbura ${productName} itangaje. Byiza kubyo ukenera byose kandi biramba.`
        };
    }
  
  try {
    const prompt = `
      Product Name: ${productName}
      
      Based on the product name, generate an engaging, concise product description.
      Then, translate the English description into Kinyarwanda.
      Return the result as a JSON object matching the provided schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: descriptionSchema,
      },
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);
    
    if (parsed.english && parsed.kinyarwanda) {
        return parsed as ProductDescription;
    } else {
        throw new Error("Invalid JSON structure from Gemini.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback in case of API error
    return {
      english: `A high-quality ${productName}.`,
      kinyarwanda: `${productName} y'ubuziranenge.`,
    };
  }
};