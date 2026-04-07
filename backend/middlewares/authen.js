const jwt = require('jsonwebtoken');
const tokenService = require('../services/tokenService');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) {
      console.log(err);
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) return res.sendStatus(403);

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
        if (err) return res.sendStatus(403);

        const storedToken = await tokenService.findByToken(refreshToken);

        if (!storedToken || storedToken.isrevoked) return res.sendStatus(403);

        const newPayload = { userid: payload.userid, username: payload.username, isactived: payload.isactived };
        const accessToken = jwt.sign(newPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        res.setHeader("Authorization", "Bearer " + accessToken);
        req.payload = payload;
        console.log("Token đã được làm mới");
        return next();
      });
    } else {
      req.payload = payload;
      console.log("Token hợp lệ, truy cập được phép");
      return next(); 
    }
  });
}

module.exports = { authenticateToken };