import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';

import { registerForPushNotificationsAsync, sendPushNotification } from '../utils/notifications';
import { saveToSecureStorage, getFromSecureStorage } from '../utils/storage';

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

	function handleWebViewMessage(eventData) {
		const message = JSON.parse(eventData);

		if (message.action === 'saveData') {
			saveToSecureStorage('count', JSON.stringify(message.data));
		} else if (message.action === 'retrieveData') {
			getFromSecureStorage('count');
		} else if (message.action === 'sendPushNotification') {
			sendPushNotification(expoPushToken.data, 'Testing...', 'Notification body');
		}
	}

	return (
		<WebView
			source={{ uri: 'https://lasjdhu.github.io/react-js-page/' }}
			ref={webView}
			javaScriptEnabled={true}
			onMessage={(event) => handleWebViewMessage(event.nativeEvent.data)}
		/>
	);
}

export default Main;
