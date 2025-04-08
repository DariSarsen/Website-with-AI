import axios from "axios";

export const uploadFile = async (
  file: File,
  questionCount: number,
  difficulty: string,
  withOptions: boolean
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("questionCount", questionCount.toString());
  formData.append("difficulty", difficulty);
  formData.append("withOptions", withOptions.toString());

  const response = await axios.post<{ test: string }>(
    "http://localhost:3000/api/upload",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};
