export type PinAction = "login" | "register";

export type TransactionAction = "deposit" | "withdraw";

export type Transaction = {
    action: TransactionAction,
    moneyAmount: number
    date: Date
    balanceAfter: number
    hasSucceeded: boolean
}

export type Menu = {
    title: string,
    value: string | number,
    action: Function
}