const util = require('./util');

const AK = process.env['QINIU_AK'];
const SK = process.env['QINIU_SK'];

/**
 * 生成七牛云RTC roomToken
 * @param {String} roomName 房间名称
 * @param {String} userId 用户ID
 * @param {Date} expireAt 过期时间
 */
function genRoomToken(roomName, userId, expireAt) {
  const roomAccess = {
    appId: process.env['QINIU_RTC_APPID'],
    roomName: roomName,
    userId: userId,
    expireAt: Math.floor(expireAt / 1000),
    permission: 'user',
  };
  const str = JSON.stringify(roomAccess);
  const encodedStr = util.urlsafeBase64Encode(str);
  const sign = util.hmacSha1(encodedStr, SK);
  const encodedSign = util.base64ToUrlSafe(sign);

  const token = AK + ':' + encodedSign + ':' + encodedStr;
  return token;
}

module.exports = { genRoomToken };
