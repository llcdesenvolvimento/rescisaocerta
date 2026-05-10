import logoImg from "@/assets/logo.png";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function Logo({ variant = "light", size = "md" }: LogoProps) {
  const heights = {
    sm: "h-10",
    md: "h-14 sm:h-16",
    lg: "h-16 sm:h-20",
  };

  return (
    <img
      src={logoImg}
      alt="Rescisão Certa - Calculadora Trabalhista"
      className={`${heights[size]} w-auto ${variant === "dark" ? "invert" : ""}`}
    />
  );
}
