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
        this.moneyAmount = moneyAmount;
    }

    public getMoneyAmount(): number {
        return this.moneyAmount;
    }
}