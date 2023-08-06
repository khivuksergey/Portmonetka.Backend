import { TTheme } from "../Common/DataTypes";

export function GetSystemThemePreference(): TTheme {
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ?
        "dark"
        :
        "light";
};

export function GetInitialTheme(): TTheme {
    const userTheme = localStorage.getItem("theme");
    const initialTheme = userTheme as TTheme ?? GetSystemThemePreference();
    return initialTheme;
}