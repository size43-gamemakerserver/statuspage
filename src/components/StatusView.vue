<style scoped>
    .content {
        max-width: 1400px;
        margin: auto;
    }

    .nodelist, .incidents, .chart {
        padding: 0 2em;
        margin-bottom: 4em;
    }

    .instances {
        display: flex;
        flex-direction: row;
    }

    @media (max-width : 1000px) {
        .instances {
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
</style>

<template>
    <div class="content">
        <h1>GameMaker Server Status</h1>
        <div class="chart">
            <Chart :points="loadHistory" />
        </div>

        <h1 v-if="status !== null">Detailed view</h1>
        <div class="nodelist" v-if="status !== null">
            <Node :status="status.proxy" :isProxy="true"></Node>
            <div class="connections">
                <svg width="100%" height="40"  v-for="(instance, index) in status.instances" :key="index">
                    <line x1="50%" y1="0" x2="50%" y2="350" :stroke="instance.highLoad ? '#FF0000' : instance.isDefault ? '#1F85DE' : '#555'" stroke-width="8" />
                </svg>
            </div>
            <div class="instances">
                <Node :status="instance" :isProxy="false" v-for="(instance, index) in status.instances" :key="index"></Node>
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

export default {
    name: 'StatusView',
    components: {
        Node,
        Chart,
        Incident,
    },
    props: {
        status: Object,
        loadHistory: Array,
        incidents: Array,
    }
}
</script>