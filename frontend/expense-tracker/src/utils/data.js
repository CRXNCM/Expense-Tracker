import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        heading: "Dashboard",
    },
    {
        id: "02",
        label: "My Earnings",
        icon: LuHandCoins,
        heading: "My Earnings",
    },
    {
        id: "03",
        label: "Sign Out",
        icon: LuLogOut,
        heading: "Sign Out",
    },
    {
        id: "04",
        label: "My Wallet",
        icon: LuWalletMinimal,
        heading: "My Wallet",
    }
];
