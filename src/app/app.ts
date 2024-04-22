import { confirm, input, select } from "@inquirer/prompts";
import Searching from "../core/search.js";
import Manager from "../core/manager.js";
import screen from "./screen.js";

type Choices<T, B> = {
    name: string;
    value: Searching<T, B>;
};

export default class App<T, B> {
    #manager: Manager<T, B>;
    private newItemInputs: string[];
    private createNewItem: (s: string[]) => T;
    private createConfirmMessage: (t: T) => string;
    private searchAlgorithmChoices: Choices<T, B>[];

    constructor(
        manager: Manager<T, B>,
        newItemInputs: string[],
        createNewItem: (s: string[]) => T,
        createConfirmMessage: (t: T) => string,
        searchAlgorithmChoices: Choices<T, B>[],
    ) {
        this.#manager = manager;
        this.newItemInputs = newItemInputs;
        this.createNewItem = createNewItem;
        this.createConfirmMessage = createConfirmMessage;
        this.searchAlgorithmChoices = searchAlgorithmChoices;
    }

    async getNewSearchTerm(message: string): Promise<string> {
        return input({
            message,
            theme: { prefix: "" },
        });
    }

    async getNewSearchAlgorithm(): Promise<Searching<T, B>> {
        return await select({
            message: "Search contacts by: ",
            choices: this.searchAlgorithmChoices,
            theme: { prefix: "" },
        });
    }

    async getNewItem(): Promise<T> {
        let c = false;
        let item: T;
        while (true) {
            const inputs: string[] = [];
            for (const message of this.newItemInputs) {
                const i = await input({
                    message,
                    theme: { prefix: "" },
                });
                inputs.push(i);
            }

            item = this.createNewItem(inputs);

            const confirmMessage = this.createConfirmMessage(item);

            c = await confirm({
                message: confirmMessage,
                theme: { prefix: "" },
            });
            if (!c) {
                screen.clearAllFromCursor(2, 0);
                continue;
            }
            break;
        }

        return item;
    }

    async addItem() {
        this.#manager.add(await this.getNewItem());
    }

    async removeItem() {
        this.#manager.remove(await this.getNewItem());
    }

    listItems() {
        this.#manager.list();
    }

    async searchItem() {
        let searchAlgorithm = await this.getNewSearchAlgorithm();
        let searchTerm = (await this.getNewSearchTerm(
            `Enter the ${searchAlgorithm.searchBy()} to search by: `,
        )) as B;
        this.#manager.setSearchAlgorithm(searchAlgorithm);
        return this.#manager.search(searchTerm);
    }
}
