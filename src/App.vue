<template>
    <div id="app">
        <StatusView :status="status" :loadHistory="loadHistory" :incidents="incidents" />
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
                { l: 1, a: false },
                { l: 4, a: false },
                { l: 66, a: false },
                { l: 77, a: false },
                { l: 54, a: false },
                { l: 67, a: false },
                { l: 13, a: false }
            ],
            incidents: [],
            status: {
                proxy: {},
                instances: []
            }
        };
    },
    mounted: async function () {
        var self = this;
        async function update() {
            try {
                var response = await fetch('https://gamemakerserver.com/dynamic/status.php');
                if (response.status == 200) {
                    var json = await response.json();

                    self.loadHistory = json.extendedLoadHistory;
                    self.incidents = json.incidents;
                    self.status = {
                        proxy: json.status.filter(x => x.isProxy)[0],
                        instances: json.status.filter(x => !x.isProxy),
                    };
                } else {
                    console.log("Received status:", response);
                    self.status = null;
                    self.incidents = [
                        {
                            "title": "Retrieving server status failed",
                            "closed": null,
                            "logs": [
                                {
                                    "severity": "Critical",
                                    "humanNeeded": true,
                                    "description": "Unable to fetch server status. The server returned the following error: " + response.statusText + " (" + response.status + ").",
                                    "loggedAt": Date.now(),
                                }
                            ]
                        }
                    ];
                }
            } catch (e) {
                self.status = null;
                self.incidents = [
                    {
                        "title": "Retrieving server status failed",
                        "closed": null,
                        "logs": [
                            {
                                "severity": "Critical",
                                "humanNeeded": true,
                                "description": "Fetching the server status failed with the following error: " + e.message,
                                "loggedAt": Date.now(),
                            }
                        ]
                    }
                ];

                console.log("Error while fetching status page:", e);
            }
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
