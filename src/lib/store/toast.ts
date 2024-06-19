import { writable } from 'svelte/store';
import uniqid from 'uniqid';

type ToastType = 'info' | 'error' | 'warning' | 'success';

interface Toast {
	message: string;
	id: string;
	type: ToastType;
}

interface CreateToast extends Toast {
	timeout?: number;
}

function createToastsStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	const removeToast = (id: string) => {
		update((toasts) => toasts.filter((toast) => toast.id !== id));
	};

	const addToast = ({ id, message, type, timeout = 3000 }: CreateToast) => {
		update((toasts) => [{ type, message, id }, ...toasts]);
		if (timeout) {
			setTimeout(() => {
				removeToast(id);
			}, timeout);
		}
	};

	return {
		subscribe,
		info: (message: string, timeout?: number) =>
			addToast({ type: 'info', message, timeout, id: uniqid() }),
		warning: (message: string, timeout?: number) =>
			addToast({ type: 'warning', message, timeout, id: uniqid() }),
		error: (message: string, timeout?: number) =>
			addToast({ type: 'error', message, timeout, id: uniqid() }),
		success: (message: string, timeout?: number) =>
			addToast({ type: 'success', message, timeout, id: uniqid() }),
		remove: removeToast
	};
}

export default createToastsStore();
