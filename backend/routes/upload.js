const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const { generateTest } = require("../services/aiService");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Файл не загружен" });

    const filePath = path.join(__dirname, "../", req.file.path);
    const { questionCount, difficulty, withOptions } = req.body;

    try {
        const buffer = fs.readFileSync(filePath);
        const { value: fileContent } = await mammoth.extractRawText({ buffer });

        const test = await generateTest(fileContent, parseInt(questionCount), difficulty, withOptions === "true");
        res.json({ message: "Файл обработан", test });
        console.log("Файл обработан:", test);

        fs.unlinkSync(filePath);
    } catch (error) {
        res.status(500).json({ error: "Ошибка обработки файла", details: error.message });
        console.error("Ошибка обработки файла:", error);
    }
});

module.exports = router;
