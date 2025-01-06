export class BankAccount {
    public id: string;

    constructor(id: string, private pin: string, private moneyAmount: number = 0) {
        this.id = id;
        this.setPin(pin);
        this.setMoneyAmount(moneyAmount);
    }

    public setPin(pin: string) {
        this.pin = pin;
    }

    public getPin(pin: string) {
        return this.pin;
    }

    public setMoneyAmount(moneyAmount: number) {
        this.moneyAmount = moneyAmount;
    }

    public getMoneyAmount() {
        return this.moneyAmount;
    }
}