import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {CLI} from "../CLI";
import {BankAccount} from "../../models/BankAccount";

type PinAction = "login" | "register" | "logout";
const pinRegex = /^\d{4}$/;
let isCreatingAccount: boolean = false;

async function askPin(action: PinAction): Promise<string> {
    let pin: string = "";
    const message = action === "register"
        ? "Entrez un nouveau code PIN (4 chiffres) :"
        : "Entrez votre code PIN (4 chiffres) :";
    do {
        pin = await CLI.askValue(message, "text");
    } while (!pinRegex.test(pin))
    return pin;
}

async function registerPin(): Promise<string> {
    const pin = await askPin("register");
    return bcrypt.hash(pin, 12);
}

// TODO: Compare pin entered and user pin
// async function logIn(): Promise<Boolean> {
//     const pin = await askPin("login");
//     return bcrypt.compare(pin, )
//
// }

export async function createBankAccount(): Promise<void> {
    if (isCreatingAccount) return;
    isCreatingAccount = true;
    try {
        const hashedPin = await registerPin();
        const id = uuidv4();
        const newAccount = new BankAccount(id, hashedPin);
        console.log("Compte bancaire créé avec succès :", newAccount);
    } catch (error) {
        console.error("Erreur lors de la création du compte bancaire :", error);
    } finally {
        isCreatingAccount = false;
    }
}

// export async function loginBankAccount() {
//     try {
//         const hashedPin = await logIn();
//     }
// }