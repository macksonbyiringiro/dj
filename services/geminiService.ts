import { GoogleGenAI, Type, Chat } from "@google/genai";
import { ProductDescription, Product } from '../types';

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

const defaultBackgroundPrompt = "A modern online marketplace setting, with digital shopping carts, glowing icons of products, laptops and smartphones displaying store websites, abstract shelves with goods floating in a futuristic space, bright professional lighting, clean layout, high-resolution, perfect for illustrating e-commerce and online sales.";

export const generateMarketplaceBackground = async (prompt: string = defaultBackgroundPrompt): Promise<string | null> => {
  if (MOCKED_API_KEY) {
    console.log("Using mocked background image (gradient).");
    return 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
  }
  
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;

  } catch (error) {
    console.error("Error calling Gemini Image API:", error);
    return null;
  }
};

// --- CHAT FUNCTIONALITY ---

export type ChatSession = Chat;

export const startChatSession = (product: Product): ChatSession => {
    if (MOCKED_API_KEY) {
        console.log("Creating mocked Gemini Chat session.");
        return {
            sendMessage: async (params: { message: string }) => {
                console.log("Using mocked Chat response for:", params.message);
                await new Promise(res => setTimeout(res, 500));
                const response = {
                    text: `This is a mocked AI response regarding "${product.name}". The price is ${product.priceUSD} USD. What else can I help you with?`,
                };
                // This needs to be wrapped in a promise to match the real return type.
                return Promise.resolve(response);
            },
        } as unknown as ChatSession;
    }

    const systemInstruction = `You are a friendly and helpful sales assistant for a marketplace called BiasharaScan. You are currently helping a customer with the product: "${product.name}".
    
    Product Details:
    - Name: ${product.name}
    - Price: ${product.priceUSD} USD
    - Description (English): ${product.description.english}
    - Description (Kinyarwanda): ${product.description.kinyarwanda}
    
    Your instructions:
    1.  Answer customer questions based ONLY on the information provided above.
    2.  Be polite, concise, and helpful.
    3.  If you do not know the answer from the provided details (e.g., questions about materials, warranty, shipping, stock), you MUST politely state that you do not have that information and suggest they contact the seller directly for specifics. DO NOT invent details.
    4.  Keep your answers short and to the point, ideally 1-3 sentences.
    5.  You can answer in English or Kinyarwanda, depending on the user's question.`;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });

    return chat;
};

// --- GENERAL CHAT FUNCTIONALITY ---

export const startGeneralChatSession = (products: Product[]): ChatSession => {
    if (MOCKED_API_KEY) {
        console.log("Creating mocked General Gemini Chat session.");
        return {
            sendMessage: async (params: { message: string }) => {
                console.log("Using mocked General Chat response for:", params.message);
                await new Promise(res => setTimeout(res, 500));
                const response = {
                    text: `This is a mocked response from Mackson. We have ${products.length} products available. How can I help you find something?`,
                };
                return Promise.resolve(response);
            },
        } as unknown as ChatSession;
    }

    const productListForPrompt = products.map(p => ({
        name: p.name,
        priceUSD: p.priceUSD,
        description: p.description.english,
    }));

    const systemInstruction = `You are Mackson, a friendly and helpful AI assistant for a marketplace called BiasharaScan.

    Your instructions:
    1. Your name is Mackson. Always be polite and cheerful.
    2. Your goal is to help users discover products and navigate the marketplace.
    3. You have access to the current list of available products.
    4. Answer user questions based on the product list provided below. You can make recommendations, compare products, or find products based on user descriptions.
    5. If a user asks a question you cannot answer from the list (e.g., "Do you have shoes?" when none are listed), politely say you couldn't find it and suggest what you CAN see.
    6. Encourage users to use the search bar for specific items or scan a product's QR code to get full details and ask product-specific questions.
    7. Keep your answers concise and helpful.
    
    Here is the list of available products in JSON format:
    ${JSON.stringify(productListForPrompt, null, 2)}
    `;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });

    return chat;
};

export const sendMessage = async (chat: ChatSession, message: string): Promise<string> => {
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "I'm sorry, I'm having some trouble connecting at the moment. Please try again in a little bit.";
    }
};