import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import TestDisplay from "./TestDisplay";
import TestPreview from "./TestPreview";

import { uploadFile } from "../services/fileService";
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

  useEffect(() => {
    const savedTest = localStorage.getItem("test");
    if (savedTest) setTestText(savedTest);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Выберите файл!");
    setIsLoading(true); 
  
    try {
      const { test } = await uploadFile(file, questionCount, difficulty, withOptions);
      setTestText(test);
      localStorage.setItem("test", test);
      if (onTestGenerated) onTestGenerated();
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    } finally {
      setIsLoading(false); 
    }
  };
  

  const handleClearTest = () => {
    setTestText("");
    localStorage.removeItem("test");
    
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
      
      <label className="custom-file-upload">
        {file ? file.name : t("upload_file_input")}
        <input type="file" onChange={handleFileChange} />
      </label>


      <label>
      {t("question_count")}
        <input
          type="number"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          min={1}
          max={50}
        />
      </label>
      <label>
      {t("difficulty")}
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">{t("easy")}</option>
          <option value="medium">{t("medium")}</option>
          <option value="hard">{t("hard")}</option>
        </select>
      </label>
      <label>
      {t("with_options")}
        <input
          type="checkbox"
          checked={withOptions}
          onChange={() => setWithOptions(!withOptions)}
        />
      </label>
      <button onClick={handleUpload}>{t("upload_file")}</button>
      <button onClick={handleClearTest}>{t("delete_test")}</button>
      <button onClick={exportToPDF}>{t("export_pdf")}</button>
      <button onClick={exportToCSV}>{t("export_csv")}</button>

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
          </div>
        )}
        </>
      )}
      
    </div>
  );
};

export default FileUpload;
