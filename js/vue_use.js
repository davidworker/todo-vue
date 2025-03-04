// const createApp = Vue.createApp;
// const ref = Vue.ref;
const { createApp, ref } = Vue;

// options API

const options = {
    data() {
        return {
            name: "David",
        };
    },
    methods: {
        setName(name) {
            this.name = name;
        },
    },
};

const optionsApp = createApp(options);
optionsApp.mount("#options-app");

// composition API

const compositionApp = createApp({
    setup() {
        const name = ref("David");
        const setName = (newName) => {
            name.value = newName;
        };
        return { name, setName };
    },
});

compositionApp.mount("#composition-app");
