import { NavLink } from 'react-router-dom';
import { GiTakeMyMoney, GiTwoCoins } from 'react-icons/gi';
import { MdSpaceDashboard, MdCategory } from "react-icons/md";
import { HiWallet } from "react-icons/hi2";
import { IoIosCash } from "react-icons/io";

export default function NavMenu() {
    return (
        <div className="nav-menu">
            <div className="logo prevent-select">
                <GiTwoCoins size={32} color={"var(--primary)"} />

                <div className="logo-text">
                    Portmonetka
                </div>
            </div>

            <section>
                <NavLink to="/" className="nav-link">
                    <MdSpaceDashboard size={32} />
                    <div className="menu-text">
                        Dashboard
                    </div>
                </NavLink>
                <NavLink to="/wallets" className="nav-link">
                    <HiWallet size={32} />
                    <div className="menu-text">
                        Wallets
                    </div>
                </NavLink>
                <NavLink to="/transactions" className="nav-link">
                    <IoIosCash size={32} />
                    <div className="menu-text">
                        Transactions
                    </div>
                </NavLink>
                <NavLink to="/categories" className="nav-link">
                    <MdCategory size={32} />
                    <div className="menu-text">
                        Categories
                    </div>
                </NavLink>
            </section>
        </div>
    )
}