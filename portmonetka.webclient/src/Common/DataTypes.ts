interface IAuditable {
    dateCreated?: Date
    dateUpdated?: Date
    dateDeleted?: Date
}

interface IAuthorizable {
    userId?: number
}

export interface IWallet extends IAuditable, IAuthorizable {
    id?: number
    name: string
    currency: string 
    initialAmount: number
    iconFileName?: string
}

export interface ICategory extends IAuditable, IAuthorizable {
    id?: number
    name: string
    isExpense: boolean
    iconFileName?: string
}

export interface ITransaction extends IAuditable, IAuthorizable {
    id?: number
    description: string
    amount: number
    date: Date
    categoryId?: number
    walletId: number
}

export interface ITransactionTemplate extends IAuditable, IAuthorizable {
    id?: number
    description: string
    amount?: number | null
    categoryId: number
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

export interface IWalletProps {
    name: string,
    currency: string,
    initialAmount: string,
    iconFileName?: string
}

export interface IUserCredentials {
    name: string
    password: string
    keepLoggedIn: boolean
}

export interface IGlobalBalanceContext {
    globalBalance: IGlobalBalance[]
    setGlobalBalance: any
}

export interface IAuthContext {
    token: string
    setToken: (token: string) => void
    userId: number
    setUserId: (id: number) => void
    expireTimestamp: number
    setExpireTimestamp: (milliseconds: number) => void
}

export enum PasswordStrength {
    WEAK = "Weak",
    MEDIUM = "Medium",
    STRONG = "Strong",
  }