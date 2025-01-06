import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {CLI} from "../CLI";
import {BankAccount} from "../../models/BankAccount";

async function askPin(): Promise<string> {
    let pin: number = 0;
    while (pin.toString().length != 4) {
        pin = await CLI.askValue("Entrez votre code pin (longueur 4)", "number");
    }
    return bcrypt.hash(pin.toString(), 12);
}

export async function createBankAccount() {
    const hashedPin = await askPin();
    const id = uuidv4();
    console.log(new BankAccount(id, hashedPin));
}