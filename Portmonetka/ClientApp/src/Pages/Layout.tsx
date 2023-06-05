import { Outlet, Link } from 'react-router-dom';
import NavMenu from "./NavMenu";

export default function Layout() {
    return (
        <>
            <NavMenu/>

            <main className="page-content">
                <Outlet />
            </main>
        </>
    )
}
