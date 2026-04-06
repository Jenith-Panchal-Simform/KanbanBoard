const key = "kanbanData";

export function getData() {
    return JSON.parse(localStorage.getItem(key)) || {
        todo: [],
        progress: [],
        validation: [],
        completed: []
    };
}

export function saveData(data) {
    localStorage.setItem(key, JSON.stringify(data));
}