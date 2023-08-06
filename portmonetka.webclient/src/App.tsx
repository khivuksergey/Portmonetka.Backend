import { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { ThemeContext } from "./Context/ThemeContext";
import { IThemeContext } from "./Common/DataTypes";
import ProtectedRoute from "./ProtectedRoute";
import AppRoutes from "./AppRoutes";
import Login from "./Pages/Login/Login";
import Layout from "./Pages/Layout/Layout";
import "./common.css";
import "./theme-dark.css";
import "./theme-light.css";

function App(): JSX.Element {
    const { isDarkTheme } = useContext<IThemeContext>(ThemeContext);

    useEffect(() => {
        const applyTheme = () => {
            const body = document.body;
            body.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
        };

        applyTheme();
    }, [isDarkTheme]);

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        {
                            AppRoutes.map(
                                (route, index) => {
                                    return (
                                        <Route
                                            key={index}
                                            path={route.path}
                                            element={route.element} />
                                    )
                                }
                            )
                        }
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;