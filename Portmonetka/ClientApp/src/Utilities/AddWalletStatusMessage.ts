import { IWallet } from "../DataTypes";
import CurrencyToSignConverter from "../Utilities/CurrencyToSignConverter";
import MoneyToLocaleString from "../Utilities/MoneyToLocaleString";
import getSymbolFromCurrency from "currency-symbol-map";

export default function AddWalletStatusMessage(wallet: IWallet): string {
    if (wallet.name === "")
        return "Seems like there's nowhere to store your savings yet";
    if (wallet.currency.length !== 3)
        return `Will you please specify the currency for ${wallet.name}?`;
    if (!wallet.initialAmount)
        return `Your ${wallet.name} wallet isn't going to be empty, or is it?`;
    if (!getSymbolFromCurrency(wallet.currency))
        return `Your ${wallet.name} wallet is going to have ${wallet.currency}${MoneyToLocaleString(wallet.initialAmount)} in it, right?`;

    return `Your ${wallet.name} wallet is going to have ${CurrencyToSignConverter(wallet.currency)}${MoneyToLocaleString(wallet.initialAmount)} in it, right?`;
}