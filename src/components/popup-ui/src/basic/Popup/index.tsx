import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
	View,
	TouchableOpacity,
	StyleSheet,
	Animated,
	Dimensions,
	Alert,
	Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { moderateScale } from 'react-native-size-matters';

import { theme } from '../../../../../core/theme';
import { FONT_FAMILY } from '../../../../../services/config';
import { Text } from '../../../../widget';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');

interface PopupConfig {
	type: 'Success' | 'Danger' | 'Warning';
	title: string;
	textBody: string;
	button?: boolean;
	buttonText?: string;
	callback?: () => void;
	background?: string;
	timing?: number;
	autoClose?: boolean;
	icon?: boolean;
}

interface PopupInstance {
	show: (config: PopupConfig) => void;
	hide: () => void;
}

let popupInstance: PopupInstance | null = null;

const PopupFunctional: React.FC = () => {
	const [config, setConfig] = useState<PopupConfig>({
		type: 'Success',
		title: '',
		textBody: '',
		buttonText: 'Ok',
		background: 'rgba(0, 0, 0, 0.5)'
	});
	const [popupHeight, setPopupHeight] = useState(0);

	const positionView = useRef(new Animated.Value(HEIGHT)).current;
	const opacity = useRef(new Animated.Value(0)).current;
	const positionPopup = useRef(new Animated.Value(HEIGHT)).current;

	useEffect(() => {
		popupInstance = {
			show: showPopup,
			hide: hidePopup
		};
	}, []);

	const showPopup = useCallback((newConfig: PopupConfig) => {
		setConfig(prev => ({
			...prev,
			...newConfig,
			button: newConfig.button ?? true,
			buttonText: newConfig.buttonText || 'Ok',
			background: newConfig.background || 'rgba(0, 0, 0, 0.5)',
			autoClose: newConfig.autoClose ?? false
		}));

		Animated.sequence([
			Animated.timing(positionView, {
				toValue: 0,
				duration: 100,
				useNativeDriver: true
			}),
			Animated.timing(opacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true
			}),
			Animated.spring(positionPopup, {
				toValue: (HEIGHT / 2) - (popupHeight / 2),
				bounciness: 15,
				useNativeDriver: true
			})
		]).start();

		if (newConfig.autoClose && newConfig.timing !== 0) {
			const duration = newConfig.timing || 5000;
			setTimeout(() => {
				hidePopup();
			}, duration);
		}
	}, [popupHeight]);

	const hidePopup = useCallback(async () => {
		await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		Animated.sequence([
			Animated.timing(positionPopup, {
				toValue: HEIGHT,
				duration: 250,
				useNativeDriver: true
			}),
			Animated.timing(opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true
			}),
			Animated.timing(positionView, {
				toValue: HEIGHT,
				duration: 100,
				useNativeDriver: true
			})
		]).start();
	}, []);

	const defaultCallback = useCallback(() => {
		Alert.alert(
			'Callback!',
			'Callback complete!',
			[{ text: 'Ok', onPress: hidePopup }]
		);
	}, []);

	const handleButtonPress = useCallback(async () => {
		await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		if (config.callback) {
			config.callback();
		} else {
			defaultCallback();
		}
	}, [config.callback]);

	const renderBackground = useCallback(() => {
		if (Platform.OS === 'ios') {
			return (
				<BlurView
					intensity={70}
					tint="light"
					style={StyleSheet.absoluteFill}
				/>
			);
		}
		return (
			<View style={[
				StyleSheet.absoluteFill,
				{ backgroundColor: theme.colors.black + '70' }
			]} />
		);
	}, []);

	const renderButton = useCallback(() => {
		if (!config.button) return null;

		return (
			<TouchableOpacity
				style={[styles.button, styles[config.type]]}
				onPress={handleButtonPress}
			>
				<Text style={styles.textButton}>{config.buttonText}</Text>
			</TouchableOpacity>
		);
	}, [config, handleButtonPress]);

	return (
		<Animated.View
			style={[styles.container, {
				opacity,
				transform: [{ translateY: positionView }]
			}]}
		>
			{renderBackground()}

			<Animated.View
				onLayout={event => {
					setPopupHeight(event.nativeEvent.layout.height);
				}}
				style={[styles.message, {
					transform: [{ translateY: positionPopup }]
				}]}
			>
				<View style={styles.content}>
					<Text style={styles.title}>{config.title}</Text>
					<Text style={styles.desc}>{config.textBody}</Text>
					{renderButton()}

					<TouchableOpacity
						style={styles.closeButton}
						onPress={async () => {
							await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							hidePopup();
						}}
					>
						<ExpoImage
							source={require('../../../../../assets/closecrows.png')}
							style={styles.closeIcon}
							contentFit="contain"
						/>
					</TouchableOpacity>
				</View>
			</Animated.View>
		</Animated.View>
	);
};

const Popup = {
	show: (config: PopupConfig) => {
		popupInstance?.show(config);
	},
	hide: () => {
		popupInstance?.hide();
	}
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		zIndex: 99999,
		width: '100%',
		height: HEIGHT,
		alignItems: 'center',
		top: 0,
		left: 0
	},
	message: {
		width: '88%',
		backgroundColor: '#fff',
		borderRadius: moderateScale(30),
		alignItems: 'center',
		overflow: 'hidden',
		position: 'absolute',
	},
	content: {
		padding: moderateScale(30),
		alignItems: 'center',
		width: '100%',
		justifyContent: 'center',
		alignSelf: 'center',
		alignContent: 'center'
	},
	title: {
		fontWeight: '900',
		fontSize: moderateScale(22),
		color: theme.colors.black,
		fontFamily: FONT_FAMILY,
		textAlign: 'center'
	},
	desc: {
		textAlign: 'center',
		color: theme.colors.blackText,
		fontFamily: FONT_FAMILY,
		fontSize: moderateScale(15),
		fontWeight: '100',
		marginTop: moderateScale(20)
	},
	button: {
		borderRadius: moderateScale(10),
		height: moderateScale(45),
		width: '80%',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: moderateScale(30),
	},
	textButton: {
		color: '#fff',
		fontWeight: 'bold'
	},
	closeButton: {
		marginTop: moderateScale(15),
	},
	closeIcon: {
		width: moderateScale(50),
		height: moderateScale(50),
	},
	Success: {
		backgroundColor: theme.colors.primary,
		shadowColor: theme.colors.primary,
	},
	Danger: {
		backgroundColor: theme.colors.canceled,
	},
	Warning: {
		backgroundColor: '#fbd10d',
	}
});

export default Popup;