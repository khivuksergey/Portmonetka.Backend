import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { GiTwoCoins } from 'react-icons/gi';
import { MdSpaceDashboard, MdCategory } from "react-icons/md";
import { HiWallet } from "react-icons/hi2";
import { IoIosCash } from "react-icons/io";

export default function NavMenu() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCollapseButtonClicked, setIsCollapseButtonClicked] = useState(false);
    const [isSizeLessThan1024, setIsSizeLessThan1024] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsSizeLessThan1024(window.innerWidth < 1024);
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

    const handleMenuLogoClick = () => {
        setIsCollapseButtonClicked(!isCollapseButtonClicked);
    };

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <div className="sidebar__logo">
                <div className="flexbox logo prevent-select" onClick={handleMenuLogoClick}>
                    <button className="logo__button" >
                        <GiTwoCoins size={40} color={"var(--primary)"}
                          /*fill={!isCollapseButtonClicked ? "var(--primary)" : "white"} */ />
                    </button>

                    <div className="logo__text">
                        Portmonetka
                    </div>
                </div>
            </div>

            <section className="sidebar__nav-links">
                <NavLink to="/" className="nav-link">
                    <MdSpaceDashboard size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Dashboard
                    </div>
                </NavLink>
                <NavLink to="/wallets" className="nav-link">
                    <HiWallet size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Wallets
                    </div>
                </NavLink>
                <NavLink to="/transactions" className="nav-link">
                    <IoIosCash size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Transactions
                    </div>
                </NavLink>
                <NavLink to="/categories" className="nav-link">
                    <MdCategory size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Categories
                    </div>
                </NavLink>
            </section>
        </div>
    )
}