import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/about',
        element: < About />
    },
    {
        path: '/contact',
        element: <Contact />
    }
];

export default AppRoutes;
