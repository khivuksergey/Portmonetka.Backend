import { IWalletProps } from "../DataTypes";
import CurrencyToSignConverter from "../Utilities/CurrencyToSignConverter";
import MoneyToLocaleString from "../Utilities/MoneyToLocaleString";
import getSymbolFromCurrency from "currency-symbol-map";

export default function AddWalletStatusMessage(wallet: IWalletProps): string {
    if (wallet.name === "")
        return "Seems like there's nowhere to store your savings yet";
    if (wallet.currency.length !== 3)
        return `Will you please specify the currency for ${wallet.name}?`;
    if (!wallet.initialAmount)
        return `Your ${wallet.name} wallet isn't going to be empty, or is it?`;
    if (!getSymbolFromCurrency(wallet.currency))
        return `Your ${wallet.name} wallet is going to have ${MoneyToLocaleString(parseFloat(wallet.initialAmount))}\u00A0${wallet.currency.toUpperCase()} in it, right?`;

    return `Your ${wallet.name} wallet is going to have ${MoneyToLocaleString(parseFloat(wallet.initialAmount))}\u00A0${CurrencyToSignConverter(wallet.currency.toUpperCase())} in it, right?`;
}