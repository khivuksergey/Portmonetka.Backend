export interface IWallet {
    id?: number
    name: string
    currency: string 
    initialAmount?: number
    iconFileName?: string
}

export interface ICategory {
    id?: number
    name: string
    isExpense: boolean
    iconFileName?: string
}

export interface ITransaction {
    id?: number
    name: string
    amount: number
    date: Date
    categoryId?: number
    walletId: number
}

export interface IGlobalBalance {
    id: number
    currency: string
    amount: number
}

export interface IGlobalBalanceContext {
    globalBalance: IGlobalBalance[]
    setGlobalBalance: any
}