import LangCode from './langCode';
/**
 * @description 國碼選單
 */
// prettier-ignore
const CountryCodeArray = [
  {
    value: 'TW+886',
    label: '+886',
    [LangCode.zhTW]: '台灣',
    [LangCode.en]: 'Taiwan'
  },
  //{  value: 'CA+1', label: '+1', [LangCode.zhTW]: '加拿大', [LangCode.en]: 'Canada' },
  {
    value: 'US+1',
    label: '+1',
    [LangCode.zhTW]: '美國',
    [LangCode.en]: 'United States'
  },
  //{  value: 'KZ+7', label: '+7', [LangCode.zhTW]: '哈薩克斯坦', [LangCode.en]: 'Kazakhstan' },
  {
    value: 'RU+7',
    label: '+7',
    [LangCode.zhTW]: '俄羅斯',
    [LangCode.en]: 'Russia'
  },
  {
    value: 'EG+20',
    label: '+20',
    [LangCode.zhTW]: '埃及',
    [LangCode.en]: 'Egypt'
  },
  {
    value: 'ZA+27',
    label: '+27',
    [LangCode.zhTW]: '南非',
    [LangCode.en]: 'South Africa'
  },
  {
    value: 'GR+30',
    label: '+30',
    [LangCode.zhTW]: '希臘',
    [LangCode.en]: 'Greece'
  },
  {
    value: 'NL+31',
    label: '+31',
    [LangCode.zhTW]: '荷蘭',
    [LangCode.en]: 'Netherlands'
  },
  {
    value: 'BE+32',
    label: '+32',
    [LangCode.zhTW]: '比利時',
    [LangCode.en]: 'Belgium'
  },
  {
    value: 'FR+33',
    label: '+33',
    [LangCode.zhTW]: '法國',
    [LangCode.en]: 'France'
  },
  {
    value: 'ES+34',
    label: '+34',
    [LangCode.zhTW]: '西班牙',
    [LangCode.en]: 'Spain'
  },
  {
    value: 'HU+36',
    label: '+36',
    [LangCode.zhTW]: '匈牙利',
    [LangCode.en]: 'Hungary'
  },
  {
    value: 'IT+39',
    label: '+39',
    [LangCode.zhTW]: '意大利',
    [LangCode.en]: 'Italy'
  },
  {
    value: 'RO+40',
    label: '+40',
    [LangCode.zhTW]: '羅馬尼亞',
    [LangCode.en]: 'Romania'
  },
  {
    value: 'CH+41',
    label: '+41',
    [LangCode.zhTW]: '瑞士',
    [LangCode.en]: 'Switzerland'
  },
  {
    value: 'AT+43',
    label: '+43',
    [LangCode.zhTW]: '奧地利',
    [LangCode.en]: 'Austria'
  },
  {
    value: 'GB+44',
    label: '+44',
    [LangCode.zhTW]: '英國',
    [LangCode.en]: 'United Kingdom'
  },
  //{  value: 'GG+44', label: '+44', [LangCode.zhTW]: '根西島', [LangCode.en]: 'Guernsey' },
  //{  value: 'IM+44', label: '+44', [LangCode.zhTW]: '曼島', [LangCode.en]: 'Isle of Man' },
  //{  value: 'JE+44', label: '+44', [LangCode.zhTW]: '澤西', [LangCode.en]: 'Jersey' },
  {
    value: 'DK+45',
    label: '+45',
    [LangCode.zhTW]: '丹麥',
    [LangCode.en]: 'Denmark'
  },
  {
    value: 'SE+46',
    label: '+46',
    [LangCode.zhTW]: '瑞典',
    [LangCode.en]: 'Sweden'
  },
  {
    value: 'NO+47',
    label: '+47',
    [LangCode.zhTW]: '挪威',
    [LangCode.en]: 'Norway'
  },
  //{  value: 'SJ+47', label: '+47', [LangCode.zhTW]: '斯瓦爾巴和揚馬延', [LangCode.en]: 'Svalbard and Jan Mayen' },
  {
    value: 'PL+48',
    label: '+48',
    [LangCode.zhTW]: '波蘭',
    [LangCode.en]: 'Poland'
  },
  {
    value: 'DE+49',
    label: '+49',
    [LangCode.zhTW]: '德國',
    [LangCode.en]: 'Germany'
  },
  {
    value: 'PE+51',
    label: '+51',
    [LangCode.zhTW]: '秘魯',
    [LangCode.en]: 'Peru'
  },
  {
    value: 'MX+52',
    label: '+52',
    [LangCode.zhTW]: '墨西哥',
    [LangCode.en]: 'Mexico'
  },
  {
    value: 'CU+53',
    label: '+53',
    [LangCode.zhTW]: '古巴',
    [LangCode.en]: 'Cuba'
  },
  {
    value: 'AR+54',
    label: '+54',
    [LangCode.zhTW]: '阿根廷',
    [LangCode.en]: 'Argentina'
  },
  {
    value: 'BR+55',
    label: '+55',
    [LangCode.zhTW]: '巴西',
    [LangCode.en]: 'Brazil'
  },
  {
    value: 'CL+56',
    label: '+56',
    [LangCode.zhTW]: '智利',
    [LangCode.en]: 'Chile'
  },
  {
    value: 'CO+57',
    label: '+57',
    [LangCode.zhTW]: '哥倫比亞',
    [LangCode.en]: 'Colombia'
  },
  {
    value: 'VE+58',
    label: '+58',
    [LangCode.zhTW]: '委內瑞拉',
    [LangCode.en]: 'Venezuela'
  },
  {
    value: 'MY+60',
    label: '+60',
    [LangCode.zhTW]: '馬來西亞',
    [LangCode.en]: 'Malaysia'
  },
  {
    value: 'AU+61',
    label: '+61',
    [LangCode.zhTW]: '澳大利亞',
    [LangCode.en]: 'Australia'
  },
  //{  value: 'CC+61', label: '+61', [LangCode.zhTW]: '科科斯（基林）群島', [LangCode.en]: 'Cocos (Keeling) Islands' },
  //{  value: 'CX+61', label: '+61', [LangCode.zhTW]: '聖誕島', [LangCode.en]: 'Christmas Island' },
  {
    value: 'ID+62',
    label: '+62',
    [LangCode.zhTW]: '印尼',
    [LangCode.en]: 'Indonesia'
  },
  {
    value: 'PH+63',
    label: '+63',
    [LangCode.zhTW]: '菲律賓',
    [LangCode.en]: 'Philippines'
  },
  {
    value: 'NZ+64',
    label: '+64',
    [LangCode.zhTW]: '紐西蘭',
    [LangCode.en]: 'New Zealand'
  },
  {
    value: 'SG+65',
    label: '+65',
    [LangCode.zhTW]: '新加坡',
    [LangCode.en]: 'Singapore'
  },
  {
    value: 'TH+66',
    label: '+66',
    [LangCode.zhTW]: '泰國',
    [LangCode.en]: 'Thailand'
  },
  {
    value: 'JP+81',
    label: '+81',
    [LangCode.zhTW]: '日本',
    [LangCode.en]: 'Japan'
  },
  {
    value: 'KR+82',
    label: '+82',
    [LangCode.zhTW]: '韓國',
    [LangCode.en]: 'South Korea'
  },
  {
    value: 'VN+84',
    label: '+84',
    [LangCode.zhTW]: '越南',
    [LangCode.en]: 'Vietnam'
  },
  {
    value: 'CN+86',
    label: '+86',
    [LangCode.zhTW]: '中國',
    [LangCode.en]: 'China'
  },
  {
    value: 'TR+90',
    label: '+90',
    [LangCode.zhTW]: '土耳其',
    [LangCode.en]: 'Turkey'
  },
  {
    value: 'IN+91',
    label: '+91',
    [LangCode.zhTW]: '印度',
    [LangCode.en]: 'India'
  },
  {
    value: 'PK+92',
    label: '+92',
    [LangCode.zhTW]: '巴基斯坦',
    [LangCode.en]: 'Pakistan'
  },
  {
    value: 'AF+93',
    label: '+93',
    [LangCode.zhTW]: '阿富汗',
    [LangCode.en]: 'Afghanistan'
  },
  {
    value: 'LK+94',
    label: '+94',
    [LangCode.zhTW]: '斯里蘭卡',
    [LangCode.en]: 'Sri Lanka'
  },
  {
    value: 'MM+95',
    label: '+95',
    [LangCode.zhTW]: '緬甸',
    [LangCode.en]: 'Myanmar'
  },
  {
    value: 'IR+98',
    label: '+98',
    [LangCode.zhTW]: '伊朗',
    [LangCode.en]: 'Iran'
  },
  {
    value: 'SS+211',
    label: '+211',
    [LangCode.zhTW]: '南蘇丹',
    [LangCode.en]: 'South Sudan'
  },
  {
    value: 'MA+212',
    label: '+212',
    [LangCode.zhTW]: '摩洛哥',
    [LangCode.en]: 'Morocco'
  },
  {
    value: 'DZ+213',
    label: '+213',
    [LangCode.zhTW]: '阿爾及利亞',
    [LangCode.en]: 'Algeria'
  },
  {
    value: 'TN+216',
    label: '+216',
    [LangCode.zhTW]: '突尼西亞',
    [LangCode.en]: 'Tunisia'
  },
  {
    value: 'LY+218',
    label: '+218',
    [LangCode.zhTW]: '利比亞',
    [LangCode.en]: 'Libya'
  },
  {
    value: 'GM+220',
    label: '+220',
    [LangCode.zhTW]: '岡比亞',
    [LangCode.en]: 'Gambia'
  },
  {
    value: 'SN+221',
    label: '+221',
    [LangCode.zhTW]: '塞內加爾',
    [LangCode.en]: 'Senegal'
  },
  {
    value: 'MR+222',
    label: '+222',
    [LangCode.zhTW]: '茅利塔尼亞',
    [LangCode.en]: 'Mauritania'
  },
  {
    value: 'ML+223',
    label: '+223',
    [LangCode.zhTW]: '馬裡',
    [LangCode.en]: 'Mali'
  },
  {
    value: 'GN+224',
    label: '+224',
    [LangCode.zhTW]: '幾內亞',
    [LangCode.en]: 'Guinea'
  },
  {
    value: 'CI+225',
    label: '+225',
    [LangCode.zhTW]: '科特迪瓦',
    [LangCode.en]: "Côte d'Ivoire"
  },
  {
    value: 'BF+226',
    label: '+226',
    [LangCode.zhTW]: '布基納法索',
    [LangCode.en]: 'Burkina Faso'
  },
  {
    value: 'NE+227',
    label: '+227',
    [LangCode.zhTW]: '尼日',
    [LangCode.en]: 'Niger'
  },
  {
    value: 'TG+228',
    label: '+228',
    [LangCode.zhTW]: '多哥',
    [LangCode.en]: 'Togo'
  },
  {
    value: 'BJ+229',
    label: '+229',
    [LangCode.zhTW]: '貝南',
    [LangCode.en]: 'Benin'
  },
  {
    value: 'MU+230',
    label: '+230',
    [LangCode.zhTW]: '模里西斯',
    [LangCode.en]: 'Mauritius'
  },
  {
    value: 'LR+231',
    label: '+231',
    [LangCode.zhTW]: '賴比瑞亞',
    [LangCode.en]: 'Liberia'
  },
  {
    value: 'SL+232',
    label: '+232',
    [LangCode.zhTW]: '塞拉利昂',
    [LangCode.en]: 'Sierra Leone'
  },
  {
    value: 'GH+233',
    label: '+233',
    [LangCode.zhTW]: '迦納',
    [LangCode.en]: 'Ghana'
  },
  {
    value: 'NG+234',
    label: '+234',
    [LangCode.zhTW]: '尼日利亞',
    [LangCode.en]: 'Nigeria'
  },
  {
    value: 'TD+235',
    label: '+235',
    [LangCode.zhTW]: '乍得',
    [LangCode.en]: 'Chad'
  },
  {
    value: 'CF+236',
    label: '+236',
    [LangCode.zhTW]: '中非共和國',
    [LangCode.en]: 'Central African Republic'
  },
  {
    value: 'CM+237',
    label: '+237',
    [LangCode.zhTW]: '喀麥隆',
    [LangCode.en]: 'Cameroon'
  },
  {
    value: 'CV+238',
    label: '+238',
    [LangCode.zhTW]: '佛得角',
    [LangCode.en]: 'Cape Verde'
  },
  {
    value: 'ST+239',
    label: '+239',
    [LangCode.zhTW]: '聖多美和普林西比',
    [LangCode.en]: 'São Tomé and Príncipe'
  },
  {
    value: 'GQ+240',
    label: '+240',
    [LangCode.zhTW]: '赤道幾內亞',
    [LangCode.en]: 'Equatorial Guinea'
  },
  {
    value: 'GA+241',
    label: '+241',
    [LangCode.zhTW]: '加蓬',
    [LangCode.en]: 'Gabon'
  },
  {
    value: 'CG+242',
    label: '+242',
    [LangCode.zhTW]: '剛果（布拉薩）',
    [LangCode.en]: 'Congo (Brazzaville)'
  },
  {
    value: 'CD+243',
    label: '+243',
    [LangCode.zhTW]: '剛果（金沙薩）',
    [LangCode.en]: 'Congo (Kinshasa)'
  },
  {
    value: 'AO+244',
    label: '+244',
    [LangCode.zhTW]: '安哥拉',
    [LangCode.en]: 'Angola'
  },
  {
    value: 'GW+245',
    label: '+245',
    [LangCode.zhTW]: '幾內亞比紹',
    [LangCode.en]: 'Guinea-Bissau'
  },
  {
    value: 'IO+246',
    label: '+246',
    [LangCode.zhTW]: '英屬印度洋領地',
    [LangCode.en]: 'British Indian Ocean Territory'
  },
  {
    value: 'SC+248',
    label: '+248',
    [LangCode.zhTW]: '塞席爾',
    [LangCode.en]: 'Seychelles'
  },
  {
    value: 'SD+249',
    label: '+249',
    [LangCode.zhTW]: '蘇丹',
    [LangCode.en]: 'Sudan'
  },
  {
    value: 'RW+250',
    label: '+250',
    [LangCode.zhTW]: '盧旺達',
    [LangCode.en]: 'Rwanda'
  },
  {
    value: 'ET+251',
    label: '+251',
    [LangCode.zhTW]: '埃塞俄比亞',
    [LangCode.en]: 'Ethiopia'
  },
  {
    value: 'SO+252',
    label: '+252',
    [LangCode.zhTW]: '索馬利亞',
    [LangCode.en]: 'Somalia'
  },
  {
    value: 'DJ+253',
    label: '+253',
    [LangCode.zhTW]: '吉布提',
    [LangCode.en]: 'Djibouti'
  },
  {
    value: 'KE+254',
    label: '+254',
    [LangCode.zhTW]: '肯尼亞',
    [LangCode.en]: 'Kenya'
  },
  {
    value: 'TZ+255',
    label: '+255',
    [LangCode.zhTW]: '坦桑尼亞',
    [LangCode.en]: 'Tanzania'
  },
  {
    value: 'UG+256',
    label: '+256',
    [LangCode.zhTW]: '烏幹達',
    [LangCode.en]: 'Uganda'
  },
  {
    value: 'BI+257',
    label: '+257',
    [LangCode.zhTW]: '布隆迪',
    [LangCode.en]: 'Burundi'
  },
  {
    value: 'MZ+258',
    label: '+258',
    [LangCode.zhTW]: '莫桑比克',
    [LangCode.en]: 'Mozambique'
  },
  {
    value: 'ZM+260',
    label: '+260',
    [LangCode.zhTW]: '贊比亞',
    [LangCode.en]: 'Zambia'
  },
  {
    value: 'MG+261',
    label: '+261',
    [LangCode.zhTW]: '馬達加斯加',
    [LangCode.en]: 'Madagascar'
  },
  //{  value: 'RE+262', label: '+262', [LangCode.zhTW]: '留尼旺', [LangCode.en]: 'Réunion' },
  {
    value: 'YT+262',
    label: '+262',
    [LangCode.zhTW]: '馬約特',
    [LangCode.en]: 'Mayotte'
  },
  {
    value: 'ZW+263',
    label: '+263',
    [LangCode.zhTW]: '津巴布韋',
    [LangCode.en]: 'Zimbabwe'
  },
  {
    value: 'NA+264',
    label: '+264',
    [LangCode.zhTW]: '納米比亞',
    [LangCode.en]: 'Namibia'
  },
  {
    value: 'MW+265',
    label: '+265',
    [LangCode.zhTW]: '馬拉威',
    [LangCode.en]: 'Malawi'
  },
  {
    value: 'LS+266',
    label: '+266',
    [LangCode.zhTW]: '賴索托',
    [LangCode.en]: 'Lesotho'
  },
  {
    value: 'BW+267',
    label: '+267',
    [LangCode.zhTW]: '博茨瓦納',
    [LangCode.en]: 'Botswana'
  },
  {
    value: 'SZ+268',
    label: '+268',
    [LangCode.zhTW]: '史瓦濟蘭',
    [LangCode.en]: 'Eswatini'
  },
  {
    value: 'KM+269',
    label: '+269',
    [LangCode.zhTW]: '科摩羅',
    [LangCode.en]: 'Comoros'
  },
  {
    value: 'SH+290',
    label: '+290',
    [LangCode.zhTW]: '聖赫勒拿',
    [LangCode.en]: 'Saint Helena'
  },
  {
    value: 'ER+291',
    label: '+291',
    [LangCode.zhTW]: '厄立特里亞',
    [LangCode.en]: 'Eritrea'
  },
  {
    value: 'AW+297',
    label: '+297',
    [LangCode.zhTW]: '阿魯巴',
    [LangCode.en]: 'Aruba'
  },
  {
    value: 'FO+298',
    label: '+298',
    [LangCode.zhTW]: '法羅群島',
    [LangCode.en]: 'Faroe Islands'
  },
  {
    value: 'GL+299',
    label: '+299',
    [LangCode.zhTW]: '格陵蘭',
    [LangCode.en]: 'Greenland'
  },
  {
    value: 'KY+345',
    label: '+345',
    [LangCode.zhTW]: '開曼群島',
    [LangCode.en]: 'Cayman Islands'
  },
  {
    value: 'GI+350',
    label: '+350',
    [LangCode.zhTW]: '直布羅陀',
    [LangCode.en]: 'Gibraltar'
  },
  {
    value: 'PT+351',
    label: '+351',
    [LangCode.zhTW]: '葡萄牙',
    [LangCode.en]: 'Portugal'
  },
  {
    value: 'LU+352',
    label: '+352',
    [LangCode.zhTW]: '盧森堡',
    [LangCode.en]: 'Luxembourg'
  },
  {
    value: 'IE+353',
    label: '+353',
    [LangCode.zhTW]: '愛爾蘭',
    [LangCode.en]: 'Ireland'
  },
  {
    value: 'IS+354',
    label: '+354',
    [LangCode.zhTW]: '冰島',
    [LangCode.en]: 'Iceland'
  },
  {
    value: 'AL+355',
    label: '+355',
    [LangCode.zhTW]: '阿爾巴尼亞',
    [LangCode.en]: 'Albania'
  },
  {
    value: 'MT+356',
    label: '+356',
    [LangCode.zhTW]: '馬爾他',
    [LangCode.en]: 'Malta'
  },
  {
    value: 'CY+357',
    label: '+357',
    [LangCode.zhTW]: '塞浦路斯',
    [LangCode.en]: 'Cyprus'
  },
  {
    value: 'FI+358',
    label: '+358',
    [LangCode.zhTW]: '芬蘭',
    [LangCode.en]: 'Finland'
  },
  //{  value: 'AX+358', label: '+358', [LangCode.zhTW]: '奧蘭群島', [LangCode.en]: 'Åland Islands' },
  {
    value: 'BG+359',
    label: '+359',
    [LangCode.zhTW]: '保加利亞',
    [LangCode.en]: 'Bulgaria'
  },
  {
    value: 'LT+370',
    label: '+370',
    [LangCode.zhTW]: '立陶宛',
    [LangCode.en]: 'Lithuania'
  },
  {
    value: 'LV+371',
    label: '+371',
    [LangCode.zhTW]: '拉脫維亞',
    [LangCode.en]: 'Latvia'
  },
  {
    value: 'EE+372',
    label: '+372',
    [LangCode.zhTW]: '愛沙尼亞',
    [LangCode.en]: 'Estonia'
  },
  {
    value: 'MD+373',
    label: '+373',
    [LangCode.zhTW]: '摩爾多瓦',
    [LangCode.en]: 'Moldova'
  },
  {
    value: 'AM+374',
    label: '+374',
    [LangCode.zhTW]: '亞美尼亞',
    [LangCode.en]: 'Armenia'
  },
  {
    value: 'BY+375',
    label: '+375',
    [LangCode.zhTW]: '白俄羅斯',
    [LangCode.en]: 'Belarus'
  },
  {
    value: 'AD+376',
    label: '+376',
    [LangCode.zhTW]: '安道爾',
    [LangCode.en]: 'Andorra'
  },
  {
    value: 'MC+377',
    label: '+377',
    [LangCode.zhTW]: '摩納哥',
    [LangCode.en]: 'Monaco'
  },
  {
    value: 'SM+378',
    label: '+378',
    [LangCode.zhTW]: '聖馬力諾',
    [LangCode.en]: 'San Marino'
  },
  {
    value: 'VA+379',
    label: '+379',
    [LangCode.zhTW]: '梵蒂岡',
    [LangCode.en]: 'Vatican City'
  },
  {
    value: 'UA+380',
    label: '+380',
    [LangCode.zhTW]: '烏克蘭',
    [LangCode.en]: 'Ukraine'
  },
  {
    value: 'RS+381',
    label: '+381',
    [LangCode.zhTW]: '塞爾維亞',
    [LangCode.en]: 'Serbia'
  },
  {
    value: 'ME+382',
    label: '+382',
    [LangCode.zhTW]: '黑山',
    [LangCode.en]: 'Montenegro'
  },
  {
    value: 'HR+385',
    label: '+385',
    [LangCode.zhTW]: '克羅地亞',
    [LangCode.en]: 'Croatia'
  },
  {
    value: 'SI+386',
    label: '+386',
    [LangCode.zhTW]: '斯洛維尼亞',
    [LangCode.en]: 'Slovenia'
  },
  {
    value: 'BA+387',
    label: '+387',
    [LangCode.zhTW]: '波斯尼亞和黑塞哥維那',
    [LangCode.en]: 'Bosnia and Herzegovina'
  },
  {
    value: 'MK+389',
    label: '+389',
    [LangCode.zhTW]: '馬其頓',
    [LangCode.en]: 'North Macedonia'
  },
  {
    value: 'CZ+420',
    label: '+420',
    [LangCode.zhTW]: '捷克共和國',
    [LangCode.en]: 'Czech Republic'
  },
  {
    value: 'SK+421',
    label: '+421',
    [LangCode.zhTW]: '斯洛伐克',
    [LangCode.en]: 'Slovakia'
  },
  {
    value: 'LI+423',
    label: '+423',
    [LangCode.zhTW]: '列支敦斯登',
    [LangCode.en]: 'Liechtenstein'
  },
  {
    value: 'FK+500',
    label: '+500',
    [LangCode.zhTW]: '福克蘭群島（馬爾維納斯）',
    [LangCode.en]: 'Falkland Islands (Malvinas)'
  },
  //{  value: 'GS+500', label: '+500', [LangCode.zhTW]: '南喬治亞島與南桑威奇群島', [LangCode.en]: 'South Georgia and the South Sandwich Islands' },
  {
    value: 'BZ+501',
    label: '+501',
    [LangCode.zhTW]: '貝里斯',
    [LangCode.en]: 'Belize'
  },
  {
    value: 'GT+502',
    label: '+502',
    [LangCode.zhTW]: '危地馬拉',
    [LangCode.en]: 'Guatemala'
  },
  {
    value: 'SV+503',
    label: '+503',
    [LangCode.zhTW]: '薩爾瓦多',
    [LangCode.en]: 'El Salvador'
  },
  {
    value: 'HN+504',
    label: '+504',
    [LangCode.zhTW]: '洪都拉斯',
    [LangCode.en]: 'Honduras'
  },
  {
    value: 'NI+505',
    label: '+505',
    [LangCode.zhTW]: '尼加拉瓜',
    [LangCode.en]: 'Nicaragua'
  },
  {
    value: 'CR+506',
    label: '+506',
    [LangCode.zhTW]: '哥斯達黎加',
    [LangCode.en]: 'Costa Rica'
  },
  {
    value: 'PA+507',
    label: '+507',
    [LangCode.zhTW]: '巴拿馬',
    [LangCode.en]: 'Panama'
  },
  {
    value: 'PM+508',
    label: '+508',
    [LangCode.zhTW]: '聖皮埃爾和密克隆群島',
    [LangCode.en]: 'Saint Pierre and Miquelon'
  },
  {
    value: 'HT+509',
    label: '+509',
    [LangCode.zhTW]: '海地',
    [LangCode.en]: 'Haiti'
  },
  //{  value: 'BL+590', label: '+590', [LangCode.zhTW]: '聖巴泰勒米', [LangCode.en]: 'Saint Barthélemy' },
  //{  value: 'GP+590', label: '+590', [LangCode.zhTW]: '瓜德羅普', [LangCode.en]: 'Guadeloupe' },
  {
    value: 'MF+590',
    label: '+590',
    [LangCode.zhTW]: '聖馬丁',
    [LangCode.en]: 'Saint Martin'
  },
  {
    value: 'BO+591',
    label: '+591',
    [LangCode.zhTW]: '玻利維亞',
    [LangCode.en]: 'Bolivia'
  },
  {
    value: 'EC+593',
    label: '+593',
    [LangCode.zhTW]: '厄瓜多爾',
    [LangCode.en]: 'Ecuador'
  },
  {
    value: 'GF+594',
    label: '+594',
    [LangCode.zhTW]: '法屬圭亞那',
    [LangCode.en]: 'French Guiana'
  },
  //{  value: 'GY+595', label: '+595', [LangCode.zhTW]: '圭亞那', [LangCode.en]: 'Guyana' },
  {
    value: 'PY+595',
    label: '+595',
    [LangCode.zhTW]: '巴拉圭',
    [LangCode.en]: 'Paraguay'
  },
  {
    value: 'MQ+596',
    label: '+596',
    [LangCode.zhTW]: '馬提尼克',
    [LangCode.en]: 'Martinique'
  },
  {
    value: 'SR+597',
    label: '+597',
    [LangCode.zhTW]: '蘇里南',
    [LangCode.en]: 'Suriname'
  },
  {
    value: 'UY+598',
    label: '+598',
    [LangCode.zhTW]: '烏拉圭',
    [LangCode.en]: 'Uruguay'
  },
  {
    value: 'AN+599',
    label: '+599',
    [LangCode.zhTW]: '荷屬安的列斯',
    [LangCode.en]: 'Netherlands Antilles'
  },
  {
    value: 'TL+670',
    label: '+670',
    [LangCode.zhTW]: '東帝汶',
    [LangCode.en]: 'Timor-Leste'
  },
  //{  value: 'NF+672', label: '+672', [LangCode.zhTW]: '諾福克島', [LangCode.en]: 'Norfolk Island' },
  {
    value: 'AQ+672',
    label: '+672',
    [LangCode.zhTW]: '南極洲',
    [LangCode.en]: 'Antarctica'
  },
  {
    value: 'BN+673',
    label: '+673',
    [LangCode.zhTW]: '汶萊',
    [LangCode.en]: 'Brunei Darussalam'
  },
  {
    value: 'NR+674',
    label: '+674',
    [LangCode.zhTW]: '瑙魯',
    [LangCode.en]: 'Nauru'
  },
  {
    value: 'PG+675',
    label: '+675',
    [LangCode.zhTW]: '巴布亞新幾內亞',
    [LangCode.en]: 'Papua New Guinea'
  },
  {
    value: 'TO+676',
    label: '+676',
    [LangCode.zhTW]: '湯加',
    [LangCode.en]: 'Tonga'
  },
  {
    value: 'SB+677',
    label: '+677',
    [LangCode.zhTW]: '所羅門群島',
    [LangCode.en]: 'Solomon Islands'
  },
  {
    value: 'VU+678',
    label: '+678',
    [LangCode.zhTW]: '瓦努阿圖',
    [LangCode.en]: 'Vanuatu'
  },
  {
    value: 'FJ+679',
    label: '+679',
    [LangCode.zhTW]: '斐濟',
    [LangCode.en]: 'Fiji'
  },
  {
    value: 'PW+680',
    label: '+680',
    [LangCode.zhTW]: '帛琉',
    [LangCode.en]: 'Palau'
  },
  {
    value: 'WF+681',
    label: '+681',
    [LangCode.zhTW]: '瓦利斯和富圖納',
    [LangCode.en]: 'Wallis and Futuna'
  },
  {
    value: 'CK+682',
    label: '+682',
    [LangCode.zhTW]: '庫克群島',
    [LangCode.en]: 'Cook Islands'
  },
  {
    value: 'NU+683',
    label: '+683',
    [LangCode.zhTW]: '紐埃',
    [LangCode.en]: 'Niue'
  },
  {
    value: 'WS+685',
    label: '+685',
    [LangCode.zhTW]: '薩摩亞',
    [LangCode.en]: 'Samoa'
  },
  {
    value: 'KI+686',
    label: '+686',
    [LangCode.zhTW]: '基里巴斯',
    [LangCode.en]: 'Kiribati'
  },
  {
    value: 'NC+687',
    label: '+687',
    [LangCode.zhTW]: '新喀裡多尼亞',
    [LangCode.en]: 'New Caledonia'
  },
  {
    value: 'TV+688',
    label: '+688',
    [LangCode.zhTW]: '圖瓦盧',
    [LangCode.en]: 'Tuvalu'
  },
  {
    value: 'PF+689',
    label: '+689',
    [LangCode.zhTW]: '法屬波利尼西亞',
    [LangCode.en]: 'French Polynesia'
  },
  {
    value: 'TK+690',
    label: '+690',
    [LangCode.zhTW]: '托克勞',
    [LangCode.en]: 'Tokelau'
  },
  {
    value: 'FM+691',
    label: '+691',
    [LangCode.zhTW]: '密克羅尼西亞聯邦',
    [LangCode.en]: 'Micronesia'
  },
  {
    value: 'MH+692',
    label: '+692',
    [LangCode.zhTW]: '馬紹爾群島',
    [LangCode.en]: 'Marshall Islands'
  },
  {
    value: 'KP+850',
    label: '+850',
    [LangCode.zhTW]: '朝鮮',
    [LangCode.en]: 'North Korea'
  },
  {
    value: 'HK+852',
    label: '+852',
    [LangCode.zhTW]: '香港',
    [LangCode.en]: 'Hong Kong'
  },
  {
    value: 'MO+853',
    label: '+853',
    [LangCode.zhTW]: '澳門',
    [LangCode.en]: 'Macau'
  },
  {
    value: 'KH+855',
    label: '+855',
    [LangCode.zhTW]: '柬埔寨',
    [LangCode.en]: 'Cambodia'
  },
  {
    value: 'LA+856',
    label: '+856',
    [LangCode.zhTW]: '寮國',
    [LangCode.en]: 'Laos'
  },
  {
    value: 'PN+872',
    label: '+872',
    [LangCode.zhTW]: '皮特肯群島',
    [LangCode.en]: 'Pitcairn Islands'
  },
  {
    value: 'BD+880',
    label: '+880',
    [LangCode.zhTW]: '孟加拉國',
    [LangCode.en]: 'Bangladesh'
  },
  {
    value: 'MV+960',
    label: '+960',
    [LangCode.zhTW]: '馬爾代夫',
    [LangCode.en]: 'Maldives'
  },
  {
    value: 'LB+961',
    label: '+961',
    [LangCode.zhTW]: '黎巴嫩',
    [LangCode.en]: 'Lebanon'
  },
  {
    value: 'JO+962',
    label: '+962',
    [LangCode.zhTW]: '約旦',
    [LangCode.en]: 'Jordan'
  },
  {
    value: 'SY+963',
    label: '+963',
    [LangCode.zhTW]: '敘利亞',
    [LangCode.en]: 'Syria'
  },
  {
    value: 'IQ+964',
    label: '+964',
    [LangCode.zhTW]: '伊拉克',
    [LangCode.en]: 'Iraq'
  },
  {
    value: 'KW+965',
    label: '+965',
    [LangCode.zhTW]: '科威特',
    [LangCode.en]: 'Kuwait'
  },
  {
    value: 'SA+966',
    label: '+966',
    [LangCode.zhTW]: '沙烏地阿拉伯',
    [LangCode.en]: 'Saudi Arabia'
  },
  {
    value: 'YE+967',
    label: '+967',
    [LangCode.zhTW]: '葉門',
    [LangCode.en]: 'Yemen'
  },
  {
    value: 'OM+968',
    label: '+968',
    [LangCode.zhTW]: '阿曼',
    [LangCode.en]: 'Oman'
  },
  {
    value: 'PS+970',
    label: '+970',
    [LangCode.zhTW]: '巴勒斯坦',
    [LangCode.en]: 'Palestine'
  },
  {
    value: 'AE+971',
    label: '+971',
    [LangCode.zhTW]: '阿拉伯聯合酋長國',
    [LangCode.en]: 'United Arab Emirates'
  },
  {
    value: 'IL+972',
    label: '+972',
    [LangCode.zhTW]: '以色列',
    [LangCode.en]: 'Israel'
  },
  {
    value: 'BH+973',
    label: '+973',
    [LangCode.zhTW]: '巴林',
    [LangCode.en]: 'Bahrain'
  },
  {
    value: 'QA+974',
    label: '+974',
    [LangCode.zhTW]: '卡塔爾',
    [LangCode.en]: 'Qatar'
  },
  {
    value: 'BT+975',
    label: '+975',
    [LangCode.zhTW]: '不丹',
    [LangCode.en]: 'Bhutan'
  },
  {
    value: 'MN+976',
    label: '+976',
    [LangCode.zhTW]: '蒙古',
    [LangCode.en]: 'Mongolia'
  },
  {
    value: 'NP+977',
    label: '+977',
    [LangCode.zhTW]: '尼泊爾',
    [LangCode.en]: 'Nepal'
  },
  {
    value: 'TJ+992',
    label: '+992',
    [LangCode.zhTW]: '塔吉克',
    [LangCode.en]: 'Tajikistan'
  },
  {
    value: 'TM+993',
    label: '+993',
    [LangCode.zhTW]: '土庫曼',
    [LangCode.en]: 'Turkmenistan'
  },
  {
    value: 'AZ+994',
    label: '+994',
    [LangCode.zhTW]: '阿塞拜疆',
    [LangCode.en]: 'Azerbaijan'
  },
  {
    value: 'GE+995',
    label: '+995',
    [LangCode.zhTW]: '喬治亞',
    [LangCode.en]: 'Georgia'
  },
  {
    value: 'KG+996',
    label: '+996',
    [LangCode.zhTW]: '吉爾吉斯斯坦',
    [LangCode.en]: 'Kyrgyzstan'
  },
  {
    value: 'UZ+998',
    label: '+998',
    [LangCode.zhTW]: '烏茲別克',
    [LangCode.en]: 'Uzbekistan'
  },
  {
    value: 'BS+1242',
    label: '+1242',
    [LangCode.zhTW]: '巴哈馬',
    [LangCode.en]: 'Bahamas'
  },
  {
    value: 'BB+1246',
    label: '+1246',
    [LangCode.zhTW]: '巴巴多斯',
    [LangCode.en]: 'Barbados'
  },
  {
    value: 'AI+1264',
    label: '+1264',
    [LangCode.zhTW]: '安圭拉',
    [LangCode.en]: 'Anguilla'
  },
  {
    value: 'AG+1268',
    label: '+1268',
    [LangCode.zhTW]: '安提瓜和巴布達',
    [LangCode.en]: 'Antigua and Barbuda'
  },
  {
    value: 'VG+1284',
    label: '+1284',
    [LangCode.zhTW]: '英屬維京群島',
    [LangCode.en]: 'British Virgin Islands'
  },
  {
    value: 'VI+1340',
    label: '+1340',
    [LangCode.zhTW]: '美屬維京群島',
    [LangCode.en]: 'U.S. Virgin Islands'
  },
  {
    value: 'BM+1441',
    label: '+1441',
    [LangCode.zhTW]: '百慕達',
    [LangCode.en]: 'Bermuda'
  },
  {
    value: 'GD+1473',
    label: '+1473',
    [LangCode.zhTW]: '格林納達',
    [LangCode.en]: 'Grenada'
  },
  {
    value: 'TC+1649',
    label: '+1649',
    [LangCode.zhTW]: '特克斯和凱科斯群島',
    [LangCode.en]: 'Turks and Caicos Islands'
  },
  {
    value: 'MS+1664',
    label: '+1664',
    [LangCode.zhTW]: '蒙塞拉特島',
    [LangCode.en]: 'Montserrat'
  },
  {
    value: 'MP+1670',
    label: '+1670',
    [LangCode.zhTW]: '北馬裡亞納群島',
    [LangCode.en]: 'Northern Mariana Islands'
  },
  {
    value: 'GU+1671',
    label: '+1671',
    [LangCode.zhTW]: '關島',
    [LangCode.en]: 'Guam'
  },
  {
    value: 'AS+1684',
    label: '+1684',
    [LangCode.zhTW]: '美屬薩摩亞',
    [LangCode.en]: 'American Samoa'
  },
  {
    value: 'LC+1758',
    label: '+1758',
    [LangCode.zhTW]: '聖盧西亞',
    [LangCode.en]: 'Saint Lucia'
  },
  {
    value: 'DM+1767',
    label: '+1767',
    [LangCode.zhTW]: '多米尼克',
    [LangCode.en]: 'Dominica'
  },
  {
    value: 'VC+1784',
    label: '+1784',
    [LangCode.zhTW]: '聖文森及格瑞那丁',
    [LangCode.en]: 'Saint Vincent and the Grenadines'
  },
  {
    value: 'DO+1849',
    label: '+1849',
    [LangCode.zhTW]: '多米尼加共和國',
    [LangCode.en]: 'Dominican Republic'
  },
  {
    value: 'TT+1868',
    label: '+1868',
    [LangCode.zhTW]: '特立尼達和多巴哥',
    [LangCode.en]: 'Trinidad and Tobago'
  },
  {
    value: 'KN+1869',
    label: '+1869',
    [LangCode.zhTW]: '聖克里斯多福及尼維斯',
    [LangCode.en]: 'Saint Kitts and Nevis'
  },
  {
    value: 'JM+1876',
    label: '+1876',
    [LangCode.zhTW]: '牙買加',
    [LangCode.en]: 'Jamaica'
  },
  {
    value: 'PR+1939',
    label: '+1939',
    [LangCode.zhTW]: '波多黎各',
    [LangCode.en]: 'Puerto Rico'
  }
];
// prettier-ignore
const icpArray = [
  '+886',
  '+1',
  '+7',
  '+20',
  '+27',
  '+30',
  '+31',
  '+32',
  '+33',
  '+34',
  '+36',
  '+39',
  '+40',
  '+41',
  '+43',
  '+44',
  '+45',
  '+46',
  '+47',
  '+48',
  '+49',
  '+51',
  '+52',
  '+53',
  '+54',
  '+55',
  '+56',
  '+57',
  '+58',
  '+60',
  '+61',
  '+62',
  '+63',
  '+64',
  '+65',
  '+66',
  '+81',
  '+82',
  '+84',
  '+86',
  '+90',
  '+91',
  '+92',
  '+93',
  '+94',
  '+95',
  '+98',
  '+211',
  '+212',
  '+213',
  '+216',
  '+218',
  '+220',
  '+221',
  '+222',
  '+223',
  '+224',
  '+225',
  '+226',
  '+227',
  '+228',
  '+229',
  '+230',
  '+231',
  '+232',
  '+233',
  '+234',
  '+235',
  '+236',
  '+237',
  '+238',
  '+239',
  '+240',
  '+241',
  '+242',
  '+243',
  '+244',
  '+245',
  '+246',
  '+248',
  '+249',
  '+250',
  '+251',
  '+252',
  '+253',
  '+254',
  '+255',
  '+256',
  '+257',
  '+258',
  '+260',
  '+261',
  '+262',
  '+263',
  '+264',
  '+265',
  '+266',
  '+267',
  '+268',
  '+269',
  '+290',
  '+291',
  '+297',
  '+298',
  '+299',
  '+345',
  '+350',
  '+351',
  '+352',
  '+353',
  '+354',
  '+355',
  '+356',
  '+357',
  '+358',
  '+359',
  '+370',
  '+371',
  '+372',
  '+373',
  '+374',
  '+375',
  '+376',
  '+377',
  '+378',
  '+379',
  '+380',
  '+381',
  '+382',
  '+385',
  '+386',
  '+387',
  '+389',
  '+420',
  '+421',
  '+423',
  '+500',
  '+501',
  '+502',
  '+503',
  '+504',
  '+505',
  '+506',
  '+507',
  '+508',
  '+509',
  '+590',
  '+591',
  '+593',
  '+594',
  '+595',
  '+596',
  '+597',
  '+598',
  '+599',
  '+670',
  '+672',
  '+673',
  '+674',
  '+675',
  '+676',
  '+677',
  '+678',
  '+679',
  '+680',
  '+681',
  '+682',
  '+683',
  '+685',
  '+686',
  '+687',
  '+688',
  '+689',
  '+690',
  '+691',
  '+692',
  '+850',
  '+852',
  '+853',
  '+855',
  '+856',
  '+872',
  '+880',
  '+960',
  '+961',
  '+962',
  '+963',
  '+964',
  '+965',
  '+966',
  '+967',
  '+968',
  '+970',
  '+971',
  '+972',
  '+973',
  '+974',
  '+975',
  '+976',
  '+977',
  '+992',
  '+993',
  '+994',
  '+995',
  '+996',
  '+998',
  '+1242',
  '+1246',
  '+1264',
  '+1268',
  '+1284',
  '+1340',
  '+1441',
  '+1473',
  '+1649',
  '+1664',
  '+1670',
  '+1671',
  '+1684',
  '+1758',
  '+1767',
  '+1784',
  '+1849',
  '+1868',
  '+1869',
  '+1876',
  '+1939'
];

Object.freeze(CountryCodeArray);

export { icpArray };
export default CountryCodeArray;
