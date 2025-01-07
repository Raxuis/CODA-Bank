import {BankAccountController} from "../src/utils/BankAccountController";

type Menu = {
    title: string,
    value: string | number,
    action: Function
}

const bankAccountController = new BankAccountController();

export const menus: Menu[] = [
    {
        title: "Créer un compte",
        value: "create",
        action:
            async () => {
                await bankAccountController.createBankAccount();
            }
    },
    {
        title: "Accéder au compte",
        value: "read",
        action: async () => {
            await bankAccountController.loginBankAccount();
        }
    }
]