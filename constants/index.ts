import {createBankAccount} from "../src/utils/BankAccountController";

type Menu = {
    title: string,
    value: string | number,
    action: Function
}

export const menus: Menu[] = [
    {
        title: "Créer un compte",
        value: "create",
        action:
            async () => {
                await createBankAccount();
            }
    },
    {
        title: "Accéder au compte",
        value: "read",
        action: () => {
        }
    }
]