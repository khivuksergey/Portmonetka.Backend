import Home from './Pages/Home/Home';
import CategoriesPage from './Pages/Categories/CategoriesPage';
import TransactionsPage from './Pages/Transactions/TransactionsPage';
import WalletsPage from './Pages/Wallets/WalletsPage';

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/wallets',
        element: < WalletsPage />
    },
    {
        path: '/transactions',
        element: < TransactionsPage />
    },
    {
        path: '/categories',
        element: <CategoriesPage />
    }
];

export default AppRoutes;
