import {PinAction, Transaction, TransactionAction} from "../types";
import {CLI} from "../CLI";
import bcrypt from "bcrypt";
import {Style} from "./Style";

export abstract class Functions {
    // 👇 Regex excluant les lettres et bloquant les caractères à 4 de longueur
    private static pinRegex: RegExp = /^\d{4}$/;

    public static async askTransactionMoney(action: TransactionAction): Promise<number> {

        let message: string = "Combien d'argent souhaitez-vous";
        let amount: number = 0;

        message += action === "deposit"
            ? " déposer"
            : " retirer"
        message += " (en €) ?"

        do {
            amount = await CLI.askValue(message, "number") as number;
        } while (!amount)

        return amount;
    }

    public static async registerPin(): Promise<string> {
        const pin: string = await this.askPin("register");
        return bcrypt.hash(pin, 12);
    }

    public static async verifyPin(storedHash: string): Promise<boolean> {
        const pin: string = await this.askPin("login");
        return bcrypt.compare(pin, storedHash);
    }

    public static async askPin(action: PinAction): Promise<string> {
        let pin: string = "";

        let message: string = action === "register"
            ? "Entrez un nouveau"
            : "Entrez votre";
        message += " code PIN (4 chiffres) :"

        do {
            pin = await CLI.askValue(message, "text") as string;
        } while (!this.pinRegex.test(pin))

        return pin;
    }

    public static printHistory(history: Transaction[]): void {
        const sortedHistory: Transaction[] =
            history.sort(
                (a: Transaction, b: Transaction) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime());

        const lastTenTransactions: Transaction[] = sortedHistory.slice(0, 10);
        lastTenTransactions.forEach((transaction: Transaction) => {
            Style.formatTransaction(transaction);
        });
    }
}