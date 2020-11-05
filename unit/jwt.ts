var jsonwebtoken = require('jsonwebtoken')
const secret = 'pure_music';

class JWT {
  generate(value) { // value 为传入值， expires为过期时间，这两者都会在token字符串中题先
    try {
      const token = 'Bearer ' + jsonwebtoken.sign(
        {
          user: value,
          isLogin: true
        },
        secret,
        {expiresIn:'1 year'}
      )
      console.log(token)
      return token
    } catch (e) {
      console.error('jwt sign error --->', e);
      return '';
    }
  }
}

module.exports = JWT;