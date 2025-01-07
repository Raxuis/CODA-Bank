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
                    action: async () => {
                        await bankAccountController.depositMoney();
                    }
                },
                {
                    title: "Retirer de l'argent",
                    value: "Withdraw",
                    action: async () => {
                        await bankAccountController.withdrawMoney();
                    }
                },
                {
                    title: "Voir l'historique",
                    value: "history",
                    action: async () => {
                        await bankAccountController.getHistoric();
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