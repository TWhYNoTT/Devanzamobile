import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../../../core/theme';

const { width: screenWidth } = Dimensions.get('window');
const scale = (size: number) => (screenWidth / 375) * size;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.black,
    },
    map: {
        flex: 1,
    },
    searchContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingHorizontal: scale(15),
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        height: scale(50),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    backButton: {
        padding: scale(5),
    },
    backIcon: {
        width: scale(20),
        height: scale(20),
        tintColor: theme.colors.blackText,
    },
    searchInput: {
        flex: 1,
        fontSize: scale(15),
        color: theme.colors.blackText,
        paddingHorizontal: scale(10),
    },
    searchButton: {
        paddingHorizontal: scale(15),
    },
    searchButtonText: {
        color: theme.colors.primary,
        fontSize: scale(14),
        fontWeight: '600',
    },
    clearButton: {
        paddingHorizontal: scale(15),
    },
    clearButtonText: {
        fontSize: scale(24),
        color: theme.colors.gray04,
        fontWeight: '300',
    },
    suggestionsContainer: {
        backgroundColor: theme.colors.white,
        marginTop: scale(5),
        borderRadius: scale(15),
        maxHeight: scale(250),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    suggestionItem: {
        paddingHorizontal: scale(15),
        paddingVertical: scale(12),
    },
    suggestionContent: {
        flex: 1,
    },
    suggestionName: {
        fontSize: scale(15),
        fontWeight: '600',
        color: theme.colors.blackText,
        marginBottom: scale(2),
    },
    suggestionAddress: {
        fontSize: scale(13),
        color: theme.colors.gray04,
    },
    suggestionSeparator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.colors.gray05 || '#E0E0E0',
        marginHorizontal: scale(15),
    },
    locationInfo: {
        position: 'absolute',
        bottom: scale(140),
        left: scale(20),
        right: scale(20),
        backgroundColor: theme.colors.white,
        borderRadius: scale(15),
        padding: scale(15),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    locationText: {
        fontSize: scale(14),
        color: theme.colors.blackText,
        textAlign: 'center',
    },
    currentLocationButton: {
        position: 'absolute',
        right: scale(20),
        bottom: scale(280),
        width: scale(50),
        height: scale(50),
        borderRadius: scale(25),
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    navigateIcon: {
        width: scale(25),
        height: scale(25),
    },
    bottomContainer: {
        position: 'absolute',
        bottom: scale(30),
        left: scale(20),
        right: scale(20),
    },
    confirmButton: {
        borderRadius: scale(15),
        backgroundColor: theme.colors.primary,
        height: scale(45),
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: theme.colors.disabled || '#CCCCCC',
    },
    confirmButtonText: {
        fontSize: scale(15),
        color: theme.colors.white,
        fontWeight: '600',
    },
    // Salon marker styles - simple circle
    salonCircle: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        backgroundColor: 'red',
        borderWidth: 3,
        borderColor: 'white',
    },
    debugText: {
        fontSize: scale(10),
        color: 'red',
        marginTop: scale(5),
    },
    loadingSalonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(10),
    },
    loadingSalonsText: {
        marginLeft: scale(8),
        fontSize: scale(12),
        color: theme.colors.gray04,
    },
    salonCountText: {
        fontSize: scale(12),
        color: theme.colors.primary,
        textAlign: 'center',
        marginTop: scale(8),
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        padding: scale(20),
        maxHeight: '80%',
    },
    modalCloseButton: {
        position: 'absolute',
        right: scale(15),
        top: scale(15),
        zIndex: 1,
    },
    modalCloseText: {
        fontSize: scale(30),
        color: theme.colors.gray04,
    },
    modalTitle: {
        fontSize: scale(20),
        fontWeight: '700',
        color: theme.colors.blackText,
        marginBottom: scale(15),
    },
    modalInfoRow: {
        flexDirection: 'row',
        marginVertical: scale(8),
    },
    modalLabel: {
        fontSize: scale(14),
        color: theme.colors.gray04,
        width: scale(100),
    },
    modalValue: {
        fontSize: scale(14),
        color: theme.colors.blackText,
        flex: 1,
        fontWeight: '500',
    },
    modalServicesTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        color: theme.colors.blackText,
        marginTop: scale(15),
        marginBottom: scale(8),
    },
    modalService: {
        fontSize: scale(14),
        color: theme.colors.blackText,
        marginVertical: scale(3),
        marginLeft: scale(10),
    },
    modalBookButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: scale(15),
        paddingVertical: scale(12),
        marginTop: scale(20),
        alignItems: 'center',
    },
    modalBookButtonText: {
        color: theme.colors.white,
        fontSize: scale(16),
        fontWeight: '600',
    },
});