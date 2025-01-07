import {BankAccountController} from "../src/controllers/BankAccountController";

type Menu = {
    title: string,
    value: string | number,
    action: Function
}

const bankAccountController = new BankAccountController();

export const getMenus = (): Menu[] => {
    if (bankAccountController.hasAccount()) {
        if (bankAccountController.isAuthenticated) {
            return [
                {
                    title: "Déposer de l'argent",
                    value: "deposit",
                    action: () => {
                        console.log("Deposit");
                    }
                },
                {
                    title: "Retirer de l'argent",
                    value: "Withdraw",
                    action: () => {
                        console.log("Withdraw");
                    }
                },
                {
                    title: "Voir l'historique",
                    value: "history",
                    action: () => {
                        console.log("History");
                    }
                },
                {
                    title: "Voir votre argent",
                    value: "balance",
                    action: async () => {
                        await bankAccountController.getBalance();
                    }
                },
                {
                    title: "Se déconnecter",
                    value: "logout",
                    action: () => {
                        bankAccountController.logout();
                    }
                }
            ]
        } else {
            return [
                {
                    title: "Accéder au compte",
                    value: "read",
                    action: async () => {
                        await bankAccountController.loginBankAccount();
                    }
                }
            ];
        }
    } else {
        return [
            {
                title: "Créer un compte",
                value: "create",
                action: async () => {
                    await bankAccountController.createBankAccount();
                }
            }
        ];
    }
};