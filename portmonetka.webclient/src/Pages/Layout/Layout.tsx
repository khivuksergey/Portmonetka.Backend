import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import TopPanel from "./TopPanel";
import Sidebar from "./Sidebar";
import { IconPortmonetka } from "../../Common/Icons";

export default function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [sidebarMustBeClosed, setSidebarMustBeClosed] = useState(false);
    const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);
    const [offcanvasMustBeClosed, setOffcanvasMustBeClosed] = useState(true);
    const [isSizeLessThan1024, setIsSizeLessThan1024] = useState(window.innerWidth < 1024);
    const [isSizeLessThan810, setIsSizeLessThan810] = useState(window.innerWidth < 810);

    useEffect(() => {
        const handleResize = () => {
            setIsSizeLessThan1024(window.innerWidth < 1024);
            setIsSizeLessThan810(window.innerWidth < 810);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (sidebarMustBeClosed) {
            setIsSidebarCollapsed(true);
        } else {
            setIsSidebarCollapsed(isSizeLessThan1024);
        }

        if (isSizeLessThan1024) {
            setIsOffcanvasVisible(!offcanvasMustBeClosed);
        } else if (isOffcanvasVisible) {
            setIsOffcanvasVisible(false);
            setOffcanvasMustBeClosed(true);
        }
    }, [isSizeLessThan1024, sidebarMustBeClosed, offcanvasMustBeClosed, isOffcanvasVisible]);

    const handleMenuButtonClick = () => {
        if (!isSizeLessThan1024) {
            setSidebarMustBeClosed(prev => !prev);
        } else {
            setOffcanvasMustBeClosed(prev => !prev);
        }
    };

    return (
        <>
            <TopPanel onMenuButtonClick={handleMenuButtonClick} />

            <div style={{ display: "flex" }}>
                {!isSizeLessThan810 ?
                    <Sidebar className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`} />
                    :
                    null}

                <main className="page-content">
                    <Outlet />
                </main>
            </div>

            <Offcanvas
                show={isOffcanvasVisible}
                onHide={handleMenuButtonClick}

            >
                <div className="logo prevent-select" onClick={handleMenuButtonClick} style={{ background: "#080808" }}>
                    <button type="button" className="logo__button" >
                        <IconPortmonetka size={40} className="icon-portmonetka" />
                    </button>

                    <div className="logo__text">
                        Portmonetka
                    </div>
                </div>
                <Sidebar className="sidebar" />
            </Offcanvas>
        </>
    )
}
