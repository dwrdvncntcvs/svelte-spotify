export default function (node: Node) {
	const handleOutsideClick = (event: Event) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('clickOutside', node));
		}
	};
	document.addEventListener('click', handleOutsideClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleOutsideClick, true);
		}
	};
}
