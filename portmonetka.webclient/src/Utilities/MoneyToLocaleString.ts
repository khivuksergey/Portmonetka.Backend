export default function MoneyToLocaleString(money: number): string {
    return money.toLocaleString(navigator.language);
}