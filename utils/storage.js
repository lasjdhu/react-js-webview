import * as SecureStore from 'expo-secure-store';

export async function saveToSecureStorage(key, value) {
	await SecureStore.setItemAsync(key, value);
	alert('Data saved securely');
}

export async function getFromSecureStorage(key) {
	const result = await SecureStore.getItemAsync(key);

	console.log(result)

	if (result) {
		alert('Here\'s your value: ' + result);
	} else {
		alert('No values stored under that key: ' + key);
	}
}