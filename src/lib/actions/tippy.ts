import tippy, { type Props } from 'tippy.js';

export default (node: HTMLElement, options?: Partial<Props>) => {
	const instance = tippy(node, options);

	return {
		update(newOptions: Partial<Props>) {
			instance.setProps(newOptions);
		},
		destroy() {
			instance.destroy();
		}
	};
};
