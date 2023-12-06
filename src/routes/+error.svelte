<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex items-center justify-center h-screen">
	<div
		class="stream-card border bg-slate-100 dark:bg-slate-800 border-gray-300 dark:border-white mb-2 rounded p-10"
	>
		<h2 class="text-lg font-bold uppercase text-center mb-2">{$page?.error?.message}</h2>
	</div>
</div>
