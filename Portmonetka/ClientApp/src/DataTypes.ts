interface IAuditable {
    dateCreated?: Date
    dateUpdated?: Date
    dateDeleted?: Date
}

export interface IWallet extends IAuditable {
    id?: number
    name: string
    currency: string 
    initialAmount: number
    iconFileName?: string
}

export interface ICategory extends IAuditable {
    id?: number
    name: string
    isExpense: boolean
    iconFileName?: string
}

export interface ITransaction extends IAuditable {
    id?: number
    description: string
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

export interface ICurrencyBalance {
    currency: string
    sum: number
    income: number
    outcome: number
    incomeTrend: number
    outcomeTrend: number
}

export interface IGlobalBalanceContext {
    globalBalance: IGlobalBalance[]
    setGlobalBalance: any
}