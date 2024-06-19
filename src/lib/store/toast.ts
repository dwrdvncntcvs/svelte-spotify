import { writable } from 'svelte/store';
import uniqid from 'uniqid';

type ToastType = 'info' | 'error' | 'warning' | 'success';

interface Toast {
	message: string;
	id: string;
	type: ToastType;
}

function createToastsStore() {
	const { subscribe } = writable<Toast[]>([
		{ type: 'info', message: 'Information', id: uniqid() },
		{ type: 'error', message: 'Error', id: uniqid() },
		{ type: 'warning', message: 'warning', id: uniqid() }
	]);

	return {
		subscribe
	};
}

export default createToastsStore();
