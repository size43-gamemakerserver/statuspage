<style scoped>
    .node {
        flex: 1 1 0;
        padding: 0;
        margin: 4px;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        position: relative;
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
        white-space: nowrap;
    }

    .node .header .title > * {
        white-space: normal;
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

    .other {
        color: #aaa;
        cursor: default;
    }

    .connector {
        position: absolute;
        width: 100%;
    }

    .connector.top, .connector.bottom svg {
        top: 0;
    }

    .connector.bottom, .connector.top svg {
        bottom: 0;
    }

    .connector svg {
        position: absolute;
        left: 0;
        right: 0;
        z-index: -1000;
    }
</style>

<template>
   <div :class="[
       'node', 'box',
        { 
           'danger': highLoad,
           'default': isDefault,
        }
    ]">
        <div :class="{
            'connector': true,
            'top': connector == 'top',
            'bottom': connector == 'bottom',
        }" v-if="connector">
            <svg width="100%" height="40">
                <line x1="50%" y1="0" x2="50%" y2="350" :stroke="highLoad ? '#FF0000' : isDefault ? '#1F85DE' : '#555'" stroke-width="8" />
            </svg>
        </div>
        <div class="header">
            <div class="expandable left">
                <slot name="load"></slot>
                <div class="expanded box">
                    <table class="value-table">
                        <slot name="stats"></slot>
                    </table>
                </div>
            </div>
            <h3 class="title">
                <slot name="title"></slot>
            </h3>
            <div :class="{
                'expandable': $slots.counts ? true : false,
            }" v-if="$slots.count">
                <slot name="count"></slot>
                <div class="expanded box" v-if="$slots.counts">
                    <table class="value-table">
                        <slot name="counts"></slot>
                    </table>
                </div>
            </div>
        </div>
        <table class="value-table">
            <slot name="body"></slot>
        </table>
        <div class="overlay seethrough" v-if="locked">
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
        locked: Boolean,
        highLoad: Boolean,
        isDefault: Boolean,
        connector: String,
    },
}
</script>