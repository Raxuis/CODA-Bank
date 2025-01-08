import {TransactionAction} from "../controllers/BankAccountController";

type Transaction = {
    action: TransactionAction,
    moneyAmount: number
    date: Date
    balanceAfter: number
    hasSucceeded: boolean
}

export class BankAccount {
    public id: string;

    constructor(id: string, private pin: string, private moneyAmount: number = 0, private transactions: Transaction[] = []) {
        this.id = id;
        this.setPin(pin);
        this.setMoneyAmount(moneyAmount);
        this.setTransactions(transactions);
    }

    public setPin(pin: string): void {
        this.pin = pin;
    }

    public getPin(): string {
        return this.pin;
    }

    public setMoneyAmount(moneyAmount: number): void {
        // 👇 Pour éviter les erreurs lors des transactions
        this.moneyAmount = parseFloat(moneyAmount.toFixed(2));
    }

    public getMoneyAmount(): number {
        return this.moneyAmount;
    }

    public setTransactions(transactions: Transaction[]): void {
        this.transactions = transactions;
    }

    public getTransactions(): Transaction[] {
        return this.transactions;
    }

    public depositMoney(transactionMoney: number): void {
        const transaction: Partial<Transaction> = {
            action: "deposit",
            moneyAmount: transactionMoney,
            date: new Date(),
            balanceAfter: this.moneyAmount + transactionMoney,
        };
        if (transactionMoney > 0) {
            this.setMoneyAmount(this.getMoneyAmount() + transactionMoney);
            transaction.hasSucceeded = true;
            console.log("Voici maintenant l'argent sur votre compte :", this.getMoneyAmount() + "€");
        } else {
            transaction.hasSucceeded = false;
            console.error(`Il n'est pas possible de déposer la somme d'argent : ${transactionMoney}€`);
        }
        this.saveTransaction(transaction as Transaction);
    }

    // TODO: Refactor transaction definition to avoid repeating myself

    public withdrawMoney(transactionMoney: number): void {
        const transaction: Partial<Transaction> = {
            action: "withdraw",
            moneyAmount: transactionMoney,
            date: new Date(),
            balanceAfter: this.moneyAmount - transactionMoney,
        }
        if (this.moneyAmount >= transactionMoney) {
            this.setMoneyAmount(this.getMoneyAmount() - transactionMoney);
            transaction.hasSucceeded = true;
            console.log("Voici maintenant l'argent sur votre compte :", this.getMoneyAmount() + "€");
        } else {
            transaction.hasSucceeded = false;
            console.error(`Il n'est pas possible de retirer la somme d'argent: ${transactionMoney}€`);
        }
        this.saveTransaction(transaction as Transaction);
    }

    private saveTransaction(transaction: Transaction): void {
        const accountTransactions = this.getTransactions();
        // Je check la longueur du tableau pour ajouter ou simplement set le tableau
        if (accountTransactions.length === 0) {
            this.setTransactions([transaction]);
        } else {
            this.setTransactions([...accountTransactions, transaction]);
        }
    }
}