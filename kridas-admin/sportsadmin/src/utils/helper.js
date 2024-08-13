class Helper {
  regExp = {
    emailRegex: RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/),
  };

  validateEmail(emailText) {
    return this.regExp.emailRegex.test(emailText);
  }

  getLookupValueFromKey(keyName, lookupArray) {
    if (keyName == null || keyName === null) return "";

    const lookupObj =
      lookupArray !== null && lookupArray.find((x) => x.lookupKey === keyName);
    return !(lookupObj == null) ? lookupObj.lookupValue : null;
  }

  getGenderName(genderCode) {
    if (genderCode == null || genderCode === null) return "";

    switch (genderCode) {
      case "M":
        return "Male";
      case "F":
        return "Female";
      case "O":
        return "Others";
      default:
        return "";
    }
  }

  getFormattedDate(dateString) {
    return new Date(dateString).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

export default new Helper();
