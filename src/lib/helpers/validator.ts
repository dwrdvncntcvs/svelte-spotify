interface Option {
	fromApi: boolean;
}

interface DataMapWithError {
	value: string;
	error?: string;
}

export interface DataObj {
	[key: string]: DataMapWithError;
}

interface RequiredFields {
	[key: string]: string;
}

export const requiredFields = <T extends object>(
	requiredFields: RequiredFields,
	fieldsObject: T,
	option?: Option
) => {
	const fieldKeys = Object.keys(fieldsObject);

	const data: DataObj = {};

	let hasError: boolean = false;

	fieldKeys.forEach((key) => {
		if (Object.keys(requiredFields).includes(key) && !fieldsObject[key]) {
			data[key] = {
				value: fieldsObject[key],
				error: requiredFields[key]
			};
		} else {
			data[key] = {
				value: fieldsObject[key]
			};
		}
	});

	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			if (data[key] && data[key].hasOwnProperty('error')) {
				hasError = true;
			}
		}
	}

	return {
		...data,
		apiError: !!option?.fromApi,
		hasError
	};
};

export default {
	requiredFields
};
