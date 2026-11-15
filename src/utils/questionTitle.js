// the dataset has no title, so use the first sentence of the statement
export function questionTitle(statement) {
    const text = statement.replace(/\s+/g, ' ').trim();
    const end = text.search(/[.?!]\s/);
    const first = end > 0 ? text.slice(0, end + 1) : text;
    return first.length > 110 ? first.slice(0, 107) + '...' : first;
}