import {v4 as uuidv4} from 'uuid';
import {BankAccount} from "../models/BankAccount";
import {Fonctions} from "../tools/Fonctions";

export class BankAccountController {

    private isCreatingAccount: boolean = false;
    private account: BankAccount | undefined;
    public isAuthenticated: boolean = false;

    private attempts: number = 0;

    public async createBankAccount(): Promise<void> {
        if (this.isCreatingAccount) return;
        this.isCreatingAccount = true;

        try {
            const hashedPin: string = await Fonctions.registerPin();
            const id: string = uuidv4();
            this.account = new BankAccount(id, hashedPin);
            console.log("\nCompte bancaire créé avec succès :", this.account);
        } catch (error) {
            console.error("Erreur lors de la création du compte bancaire :", error);
        } finally {
            this.isCreatingAccount = false;
        }
    }

    public async loginBankAccount(): Promise<void> {
        try {
            const isVerified: boolean = await Fonctions.verifyPin(this.account!.getPin());
            this.attempts++;
            if (this.attempts >= 3) {
                console.log("⚠️ Doucement, sur le bruteforce ! ⚠️")
                process.exit(0);
            }
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
        console.log(`Vous possédez : ${this.account!.getMoneyAmount()}€`);
    }

    public async depositMoney(): Promise<void> {
        const amount: number = await Fonctions.askTransactionMoney("deposit");
        this.account!.depositMoney(amount);
    }

    public async withdrawMoney(): Promise<void> {
        const amount: number = await Fonctions.askTransactionMoney("withdraw");
        this.account!.withdrawMoney(amount);
    }

    public async getHistoric(): Promise<void> {
        const historic = this.account!.getTransactions();
        if (historic.length === 0) {
            console.log("Aucune transaction n'a été effectuée");
        } else {
            // TODO: Only show the ten last transactions
            console.log(historic);
        }
    }

    public hasAccount(): boolean {
        return !!this.account;
    }
}