import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
	let token;

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = await Notifications.getExpoPushTokenAsync({
			projectId: Constants.expoConfig.extra.eas.projectId,
		});
		console.log(token);
	} else {
		alert('Must use physical device for Push Notifications');
	}

	return token;
}

export async function sendPushNotification(token, title, body) {
	try {
		const message = {
			to: token,
			sound: 'default',
			title,
			body,
		};

		const response = await fetch('https://exp.host/--/api/v2/push/send', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Accept-encoding': 'gzip, deflate',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(message),
		});

		if (response.ok) {
			const result = await response.json();

			console.log(result);
			alert('Push notification sent successfully.');
		} else {
			console.error('Error sending push notification (fetch)');
			alert('Error sending push notification (fetch)');
		}
	} catch (error) {
		console.error('Error sending push notification:', error);
		alert('Error sending push notification: ' + error.message);
	}
}