import { TodoApiStorage } from "./TodoApiStorage.js";

class TodoApiRequest {
    static async get(uid) {
        try {
            const url = TodoApiStorage.get();
            if (!url || !uid) {
                return [];
            }

            const response = await fetch(`${url}?uid=${uid}`);
            const result = await response.json();

            if (result.code === 200) {
                return result.data || [];
            }

            return [];
        } catch (error) {
            return [];
        }
    }

    static async set(uid, todos) {
        try {
            const url = TodoApiStorage.get();
            if (!url || !uid) {
                return false;
            }

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    uid: uid,
                    data: todos,
                }),
            });

            const result = await response.json();

            if (result.code !== 200) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }
}

export { TodoApiRequest };
