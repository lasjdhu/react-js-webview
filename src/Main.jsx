import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

async function registerForPushNotificationsAsync() {
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

function Main() {
	const webView = useRef(null);

	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	useEffect(() => {
		if (Platform.OS === 'android') {
			registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

			notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
				setNotification(notification);
			});

			responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
				console.log(response);
			});

			return () => {
				Notifications.removeNotificationSubscription(notificationListener.current);
				Notifications.removeNotificationSubscription(responseListener.current);
			}
		}
	}, []);

	async function sendPushNotification() {
		try {
			const message = {
				to: expoPushToken.data,
				sound: 'default',
				title: 'Your Notification Title',
				body: 'Your Notification Body',
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

			const result = await response.json();
			console.log(result);

			alert('Push notification sent successfully.');
		} catch (error) {
			console.error('Error sending push notification:', error);
			alert('Error sending push notification: ' + error.message);
		}
	}


	function handleWebViewMessage(eventData) {
		// const message = JSON.parse(eventData);
		// message.action
		if (eventData === 'saveData') {
		// Save data to SecureStorage
			console.log('saveData');
		} else if (eventData === 'retrieveData') {
		// Retrieve data from SecureStorage
			console.log('retrieveData');
		} else if (eventData === 'sendPushNotification') {
			sendPushNotification();
		}
	}

	return (
		<WebView
			ref={webView}
			source={{ uri: 'https://lasjdhu.github.io/react-js-page/' }}
			javaScriptEnabled={true}
			onMessage={(event) => handleWebViewMessage(event.nativeEvent.data)}
		/>
	);
}

export default Main;
