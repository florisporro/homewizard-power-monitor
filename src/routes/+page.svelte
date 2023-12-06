<script lang="ts">
	import { onMount } from 'svelte';
	import type { Powermeter } from '../app';
	import Watt from '$lib/components/watt.svelte';
	import Phase from '$lib/components/phase.svelte';
	import { browser } from '$app/environment';
	import * as Tone from 'tone';

	let data: Powermeter;
	let alertsEnabled: boolean = false;

	onMount(async () => {
		const fetchData = async () => {
			const response = await fetch('http://192.168.15.84/api/v1/data');
			const jsonData = await response.json();
			data = jsonData;
		};

		setInterval(fetchData, 1000);
		setInterval(calculateAverage, 5000);
	});

	function calculateAverage() {
		if (typeof data?.active_power_w === 'number') total_power_w.push(data.active_power_w);
		if (typeof data?.active_power_l1_w === 'number') power_l1_w.push(data.active_power_l1_w);
		if (typeof data?.active_power_l2_w === 'number') power_l2_w.push(data.active_power_l2_w);
		if (typeof data?.active_power_l3_w === 'number') power_l3_w.push(data.active_power_l3_w);

		// Remove values older than 5 minutes (60 * 5 = 300 seconds)
		if (total_power_w.length > 12) total_power_w.shift();
		if (power_l1_w.length > 12) power_l1_w.shift();
		if (power_l2_w.length > 12) power_l2_w.shift();
		if (power_l3_w.length > 12) power_l3_w.shift();

		// Calculate 5 minute average
		avg_total_power_w = total_power_w.reduce((a, b) => a + b, 0) / total_power_w.length;
		avg_power_l1_w = power_l1_w.reduce((a, b) => a + b, 0) / power_l1_w.length;
		avg_power_l2_w = power_l2_w.reduce((a, b) => a + b, 0) / power_l2_w.length;
		avg_power_l3_w = power_l3_w.reduce((a, b) => a + b, 0) / power_l3_w.length;
	}

	let total_power_w: number[] = [];
	let power_l1_w: number[] = [];
	let power_l2_w: number[] = [];
	let power_l3_w: number[] = [];
	let avg_total_power_w: number = 0;
	let avg_power_l1_w: number = 0;
	let avg_power_l2_w: number = 0;
	let avg_power_l3_w: number = 0;

	let maxCurrent = 25; // Define your maximum average here
	let exceeding: string[] = [];
	$: {
		exceeding = [];
		let maxPower = data?.active_voltage_l1_v * maxCurrent;
		if (avg_power_l1_w > maxPower) {
			exceeding.push('fase 1');
		}

		maxPower = data?.active_voltage_l2_v * maxCurrent;
		if (avg_power_l2_w > maxPower) {
			exceeding.push('fase 2');
		}

		maxPower = data?.active_voltage_l3_v * maxCurrent;
		if (avg_power_l3_w > maxPower) {
			exceeding.push('fase 3');
		}
	}
	setInterval(() => {
		console.log(exceeding);
		if (exceeding.length > 0 && alertsEnabled) {
			if (browser) {
				var msg = new SpeechSynthesisUtterance();
				msg.text = 'Warning! ' + exceeding.join(' and ') + 'exceeding maximum power';
				window.speechSynthesis.speak(msg);
			}
		}
	}, 10000);

	setInterval(() => {
		console.log(exceeding);
		if (exceeding.length > 0 && alertsEnabled) {
			if (browser) {
				//create a synth and connect it to the main output (your speakers)
				const synth = new Tone.Synth().toDestination();

				//play a middle 'C' for the duration of an 8th note
				synth.triggerAttackRelease('C5', '4n');
			}
		}
	}, 1000);
</script>

<svelte:head>
	<title>⚡{Math.round((data?.active_power_w / 1000) * 100) / 100} kW</title>
</svelte:head>

<div class="{exceeding.length > 0 ? 'bg-red-800' : 'bg-green-800'} w-100 py-5 text-white">
	<h2 class="uppercase text-center text-3xl font-bold text-white">Alerts</h2>
	<div class="text-center mt-4">
		<label for="alerts">Sound notifications</label>
		<input type="checkbox" id="alerts" bind:checked={alertsEnabled} />
	</div>
	{#if exceeding.length > 0}
		<div
			class="mx-auto container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-10 py-5"
		>
			{#each exceeding as phase}
				<div class="bg-red-600 mb-2 rounded p-1">
					<h2 class="text-lg font-bold uppercase text-center mb-2">{phase}</h2>
					<p class="text-center">Exceeding 25A</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<main class="mx-auto py-10 px-[3rem]">
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-10">
		<div
			class="border bg-slate-100 dark:bg-slate-800 border-gray-300 dark:border-white mb-2 rounded p-1"
		>
			<h2 class="text-lg font-bold uppercase text-center mb-2">Total</h2>
			<p class="text-[3rem] font-bold text-center tabular-nums">
				<Watt power={avg_total_power_w} colorize={true}></Watt>
			</p>
			<p class="text-center"><Watt power={data?.active_power_w}></Watt></p>
		</div>

		<Phase
			averagePower={avg_power_l1_w}
			current={data?.active_current_l1_a}
			voltage={data?.active_voltage_l1_v}
			power={data?.active_power_l1_w}>Fase 1</Phase
		>
		<Phase
			averagePower={avg_power_l2_w}
			current={data?.active_current_l2_a}
			voltage={data?.active_voltage_l2_v}
			power={data?.active_power_l2_w}>Fase 2</Phase
		>
		<Phase
			averagePower={avg_power_l3_w}
			current={data?.active_current_l3_a}
			voltage={data?.active_voltage_l3_v}
			power={data?.active_power_l3_w}>Fase 3</Phase
		>
	</div>
</main>
