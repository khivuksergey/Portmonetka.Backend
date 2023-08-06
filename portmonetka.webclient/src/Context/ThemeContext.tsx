import { createContext, useEffect, useState } from "react";
import { GetInitialTheme, GetSystemThemePreference } from "../Utilities";
import { IThemeContext, TTheme } from "../Common/DataTypes";

export const ThemeContext = createContext<IThemeContext>(
    {
        theme: GetSystemThemePreference(),
        setTheme: () => { },
        isDarkTheme: GetSystemThemePreference() === "dark"
    }
);

export const ThemeProvider = ({ children }: any) => {
    const initialTheme = GetInitialTheme();

    const [theme, setThemeState] = useState<TTheme>(initialTheme);

    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(initialTheme === "dark");

    useEffect(() => {
        if (theme !== "system")
            setIsDarkTheme(theme === "dark");
        else
            setIsDarkTheme(GetSystemThemePreference() === "dark");
    }, [theme])

    const setTheme = (theme: TTheme) => {
        setThemeState(theme);
        localStorage.setItem("theme", theme);
    }
    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDarkTheme }} >
            {children}
        </ThemeContext.Provider>
    )
}