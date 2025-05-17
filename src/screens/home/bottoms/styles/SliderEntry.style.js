import { StyleSheet, Dimensions, Platform } from 'react-native';
import { theme } from '../../../../core/theme';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}


const slideHeight = Dimensions.get('screen').height / 2;
const slideWidth = scale(260);
const itemHorizontalMargin = wp(moderateScale(0.1));


export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * moderateScale(1);

const entryBorderRadius = 0;

export default StyleSheet.create({
    percentageOff: {
        position: 'absolute',
        marginLeft: moderateScale(-12),
        marginRight: moderateScale(-1),
        marginTop: moderateScale(-1),
        zIndex: 2,
    },
    percentageOffThird: {
        position: 'absolute',
        zIndex: 3,
    },
    percentageOffFourth: {
        position: 'absolute',
        zIndex: 4,
    },
    slideInnerContainer: {
        width: '100%',
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: verticalScale(10) // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: moderateScale(5),
        shadowColor: theme.colors.white,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius,
        // backgroundColor: theme.colors.gray06,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        // backgroundColor: theme.colors.gray06,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },

    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius + 20,
        // backgroundColor: theme.colors.black,
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 2 - entryBorderRadius,
        paddingBottom: 0,
        paddingHorizontal: 3,
        // backgroundColor: theme.colors.gray06,
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    title: {
        color: theme.colors.black,
        fontSize: moderateScale(14),
        paddingHorizontal: moderateScale(3),
        width: '100%',
        textAlign: 'center',
        letterSpacing: 0.5
    },
    subtitle: {
        marginTop: 1,
        textAlign: 'center',
        color: theme.colors.gray04,
        fontSize: moderateScale(11),
        fontStyle: 'normal'
    }
});