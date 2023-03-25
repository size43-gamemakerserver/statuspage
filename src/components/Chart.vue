<template>
    <svg width="100%" height="200" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <polyline
        fill="#CBDDE6"
        stroke="#97BBCD"
        stoke-width="2"
        :points="pointsStr"
        />
    </svg>
</template>

<script>
export default {
    name: 'Chart',
    props: {
        points: Array,
    },
    computed: {
        pointsStr: function () {
            var s = "1000,200 0,200";

            console.log(this.points, this.points.length, 0 < this.points.length);
            
            var max = Math.max.apply(null, this.points) * 1.1;
            for(var i = 0; i < this.points.length; i++)
            {
                s += " " + Math.round((i * 1000 / (this.points.length - 1))) + "," + (100 - (this.points[i] * 100 / max));
            }

            return s;
        }
    }
}
</script>