class Helper {
  removeEndComma(str) {
    return str.replace(/,\s*$/, "");
  }

  removeStartEndComma(str) {
    return str.replace(/^\s*,+\s*|\s*,+\s*$/g, "");
  }

  getJSDateObject(inputDate) {
    const date = new Date(inputDate);
    const offset = date.getTimezoneOffset();
    if (offset < 0) {
      date.setHours(12, 0, 0);
    }
    return date.toISOString().substring(0, 10);
  }
}

export default new Helper();
