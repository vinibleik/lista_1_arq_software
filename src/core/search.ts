export default interface Searching<T, B> {
    search(list: T[], searchTerm: B): T[];
    searchBy(): string;
}
