// // src/services/aiService.ts
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Hàm 1: Dùng cho nút Auto-fill
// export const generateWordDetails = async (word: string) => {
//   // Tự động lấy Key người dùng nhập, nếu trống thì lấy từ .env
//   const apiKey = localStorage.getItem('user-gemini-key') || import.meta.env.VITE_GEMINI_API_KEY;
  
//   if (!apiKey) {
//     throw new Error("⚠️ Vui lòng dán Gemini API Key ở thanh Header phía trên để sử dụng AI!");
//   }

//   const genAI = new GoogleGenerativeAI(apiKey);

//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash",
//       generationConfig: { responseMimeType: "application/json" }
//     });

//     const prompt = `Bạn là một chuyên gia ngôn ngữ học. Hãy phân tích từ tiếng Anh: "${word}".
//     Trả về CHỈ MỘT OBJECT JSON duy nhất theo cấu trúc sau:
//     {
//       "type": "Noun", 
//       "meaning": "Nghĩa tiếng Việt ngắn gọn, thông dụng nhất",
//       "example": "Một câu ví dụ tiếng Anh ngắn gọn, tự nhiên. Nếu từ vựng có thể áp dụng vào ngữ cảnh Công nghệ thông tin, Lập trình hoặc Thể thao, hãy ưu tiên sử dụng ngữ cảnh đó."
//     }`;

//     const result = await model.generateContent(prompt);
//     const cleanJson = result.response.text().replace(/```(json)?|```/g, '').trim();
//     return JSON.parse(cleanJson);
//   } catch (error) {
//     console.error("Lỗi khi gọi Gemini API:", error);
//     throw new Error("Không thể kết nối với AI. Hãy kiểm tra lại kết nối mạng hoặc API Key.");
//   }
// };

// // Hàm 2: Dùng cho khu vực Học AI Mode
// export const generateStudyMaterial = async (
//   wordsList: string, 
//   mode: 'flashcard' | 'story' | 'fillblank',
//   topic?: string 
// ) => {
//   const apiKey = localStorage.getItem('user-gemini-key') || import.meta.env.VITE_GEMINI_API_KEY;
  
//   if (!apiKey) {
//     throw new Error("⚠️ Vui lòng dán Gemini API Key ở thanh Header phía trên để tạo bài học!");
//   }

//   const genAI = new GoogleGenerativeAI(apiKey);
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//     // model: "gemini-2.0-flash-exp",
//     // model: "gemini-1.5-flash",
//     // model: "gemini-1.5-flash",
//     generationConfig: { responseMimeType: "application/json" }
//   });

//   const topicContext = topic ? `Chủ đề chủ đạo: "${topic}".` : "Chủ đề: Ngẫu nhiên (ưu tiên CNTT hoặc đời sống sinh viên).";

//   let prompt = "";
//   if (mode === 'flashcard') {
//     // prompt = `Hãy đóng vai một chuyên gia giảng dạy tiếng Anh. Phân tích các từ vựng sau theo ${topicContext}:\n${wordsList}\n\nTrả về mảng JSON cấu trúc:\n[\n  {\n    "word": "[Từ tiếng Anh]",\n    "pronunciation": "[Phiên âm IPA]",\n    "partOfSpeech": "[Loại từ]",\n    "meaningVN": "[Nghĩa tiếng Việt]",\n    "definitionEN": "[Định nghĩa tiếng Anh]",\n    "exampleEN": "[Ví dụ tiếng Anh. Bắt buộc: Ưu tiên ngữ cảnh Lập trình C++, Công nghệ thông tin, hoặc Sư phạm giảng dạy]",\n    "exampleVN": "[Dịch nghĩa ví dụ]",\n    "usageNote": "[Mẹo nhớ từ, từ đồng nghĩa hoặc collocation phổ biến]"\n  }\n]`;
//     prompt = `Act as an expert English teacher and linguist for Vietnamese learners:

// Your task is to analyze the following vocabulary based on the topic: ${topicContext}

// Vocabulary list:
// ${wordsList}

