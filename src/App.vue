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
                instances: [],
                forwardNodes: [],
            }
        };
    },
    mounted: async function () {
        var self = this;
        var hosts = [
            'https://gms-status.shuttleapp.rs/',
            'https://gms-status.infinityfreeapp.com/',
            'https://www.gamemakerserver.com/dynamic/status.php',
        ];
        var currentHost = 0;
        async function update() {
            try {
                let n = currentHost % hosts.length;
                console.log("Fetching status from", n, hosts[n]);
                var response = await fetch(hosts[n], { signal: AbortSignal.timeout(5000) });
                
                if (response.status == 200) {
                    var json = await response.json();

                    self.loadHistory = json.extendedLoadHistory;
                    self.incidents = json.incidents;
                    self.status = {
                        proxy: json.status.filter(x => x.isProxy)[0],
                        instances: json.status.filter(x => !x.isProxy),
                        forwardNodes: json.forwardNodes,
                    };
                } else {
                    console.log("Received non-200 HTTP status:", response);
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

                    currentHost += 1;
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
                currentHost += 1;
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

.value-table {
    padding: 0;
    border: 0;
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
}

.value-table td {
    padding: 4px;
    white-space: nowrap;
}

.value-table .count {
    background: rgba(0, 0, 0, 0.2);
    padding: 4px;
}

.value-table .danger, .value-table .danger a {
    background: #ff0000;
    color: #ffffff;
}

.expandable {
    position: relative;
    cursor: default;
    text-decoration: underline; 
    text-underline-position: under; 
    text-decoration-style: dotted;
}

.expandable .expanded {
    position: absolute;
    display: block;
    pointer-events: none;

    right: 0;
    top: 0;

    z-index: 99;
    transition: all .15s;
    opacity: 0;
    transform: rotateX(20deg) rotateY(20deg) scale(0.8);
    transform-origin: 100% 0;
}

.expandable.left .expanded {
    left: 0;
    right: auto;
    transform: rotateX(20deg) rotateY(-20deg) scale(0.8);
    transform-origin: 0 0;
}

.expandable.middle .expanded {
    left: -150px;
    right: auto;
    transform: rotateY(-90deg) scale(0.8);
    transform-origin: 50% 0;
}

.expandable:hover .expanded, .expandable .expanded:hover {
    padding: 0;
    opacity: 1;
    transform: rotateX(0) rotateY(0);
}

.box {
    border: 1px solid #888;
    box-shadow: 0px 0px 16px #ddd;
    background: #fafafa;
    position: relative;
    color: #000000;
}

a {
    text-decoration: none;
    color: #000000;
}

.tooltip {
    width: 300px;
}

.tooltip p {
    padding: 16px !important;
    margin: 0;
    text-align: justify;
    font-weight: 100;
}
</style>
