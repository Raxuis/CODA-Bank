import {v4 as uuidv4} from 'uuid';
import {BankAccount} from "../models/BankAccount";
import {Functions} from "../tools/Functions";
import {Transaction} from "../types";
import {Style} from "../tools/Style";

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
            Style.printSuccess("\nCompte bancaire créé avec succès.");
        } catch (error) {
            Style.printError(`Erreur lors de la création du compte bancaire : ${error}`);
        } finally {
            this.isCreatingAccount = false;
        }
    }

    public async loginBankAccount(): Promise<void> {
        try {

            const isVerified: boolean = await Functions.verifyPin(this.account!.getPin());
            this.attempts++;

            if (this.attempts >= 3) {
                Style.printColored("⚠️ Doucement, sur le bruteforce ! ⚠️", "yellow")
                process.exit(0);
            }

            if (isVerified) {
                Style.printColored("Connexion réussie. Bienvenue ! 🤗", "magenta");

                this.isAuthenticated = true;
            } else {
                Style.printError("Échec de la connexion. Code PIN incorrect.");
            }
        } catch (error) {
            Style.printError(`Erreur lors de la connexion au compte bancaire : ${error}`);
        }
    }

    public logout(): void {
        this.isAuthenticated = false;
        Style.printColored("Oh d'accord, bye bye 👋", "yellow")
    }

    public async getBalance(): Promise<void> {
        Style.printInfo(`💸 Vous possédez : ${this.account!.getMoneyAmount()}€ 💸`);
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
            Style.printInfo("Aucune transaction n'a été effectuée");
        } else {
            Functions.printHistory(history);
        }
    }

    public hasAccount(): boolean {
        return !!this.account;
    }
}