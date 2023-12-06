// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

export interface Powermeter {
	wifi_ssid: string;
	wifi_strength: number;
	smr_version: number;
	meter_model: string;
	unique_id: string;
	active_tariff: number;
	total_power_import_kwh: number;
	total_power_import_t1_kwh: number;
	total_power_import_t2_kwh: number;
	total_power_export_kwh: number;
	total_power_export_t1_kwh: number;
	total_power_export_t2_kwh: number;
	active_power_w: number;
	active_power_l1_w: number;
	active_power_l2_w: number;
	active_power_l3_w: number;
	active_voltage_l1_v: number;
	active_voltage_l2_v: number;
	active_voltage_l3_v: number;
	active_current_l1_a: number;
	active_current_l2_a: number;
	active_current_l3_a: number;
	voltage_sag_l1_count: number;
	voltage_sag_l2_count: number;
	voltage_sag_l3_count: number;
	voltage_swell_l1_count: number;
	voltage_swell_l2_count: number;
	voltage_swell_l3_count: number;
	any_power_fail_count: number;
	long_power_fail_count: number;
	total_gas_m3: number;
	gas_timestamp: number;
	gas_unique_id: string;
	external: External[];
}

export interface External {
	unique_id: string;
	type: string;
	timestamp: number;
	value: number;
	unit: string;
}
