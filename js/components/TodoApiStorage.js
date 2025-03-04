const key = "todo_api_url";

class TodoApiStorage {
    static set(value) {
        localStorage.setItem(key, this.protectUrl(value));
    }

    static get() {
        return this.protectUrl(localStorage.getItem(key));
    }

    static protectUrl(url) {
        return url.endsWith("/") ? url : `${url}/`;
    }
}

export { TodoApiStorage };
