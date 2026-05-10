import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

const QUIZ_RETURN_KEY = "rescisao-quiz-return-path";

const quizPaths = ["/quiz", "/resultado", "/test"];

function isQuizRoute(pathname: string) {
  return quizPaths.some((p) => pathname.startsWith(p));
}

export function Header() {
  const location = useLocation();

  const inQuiz = isQuizRoute(location.pathname);

  // Save current quiz path so we can return after visiting institutional pages
  useEffect(() => {
    if (inQuiz) {
      sessionStorage.setItem(QUIZ_RETURN_KEY, location.pathname);
    }
  }, [location.pathname, inQuiz]);

  const homeLink = inQuiz ? location.pathname : "/";

  return (
    <header className="sticky top-0 z-50 w-full shadow-md" style={{ backgroundColor: '#2056df' }}>
      <div className="container relative flex h-16 sm:h-20 items-center justify-center px-3 sm:px-4">
        <Link to={homeLink} aria-label="Rescisão Certa - Início">
          <Logo variant="light" size="md" />
        </Link>
      </div>
    </header>
  );
}

export { QUIZ_RETURN_KEY };
