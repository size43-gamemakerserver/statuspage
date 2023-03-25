<template>
    <div id="app">
        <StatusView :status="status" :loadHistory="loadHistory" :incidents="incidents"/>
    </div>
</template>

<script>
import StatusView from './components/StatusView.vue'

export default {
    name: 'App',
    components: {
        StatusView
    },
    data: () => {
        return {
            loadHistory: [
                1, 4, 66, 77,
                54, 67, 13
            ],
            status: {
                proxy: {},
                instances: []
            }
        };
    },
    mounted: async function () {
        var self = this;
        async function update() {
            var response = await fetch('https://gamemakerserver.com/dynamic/status.php');
            var json = await response.json();

            self.loadHistory = json.loadHistory;
            self.incidents = json.incidents;
            self.status = {
                proxy: json.status.filter(x => x.isProxy)[0],
                instances: json.status.filter(x => !x.isProxy),
            };
        }

        await update();
        window.setInterval(update, 10 * 1000);
    }
}
</script>

<style>
* {
    box-sizing: border-box;
}

body {
    padding: 0;
    margin: 0;
}

#app {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-align: center;
}
</style>
