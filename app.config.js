export default {
    expo: {
        extra: {
            apiUrl: process.env.API_URL || 'https://devanza.runasp.net/api',
        },
        plugins: [
            "expo-localization"
        ],
    },
};