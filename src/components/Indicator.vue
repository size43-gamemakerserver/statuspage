<style scoped>
    .count {
        background: rgba(0, 0, 0, 0.2) !important;
        padding: 4px;
    }
    .good {
        background: rgba(53, 255, 53, 0.2) !important;
    }
    .meh {
        background: rgba(190, 146, 0, 0.2) !important;
    }
    .bad {
        background: rgba(255, 0, 0, 0.2) !important;
    }
    td {
        padding: 4px;
        white-space: nowrap;
    }
</style>

<template>
    <tr>
        <td :class="[
            'count',
            {
                'good': value <= good,
                'meh': value > good && value <= bad,
                'bad': value > bad,
            }
        ]"><slot></slot></td>
        <td>{{ itemName }}</td>
    </tr>
</template>


<script>
export default {
    name: 'Indicator',
    props: {
        itemName: String,
        good: Number,
        bad: Number,
        value: Number,
    }
}
</script>