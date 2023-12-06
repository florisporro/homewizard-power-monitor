<script lang="ts">
	import Watt from './watt.svelte';
	export let averagePower: number | undefined;
	export let voltage: number | undefined;
	export let current: number | undefined;
	export let power: number | undefined;
</script>

<div class="border bg-slate-100 dark:bg-slate-800 border-gray-300 dark:border-white mb-2 rounded">
	<h2 class="text-lg font-bold uppercase text-center mb-2"><slot /></h2>
	<p class="text-[3rem] font-bold text-center tabular-nums">
		<Watt power={averagePower} colorize={true}></Watt>
	</p>
	<div class="grid gap-2 grid-cols-2 p-6">
		<div class="flex flex-row justify-between bg-slate-500 dark:bg-slate-500 rounded p-4">
			<p class="text-white font-bold">Volt</p>
			<p class="text-white font-bold">
				{Math.round(voltage)}v
			</p>
		</div>
		<div class="flex flex-row justify-between bg-slate-500 dark:bg-slate-500 rounded p-4">
			<p class="text-white font-bold">Current</p>
			<p class="text-white font-bold">
				{Math.round(current)}A
			</p>
		</div>
		<div class="flex flex-row justify-between bg-slate-500 dark:bg-slate-500 rounded p-4">
			<p class="text-white font-bold">Max 25A</p>
			<p class="text-white font-bold">
				<Watt power={(voltage || 0) * 25}></Watt>
			</p>
		</div>
		<div class="flex flex-row justify-between bg-slate-500 dark:bg-slate-500 rounded p-4">
			<p class="text-white font-bold">Actual</p>
			<p class="text-white font-bold">
				<Watt {power}></Watt>
			</p>
		</div>
	</div>
</div>
