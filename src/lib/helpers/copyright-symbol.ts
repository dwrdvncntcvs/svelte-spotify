export default function getCopyrightSymbol(type: 'P' | 'C' | 'R') {
	switch (type) {
		case 'R':
			return '®';
		case 'C':
			return '©';
		case 'P':
			return '℗';
		default:
			return type;
	}
}