// STRICT REQUIREMENTS:
// - Highlight the target word naturally in the example sentence (optional but recommended).
// - Return EXACTLY one object for EACH word in the list (no missing or extra words).
// - Ensure all explanations are clear, accurate, and suitable for learners at B1–C1 level.
// - Use simple but precise English for definitions (avoid overly complex wording).
// - Vietnamese translations must be natural, correct, and easy to understand.

// EXAMPLE REQUIREMENTS:
// - The example sentence MUST be realistic and meaningful.
// - PRIORITIZE contexts related to:
//   + C++ programming
//   + Information Technology
//   + Teaching / Education
// - If not possible, use a practical real-life situation.
// - The example must clearly demonstrate how the word is used in context (not just a generic sentence).

// USAGE NOTE REQUIREMENTS:
// - Provide at least ONE of the following:
//   + A useful collocation
//   + A synonym or contrast (if helpful)
//   + A memory tip (easy way to remember the word)
// - Keep it concise but practical.

// LANGUAGE QUALITY:
// - Avoid unnatural or forced sentences.
// - Ensure correct grammar, collocation, and word usage.
// - Use varied sentence structures across examples.

// OUTPUT FORMAT (STRICT JSON ARRAY, NO EXTRA TEXT):
// [
//   {
//     "word": "[Từ tiếng Anh]",
//     "pronunciation": "[Phiên âm IPA]",
//     "partOfSpeech": "[Loại từ]",
//     "meaningVN": "[Nghĩa tiếng Việt]",
//     "definitionEN": "[Định nghĩa tiếng Anh]",
//     "exampleEN": "[Ví dụ tiếng Anh. Bắt buộc: Ưu tiên ngữ cảnh Lập trình C++, Công nghệ thông tin, hoặc Sư phạm giảng dạy]",
//     "exampleVN": "[Dịch nghĩa ví dụ]",
//     "usageNote": "[Mẹo nhớ từ, từ đồng nghĩa hoặc collocation phổ biến]"
//   }
// ]`;
//   } else if (mode === 'story') {
//     // prompt = `Đóng vai một nhà văn. Viết một câu chuyện ngắn thú vị (150-250 từ) bằng tiếng Anh theo ${topicContext} sử dụng TẤT CẢ các từ vựng sau:\n${wordsList}\n\nCấu trúc JSON:\n{\n  "title": "[Tên câu chuyện]",\n  "content_EN": "[Nội dung tiếng Anh. BẮT BUỘC bọc các từ vựng mục tiêu trong thẻ <mark>từ vựng</mark>]",\n  "content_VN": "[Bản dịch tiếng Việt mượt mà]",\n  "vocabulary_used": [Các từ đã dùng]\n}`;
//     prompt = `Act as a professional storyteller and English linguist for Vietnamese learners.

// Write a short, engaging, and meaningful story in English (150–250 words) based on the topic: ${topicContext}

// Vocabulary list:
// ${wordsList}

// STRICT REQUIREMENTS:
// - You MUST use ALL the vocabulary words provided (no missing words).
// - Each word must be used in a grammatically correct and natural way.
// - Do NOT force unnatural or awkward sentences just to include vocabulary.
// - The story must have a clear structure: beginning → development → ending.
// - Ensure logical flow, coherence, and smooth transitions between sentences.
// - Use varied sentence structures (simple, compound, complex).
// - Prefer natural collocations and realistic contexts.

// VOCABULARY HIGHLIGHT RULE:
// - Wrap EACH target word with <mark>...</mark> exactly as written in the list.
// - Do NOT change the form of the word unless absolutely necessary for grammar (keep it recognizable).

// LANGUAGE QUALITY:
// - Writing level: B2–C1 (natural, expressive, and learner-friendly).
// - Avoid repetition and unnatural phrasing.
// - Make the story interesting, not just educational.

// TRANSLATION REQUIREMENT:
// - Translate the story into Vietnamese naturally and fluently.
// - Do NOT translate word-by-word; prioritize meaning and readability.

// OUTPUT FORMAT (STRICT JSON OBJECT, NO EXTRA TEXT):
// {
//   "title": "[Tên câu chuyện]",
//   "content_EN": "[Nội dung tiếng Anh với các từ được bọc trong <mark>...</mark>]",
//   "content_VN": "[Bản dịch tiếng Việt mượt mà, tự nhiên]",
//   "vocabulary_used": [Các từ đã dùng]
// }`;
//   } else {
//     prompt = `Act as an expert English teacher for Vietnamese learners.

