import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="lang-switcher">
      <button onClick={() => handleChange('ru')}>RU</button> 
      <button onClick={() => handleChange('kz')}>KZ</button>
      <button onClick={() => handleChange('en')}>EN</button>
    </div>
  );
};


export default LanguageSwitcher;
