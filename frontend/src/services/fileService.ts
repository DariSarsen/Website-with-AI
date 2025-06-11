import axios from "axios";


export const generateTestRequest = async (
  file: File | null,
  questionCount: number,
  difficulty: string,
  withOptions: boolean,
  text: string
) => {
  const formData = new FormData();
  if (file) formData.append("file", file);
  if (text) formData.append("text", text);

  formData.append("questionCount", questionCount.toString());
  formData.append("difficulty", difficulty);
  formData.append("withOptions", withOptions.toString());

  const response = await axios.post<{ test: string }>(
    "http://localhost:3000/api/generate",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};
