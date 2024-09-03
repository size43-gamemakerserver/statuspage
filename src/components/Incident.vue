<style scoped>
    ul {
        list-style-type: none;
        padding-left: 0;
    }

    li {
        text-align: left;
        padding: 1em;
    }

    li small {
        display: block;
        margin-bottom: 2px;
    }

    .closed {
        opacity: 0.3;
    }

    h3 {
        margin: 0;
    }

    small {
        padding: 0;
        color: #666;
    }

    b.tag {
        display: inline-block;
        padding: 2px;
        border: 2px solid #000;
        border-radius: 4px;
        padding-left: 8px;
        padding-right: 8px;
        cursor: default;
    }

    b.entry-Notice {
        background: #AAAAAA;
    }

    b.entry-Proactive, b.entry-Update {
        background: #a7e56f;
        border-color: #5aab11;
    }

    b.entry-Minor {
        background: #efdb6d;
        border-color: #d9ba17;
    }

    b.entry-Major {
        background: #ffa950;
        border-color: #d97917;
    }

    b.entry-Critical {
        background: #ff0000;
        color: #FFFFFF;
        border-color: #880000;
    }

    div {
        text-align: left;
    }

    .root {
        margin-bottom: 40px;
    }

    .human-needed {
        background: #ffc1b3;
    }
</style>

<template>
    <div :class="{
            'root': true,
            'closed': data.closed != null
        }">
        <h3>{{ data.title }}</h3>

        <ul>
            <li :class="{
                'human-needed': log.humanNeeded,    
            }" v-for="(log, index) in data.logs" :key="index">
                <small>{{ relativeTime(log.loggedAt) }}</small>
                <b :class="'tag entry-' + log.severity">{{ log.severity }}</b>
                {{ log.description }}
            </li>
        </ul>
    </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
    name: 'Node',
    props: {
        data: Object,
    },
    methods: {
        relativeTime(date) {
            return dayjs(date).fromNow();
        }
    }
}
</script>