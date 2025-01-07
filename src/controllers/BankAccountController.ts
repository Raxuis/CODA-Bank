import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {CLI} from "../CLI";
import {BankAccount} from "../../models/BankAccount";

type PinAction = "login" | "register" | "logout";

export class BankAccountController {
    private pinRegex = /^\d{4}$/;
    private isCreatingAccount: boolean = false;
    private account: BankAccount | undefined;
    public isAuthenticated: boolean = false;

    private async askPin(action: PinAction): Promise<string> {
        let pin: string = "";
        const message = action === "register"
            ? "Entrez un nouveau code PIN (4 chiffres) :"
            : "Entrez votre code PIN (4 chiffres) :";
        do {
            pin = await CLI.askValue(message, "text") as string;
        } while (!this.pinRegex.test(pin))
        return pin;
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

    public hasAccount(): boolean {
        return !!this.account;
    }
}