
const referralCode = (Number) => {
    let referral_code = null;
    var Digit = "0000000";
    if (Number.toString().length !== 1) {
        referral_code = Digit.slice(0, -(-1 + Number.toString().length)) + Number;
        return referral_code;
    }
    else {
        referral_code = Digit + Number;
        return referral_code;
    }
}


module.exports = {
    referralCode
}