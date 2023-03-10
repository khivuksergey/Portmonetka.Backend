import getSymbolFromCurrency from "currency-symbol-map";
import { GiCat } from "react-icons/gi";

export default function currencyToSign(currency) {
    if (currency.toUpperCase() === "KUS") {
        return <i><GiCat className="kusya" /></i>
    } else {
        return getSymbolFromCurrency(currency);
    }
}