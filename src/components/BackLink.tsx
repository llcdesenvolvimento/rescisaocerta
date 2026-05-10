import { Link } from "react-router-dom";
import { QUIZ_RETURN_KEY } from "./layout/Header";

export function BackLink() {
  const savedPath = sessionStorage.getItem(QUIZ_RETURN_KEY);
  const to = savedPath || "/";

  return (
    <Link to={to} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
      ← Voltar
    </Link>
  );
}
