require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateTest(text, questionCount = 5, difficulty = "medium", withOptions = true) {
    await delay(2000);

    const prompt = `
Создай ${questionCount} ${difficulty === "easy" ? "простых" : difficulty === "hard" ? "сложных" : "средних"} вопросов по тексту:

${text}

Формат каждого вопроса должен быть:
${withOptions ? ` С вариантами ответа:
Вопрос: ...
Варианты:
a) ...
b) ...
c) ...
Правильный ответ: ...` : ` Без вариантов ответа:
Вопрос: ...
Правильный ответ: ...`};
ВАЖНО!!! Ответь на том языке, каком написан текст, формат(Такие слова в предложенном формате, как "Вопрос", "Варианты" и т.д. должны быть переведены) также меняется в зависимости от языка текста. 
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
    });

    console.log("✅ Test generated");
    return response.choices[0].message.content.trim();
}

module.exports = { generateTest };
