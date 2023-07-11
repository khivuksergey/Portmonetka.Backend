import { useState, useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import { IconTwoCoins } from "../Common/Icons";
import Sidebar from "./Sidebar";

export default function NavMenu() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCollapseButtonClicked, setIsCollapseButtonClicked] = useState(false);
    const [isSizeLessThan1024, setIsSizeLessThan1024] = useState(window.innerWidth < 1024);
    const [isSizeLessThan810, setIsSizeLessThan810] = useState(window.innerWidth < 810);

    const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);

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
        if (isCollapseButtonClicked) {
            setIsCollapsed(true);
        } else {
            setIsCollapsed(isSizeLessThan1024);
        }
    }, [isCollapseButtonClicked, isSizeLessThan1024]);

    useEffect(() => {
        if (!isCollapsed && isOffcanvasVisible && !isSizeLessThan1024) {
            setIsOffcanvasVisible(false);
        }
    }, [isOffcanvasVisible, isSizeLessThan1024, isCollapsed])

    const handleMenuLogoClick = () => {
        setIsCollapseButtonClicked(!isCollapseButtonClicked);
    };

    const handleOffcanvasOpen = () => {
        setIsOffcanvasVisible(prev => !prev);
    };

    return (
        <>
            {!isSizeLessThan810 ?
                <Sidebar
                    className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
                    onClose={
                        isSizeLessThan1024 && !isSizeLessThan810 ?
                            handleOffcanvasOpen
                            :
                            handleMenuLogoClick
                    }
                />
                :
                <>
                    <div
                        style={{
                            position: "sticky",
                            left: "0",
                            top: "0",
                            zIndex: "6",
                            height: "calc(64px + 0.25rem)",
                            width: "100%",
                            flexShrink: "0",
                            overflow: "hidden",
                            backgroundColor: "#101010"
                        }}
                    >
                        <div className="logo prevent-select" onClick={handleOffcanvasOpen}>
                            <button type="button" className="logo__button">
                                <IconTwoCoins size={40} color={"var(--primary)"} />
                            </button>

                            <div className="logo__text">
                                Portmonetka
                            </div>
                        </div>
                    </div>
                </>
            }

            <Offcanvas
                show={isOffcanvasVisible}
                onHide={() => setIsOffcanvasVisible(false)}

            >
                <Sidebar
                    className="sidebar"
                    onClose={() => setIsOffcanvasVisible(false)} />
            </Offcanvas>
        </>
    )
}