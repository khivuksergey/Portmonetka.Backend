import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Layout from "./Pages/Layout";
import "./custom.css";

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {AppRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return <Route key={index} {...rest} element={element} />;
                    })}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
