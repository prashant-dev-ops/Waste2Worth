import { GoogleGenerativeAI } from '@google/generative-ai';
import { WasteAnalysisResult, AnalysisResponse } from '@/types/gemini';
import { imageToBase64, getMimeType } from '@/utils/imageUtils';

// Initialize Gemini AI
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

if (!API_KEY) {
    console.error('⚠️ Gemini API key not found in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Analyze waste item image using Gemini Vision AI
 * 
 * @param imageUri - Local URI of the image to analyze
 * @param userText - Optional text description from user
 * @returns Structured waste analysis result
 */
export async function analyzeWasteImage(
    imageUri: string,
    userText?: string
): Promise<AnalysisResponse> {
    try {
        // Validate API key
        if (!API_KEY) {
            return {
                error: true,
                message: 'API key not configured',
                details: 'Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file'
            };
        }

        // Convert image to base64
        console.log('📸 Converting image to base64...');
        const base64Image = await imageToBase64(imageUri);
        const mimeType = getMimeType(imageUri);

        // Initialize Gemini Pro Vision model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Construct the prompt
        const prompt = buildAnalysisPrompt(userText);

        console.log('🤖 Sending request to Gemini AI...');

        // Send request to Gemini
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        console.log('✅ Received response from Gemini');
        console.log('Raw response:', text);

        // Parse JSON response
        const analysisResult = parseGeminiResponse(text);

        return analysisResult;

    } catch (error: any) {
        console.error('❌ Error analyzing image:', error);

        return {
            error: true,
            message: 'Failed to analyze image',
            details: error?.message || 'Unknown error occurred'
        };
    }
}

/**
 * Build the analysis prompt for Gemini
 */
function buildAnalysisPrompt(userText?: string): string {
    const userContext = userText
        ? `\n\nUser description: "${userText}"`
        : '';

    return `You are an AI assistant for Waste2Worth, an Indian waste recycling app that helps users earn money from waste materials.

Analyze this waste item image and provide practical earning and recycling suggestions.${userContext}

CRITICAL INSTRUCTIONS:
1. Identify the product from the image
2. Classify the waste type
3. Provide India-focused, practical advice
4. Use simple language suitable for everyday users
5. Be honest if you're uncertain - reflect this in the confidence score
6. Do NOT hallucinate exact prices or specific brand names
7. Return ONLY valid JSON, no markdown, no explanations, no code blocks

Required JSON structure (return this exact format):
{
  "product_name": "Brief descriptive name of the item",
  "waste_category": "One of: Plastic, Metal, Paper, E-waste, Glass, Organic, Unknown",
  "estimated_price_range_inr": "₹X-Y per kg or ₹X-Y per item (be realistic for India)",
  "selling_options": [
    "Local scrap dealer (kabadiwala)",
    "Recycling center",
    "Other realistic options"
  ],
  "earning_tips": [
    "Practical tip 1 to earn more",
    "Practical tip 2",
    "Practical tip 3"
  ],
  "youtube_search_queries": [
    "Search query 1 (NOT YouTube links, just search terms)",
    "Search query 2",
    "Search query 3"
  ],
  "eco_impact_note": "Brief positive environmental impact message",
  "safety_tips": [
    "Safety tip 1 (if applicable)",
    "Safety tip 2 (if applicable)"
  ],
  "confidence_score": 85
}

IMPORTANT:
- Keep all text in simple English (Hindi-English mix acceptable for local terms like "kabadiwala")
- Price ranges should be realistic for Indian market
- YouTube queries should be search terms, NOT URLs
- Confidence score should be 0-100 (lower if image is unclear or item is unusual)
- If you can't identify the item, be honest and set confidence low

Return ONLY the JSON object, nothing else.`;
}

/**
 * Parse Gemini response and extract JSON
 */
function parseGeminiResponse(text: string): AnalysisResponse {
    try {
        // Remove markdown code blocks if present
        let cleanText = text.trim();

        // Remove ```json and ``` markers
        cleanText = cleanText.replace(/```json\s*/g, '');
        cleanText = cleanText.replace(/```\s*/g, '');

        // Find JSON object
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }

        const parsed = JSON.parse(jsonMatch[0]) as WasteAnalysisResult;

        // Validate required fields
        if (!parsed.product_name || !parsed.waste_category) {
            throw new Error('Missing required fields in response');
        }

        // Ensure confidence score is within range
        if (parsed.confidence_score < 0 || parsed.confidence_score > 100) {
            parsed.confidence_score = Math.max(0, Math.min(100, parsed.confidence_score));
        }

        // Ensure arrays exist
        parsed.selling_options = parsed.selling_options || [];
        parsed.earning_tips = parsed.earning_tips || [];
        parsed.youtube_search_queries = parsed.youtube_search_queries || [];
        parsed.safety_tips = parsed.safety_tips || [];

        return parsed;

    } catch (error: any) {
        console.error('Failed to parse Gemini response:', error);

        return {
            error: true,
            message: 'Failed to parse AI response',
            details: error?.message || 'Invalid JSON format'
        };
    }
}

/**
 * Example usage and mock response for testing
 */
export const MOCK_ANALYSIS_RESULT: WasteAnalysisResult = {
    product_name: "Plastic Water Bottle",
    waste_category: "Plastic",
    estimated_price_range_inr: "₹15-25 per kg",
    selling_options: [
        "Local scrap dealer (kabadiwala)",
        "Recycling center",
        "Bulk collection centers"
    ],
    earning_tips: [
        "Collect in bulk (10+ kg) to get better rates",
        "Remove labels and caps before selling",
        "Clean bottles fetch higher prices"
    ],
    youtube_search_queries: [
        "plastic bottle recycling earning in India",
        "DIY plastic bottle crafts reuse ideas",
        "kabadiwala rates plastic waste"
    ],
    eco_impact_note: "Recycling 1 kg of plastic saves 1.5 kg of CO₂ emissions!",
    safety_tips: [
        "Clean bottles before storing to avoid odor",
        "Store in dry place to prevent contamination"
    ],
    confidence_score: 92
};
