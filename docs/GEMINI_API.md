# Gemini API Integration Documentation

## API Configuration

**Model Used:** `gemini-1.5-flash`  
**API Key:** Stored in `.env` file as `EXPO_PUBLIC_GEMINI_API_KEY`

---

## Request Payload Example

```javascript
{
  model: "gemini-1.5-flash",
  contents: [
    {
      parts: [
        { text: "PROMPT_TEXT_HERE" },
        {
          inlineData: {
            data: "BASE64_IMAGE_STRING",
            mimeType: "image/jpeg"
          }
        }
      ]
    }
  ]
}
```

---

## Exact Prompt Sent to Gemini

```
You are an AI assistant for Waste2Worth, an Indian waste recycling app that helps users earn money from waste materials.

Analyze this waste item image and provide practical earning and recycling suggestions.

[Optional: User description: "user input text"]

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

Return ONLY the JSON object, nothing else.
```

---

## Example JSON Response

### Example 1: Plastic Bottle

```json
{
  "product_name": "Plastic Water Bottle",
  "waste_category": "Plastic",
  "estimated_price_range_inr": "₹15-25 per kg",
  "selling_options": [
    "Local scrap dealer (kabadiwala)",
    "Recycling center",
    "Bulk collection centers"
  ],
  "earning_tips": [
    "Collect in bulk (10+ kg) to get better rates",
    "Remove labels and caps before selling",
    "Clean bottles fetch higher prices"
  ],
  "youtube_search_queries": [
    "plastic bottle recycling earning in India",
    "DIY plastic bottle crafts reuse ideas",
    "kabadiwala rates plastic waste"
  ],
  "eco_impact_note": "Recycling 1 kg of plastic saves 1.5 kg of CO₂ emissions!",
  "safety_tips": [
    "Clean bottles before storing to avoid odor",
    "Store in dry place to prevent contamination"
  ],
  "confidence_score": 92
}
```

### Example 2: E-waste (Old Phone)

```json
{
  "product_name": "Old Mobile Phone",
  "waste_category": "E-waste",
  "estimated_price_range_inr": "₹100-500 per item",
  "selling_options": [
    "Authorized e-waste collection centers",
    "Mobile repair shops (for parts)",
    "Online buyback platforms (Cashify, InstaCash)"
  ],
  "earning_tips": [
    "Check if phone is repairable - working phones fetch more",
    "Remove SIM card and personal data before selling",
    "Compare prices on multiple buyback platforms"
  ],
  "youtube_search_queries": [
    "how to sell old mobile phone India",
    "e-waste recycling earning",
    "mobile phone scrap value India"
  ],
  "eco_impact_note": "Proper e-waste recycling prevents harmful chemicals from entering soil and water!",
  "safety_tips": [
    "Factory reset phone to remove all personal data",
    "Remove battery if swollen or damaged",
    "Don't throw e-waste in regular trash"
  ],
  "confidence_score": 88
}
```

### Example 3: Cardboard Box

```json
{
  "product_name": "Cardboard Box",
  "waste_category": "Paper",
  "estimated_price_range_inr": "₹8-12 per kg",
  "selling_options": [
    "Local scrap dealer (raddi/kabadiwala)",
    "Paper recycling centers",
    "Bulk paper collection agencies"
  ],
  "earning_tips": [
    "Flatten boxes to save storage space",
    "Remove tape and stickers for better rates",
    "Collect at least 20-30 kg for better pricing"
  ],
  "youtube_search_queries": [
    "cardboard recycling price in India",
    "DIY cardboard craft ideas",
    "raddi paper rates today"
  ],
  "eco_impact_note": "Recycling cardboard saves trees and reduces landfill waste!",
  "safety_tips": [
    "Store in dry place to avoid moisture damage",
    "Be careful of staples and sharp edges"
  ],
  "confidence_score": 95
}
```

---

## Best Practices for Handling Uncertain Predictions

### 1. Low Confidence Scores (< 50)
- Display warning to user: "AI is uncertain about this item"
- Suggest retaking photo with better lighting
- Show multiple possible matches if applicable

### 2. Blurry or Poor Quality Images
- Return confidence score below 60
- Suggest in `eco_impact_note`: "Try taking a clearer photo for better analysis"

### 3. Non-waste Items Detected
```json
{
  "product_name": "Unidentified Item",
  "waste_category": "Unknown",
  "estimated_price_range_inr": "Unable to estimate",
  "selling_options": ["Please scan a waste or recyclable item"],
  "earning_tips": ["Try scanning plastic, paper, metal, glass, or e-waste items"],
  "youtube_search_queries": ["types of recyclable waste in India"],
  "eco_impact_note": "Make sure to scan waste materials for analysis",
  "safety_tips": [],
  "confidence_score": 20
}
```

### 4. Multiple Items in One Photo
- AI should identify the primary/largest item
- Mention in `earning_tips`: "Multiple items detected - scan items individually for best results"

### 5. Error Handling in Code
```typescript
// Check if response is error
if (isAnalysisError(result)) {
  Alert.alert('Analysis Failed', result.message);
  return;
}

// Check confidence score
if (result.confidence_score < 40) {
  Alert.alert(
    'Low Confidence',
    'The AI is uncertain. Try retaking the photo with better lighting.',
    [
      { text: 'Retake', onPress: () => openCamera() },
      { text: 'View Results', onPress: () => showResults(result) }
    ]
  );
}
```

---

## Response Validation

The `parseGeminiResponse()` function performs these checks:

1. ✅ Removes markdown code blocks (```json)
2. ✅ Extracts JSON object using regex
3. ✅ Validates required fields exist
4. ✅ Ensures confidence score is 0-100
5. ✅ Initializes empty arrays if missing
6. ✅ Returns error object if parsing fails

---

## India-Specific Considerations

1. **Pricing**: All prices in Indian Rupees (₹)
2. **Local Terms**: Uses "kabadiwala", "raddi" for scrap dealers
3. **Platforms**: Mentions Indian platforms (Cashify, InstaCash, etc.)
4. **Practical Advice**: Bulk collection, local market rates
5. **Language**: Simple English with Hindi-English mix allowed

---

## API Rate Limits & Costs

- **Free Tier**: 60 requests per minute
- **Cost**: Check [Google AI Pricing](https://ai.google.dev/pricing)
- **Recommended**: Implement request caching for same images
- **Optimization**: Compress images before sending to reduce costs

---

## Testing Checklist

- [x] Camera permission handling
- [x] Gallery upload handling  
- [x] Image to base64 conversion
- [x] Gemini API request/response
- [x] JSON parsing and validation
- [x] Error handling
- [x] Results display
- [x] YouTube search integration
- [ ] Real device testing
- [ ] Various waste types testing
- [ ] Edge case testing

---

## Files Created

1. `types/gemini.ts` - TypeScript type definitions
2. `utils/imageUtils.ts` - Image processing utilities
3. `services/geminiService.ts` - Main AI service
4. `app/(tabs)/scanner.tsx` - Camera integration
5. `app/results.tsx` - Results display screen
6. `.env` - API key configuration

---

## Security Notes

⚠️ **Important**: 
- API key is in `.env` file (gitignored)
- Never commit API keys to version control
- For production: Move API calls to backend server
- Current setup is for development/testing only
