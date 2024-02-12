export default function hello(req, res, next) {
  console.log(req.url);
  next();
}