// Create high-quality fill-in-the-blank exercises based on the topic: ${topicContext}

// Vocabulary list:
// ${wordsList}

// STRICT REQUIREMENTS:
// - Generate EXACTLY one question for EACH word in the list (no missing or extra).
// - Each sentence must be natural, meaningful, and context-rich (level B1–B2+).
// - The sentence should reflect real-life, academic, or professional situations.
// - PRIORITIZE contexts related to the given topic. If applicable, prefer:
//   + Information Technology / Programming
//   + Education / Teaching
// - Replace ONLY the target word with "________".
// - Do NOT create vague, overly simple, or artificial sentences.
// - Ensure each sentence provides enough context for learners to infer the answer logically.
// - Use a variety of sentence structures (avoid repetition).

// WORD USAGE RULES:
// - Use the correct grammatical form of the word.
// - Do NOT change the word into a completely different form (keep it recognizable).
// - Each word must be used exactly once.

// WORD HINT REQUIREMENTS:
// - Provide a helpful hint in Vietnamese.
// - Include:
//   + Part of speech (e.g., Danh từ, Động từ, Tính từ...)
//   + Meaning in Vietnamese
//   + OPTIONAL: first letter or word pattern (but do NOT make it too obvious)
// - The hint must guide the learner without directly revealing the answer.

// TRANSLATION REQUIREMENTS:
// - Translate the sentence into natural Vietnamese.
// - Keep "________" unchanged in the translated sentence.
// - Ensure the translation reflects the correct meaning of the original sentence.

// OUTPUT FORMAT (STRICT JSON ARRAY, NO EXTRA TEXT):
// [
//   {
//     "question": "[Câu tiếng Anh với '________']",
//     "answer": "[Từ đúng để điền]",
//     "wordHint": "[Gợi ý: từ loại + nghĩa + gợi ý thêm nếu cần]",
//     "sentenceTranslation": "[Bản dịch tiếng Việt, giữ nguyên '________']"
//   }
// ]`;
//     // prompt = `Tạo bài tập điền từ vào chỗ trống (Fill in the blanks) theo ${topicContext} cho các từ sau.\n\nDanh sách từ:\n${wordsList}\n\nCấu trúc JSON:\n[\n  {\n    "question": "[Câu tiếng Anh, thay từ mục tiêu bằng '________']",\n    "answer": "[Từ đúng để điền]",\n    "wordHint": "[Gợi ý cụ thể về từ cần điền. VD: 'Từ loại: Động từ. Nghĩa: Tối ưu hóa. Bắt đầu bằng chữ O...']",\n    "sentenceTranslation": "[Bản dịch tiếng Việt của câu question, vị trí từ bị thiếu VẪN GIỮ NGUYÊN là '________']"\n  }\n]`;
//   }
  
