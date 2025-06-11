const express = require("express");
const TestRating = require("../models/TestRating");

const router = express.Router();

router.post("/rate", async (req, res) => {
    try {
        const { rating, feedback } = req.body;

        if (!rating || rating < 0 || rating > 5) {
            return res.status(400).json({ error: "Некорректная оценка" });
        }

        const saved = await TestRating.create({ rating, feedback });
        res.json({ message: "Оценка сохранена", data: saved });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сохранения", details: err.message });
        console.error(err)
    }
});

module.exports = router;
