
import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// Generate a tattoo design concept based on description
export const generateTattooDesign = async (prompt: string, style: string = "Blackwork", complexity: string = "Detailed"): Promise<string> => {
  const ai = getClient();
  
  // Using gemini-2.5-flash-image (Nano Banana) for generation
  // Engineered prompt to incorporate style and complexity with strict visual constraints
  const enhancedPrompt = `Act as a world-class tattoo artist designing a custom stencil.

  CLIENT REQUEST (SUBJECT): "${prompt}"
  ARTISTIC STYLE: ${style}
  COMPLEXITY LEVEL: ${complexity}

  DESIGN RULES:
  1. **Composition**: Center the design on a PURE WHITE background (#FFFFFF). No borders, no skin, no body parts.
  2. **Line Work & Technique**:
     - If Style is 'Realism': Focus on smooth shading, volumetric depth, and soft edges. Avoid hard outlines unless necessary.
     - If Style is 'Traditional' (Old School): Use bold, uniform black outlines with heavy black shading and strong contrast.
     - If Style is 'Minimalist': Use fine (single needle) lines, extensive negative space, and only essential details.
     - If Style is 'Geometric': Use precise mathematical lines, sacred geometry, dotwork shading, and sharp angles.
     - If Style is 'Watercolor': Use fluid shapes, soft edges, and artistic splatters (rendered as high-contrast greyscale for stencil visibility).
     - If Style is 'Blackwork': Use heavy solid black fills, high contrast, and negative space patterns.
     - If Style is 'Lettering': Use precise, high-contrast typography (Script, Gothic, or Serif). Focus on legibility and flow.
  3. **Complexity Guide**:
     - 'Simple': Minimal shading, focus on clear silhouette and flow.
     - 'Medium': Balanced detail with standard shading.
     - 'Detailed': Intricate textures (stippling, hatching, etching style), fine internal patterns, and high element count.
  4. **Output Format**: High-contrast black ink on white paper. Digital flash sheet quality. 
     - Ensure the design is legible and flows well anatomically.
     - Interpretation: Capture the essence of the client's request creatively but clearly. Do not add text unless requested.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
    });

    // Extract image from response parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Design Generation Error:", error);
    throw error;
  }
};

// Simulate the tattoo on the user's body part
// Now accepts a composited image where the user has already placed the tattoo
export const simulateTattooOnBody = async (
  compositedImageBase64: string, 
  designPrompt: string
): Promise<string> => {
  const ai = getClient();

  // Clean base64 string
  const base64Data = compositedImageBase64.split(',')[1];
  const mimeType = compositedImageBase64.substring(compositedImageBase64.indexOf(':') + 1, compositedImageBase64.indexOf(';'));

  // Prompt engineering for editing/simulation
  // upgraded to gemini-3-pro-image-preview for advanced lighting and skin texture handling
  const simulationPrompt = `Advanced Image Editing: Hyper-Realistic Tattoo Integration.
  
  INPUT ANALYSIS:
  The provided image contains a digital overlay of a tattoo on a body part.
  The user has meticulously placed this overlay exactly where they want it.
  
  STRICT CONSTRAINT: 
  **DO NOT MOVE, ROTATE, OR RESIZE THE TATTOO DESIGN.** 
  The position is final. Your job is purely texture blending, lighting synthesis, and biological integration.

  REALISM INSTRUCTIONS:
  1.  **Dermal Depth (Subsurface Scattering)**: 
      -   The ink must look embedded *inside* the dermis, not floating on top of the epidermis.
      -   **Overlay Details**: Crucially, natural skin texture (pores, goosebumps, fine vellus hairs, wrinkles, scars) must appear *ON TOP* of the ink. The ink stains the skin cells; it does not cover them like a sticker.
      -   **Transparency**: The ink should have a semi-transparent quality, especially in lighter shaded areas, allowing the skin tone to slightly influence the ink color (Tyndall effect).
  
  2.  **Volumetric Lighting Interaction**:
      -   **Specularity**: If the skin has a natural sheen, oiliness, or highlight, that highlight must pass uninterrupted *over* the tattoo.
      -   **Shadows**: The tattoo must darken exactly as the skin darkens in shadowed areas / muscle crevices.
      -   **Color Grading**: Match the grain, noise, and white balance of the original photo perfectly.

  3.  **Anatomical Wrapping**:
      -   While maintaining the overall position, apply subtle micro-warping to the design's internal lines to ensure they follow the subtle topography of veins, muscles, and bones beneath.

  CONTEXT:
  Design description: "${designPrompt}".
  Goal: A photorealistic simulation where the tattoo looks fully healed and settled into the skin.`;

  try {
    // Using gemini-3-pro-image-preview for superior image editing capabilities
    const response = await ai.models.generateContent({
      //model: 'gemini-3-pro-image-preview', 
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: simulationPrompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No simulation generated");
  } catch (error) {
    console.error("Simulation Error:", error);
    throw error;
  }
};

// Helper to refine description (Text only)
export const refineDescription = async (rawInput: string): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite this tattoo idea into a concise, artistic prompt suitable for an image generator: "${rawInput}"`,
    });
    return response.text || rawInput;
  } catch (e) {
    return rawInput;
  }
};

// Enhance a tattoo design from a reference image
export const enhanceTattooDesign = async (
  referenceImage: string,
  description: string,
  style: string
): Promise<string> => {
  const ai = getClient();
  
  // Check for valid base64 data
  if (!referenceImage.includes(',')) {
    throw new Error("Invalid image data");
  }

  const base64Data = referenceImage.split(',')[1];
  const mimeType = referenceImage.substring(referenceImage.indexOf(':') + 1, referenceImage.indexOf(';'));

  const prompt = `Act as a master tattoo artist.
  
  TASK: Redraw and enhance the provided reference image into a professional tattoo flash/stencil.
  
  INPUT CONTEXT:
  User Description: "${description}"
  Desired Style: "${style}"
  
  INSTRUCTIONS:
  1. **Clean Up**: Remove any sketchiness, bad lighting, paper texture, or background noise.
  2. **Refine**: Make lines crisp, confident, and suitable for stenciling. Correct anatomy or symmetry if applicable.
  3. **Style Adaptation**: Apply the requested art style (${style}) to the design.
  4. **Output**: Return a high-contrast black and white image on a pure white background.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No enhanced image generated");
  } catch (error) {
    console.error("Enhancement Error:", error);
    throw error;
  }
};
