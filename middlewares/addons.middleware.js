var mcache = require('memory-cache');

module.exports = {
  cache : () => {
    return (req, res, next) => {
      let key = '__dummyapp__' + req.originalUrl || req.url
      let cachedBody = mcache.get(key)
      if (cachedBody) {
        res.json(JSON.parse(cachedBody))
        return;
      } else {
        res.sendResponse = res.send
        res.send = (body) => {
          mcache.put(key, JSON.stringify(body), process.env.CACHE_DURATION * 1000);
          res.sendResponse(body)
        }
        next()
      }
    }
  }
}