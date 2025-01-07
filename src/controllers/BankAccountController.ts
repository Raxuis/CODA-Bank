import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {CLI} from "../CLI";
import {BankAccount} from "../../models/BankAccount";

type PinAction = "login" | "register";
export type TransactionAction = "deposit" | "withdraw";

export class BankAccountController {

    // 👇 Regex excluant les lettres et bloquant les caractères à 4 de longueur
    private pinRegex = /^\d{4}$/;

    // 👇 Regex acceptant les entiers et décimaux
    // + limitant les centimes
    // + évitant les valeurs négatives
    private amountRegex = /^\d{1,3}(?:\d{3})*(?:[,.]\d{1,2})?$/;

    private isCreatingAccount: boolean = false;
    private account: BankAccount | undefined;
    public isAuthenticated: boolean = false;

    private async askPin(action: PinAction): Promise<string> {
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

    private async askTransactionMoney(action: TransactionAction): Promise<string> {
        let message: string = "Combien d'argent souhaitez-vous";
        let amount: string = "";

        message += action === "deposit"
            ? " déposer"
            : " retirer"

        message += " (en €) ?"

        do {
            amount = await CLI.askValue(message, "text") as string;
        } while (!this.amountRegex.test(amount))

        return amount;
    }

    private async registerPin(): Promise<string> {
        const pin = await this.askPin("register");
        return bcrypt.hash(pin, 12);
    }

    private async verifyPin(storedHash: string): Promise<boolean> {
        const pin = await this.askPin("login");
        return bcrypt.compare(pin, storedHash);
    }

    public async createBankAccount(): Promise<void> {
        if (this.isCreatingAccount) return;
        this.isCreatingAccount = true;

        try {
            const hashedPin = await this.registerPin();
            const id = uuidv4();
            this.account = new BankAccount(id, hashedPin);
            console.log("Compte bancaire créé avec succès :", this.account);
        } catch (error) {
            console.error("Erreur lors de la création du compte bancaire :", error);
        } finally {
            this.isCreatingAccount = false;
        }
    }

    public async loginBankAccount(): Promise<void> {
        try {
            const isVerified = await this.verifyPin(this.account!.getPin());
            if (isVerified) {
                console.log("Connexion réussie. Bienvenue !");
                this.isAuthenticated = true;
            } else {
                console.error("Échec de la connexion. Code PIN incorrect.");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion au compte bancaire :", error);
        }
    }

    public logout(): void {
        this.isAuthenticated = false;
    }

    public async getBalance(): Promise<void> {
        console.log(this.account!.getMoneyAmount() + "€");
    }

    public async depositMoney(): Promise<void> {
        try {
            const amount = await this.askTransactionMoney("deposit");
            this.account!.depositMoney(parseFloat(amount));
            console.log("Voici maintenant l'argent sur votre compte :", this.account!.getMoneyAmount() + "€");
        } catch (error) {
            console.error("Erreur lors de la transaction au compte bancaire :", error);
        }
    }

    public async withdrawMoney(): Promise<void> {
        try {
            const amount = await this.askTransactionMoney("withdraw");
            this.account!.withdrawMoney(parseFloat(amount));
            console.log("Voici maintenant l'argent sur votre compte :", this.account!.getMoneyAmount() + "€");
        } catch (error) {
            console.error("Erreur lors de la transaction au compte bancaire :", error);
        }
    }

    public async getHistoric(): Promise<void> {
        const historic = this.account!.getTransactions();
        if (historic.length === 0) {
            console.log("Aucune transaction n'a été effectuée");
        } else {
            console.log(historic);
        }
    }

    public hasAccount(): boolean {
        return !!this.account;
    }
}