type Menus = {
    title: string,
    value: string,
    action: Function
}

export const menus: Menus[] = [
    {
        title: "Créer un compte",
        value: "create",
        action: () => {
            console.log("test");
        }
    }
]