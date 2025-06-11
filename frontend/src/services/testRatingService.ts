import axios from "axios"; 
export async function submitTestRating(rating: number, feedback: string) {
  const response = await axios.post("http://localhost:3000/api/rate", { rating, feedback });
  return response.data;
}
