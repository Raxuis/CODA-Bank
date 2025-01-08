import {v4 as uuidv4} from 'uuid';
import {BankAccount} from "../models/BankAccount";
import {Functions} from "../tools/Functions";
import {Transaction} from "../types";

export class BankAccountController {

    private isCreatingAccount: boolean = false;
    private account: BankAccount | undefined;
    public isAuthenticated: boolean = false;

    private attempts: number = 0;

    public async createBankAccount(): Promise<void> {
        if (this.isCreatingAccount) return;
        this.isCreatingAccount = true;

        try {
            const hashedPin: string = await Functions.registerPin();
            const id: string = uuidv4();
            this.account = new BankAccount(id, hashedPin);
            Functions.print("\nCompte bancaire créé avec succès.");
        } catch (error) {
            Functions.print(`Erreur lors de la création du compte bancaire : ${error}`, true);
        } finally {
            this.isCreatingAccount = false;
        }
    }

    public async loginBankAccount(): Promise<void> {
        try {

            const isVerified: boolean = await Functions.verifyPin(this.account!.getPin());
            this.attempts++;

            if (this.attempts >= 3) {
                Functions.print("⚠️ Doucement, sur le bruteforce ! ⚠️")
                process.exit(0);
            }

            if (isVerified) {
                Functions.print("Connexion réussie. Bienvenue ! 🤗");

                this.isAuthenticated = true;
            } else {
                Functions.print("Échec de la connexion. Code PIN incorrect.", true);
            }
        } catch (error) {
            Functions.print(`Erreur lors de la connexion au compte bancaire : ${error}`, true);
        }
    }

    public logout(): void {
        this.isAuthenticated = false;
        Functions.print("Oh d'accord, bye bye 👋")
    }

    public async getBalance(): Promise<void> {
        Functions.print(`💸 Vous possédez : ${this.account!.getMoneyAmount()}€ 💸`);
    }

    public async depositMoney(): Promise<void> {
        const amount: number = await Functions.askTransactionMoney("deposit");
        this.account!.depositMoney(amount);
    }

    public async withdrawMoney(): Promise<void> {
        const amount: number = await Functions.askTransactionMoney("withdraw");
        this.account!.withdrawMoney(amount);
    }

    public async getHistory(): Promise<void> {
        const history: Transaction[] = this.account!.getTransactions();

        if (history.length === 0) {
            Functions.print("Aucune transaction n'a été effectuée");
        } else {
            Functions.printHistory(history);
        }
    }

    public hasAccount(): boolean {
        return !!this.account;
    }
}