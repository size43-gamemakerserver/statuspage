<style scoped>
    .box {
        border: 1px solid #888;
        box-shadow: 0px 0px 16px #ddd;
        background: #fafafa;
        position: relative;
        color: #000000;
    }

    .node {
        flex: 1 1 0;
        padding: 0;
        margin: 4px;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
    }

    .box.danger, .danger .box {
        background: #d73000;
        color: #ffffff;
        border-color: #9e2000;
    }

    .danger td {
        color: #ffffff;
    }

    .node h3 {
        font-weight: 900;
        font-size: 1em;
        text-align: center;
        margin: 0;
        padding: 0;
    }

    .node .header {
        display: grid;
        grid-template-columns: [first] 20% auto [last] 20%;
        background: #F1FA8C;
        color: #000000;
    }

    .node.default .header {
        background: #1F85DE;
        color: #ffffff;
    }

    .node.danger .header {
        background: #d73000;
        color: #ffffff;
    }

    .node .header .title {
        text-align: center;
    }

    .node .header div:first-child {
        text-align: left;
    }

    .node .header div:last-child {
        text-align: right;
    }

    .node .header > * {
        padding: 0.8em;
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

    .expandable:hover .expanded, .expandable .expanded:hover {
        padding: 0;
        opacity: 1;
        transform: rotateX(0) rotateY(0);
    }

    .overlay {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .seethrough {
        background: rgba(0, 0, 0, 0.3);
    }

    .sideways {
        transform: rotateZ(-20deg);
    }

    .seethrough * {
        opacity: 0.7;
    }

    .scale-5x {
        transform: scale(5);
    }

    .full {
        font-size: 3.5em;
        font-weight: 900;
    }

    a {
        text-decoration: none;
        color: #000000;
    }

    .other {
        color: #aaa;
        cursor: default;
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

<template>
   <div :class="[
       'node', 'box',
        { 
           'danger': status.highLoad,
           'default': status.isDefault,
        }
    ]">
        <div class="header">
            <div class="expandable left">
                {{ status.cpu | cpu }}%
                <div class="expanded box">
                    <table class="value-table">
                        <Indicator item-name="CPU" :good="0.25" :bad="0.75" :value="status.cpu">{{ status.cpu | cpu }}%</Indicator>
                        <Indicator item-name="RAM" :good="isProxy ? 300 : 200" :bad="isProxy ? 600 : 400" :value="status.ram">{{ status.ram }}MiB</Indicator>
                        <Indicator v-if="!isProxy" item-name="Min. ping" :good="50" :bad="150" :value="status.minPing">{{ status.minPing }}ms</Indicator>
                        <Indicator v-if="!isProxy" item-name="Avg. ping" :good="200" :bad="500" :value="status.avgPing">{{ status.avgPing }}ms</Indicator>
                        <Indicator v-if="!isProxy" item-name="Avg. loop" :good="5" :bad="10" :value="status.avgTick + status.avgReceive">{{  status.avgTick + status.avgReceive | twoDigits }}ms</Indicator>
                        <Indicator item-name="Error rate" :good="3" :bad="6" :value="status.errorRate">{{ status.errorRate | twoDigits }}</Indicator>
                    </table>
                </div>
            </div>
            <h3 class="title" v-if="!isProxy">
                Instance #{{ status.nodeId }}
                <span class="expandable left" v-if="status.isDefault">
                *
                <div class="box expanded tooltip">
                    <p>
                        This is the default node for new connections. If a game does not have sessions running on other nodes, a new session will be started here.
                    </p>
                </div>
                </span>
            </h3>
            <h3 class="title" v-if="isProxy">Proxy</h3>
            <div class="expandable" v-if="!isProxy">
                {{ status.games.map(x => x.connected).reduce((a, b) => a + b, 0) }}
                <div class="expanded box">
                    <table class="value-table">
                        <tr>
                            <td class="count">{{ status.games.map(x => x.connected).reduce((a, b) => a + b, 0) }}</td>
                            <td>connected</td>
                        </tr>
                        <tr>
                            <td class="count">{{ status.games.map(x => x.loggedIn).reduce((a, b) => a + b, 0) }}</td>
                            <td>logged in</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="isProxy">
            <p>
                The proxy node is the entry point for all connections to the server. Here, incoming are inspected and sent on to the right instance. Outgoing messages are sent back to the correct connection.
            </p>
        </div>
        <table class="value-table" v-if="!isProxy">
            <tr :class="{ 
                danger: game.highLoad,
            }" v-for="(game, index) in status.games" :key="index">
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
        <div class="overlay seethrough" v-if="status.locked">
            <svg class="scale-5x" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <path d="m3,9v11h14V9M4,9V6c0-3.3 2.7-6 6-6c3.3,0 6,2.7 6,6v3H14V6c0-2.2-1.8-4-4-4-2.2,0-4,1.8-4,4v3"/>
            </svg>
            <div class="overlay sideways full">
                FULL
            </div>
        </div>
    </div>
</template>

<script>
import Indicator from './Indicator.vue'

export default {
    name: 'Node',
    components: {
        Indicator,
    },
    props: {
        status: Object,
        isProxy: Boolean,
    }
}
</script>