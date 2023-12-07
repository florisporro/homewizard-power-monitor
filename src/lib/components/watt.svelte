<script lang="ts">
	export let power: number;
	export let colorize: boolean = false;
	let unit = 'W';
	let displayPower: number;
	let lastPower: number;
	let arrow: string = '';
	let color: string = '';
	let difference: number;

	$: {
		if (power >= 1000) {
			displayPower = Number((power / 1000).toFixed(2));
			unit = 'kW';
		} else {
			displayPower = Math.round(power);
			unit = 'W';
		}

		if (lastPower !== undefined && colorize) {
			difference = Math.abs(power - lastPower);
			if (difference > 20) {
				arrow = power > lastPower ? '↑' : '↓';
				color = power > lastPower ? 'text-red-600' : 'text-green-600';
			} else {
				arrow = '';
				color = '';
			}
		}

		lastPower = power;
	}
</script>

<span class={color}>{displayPower} {unit}{arrow}</span>
