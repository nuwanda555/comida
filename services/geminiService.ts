
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

export const analyzeFoodImage = async (imageFile: File): Promise<AnalysisResult> => {
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `Analiza esta imagen de un plato de comida. Proporciona una lista de ingredientes probables, una receta paso a paso para prepararlo y una lista de alérgenos comunes que podría contener. Responde únicamente en formato JSON.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            ingredients: {
                type: Type.ARRAY,
                description: 'Lista de ingredientes probables en el plato.',
                items: { type: Type.STRING },
            },
            recipe: {
                type: Type.ARRAY,
                description: 'Pasos detallados para preparar el plato.',
                items: { type: Type.STRING },
            },
            allergens: {
                type: Type.ARRAY,
                description: 'Lista de posibles alérgenos comunes (ej. gluten, lácteos, frutos secos).',
                items: { type: Type.STRING },
            },
        },
        required: ['ingredients', 'recipe', 'allergens'],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    imagePart,
                    { text: prompt },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText);
        
        // Basic validation
        if (
            !parsedResult.ingredients || 
            !parsedResult.recipe || 
            !parsedResult.allergens
        ) {
            throw new Error("La respuesta de la API no tiene el formato esperado.");
        }
        
        return parsedResult as AnalysisResult;
        
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("No se pudo analizar la imagen. Por favor, inténtalo de nuevo con una imagen más clara o diferente.");
    }
};
