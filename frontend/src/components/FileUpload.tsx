import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import TestDisplay from "./TestDisplay";
import TestPreview from "./TestPreview";
import TestRating from "./TestRating";

import { generateTestRequest } from "../services/fileService";
import "../styles/FileUpload.css";

import { useTranslation } from 'react-i18next';

interface FileUploadProps {
  onTestGenerated?: () => void;
  onTestCleared?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onTestGenerated, onTestCleared }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [testText, setTestText] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [withOptions, setWithOptions] = useState<boolean>(true);
  const [wishText, setWishText] = useState<string>("");

  useEffect(() => {
    const savedTest = localStorage.getItem("test");
    if (savedTest) setTestText(savedTest);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!file && !wishText.trim()) return alert(t("please_upload_or_write"));

  setIsLoading(true);
  try {
    const { test } = await generateTestRequest(
      file,
      questionCount,
      difficulty,
      withOptions,
      wishText
    );
    setTestText(test);
    localStorage.setItem("test", test);
    if (onTestGenerated) onTestGenerated();
  } catch (error) {
    console.error("Ошибка генерации теста:", error);
  } finally {
    setIsLoading(false);
  }
};

  

const handleClearTest = () => {
  setTestText("");
  localStorage.removeItem("test");
  localStorage.removeItem("testRated");
  if (onTestCleared) onTestCleared();
};


  const handleEditTest = (index: number, newValue: string) => {
    const questions = testText.split("\n\n");
    questions[index] = newValue;
    const updatedTest = questions.join("\n\n");
    setTestText(updatedTest);
    localStorage.setItem("test", updatedTest);
  };

  const exportToPDF = () => {
    const element = document.getElementById("test-preview");
    if (!element) return;
    html2pdf().set({
      margin: [10, 5, 10, 5],
      filename: "test.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).from(element).save();
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + testText.replace(/\n/g, "\r\n");
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, "test.csv");
  };

  return (
    
    <div className="container">
      
      <div className="wish-input-wrapper">
        <textarea
          placeholder={t("wish_input_label")}
          value={wishText}
          onChange={(e) => setWishText(e.target.value)}
          rows={4}
          className="wish-textarea"
        />

        <label className="plus-button">
          <svg width="100%" height="100%" viewBox="-3 -3 15 15" >
            <path d="M 4 0 L 5 0 L 5 4 L 9 4 L 9 5 L 5 5 L 5 9 L 4 9 L 4 5 L 0 5 L 0 4 L 4 4 Z" fill="#ffffff" />
          </svg>
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input-hidden"
          />
        </label>
      </div>


      <div className="flexible">
        <label className="labels">
        {t("question_count")}
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            min={1}
            max={50}
          />
        </label>
        <label className="labels">
        {t("difficulty")}
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">{t("easy")}</option>
            <option value="medium">{t("medium")}</option>
            <option value="hard">{t("hard")}</option>
          </select>
        </label>
        <label className="labels">
        {t("with_options")}
          <input
            type="checkbox"
            checked={withOptions}
            onChange={() => setWithOptions(!withOptions)}
          />
        </label>

      </div>
      
      <div className="flexible">
        <button onClick={handleUpload}>{t("upload_file")}</button>
        {testText && (
          <>
          <button onClick={handleClearTest}>{t("delete_test")}</button>
          <button onClick={exportToPDF}>{t("export_pdf")}</button>
          <button onClick={exportToCSV}>{t("export_csv")}</button>
          </>
        )} 
      </div>

      {isLoading ? (
        <div className="spinner" />
      ) : (
        <>
        {testText && (
          <div>
            <h2>{t("generated_test")}</h2>
            <TestDisplay testText={testText} onEdit={handleEditTest} />
            <div id="test-preview">
              <h2>{t("preview_title")}</h2>
              <TestPreview testText={testText} />
            </div>
            <TestRating />
          </div>
        )}
        </>
      )}
      
    </div>
  );
};

export default FileUpload;
