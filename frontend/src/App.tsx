import { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload";
import './app.css';
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [hasTest, setHasTest] = useState(false);

  useEffect(() => {
    const savedTest = localStorage.getItem("test");
    if (savedTest) setHasTest(true);
  }, []);

  return (
    <div>
      <LanguageSwitcher />
      <div id="welcome" className={hasTest ? "welcome-small" : "welcome-large"}>
        {t("welcome")}
      </div>
      <FileUpload 
        onTestGenerated={() => setHasTest(true)} 
        onTestCleared={() => setHasTest(false)} 
      />

    </div>
  );
};

export default App;
