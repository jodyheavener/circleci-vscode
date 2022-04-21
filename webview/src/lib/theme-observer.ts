import { useCallback, useEffect, useState } from "react";

export const useThemeObserver = () => {
  const getTheme = useCallback(
    () => (document.body.classList.contains("vscode-dark") ? "dark" : "light"),
    []
  );
  const [theme, setTheme] = useState<"dark" | "light">(getTheme());

  useEffect(() => {
    const observer = new MutationObserver((mutationList: MutationRecord[]) => {
      mutationList.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          setTheme(getTheme());
        }
      });
    });
    observer.observe(document.body, {
      attributes: true,
    });

    return () => observer.disconnect();
  }, [getTheme]);

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return theme;
};
