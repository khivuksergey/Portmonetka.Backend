import { createContext, useState } from "react";
import { GetInitialTheme, GetSystemThemePreference, WriteToLocalStorage } from "../Utilities";
import { IThemeContext } from "../Common/DataTypes";

export const ThemeContext = createContext<IThemeContext>(
    {
        isDarkTheme: GetSystemThemePreference() === "dark",
        setIsDarkTheme: () => { }
    }
);

export const ThemeProvider = ({ children }: any) => {
    const initialTheme = GetInitialTheme();

    const [isDarkTheme, setIsDarkThemeState] = useState<boolean>(initialTheme === "dark");

    const setIsDarkTheme = (isDark: boolean) => {
        setIsDarkThemeState(isDark);
        const theme = isDark ? "dark" : "light";
        WriteToLocalStorage("theme", theme);
    }
    return (
        <ThemeContext.Provider value={{ isDarkTheme, setIsDarkTheme }} >
            {children}
        </ThemeContext.Provider>
    )
}