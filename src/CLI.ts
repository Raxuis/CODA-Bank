import type {Answers, Choice, PromptType} from "prompts";
import prompts from "prompts";
import {Style} from "./tools/Style";

export interface CLIChoice extends Choice {
    action: Function;
}

/**
 * Represents a Command Line Interface (CLI) utility.
 */
export class CLI {
    private readonly getMenus: () => CLIChoice[];

    /**
     * Creates an instance of the CLI class.
     * @param getMenus - A function returning an array of CLIChoice objects.
     */
    constructor(getMenus: () => CLIChoice[]) {
        this.getMenus = getMenus;
    }

    /**
     * Prompts the user to input a value.
     */
    public static async askValue(message: string, type: PromptType = "text"): Promise<string | number> {
        const response: Answers<"value"> = await prompts({
            type,
            name: "value",
            message,
        });
        return response.value;
    }

    /**
     * Displays a menu to the user with the available choices.
     */
    public async menu() {
        const choices: CLIChoice[] = this.getMenus();
        const response: Answers<"action"> = await prompts({
            type: "select",
            name: "action",
            message: "Que voulez-vous faire ?",
            choices: [
                ...choices.map((choice: CLIChoice) => ({
                    title: choice.title,
                    value: choice.value,
                })),
                {title: "Quitter", value: "quit"},
            ],
        });

        const choice: CLIChoice | undefined = choices.find((choice: CLIChoice) => choice.value === response.action);

        if (choice) await choice.action();
        else await this.quit();

        Style.print("\n");
        await this.menu();
    }

    /**
     * Quit the CLI and exit the program.
     */
    private async quit() {
        const randomTime: number = Math.floor(Math.random() * 2); // Random time between 0 and 2 seconds
        await new Promise((resolve) => setTimeout(resolve, randomTime * 1000));

        Style.printColored("Au revoir !", "dim");
        process.exit(0);
    }
}
