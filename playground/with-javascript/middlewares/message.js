module.exports.Message = function (req, res, next) {
  req.message = 'Hello World!';

  next();
};
