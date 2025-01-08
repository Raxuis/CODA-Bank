import {Transaction} from "../types";

export class Style {
    private static readonly colors = {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
    };

    public static print(message: string): void {
        console.log(message);
    }

    /**
     * Print a colored message
     * @param message - The message sent
     * @param color - The value corresponding to the color
     */
    public static printColored(message: string, color: keyof typeof Style.colors): void {
        console.log(`${Style.colors[color]}${message}${Style.colors.reset}`);
    }

    public static printError(message: string): void {
        console.error(`${Style.colors.red}${message}${Style.colors.reset}`);
    }

    public static printSuccess(message: string): void {
        console.log(`${Style.colors.green}${message}${Style.colors.reset}`);
    }

    public static printInfo(message: string): void {
        console.log(`${Style.colors.cyan}${message}${Style.colors.reset}`);
    }

    public static formatTransaction(transaction: Transaction): void {
        const formattedDateTime: string = new Date(transaction.date).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        const actionColor = transaction.action === "deposit" ? this.colors.green : this.colors.red;
        const successColor = transaction.hasSucceeded ? this.colors.green : this.colors.red;

        this.printInfo(`\nTransaction du ${formattedDateTime} :`);
        this.print(`${actionColor}Action: ${transaction.action === "deposit" ? "Dépôt" : "Retrait"} de ${transaction.moneyAmount}€${this.colors.reset}`);
        this.print(`Argent après la transaction: ${transaction.balanceAfter}€`);
        this.print(`${successColor}${transaction.hasSucceeded ? "✅ A fonctionné ✅" : "❌ Échec ❌"}${this.colors.reset}`);
    }
}