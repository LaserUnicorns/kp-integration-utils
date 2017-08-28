export interface PaymentExport {
    date: string
    time: string
    dep: string
    cashier: string
    eps: string
    account: string
    fullname: string
    address: string
    paymentPeriod: string
    transactionAmount: string
    transferAmount: string
    commissionAmount: string
}

export interface PaymentImport {
    type: ImportLineType
    ls: string
    code: string
    dateoper: string
    val: string
    note: string
}

export enum ImportFileType {
    Accounts = 'L',
    Payments = 'P',
}

export enum ImportLineType {
    Account = 1,
    Counter = 2,
    Payment = 3,
    Reading = 4,
}
