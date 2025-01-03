<style scoped>
    .content {
        max-width: 1400px;
        margin: auto;
    }

    .nodecontainer, .incidents, .chart {
        padding: 0 2em;
        margin-bottom: 4em;
    }

    .nodes {
        display: flex;
        flex-direction: row;
        margin-top: 16px;
        margin-bottom: 16px;
    }

    .nodes.small-rhs {
        justify-content: end;
    }

    @media (max-width : 1000px) {
        .nodes {
            flex-direction: column;
        }
    }

    .internet {
        border: dotted 2px #000;
        text-align: center;
        margin: 4px;
        padding: 20px;
    }

    .connections {
        margin-top: -4px;
        margin-bottom: -4px;
        display: flex;
        flex-direction: row;
    }

    .other {
        color: #aaa;
        cursor: default;
    }
</style>

<template>
    <div class="content">
        <h1>GameMaker Server Status</h1>
        <div class="chart">
            <Chart :points="loadHistory" :height="200" />
        </div>

        <h1 v-if="status !== null">Detailed view</h1>
        <div class="nodecontainer" v-if="status !== null">
            <div class="nodes small-rhs">
                <Node connector="bottom" :locked="false" :highLoad="node.highLoad" :isDefault="node.identifier == 'M'" v-for="(node, index) in status.forwardNodes" :key="index">
                    <template v-slot:title>
                        Entry {{ node.identifier }}
                    </template>
                    <template v-slot:load>
                        {{ makePercentage(node.cpu) }}%
                    </template>
                    <template v-slot:stats>
                        <Indicator item-name="CPU" :good="0.25" :bad="0.75" :value="node.cpu">{{ makePercentage(node.cpu) }}%</Indicator>
                        <Indicator item-name="packets in" :good="500" :bad="2000" :value="node.rx">{{ twoDigits(node.rx / 1000) }}kpps</Indicator>
                        <Indicator item-name="packets filtered" :good="500" :bad="2000" :value="node.filtered">{{ twoDigits(node.filtered / 1000) }}kpps</Indicator>
                    </template>
                    <template v-slot:count>
                        {{ node.num }}
                    </template>
                    <template v-slot:counts>
                        <Indicator item-name="connections" :value="node.num">
                            {{ node.num }}
                        </Indicator>
                        <Indicator item-name="valid connections" :value="node.validNum">
                            {{ node.validNum }}
                        </Indicator>
                    </template>
                    <template v-slot:body>
                        <Chart :points="node.history" :height="60" />
                    </template>
                </Node>
            </div>
            
            <Node :locked="false" :highLoad="status.proxy.highLoad" v-if="status.proxy != undefined" :isDefault="false">
                <template v-slot:title>
                    Reverse Proxy
                </template>
                <template v-slot:load>
                    {{ makePercentage(status.proxy.cpu) }}%
                </template>
                <template v-slot:stats>
                    <Indicator item-name="CPU" :good="0.25" :bad="0.75" :value="status.proxy.cpu">{{ makePercentage(status.proxy.cpu) }}%</Indicator>
                    <Indicator item-name="RAM" :good="50" :bad="150" :value="status.proxy.ram">{{ status.proxy.ram }}MiB</Indicator>
                </template>
                <template v-slot:body>
                    <p>
                        The reverse proxy node divides connections over the available instances.
                    </p>
                </template>
            </Node>
            <div class="nodes">
                <Node connector="top" :locked="instance.locked" :highLoad="instance.highLoad" :isDefault="instance.isDefault" v-for="(instance, index) in status.instances" :key="index">
                    <template v-slot:title>
                        Instance #{{ instance.nodeId }}
                        <span class="expandable middle" v-if="instance.isDefault">
                        *
                        <div class="box expanded tooltip">
                            <p>
                                This is the default node for new connections. If a game does not have sessions running on other nodes, a new session will be started here.
                            </p>
                        </div>
                        </span>
                    </template>
                    <template v-slot:load>
                        {{ makePercentage(instance.cpu) }}%
                    </template>
                    <template v-slot:stats>
                        <Indicator item-name="CPU" :good="0.25" :bad="0.75" :value="instance.cpu">{{ makePercentage(instance.cpu) }}%</Indicator>
                        <Indicator item-name="RAM" :good="500" :bad="1000" :value="instance.ram">{{ instance.ram }}MiB</Indicator>
                        <Indicator item-name="Min. ping" :good="50" :bad="150" :value="instance.minPing">{{ instance.minPing }}ms</Indicator>
                        <Indicator item-name="Avg. ping" :good="200" :bad="500" :value="instance.avgPing">{{ instance.avgPing }}ms</Indicator>
                        <Indicator item-name="Avg. loop" :good="5" :bad="10" :value="instance.avgTick + instance.avgReceive">{{ twoDigits(instance.avgTick + instance.avgReceive) }}ms</Indicator>
                        <Indicator item-name="Error rate" :good="3" :bad="6" :value="instance.errorRate">{{ twoDigits(instance.errorRate) }}</Indicator>
                    </template>
                    <template v-slot:count>
                        {{ instance.games.map(x => x.connected).reduce((a, b) => a + b, 0) }}
                    </template>
                    <template v-slot:counts>
                        <Indicator item-name="connected" :value="instance.games.map(x => x.connected).reduce((a, b) => a + b, 0)">
                            {{ instance.games.map(x => x.connected).reduce((a, b) => a + b, 0) }}
                        </Indicator>
                        <Indicator item-name="logged in" :value="instance.games.map(x => x.loggedIn).reduce((a, b) => a + b, 0)">
                            {{ instance.games.map(x => x.loggedIn).reduce((a, b) => a + b, 0) }}
                        </Indicator>
                    </template>
                    <template v-slot:body>
                        <table class="value-table">
                            <tr :class="{ 
                                danger: game.highLoad,
                            }" v-for="(game, index) in instance.games" :key="index">
                                <td class="count expandable left">
                                    {{ game.connected }}
                                    <div class="expanded box">
                                        <table class="value-table">
                                            <tr>
                                                <td class="count">{{ game.connected }}</td>
                                                <td>connected</td>
                                            </tr>
                                            <tr>
                                                <td class="count">{{ game.loggedIn }}</td>
                                                <td>logged in</td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                                <td>
                                    <a :href="`https://gamemakerserver.com/en/games/${game.id}/`" v-if="game.id != 0">
                                        {{ game.title }}
                                    </a>
                                    <span v-if="game.id == 0" class="other">
                                        {{ game.title}}
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </template>
                </Node>
            </div>
        </div>
        
        <h1>Incidents</h1>
        <div class="incidents">
            <Incident :data="incident" v-for="(incident, index) in incidents" :key="index"></Incident>
        </div>
    </div>
</template>

<script>
import Node from './Node.vue'
import Chart from './Chart.vue'
import Incident from './Incident.vue'
import Indicator from './Indicator.vue'

export default {
    name: 'StatusView',
    components: {
        Node,
        Chart,
        Incident,
        Indicator,
    },
    props: {
        status: Object,
        loadHistory: Array,
        incidents: Array,
    },
    methods: {
        twoDigits(value) {
            return (value * 1).toFixed(2);
        },
        makePercentage(value) {
            return (value * 100).toFixed(1)
        }
    }
}
</script>