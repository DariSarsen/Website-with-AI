import React, { useState, useEffect } from "react";
import { submitTestRating } from "../services/testRatingService";

import { useTranslation } from 'react-i18next';

const TestRating: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const { t } = useTranslation();

  // при монтировании проверяем, была ли уже отправлена оценка
  useEffect(() => {
    const isRated = localStorage.getItem("testRated");
    if (isRated === "true") {
      setSubmitted(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Пожалуйста, выберите оценку.");
      return;
    }

    try {
      setError("");
      await submitTestRating(rating, feedback);
      setSubmitted(true);
      localStorage.setItem("testRated", "true"); // сохраняем флаг
    } catch (err) {
      console.error("Ошибка при отправке оценки:", err);
      setError("Не удалось отправить оценку. Попробуйте позже.");
    }
  };

  if (submitted) {
    return (
      <div>
        <p>Спасибо за вашу оценку!</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="">{t("rate_test")}</h3>

      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            type="button"
            className={`star ${star <= rating ? "active" : ""}`}
            aria-label={`Оценка ${star}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        placeholder={t("test_rating_placeholder")}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
      />

      {error && <p className="">{error}</p>}

      <button
        onClick={handleSubmit}
        type="button"
        className="rate-button"
      >
        {t("submit_rating")}
      </button>
    </div>
  );
};

export default TestRating;
