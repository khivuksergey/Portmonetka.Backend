import Home from "./Pages/Home/Home";
import CategoriesPage from "./Pages/Categories/CategoriesPage";
import TransactionsPage from "./Pages/Transactions/TransactionsPage";
import WalletsPage from "./Pages/Wallets/WalletsPage";

const AppRoutes = [
    {
        index: true,
        path: "",
        element: <Home />
    },
    {
        path: "/transactions",
        element: <TransactionsPage />
    },
    {
        path: "/wallets",
        element: <WalletsPage />
    },
    {
        path: "/categories",
        element: <CategoriesPage />
    }
];

export default AppRoutes;
