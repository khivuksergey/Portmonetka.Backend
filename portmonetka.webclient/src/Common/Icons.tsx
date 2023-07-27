import { GetUserDevice } from "../Utilities";

import { GiTwoCoins, GiCat } from "react-icons/gi";
import {
    HiWallet, HiOutlineWallet,
    HiPresentationChartLine, HiOutlinePresentationChartLine,
    HiRectangleGroup, HiOutlineRectangleGroup,
    HiMiniBanknotes, HiOutlineBanknotes,
    HiOutlineSun,
    HiOutlineMoon,
    HiOutlineComputerDesktop,
    HiOutlineDeviceTablet,
    HiOutlineDevicePhoneMobile,
    HiOutlineCog6Tooth,
} from "react-icons/hi2";
import { HiOutlineLogout, HiPlus } from "react-icons/hi";
import { IoIosCalendar } from "react-icons/io";
import { LuServerOff } from "react-icons/lu";
import {
    MdConstruction,
    MdDelete,
    MdPlaylistAddCheck,
    MdPlaylistRemove,
    MdRefresh,
    MdRestoreFromTrash,
    MdTrendingDown,
    MdTrendingFlat,
    MdTrendingUp,
} from "react-icons/md";

interface IIconProps {
    size?: number
    className?: string
    isDarkMode?: boolean
}

const IconOverview = ({ size, className, isDarkMode }: IIconProps) => {
    return (
        isDarkMode ?
            <HiPresentationChartLine size={size} className={className} />
            :
            <HiOutlinePresentationChartLine size={size} className={className} />
    )
}

const IconWallets = ({ size, className, isDarkMode }: IIconProps) => {
    return (
        isDarkMode ?
            <HiWallet size={size} className={className} />
            :
            <HiOutlineWallet size={size} className={className} />
    )
}

const IconTransactions = ({ size, className, isDarkMode }: IIconProps) => {
    return (
        isDarkMode ?
            <HiMiniBanknotes size={size} className={className} />
            :
            <HiOutlineBanknotes size={size} className={className} />
    )
}

const IconCategories = ({ size, className, isDarkMode }: IIconProps) => {
    return (
        isDarkMode ?
            <HiRectangleGroup size={size} className={className} />
            :
            <HiOutlineRectangleGroup size={size} className={className} />
    )
}

const IconTheme = ({ size, className, isDarkMode }: IIconProps) => {
    return (
        isDarkMode ?
            <HiOutlineMoon size={size} className={className} style={{ transform: "scale(0.9)" }} />
            :
            <HiOutlineSun size={size} className={className} />
    )
}

// const IconSystem = ({ size }: IIconProps) => {
//     return <HiOutlineCog6Tooth size={size} />
//     const device = GetUserDevice();
//     switch (device) {
//         case "mobile":
//             return <HiOutlineDevicePhoneMobile size={size} />;
//         case "tablet":
//             return <HiOutlineDeviceTablet size={size} />;
//         case "desktop":
//         case "undefined":
//             return <HiOutlineComputerDesktop size={size} />;
//     }
// }

const IconLogout = ({ size, className, isDarkMode }: IIconProps) => {
    return (
        <HiOutlineLogout size={size} style={{ strokeWidth: "1.5px" }} />
    )
}

export {
    GiCat as IconCat,
    GiTwoCoins as IconPortmonetka,
    IoIosCalendar as IconCalendar,
    IconOverview,
    IconWallets,
    IconTransactions,
    IconCategories,
    IconTheme,
    IconLogout,
    HiMiniBanknotes as IconCash,
    HiPlus as IconAdd,
    MdConstruction as IconUnderConstruction,
    MdDelete as IconDelete,
    LuServerOff as IconServerOff,
    MdPlaylistAddCheck as IconRestoreRow,
    MdPlaylistRemove as IconRemoveRow,
    MdRefresh as IconRefresh,
    MdRestoreFromTrash as IconRestore,
    MdTrendingDown as IconTrendingDown,
    MdTrendingFlat as IconTrendingFlat,
    MdTrendingUp as IconTrendingUp,
}