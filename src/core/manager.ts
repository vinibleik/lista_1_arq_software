import Searching from "./search.js";

export default interface Manager<T, B> {
    setSearchAlgorithm(searchAlgorithm: Searching<T, B>): void;
    add(item: T): void;
    remove(item: T): void;
    list(): void;
    search(searchTerm: B): T[];
    searchBy(): string;
}
