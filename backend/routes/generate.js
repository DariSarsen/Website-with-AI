const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const { generateTest } = require("../services/aiService");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/generate", upload.single("file"), async (req, res) => {
    const { questionCount, difficulty, withOptions, text: userWish } = req.body;

    try {
        let fileContent = "";

        if (req.file) {
            const filePath = path.join(__dirname, "../", req.file.path);
            const buffer = fs.readFileSync(filePath);
            const { value } = await mammoth.extractRawText({ buffer });
            fileContent = value.trim();
            fs.unlinkSync(filePath);
        }

        if (!userWish?.trim() && !fileContent) {
            return res.status(400).json({ error: "Необходимо загрузить файл или ввести пожелание." });
        }

        const test = await generateTest(
            userWish?.trim() || "",   
            fileContent || "",         
            parseInt(questionCount),
            difficulty,
            withOptions === "true"
        );

        res.json({ message: "Тест сгенерирован", test });
    } catch (error) {
        res.status(500).json({ error: "Ошибка генерации теста", details: error.message });
    }
});



module.exports = router;
