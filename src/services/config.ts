// src/services/config.ts
type Environment = 'dev' | 'test' | 'stg' | 'product' | 'local';

const env: Record<Environment, Environment> = {
    dev: 'dev', test: 'test', stg: 'stg', product: 'product', local: 'local',
};

const API_URL: Record<Environment, string> = {
    local: 'http://localhost:3100',
    dev: 'http://192.168.2.20:3100',
    test: 'http://195.229.192.170:3100',
    stg: 'http://192.168.43.36:3100',
    product: 'https://devanza-dev-backend.azurewebsites.net/',
};

const currentEnv: Environment = env.dev;

export const BASE_API_URL: string = API_URL[currentEnv] + '/v1';
export const BASE_URL_IMAGE: string = BASE_API_URL + '/image/get/';
export const BASE_API_URL_IMAEG: string = API_URL[currentEnv] + '/uploads/medium/';
export const BASE_API_URL_IMAEG_ORIGINAL: string = API_URL[currentEnv] + '/uploads/original/';

export const FONT_FAMILY: string = 'Avenir';

export const USER_TOKEN: string = 'USER_TOKEN';
export const LOW_QUALITY: string = '?q=30';
export const MEDIUM_QUALITY: string = '?q=50';
export const HEIGHT_QUALITY: string = '?q=100';
export const PROGRESSIVE_QUALITY: string = '?q=2';

export const MARCHENT_KEY_TEST: string = 'test_$2y$10$dRat0iZ.uvCm.SZVEyta2.ym1.Da9vz7oI5jFjkrsLMszwUe6QL22';
export const MARCHENT_KEY_LIVE: string = 'live_$2y$10$tsEZX410Pm7p893ieoBlv.Q8qiG-8kUmAT0qOjZ0SnjWHXRIzbTHS';

export const FOLOOSI_URL_TEST: string = 'https://foloosi.com/api/v1/api/initialize-setup';
export const FOLOOSI_URL_LIVE: string = 'https://foloosi.com/api/v1/api/initialize-setup';

interface MomentConfig {
    name: string;
    config: {
        months: string[];
        monthsShort: string[];
        monthsParseExact: boolean;
        weekdays: string[];
        weekdaysShort: string[];
        weekdaysMin: string[];
        weekdaysParseExact: boolean;
        longDateFormat: {
            LT: string;
            LTS: string;
            L: string;
            LL: string;
            LLL: string;
            LLLL: string;
        };
        calendar: {
            sameDay: string;
            nextDay: string;
            nextWeek: string;
            lastDay: string;
            lastWeek: string;
            sameElse: string;
        };
        relativeTime: {
            future: string;
            past: string;
            s: string;
            m: string;
            mm: string;
            h: string;
            hh: string;
            d: string;
            dd: string;
            M: string;
            MM: string;
            y: string;
            yy: string;
        };
        dayOfMonthOrdinalParse: RegExp;
        ordinal: (number: number) => string;
        meridiemParse: RegExp;
        isPM: (input: string) => boolean;
        meridiem: (hour: number, minute: number, isLower: boolean) => string;
        week: {
            dow: number;
            doy: number;
        };
    };
}

export const momentConf: MomentConfig = {
    name: 'ar',
    config: {
        months: [
            'يناير',
            'فبراير',
            'مارس',
            'أبريل',
            'مايو',
            'يونيو',
            'يوليو',
            'أغسطس',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر',
        ],
        monthsShort: [
            'يناير',
            'فبراير',
            'مارس',
            'أبريل',
            'مايو',
            'يونيو',
            'يوليو',
            'أغسطس',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر',
        ],
        monthsParseExact: true,
        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm'
        },
        calendar: {
            sameDay: '[اليوم عند الساعة] LT',
            nextDay: '[غدًا عند الساعة] LT',
            nextWeek: 'dddd [عند الساعة] LT',
            lastDay: '[أمس عند الساعة] LT',
            lastWeek: 'dddd [عند الساعة] LT',
            sameElse: 'L',
        },
        relativeTime: {
            future: 'بعد %s',
            past: 'منذ %s',
            s: 'quelques secondes',
            m: 'une minute',
            mm: '%d minutes',
            h: 'une heure',
            hh: '%d heures',
            d: 'un jour',
            dd: '%d jours',
            M: 'un mois',
            MM: '%d mois',
            y: 'un an',
            yy: '%d ans'
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
        ordinal: function (number: number): string {
            return number + (number === 1 ? 'er' : 'e');
        },
        meridiemParse: /ص|م/,
        isPM: function (input: string): boolean {
            return 'م' === input;
        },
        meridiem: function (hour: number, minute: number, isLower: boolean): string {
            if (hour < 12) {
                return 'ص';
            } else {
                return 'م';
            }
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4  // Used to determine first week of the year.
        }
    }
};