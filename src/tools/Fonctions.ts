import {PinAction, Transaction, TransactionAction} from "../types";
import {CLI} from "../CLI";
import bcrypt from "bcrypt";

export abstract class Fonctions {
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
        // TODO: Only show the ten last transactions
        history.map((ele: Transaction) => {
            console.log(`Transaction du ${ele.date} :\n`);
            console.log(`Action: ${ele.action === "deposit" ? "dépot" : "retrait"} de ${ele.moneyAmount}\n`);
            console.log(`Argent après la transaction: ${ele.balanceAfter}\n`);
            console.log(`${ele.hasSucceeded ? "✅ A fonctionné ✅" : "❌ Échec ❌"}`)
        })
    }
}