import * as moment from "moment";
import localization from "moment/locale/en-sg";
import * as momentTime from "moment-timezone";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import AuthService from "../../service/AuthService";
import { addDays, subMonths } from "date-fns";
import MasterData from "./masterdata";

class Helper {
  regExp = {
    emailRegex: RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/),
  };

  //Properties for Price Columns
  amountProperties = {
    decimalScale: 2,
    allowNegative: false,
    fixedDecimalScale: true,
    defaultValue: 0.0,
    thousandSeparator: true,
    style: { textAlign: "right" },
  };

  //Properties for integer columns
  integerProperties = {
    allowNegative: false,
    defaultValue: 1,
  };

  validateEmail(emailText) {
    return this.regExp.emailRegex.test(emailText);
  }

  calculateBMI(height, weight) {
    return weight / (((height / 100) * height) / 100);
  }

  getYears() {
    let allYears = [];
    for (let x = 1950; x <= new Date().getFullYear(); x++) {
      allYears.push(x);
    }
    return allYears;
  }

  getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");

      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return "";
  }

  /* Get date formatted in particular locale */
  getFormattedDate(dateString, formatString) {
    if (dateString === null) return dateString;
    //Get locale

    const countryLocale = MasterData.getLocaleBasedOnCountry(
      AuthService.getAllCompanyInfo() !== null
        ? AuthService.getAllCompanyInfo().companyDTO.addressDTO.country
        : "en-SG"
    );

    return moment(dateString)
      .locale(countryLocale, localization)
      .format(formatString);
  }

  /*
  Function Name: getDateTimeFromUTCWithAllParams
  Description: Get datetime from UTC datetime
  Parameters: datetime, format string, timezone
  Returns: Date & Time format string in user's timezone
  */
  getDateTimeFromUTCWithAllParams(dateString, formatStr, timeZone) {
    if (dateString === null) return dateString;
    return momentTime.tz(moment.utc(dateString), timeZone).format(formatStr);
  }

  /*
  Function Name: getDateTimeFormat
  Description: Get logged in user's datetime from UTC datetime
  Parameters: datetime, format string
  Returns: Date & Time format string in user's timezone
  */
  getDateTimeFromUTC(dateString, formatStr) {
    console.log("date string " + dateString);
    return this.getDateTimeFromUTCWithAllParams(
      dateString,
      formatStr,
      AuthService.getAllCompanyInfo().companyDTO.companyTimezoneText
    );
  }

  /* Get UTC datetime */
  getCurrentUTCDateTime() {
    return moment.utc().format();
  }

  getCurrentDateTime() {
    return moment().format();
  }

  /*Coverts current time to specific timezone*/
  getCurrentTimeBasedOnZone() {
    const timezoneString = AuthService.getAllCompanyInfo().companyDTO
      .companyTimezoneText; //Need to fetch from local storage
    return momentTime.tz(moment(), timezoneString).format();
  }

  /* MOMENTJS - Returns today's date, TBD - check for timezone requirements */

  getTodayMJS() {
    return moment();
  }

  /* Returns Today - No_of_months */
  getTodayMinusMonthsMJS(value) {
    return moment().subtract(value, "months");
  }

  /* Date Fns - Returns today's date, TBD - check for timezone requirements */
  getTodayFNS() {
    return new Date();
  }

  /* Date Fns - Returns Today - No_of_months */
  getTodayMinusMonthsFNS(value) {
    return subMonths(new Date(), value);
  }

  /* Use for Creation / Modified Date to be sent to server */
  getCreatedModifiedDateTime() {
    return this.getCurrentDateTime();
  }

  getGenderName(genderCode) {
    if (
      genderCode === null ||
      (genderCode !== null && genderCode.trim().length === 0)
    ) {
      return "";
    }

    return genderCode === "M" ? "Male" : "Female";
  }

  descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => this.descendingComparator(a, b, orderBy)
      : (a, b) => -this.descendingComparator(a, b, orderBy);
  }

  stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  validatePhoneNumber(dialCode, phoneNumber) {
    // setErrors({});
    let testno = "+" + dialCode + " " + phoneNumber;
    phoneNumber = testno;

    /*
        Phone number validation using google-libphonenumber
        */
    let valid = false;
    try {
      const phoneUtil = PhoneNumberUtil.getInstance();
      valid = phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber));
    } catch (e) {
      valid = false;
    }
    if (valid) {
      return true;
    } else {
      return false;
    }
  }

  toLocalTimezone(dateStr) {
    // Construct a local timezone date string ignoring the source timezone
    const dateStrNoTz = moment(dateStr)
      .tz(this.state.timezone)
      .format("YYYY-MM-DDTHH:mm:ss");
    return moment(dateStrNoTz).format();
  }

  toTargetTimezone(dateStr) {
    // Construct a target timezone date string ignoring the source timezone
    const dateStrNoTz = moment(dateStr).format("YYYY-MM-DDTHH:mm:ss");
    return moment.tz(dateStrNoTz, this.state.timezone).format();
  }

  removeEndComma(str) {
    return str.replace(/,\s*$/, "");
  }

  removeStartEndComma(str) {
    return str.replace(/^\s*,+\s*|\s*,+\s*$/g, "");
  }

  reducer(state, { field, value }) {
    return {
      ...state,
      [field]: value,
    };
  }

  getCountryLocale(country) {
    return MasterData.getLocaleBasedOnCountry(country);
  }

  /*
  Function Name: getFormattedNumber
  Description: Formats number based on logged in user's company country
  Parameters: 1. number - value to be formatted
  Returns: Formatted number
  */
  getFormattedNumber(number) {
    const countryLocale = MasterData.getLocaleBasedOnCountry(
      AuthService.getAllCompanyInfo().companyDTO.addressDTO.country
    );
    return this.getFormattedNumberBasedOnLocale(
      number,
      countryLocale,
      AuthService.getLoggedInCompanyCurrencyCode()
    );
  }

  /*
  Function Name: getFormattedNumberBasedOnLocale
  Description: Formats number based on locale, currency code
  Parameters: 1. number - value to be formatted
              2. locale - locale of the country
              3. currenyCode - currency code of the country
  Returns: Formatted number
  */
  getFormattedNumberBasedOnLocale(number, locale, currencyCode) {
    return new Intl.NumberFormat(locale, {
      currency: currencyCode,
      style: "currency",
    }).format(number);
  }

  /*
  Function Name: getNumberFromString
  Description: Fetches the first number from the string
  Parameters: 1. str - string 
  Returns: Number 
  */
  getNumberFromString(str) {
    const matches = str.match(/(\d+)/);
    if (matches) {
      return matches[0];
    }
    return "";
  }

  /*
  Function Name: getInputDateFormat
  Description: Date format for accepting date input in forms
  Parameters: None
  Returns: Date format string 
  */
  getInputDateFormat() {
    return "dd/MM/yyyy";
  }

  /*
  Function Name: getDateTimeFormat
  Description: Date format for displaying date with time component
  Parameters: None
  Returns: Date & Time format string 
  */
  getDateTimeFormat() {
    return "DD MMMM YYYY, h:mm a";
  }

  getInputDateFormatByDash() {
    return "dd-MM-yyyy";
  }

  /*
  Function Name: getPriceInputFormatBasedOnCountry
  Description: Format for the amount inputs
  Parameters: None
  Returns: Format Properties 
  */
  getPriceInputFormatBasedOnCountry() {
    const country = AuthService.getAllCompanyInfo().companyDTO.addressDTO
      .country;
    switch (country) {
      case "SGP":
        return {
          decimalScale: 2,
          allowNegative: false,
          fixedDecimalScale: true,
          defaultValue: 0.0,
          thousandSeparator: true,
          style: { textAlign: "right" },
        };
      case "MYS":
        return {
          decimalScale: 2,
          allowNegative: false,
          fixedDecimalScale: true,
          defaultValue: 0.0,
          thousandSeparator: true,
          style: { textAlign: "right" },
        };
      case "PHL":
        return {
          decimalScale: 2,
          allowNegative: false,
          fixedDecimalScale: true,
          defaultValue: 0.0,
          thousandSeparator: true,
          style: { textAlign: "right" },
        };
      case "MMR":
        return {
          decimalScale: 2,
          allowNegative: false,
          fixedDecimalScale: true,
          defaultValue: 0.0,
          thousandSeparator: true,
          style: { textAlign: "right" },
        };

      default:
        return {
          decimalScale: 2,
          allowNegative: false,
          fixedDecimalScale: true,
          defaultValue: 0.0,
          thousandSeparator: true,
          style: { textAlign: "right" },
        };
    }
  }

  /*
  Function Name: getMaxQuantityAllowed
  Description: Maximun limit of quantity allowed in input
  Parameters: None
  Returns: Quantity allowed limit
  */
  getMaxQuantityAllowed() {
    return 999;
  }

  /*
  Function Name: getMaxPriceAllowed
  Description: Maximun limit of price allowed in input
  Parameters: None
  Returns: Price allowed limit
  */
  getMaxPriceAllowed() {
    return 999999;
  }

  getJSDateObject(date) {
    let year = moment(date).format("YYYY");
    let month = moment(date).format("MM");
    let days = moment(date).format("DD");
    let hours = moment(date).hours();
    let mins = moment(date).minutes();

    return new Date(year, month - 1, days, hours, mins);
  }

  getOffset(dateStr, timezoneStr) {
    const companyTime = moment.tz(dateStr, timezoneStr);
    return moment.parseZone(companyTime.format()).utcOffset();
  }
}

export default new Helper();
