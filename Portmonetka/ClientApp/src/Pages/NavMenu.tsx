import { NavLink } from 'react-router-dom';
import { GiTakeMyMoney, GiTwoCoins } from 'react-icons/gi';
import { MdSpaceDashboard, MdCategory } from "react-icons/md";
import { HiWallet } from "react-icons/hi2";
import { IoIosCash } from "react-icons/io";

export default function NavMenu() {
    return (
        <div className="nav-menu">
            <div className="logo prevent-select">
                <GiTwoCoins size={32} />Portmonetka
            </div>

            <section>
                <NavLink to="/" className="nav-link">
                    <MdSpaceDashboard size={32} />
                    Dashboard
                </NavLink>
                <NavLink to="/wallets" className="nav-link">
                    <HiWallet size={32} />
                    Wallets
                </NavLink>
                <NavLink to="/transactions" className="nav-link">
                    <IoIosCash size={32} />
                    Transactions
                </NavLink>
                <NavLink to="/categories" className="nav-link">
                    <MdCategory size={32} />
                    Categories
                </NavLink>
            </section>
        </div>
    )
}