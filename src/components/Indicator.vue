<style scoped>
    .count {
        background: rgba(0, 0, 0, 0.2);
        padding: 4px;
    }
    .good {
        background: rgba(53, 255, 53, 0.2);
    }
    .meh {
        background: rgba(190, 146, 0, 0.2);
    }
    .bad {
        background: rgba(255, 0, 0, 0.2);
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