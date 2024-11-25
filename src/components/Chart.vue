<template>
    <svg width="100%" :height="height" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <polyline
        fill="#FA6B6B"
        stoke-width="2"
        :points="redStr"
        />
        <polyline
        fill="#FFC060"
        stoke-width="2"
        :points="orangeStr"
        />
        <polyline
        fill="#0072ab30"
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
        height: String,
    },
    computed: {
        pointsStr: function () {
            var s = "1000,200 0,200";

            if (this.points) {
                console.log(this.points, this.points.length, 0 < this.points.length);
                
                var max = Math.max.apply(null, this.points.map(p => p.l)) * 1.1;
                for(var i = 0; i < this.points.length; i++)
                {
                    s += " " + Math.round((i * 1000 / (this.points.length - 1))) + "," + (100 - (this.points[i].l * 100 / max));
                }
            }

            return s;
        },
        redStr: function () {
            var s = "1000,200 0,200";

            if (this.points) {
                console.log(this.points, this.points.length, 0 < this.points.length);
                for(var i = 0; i < this.points.length; i++)
                {
                    let y = (100 - (this.points[i].a ? 100 : 0));
                    s += " " + Math.round(((i - 1) * 1000 / (this.points.length - 1))) + "," + y;
                    s += " " + Math.round((i * 1000 / (this.points.length - 1))) + "," + y;
                }
            }

            return s;
        },
        orangeStr: function () {
            var s = "1000,200 0,200";

            if (this.points) {
                console.log(this.points, this.points.length, 0 < this.points.length);
                for(var i = 0; i < this.points.length; i++)
                {
                    let y = (100 - (this.points[i].r && !this.points[i].a ? 100 : 0));
                    s += " " + Math.round(((i - 1) * 1000 / (this.points.length - 1))) + "," + y;
                    s += " " + Math.round((i * 1000 / (this.points.length - 1))) + "," + y;
                }
            }

            return s;
        },
    }
}
</script>