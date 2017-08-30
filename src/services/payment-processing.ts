import * as iconv from 'iconv-lite'
import * as AdmZip from 'adm-zip'
import * as uuid from 'uuid'
import { PaymentExport, PaymentImport, ImportLineType, ImportFileType } from "../models/payment";
import { Settings } from "../models/settings";

export function parsePaymentExport(this: void, line: string): PaymentExport {
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

const EOL = '\r\n'

export function parseExportFile(this: void, file: Buffer): string[] {
    return iconv.decode(file, 'win1251').split(EOL).filter(line => line !== '').filter(line => !line.startsWith('='))
}

export function parseArchive(this: void, path: string): PaymentExport[] {
    const zip = new AdmZip(path)

    const lines = zip.getEntries()
        .map(entry => parseExportFile(entry.getData()))
        .reduce((total, file) => total.concat(file), [])

    return lines.map(line => parsePaymentExport(line))
}

export function prepareImportFile(this: void, payments: PaymentExport[]): Buffer {
    const lines = payments
        .map(convertPayment)
        .map(p => [p.type, p.ls, p.code, p.dateoper, p.val, p.note].join(';'))

    return iconv.encode(lines.join(EOL) + EOL, 'win1251')
}

export function getImportFileName(this: void, settings: Settings) {
    return `${ImportFileType.Payments}_${settings.inn}_${uuid()}.csv`
}

export function convertPayment(this: void, payment: PaymentExport): PaymentImport {
    return {
        type: ImportLineType.Payment,
        ls: payment.account,
        code: '',
        dateoper: payment.date.replace(/\-/g, '.'),
        val: payment.transactionAmount.replace(',', '.'),
        note: '',
    }
}