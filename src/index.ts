import { CLI } from "./CLI";
import { getMenus } from "../constants";

const startupParts: string[] = [
    "   __________  ____  ___       ____  ___    _   ____ __",
    "  / ____/ __ \\/ __ \\/   |     / __ )/   |  / | / / //_/",
    " / /   / / / / / / / /| |    / __  / /| | /  |/ / ,<   ",
    "/ /___/ /_/ / /_/ / ___ |   / /_/ / ___ |/ /|  / /| |  ",
    "\\____/\\____/_____/_/  |_|  /_____/_/  |_/_/ |_/_/ |_|",
    "",
    "La banque de demain, aujourd'hui.",
    "",
];

console.log(startupParts.join("\n"));

const cli = new CLI(getMenus);
cli.menu();
