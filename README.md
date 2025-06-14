
# 🚀 Развёртывание проекта

## 🔧 Установка зависимостей  

### Фронтенд  
```bash
cd frontend
npm install
npm run dev
```

### Бэкенд  
```bash
cd backend
npm install
npm start
```

## 🗄 Настройка базы данных  

### 📌 1. Создать файл `.env`  
В корне `backend/` уже есть файл `.env copy`.  

1. Скопируйте его и переименуйте в `.env`:  
2. Откройте `.env` и заполните необходимые данные.  

## 🏗 Запуск проекта  

### 🔥 Запуск бэкенда  
Перейдите в папку `backend` и запустите сервер:  
```bash
cd backend
npm start
```
После этого сервер будет доступен на `http://localhost:3000` (если используется стандартный порт из `.env`, если вы хотите использовать другой порт, то нужно внести изменения на фронтенде в axios запросах).  

### 🎨 Запуск фронтенда  
Перейдите в папку `frontend` и запустите проект:  
```bash
cd frontend
npm run dev
```
После этого фронтенд будет доступен на `http://localhost:5173` (по умолчанию для Vite).  

### Скрины сайта  

![App Screenshot](./screenshots/s2.png)
![App Screenshot](./screenshots/s3.png)
![App Screenshot](./screenshots/s4.png)