import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import AppRoutes from "./AppRoutes";
import Login from "./Pages/Login/Login";
import Layout from "./Pages/Layout";
import "./custom.css";

function App(): JSX.Element {
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