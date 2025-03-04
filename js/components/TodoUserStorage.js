const key = "todo_uid";
class TodoUserStorage {
    static set(name) {
        localStorage.setItem(key, name);
    }

    static get() {
        return localStorage.getItem(key);
    }
}

export { TodoUserStorage };
