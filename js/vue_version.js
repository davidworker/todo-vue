import { TodoApiStorage } from "./components/TodoApiStorage.js";
import { TodoItemStorage } from "./components/TodoItemStorage.js";
import { TodoUserStorage } from "./components/TodoUserStorage.js";

const { createApp } = Vue;

const todoOptions = {
    data() {
        return {
            user: {
                name: "",
            },
            newTodo: "",
            todos: [],
            apiUrl: "",
        };
    },
    methods: {
        async setUserName(isChanging = true) {
            try {
                const result = await window.Swal.fire({
                    title: isChanging ? "更換使用者 ID" : "請輸入使用者 ID",
                    input: "text",
                    inputLabel: "這是必填欄位",
                    inputPlaceholder: "請輸入您的使用者 ID",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: "確認",
                    showCancelButton: isChanging,
                    cancelButtonText: "取消",
                    inputValidator: (value) => {
                        if (!value) {
                            return "使用者 ID 不能為空！";
                        }
                    },
                });

                if (result.isConfirmed && result.value) {
                    this.user.name = result.value;
                    this.setUserToStorage(result.value);
                }
            } catch (error) {
                console.error("輸入使用者 ID 時發生錯誤:", error);
                // 如果發生錯誤，稍後重試
                setTimeout(() => this.setUserName(isChanging), 1000);
            }
        },
        setUserToStorage(name) {
            TodoUserStorage.set(name);
        },
        getUserFromStorage() {
            return TodoUserStorage.get();
        },
        addTodo() {
            if (this.newTodo.trim() === "") {
                Swal.fire({
                    title: "請輸入待辦事項",
                    icon: "warning",
                });
                return;
            }
            this.todos.push({
                id: Date.now().toString(),
                text: this.newTodo,
                completed: false,
            });
            this.newTodo = "";
            TodoItemStorage.set(this.todos);
        },
        deleteTodo(id) {
            this.todos = this.todos.filter((todo) => {
                return todo.id != id;
            });
            TodoItemStorage.set(this.todos);
        },
        toggleTodo(id) {
            this.todos = this.todos.map((todo) => {
                if (todo.id === id) {
                    todo.completed = !todo.completed;
                }
                return todo;
            });
            TodoItemStorage.set(this.todos);
        },
        async setApiUrl() {
            const result = await window.Swal.fire({
                title: "設定 API 位置",
                input: "url",
                inputLabel: "請輸入 API 位置",
                inputPlaceholder: "https://example.com/api/todo/",
                inputValue: this.apiUrl || "",
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: "確認",
                denyButtonText: "清除設定",
                cancelButtonText: "取消",
                inputValidator: (value) => {
                    if (value) {
                        try {
                            const url = new URL(value);
                            if (!url.protocol.startsWith("http")) {
                                return "請使用 HTTP 或 HTTPS 協議";
                            }
                        } catch (e) {
                            return "請輸入有效的 URL";
                        }
                    }
                },
            });

            if (result.isDenied) {
                this.apiUrl = "";
                TodoApiStorage.set("");
                return;
            }

            if (result.isConfirmed && result.value) {
                this.apiUrl = TodoApiStorage.protectUrl(result.value);
                TodoApiStorage.set(this.apiUrl);
                return;
            }
        },
    },
    mounted() {
        console.log("Todo app mounted");
        this.user.name = this.getUserFromStorage();
        if (!this.user.name) {
            this.setUserName();
        }
        this.todos = TodoItemStorage.get();
        this.apiUrl = TodoApiStorage.get();
    },
};

const todoApp = createApp(todoOptions);
todoApp.mount("#app");
