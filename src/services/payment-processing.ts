import * as iconv from 'iconv-lite'
import { PaymentExport, PaymentImport } from "../models/payment";

export function parsePaymentExport(line: string): PaymentExport {
    const [
        date,
        time,
        dep,
        cashier,
        eps,
        account,
        fullname,
        address,
        paymentPeriod,
        transactionAmount,
        transferAmount,
        commissionAmount,
    ] = line.split(';')

    return {
        date,
        time,
        dep,
        cashier,
        eps,
        account,
        fullname,
        address,
        paymentPeriod,
        transactionAmount,
        transferAmount,
        commissionAmount,
    }
}

export function parseFile(file: Buffer): string[] {
    return iconv.decode(file, 'win1251').split('\r\n').filter(line => line !== '').filter(line => !line.startsWith('='))
}

export function prepareFile(lines: string[]): Buffer {
    return iconv.encode(lines.join('\r\n'), 'win1251')
}

export function convertPayment(payment: PaymentExport): PaymentImport {
    return {
        type: 3,
        ls: payment.account,
        code: '',
        dateoper: payment.date.replace(/\-/g, '.'),
        val: payment.transactionAmount.replace(',', '.'),
        note: '',
    }
}