//   try {
//     const result = await model.generateContent(prompt);
//     const cleanJsonString = result.response.text().replace(/```(json)?|```/g, '').trim();
//     return JSON.parse(cleanJsonString);
//   } catch (error) {
//     console.error("Lỗi khi tạo bài học AI:", error);
//     throw new Error("Lỗi API: Hãy kiểm tra lại API Key hoặc có thể bạn đã gửi yêu cầu quá nhanh.");
//   }
// };
// src/services/aiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// === HÀM HỖ TRỢ: Tự động gọi lại nếu API báo lỗi (Quá tải, Rate limit) ===
const fetchWithRetry = async (operation: () => Promise<any>, retries = 2, delay = 2000): Promise<any> => {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && (error.message.includes('503') || error.message.includes('429'))) {
      console.warn(`Server bận. Đang thử lại... (Còn ${retries} lần)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(operation, retries - 1, delay * 2); // Tăng thời gian chờ cho lần sau
    }
    throw error;
  }
};

// === HÀM HỖ TRỢ: Làm sạch và Parse JSON an toàn ===
const safeParseJSON = (text: string) => {
  try {
    // Xóa bỏ các markdown tags nếu có (dù đã cấu hình mimeType) và các khoảng trắng thừa
    const cleanText = text.replace(/^```(json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Lỗi Parse JSON từ AI:", text);
    throw new Error("Dữ liệu AI trả về bị lỗi định dạng. Vui lòng thử lại!");
  }
};

// === HÀM 1: Dùng cho nút Auto-fill ===
export const generateWordDetails = async (word: string) => {
  const apiKey = localStorage.getItem('user-gemini-key') || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("⚠️ Vui lòng dán Gemini API Key ở thanh Header phía trên để sử dụng AI!");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Bạn là một chuyên gia ngôn ngữ học. Hãy phân tích từ tiếng Anh: "${word}".
    Trả về CHỈ MỘT OBJECT JSON duy nhất theo cấu trúc sau:
    {
      "type": "Noun", 
      "meaning": "Nghĩa tiếng Việt ngắn gọn, thông dụng nhất",
      "example": "Một câu ví dụ tiếng Anh ngắn gọn, tự nhiên. Nếu từ vựng có thể áp dụng vào ngữ cảnh Công nghệ thông tin, Lập trình hoặc Thể thao, hãy ưu tiên sử dụng ngữ cảnh đó."
    }`;

    const result = await fetchWithRetry(() => model.generateContent(prompt));
    return safeParseJSON(result.response.text());
  } catch (error: any) {
    console.error("Lỗi khi gọi Gemini API (Word Details):", error);
    throw new Error(error.message || "Không thể kết nối với AI. Hãy kiểm tra lại kết nối mạng hoặc API Key.");
  }
};

// === HÀM 2: Dùng cho khu vực Học AI Mode ===
export const generateStudyMaterial = async (
  wordsList: string, 
  mode: 'flashcard' | 'story' | 'fillblank',
  topic?: string 
) => {
  const apiKey = localStorage.getItem('user-gemini-key') || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("⚠️ Vui lòng dán Gemini API Key ở thanh Header phía trên để tạo bài học!");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const topicContext = topic ? `Chủ đề chủ đạo: "${topic}".` : "Chủ đề: Ngẫu nhiên (ưu tiên CNTT hoặc đời sống sinh viên).";

  let prompt = "";
  if (mode === 'flashcard') {
    prompt = `Act as an expert English teacher and linguist for Vietnamese learners:

Your task is to analyze the following vocabulary based on the topic: ${topicContext}

Vocabulary list:
${wordsList}

STRICT REQUIREMENTS:
- Highlight the target word naturally in the example sentence (optional but recommended).
- Return EXACTLY one object for EACH word in the list (no missing or extra words).
- Ensure all explanations are clear, accurate, and suitable for learners at B1–C1 level.
- Use simple but precise English for definitions (avoid overly complex wording).
- Vietnamese translations must be natural, correct, and easy to understand.

EXAMPLE REQUIREMENTS:
- The example sentence MUST be realistic and meaningful.
- PRIORITIZE contexts related to:
  + C++ programming
  + Information Technology
  + Teaching / Education
- If not possible, use a practical real-life situation.
- The example must clearly demonstrate how the word is used in context (not just a generic sentence).

USAGE NOTE REQUIREMENTS:
- Provide at least ONE of the following:
  + A useful collocation
  + A synonym or contrast (if helpful)
  + A memory tip (easy way to remember the word)
- Keep it concise but practical.

LANGUAGE QUALITY:
- Avoid unnatural or forced sentences.
- Ensure correct grammar, collocation, and word usage.
- Use varied sentence structures across examples.

OUTPUT FORMAT (STRICT JSON ARRAY, NO EXTRA TEXT):
[
  {
    "word": "[Từ tiếng Anh]",
    "pronunciation": "[Phiên âm IPA]",
    "partOfSpeech": "[Loại từ]",
    "meaningVN": "[Nghĩa tiếng Việt]",
    "definitionEN": "[Định nghĩa tiếng Anh]",
    "exampleEN": "[Ví dụ tiếng Anh. Bắt buộc: Ưu tiên ngữ cảnh Lập trình C++, Công nghệ thông tin, hoặc Sư phạm giảng dạy]",
    "exampleVN": "[Dịch nghĩa ví dụ]",
    "usageNote": "[Mẹo nhớ từ, từ đồng nghĩa hoặc collocation phổ biến]"
  }
]`;
  } else if (mode === 'story') {
    prompt = `Act as a professional storyteller and English linguist for Vietnamese learners.

Write a short, engaging, and meaningful story in English (150–250 words) based on the topic: ${topicContext}

Vocabulary list:
${wordsList}

STRICT REQUIREMENTS:
- You MUST use ALL the vocabulary words provided (no missing words).
- Each word must be used in a grammatically correct and natural way.
- Do NOT force unnatural or awkward sentences just to include vocabulary.
- The story must have a clear structure: beginning → development → ending.
- Ensure logical flow, coherence, and smooth transitions between sentences.
- Use varied sentence structures (simple, compound, complex).
- Prefer natural collocations and realistic contexts.

VOCABULARY HIGHLIGHT RULE:
- Wrap EACH target word with <mark>...</mark> exactly as written in the list.
- Do NOT change the form of the word unless absolutely necessary for grammar (keep it recognizable).

LANGUAGE QUALITY:
- Writing level: B2–C1 (natural, expressive, and learner-friendly).
- Avoid repetition and unnatural phrasing.
- Make the story interesting, not just educational.

TRANSLATION REQUIREMENT:
- Translate the story into Vietnamese naturally and fluently.
- Do NOT translate word-by-word; prioritize meaning and readability.

OUTPUT FORMAT (STRICT JSON OBJECT, NO EXTRA TEXT):
{
  "title": "[Tên câu chuyện]",
  "content_EN": "[Nội dung tiếng Anh với các từ được bọc trong <mark>...</mark>]",
  "content_VN": "[Bản dịch tiếng Việt mượt mà, tự nhiên]",
  "vocabulary_used": [Các từ đã dùng]
}`;
  } else {
    prompt = `Act as an expert English teacher for Vietnamese learners.

Create high-quality fill-in-the-blank exercises based on the topic: ${topicContext}

Vocabulary list:
${wordsList}

STRICT REQUIREMENTS:
- Generate EXACTLY one question for EACH word in the list (no missing or extra).
- Each sentence must be natural, meaningful, and context-rich (level B1–B2+).
- The sentence should reflect real-life, academic, or professional situations.
- PRIORITIZE contexts related to the given topic. If applicable, prefer:
  + Information Technology / Programming
  + Education / Teaching
- Replace ONLY the target word with "________".
- Do NOT create vague, overly simple, or artificial sentences.
- Ensure each sentence provides enough context for learners to infer the answer logically.
- Use a variety of sentence structures (avoid repetition).

WORD USAGE RULES:
- Use the correct grammatical form of the word.
- Do NOT change the word into a completely different form (keep it recognizable).
- Each word must be used exactly once.

WORD HINT REQUIREMENTS:
- Provide a helpful hint in Vietnamese.
- Include:
  + Part of speech (e.g., Danh từ, Động từ, Tính từ...)
  + Meaning in Vietnamese
  + OPTIONAL: first letter or word pattern (but do NOT make it too obvious)
- The hint must guide the learner without directly revealing the answer.

TRANSLATION REQUIREMENTS:
- Translate the sentence into natural Vietnamese.
- Keep "________" unchanged in the translated sentence.
- Ensure the translation reflects the correct meaning of the original sentence.

OUTPUT FORMAT (STRICT JSON ARRAY, NO EXTRA TEXT):
[
  {
    "question": "[Câu tiếng Anh với '________']",
    "answer": "[Từ đúng để điền]",
    "wordHint": "[Gợi ý: từ loại + nghĩa + gợi ý thêm nếu cần]",
    "sentenceTranslation": "[Bản dịch tiếng Việt, giữ nguyên '________']"
  }
]`;
  }
  
  try {
    const result = await fetchWithRetry(() => model.generateContent(prompt));
    return safeParseJSON(result.response.text());
  } catch (error: any) {
    console.error("Lỗi khi tạo bài học AI:", error);
    if (error.message && error.message.includes('Dữ liệu AI trả về')) {
        throw error; 
    }
    throw new Error("Lỗi API: Hãy kiểm tra lại API Key. Hoặc Server đang quá tải, vui lòng thử lại sau giây lát.");
  }
};