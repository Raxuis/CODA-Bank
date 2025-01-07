export class BankAccount {
    public id: string;

    constructor(id: string, private pin: string, private moneyAmount: number = 0) {
        this.id = id;
        this.setPin(pin);
        this.setMoneyAmount(moneyAmount);
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

    public depositMoney(transactionMoney: number): void {
        if (transactionMoney > 0) {
            this.setMoneyAmount(this.getMoneyAmount() + transactionMoney);
        } else {
            throw new Error(`Il n'est pas possible de déposer la somme d'argent : ${transactionMoney}`);
        }
    }

    public withdrawMoney(transactionMoney: number): void {
        if (this.moneyAmount >= transactionMoney) {
            this.setMoneyAmount(this.getMoneyAmount() - transactionMoney);
        } else {
            throw new Error(`Il n'est pas possible de retirer la somme d'argent: ${transactionMoney}`);
        }
    }

}