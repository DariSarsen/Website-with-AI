require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateTest(wish, content, questionCount = 5, difficulty = "medium", withOptions = true) {
    await delay(2000);
    const format = withOptions
        ? `С вариантами ответа:
        Вопрос: ...
        Варианты:
        a) ...
        b) ...
        c) ...
        Правильный ответ: ...`
                : `Без вариантов ответа:
        Вопрос: ...
        Правильный ответ: ...`;
    let inputParts = [];

    if (wish?.trim()) inputParts.push(`Пожелание пользователя: ${wish.trim()}`);
    if (content?.trim()) inputParts.push(`Содержание документа: ${content.trim()}`);

    const prompt = `
    Ты — учитель, который составляет тесты на основе пожеланий и/или текста.
    Создай ${questionCount} ${difficulty === "easy" ? "простых" : difficulty === "hard" ? "сложных" : "средних"} вопросов.
    (ниже текст, на который ты должен посмотреть и понять, на каком языке он написан, и ответить на том же языке)
    ${inputParts.join("\n\n")}
    Формат каждого вопроса должен быть:
    ${format}
    `;
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
    });

    console.log("✅ Тест сгенерирован");
    return response.choices[0].message.content.trim();
}

module.exports = { generateTest };
