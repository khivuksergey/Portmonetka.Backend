import { ReadFromLocalStorage } from "./LocalStorageUtility";

type TTheme = "light" | "dark";

export function GetSystemThemePreference(): TTheme {
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ?
        "dark"
        :
        "light";
};

export function GetInitialTheme(): TTheme {
    const userTheme = ReadFromLocalStorage("theme");
    const initialTheme = userTheme ?? GetSystemThemePreference();
    return initialTheme;
}