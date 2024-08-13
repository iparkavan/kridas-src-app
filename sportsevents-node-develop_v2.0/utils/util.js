const crypto = require('crypto');

const uuidv4 = () => {
  // return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
  //   (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  // );
  return crypto.randomUUID();
}

const equals = (parameter1, parameter2) => {
  if (parameter1 === parameter2)
    return true
  else
    return false
}

const otpGenerator = () => {
  let otp = Math.floor(100000 + Math.random() * 900000)
  return otp;
}

const feedDefaultContent = {
  "blocks": [
    {
      "key": "54vhe",
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "6ptm2",
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 0,
          "length": 1,
          "key": 0
        }
      ],
      "data": {}
    },
    {
      "key": "afr93",
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }
  ],
  "entityMap": {
    "0": {
      "type": "IMAGE",
      "mutability": "IMMUTABLE",
      "data": {}
    }
  }
}


module.exports = {
  uuidv4,
  equals,
  otpGenerator,
  feedDefaultContent
}