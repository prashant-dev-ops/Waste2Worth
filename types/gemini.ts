/**
 * Type definitions for Gemini AI Waste Analysis
 */

export type WasteCategory =
    | 'Plastic'
    | 'Metal'
    | 'Paper'
    | 'E-waste'
    | 'Glass'
    | 'Organic'
    | 'Unknown';

export interface WasteAnalysisResult {
    product_name: string;
    waste_category: WasteCategory;
    estimated_price_range_inr: string;
    selling_options: string[];
    earning_tips: string[];
    youtube_search_queries: string[];
    eco_impact_note: string;
    safety_tips: string[];
    confidence_score: number; // 0-100
}

export interface AnalysisError {
    error: true;
    message: string;
    details?: string;
}

export type AnalysisResponse = WasteAnalysisResult | AnalysisError;

// Helper type guard
export function isAnalysisError(response: AnalysisResponse): response is AnalysisError {
    return (response as AnalysisError).error === true;
}
