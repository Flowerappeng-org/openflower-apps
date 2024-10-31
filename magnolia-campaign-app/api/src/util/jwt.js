// const jwt = require("jsonwebtoken");

// module.exports.sign = async (user) => {
//   console.log('[sign]', process.env.JWT_SECRET)
//   const token = await jwt.sign(
//     { id: user.id, username: user.username, email: user.email },
//     'JOHN_TEST'//process.env.JWT_SECRET
//   );
//   return token;
// };

// module.exports.verify = async (token) => {
//   const decoded = await jwt.verify(token, 'JOHN_TEST'); // process.env.JWT_SECRET
//   return decoded;
// };
