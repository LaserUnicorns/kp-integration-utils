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
    type: 1 | 2 | 3 | 4
    ls: string
    code: string
    dateoper: string
    val: string
    note: string
}