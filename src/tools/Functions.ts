import {PinAction, Transaction, TransactionAction} from "../types";
import {CLI} from "../CLI";
import bcrypt from "bcrypt";

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
        // 👇 Triage de l'historique par la date (DESC)
        const sortedHistory: Transaction[] =
            history.sort(
                (a: Transaction, b: Transaction) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime());

        // 👇 Récupération de seulement les dix premiers (dix derniers en raison de DESC)
        const lastTenTransactions: Transaction[] = sortedHistory.slice(0, 10);

        lastTenTransactions.forEach((ele: Transaction) => {
            const formattedDateTime: string = new Date(ele.date).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });

            // Des couleurs simplement pour améliorer le style
            const actionColor: "\u001B[32m" | "\u001B[31m" = ele.action === "deposit" ? "\x1b[32m" : "\x1b[31m";
            const successColor: "\u001B[32m" | "\u001B[31m" = ele.hasSucceeded ? "\x1b[32m" : "\x1b[31m";

            this.print(`\n\x1b[36mTransaction du ${formattedDateTime} :\x1b[0m`);
            this.print(`${actionColor}Action: ${ele.action === "deposit" ? "Dépôt" : "Retrait"} de ${ele.moneyAmount}€\x1b[0m`);
            this.print(`Argent après la transaction: ${ele.balanceAfter}€`);
            this.print(`${successColor}${ele.hasSucceeded ? "✅ A fonctionné ✅" : "❌ Échec ❌"}\x1b[0m`);
        });
    }

    public static print(message: string, error: Boolean = false): void {
        error ? console.error(message) : console.log(message);
    }

}