export default function hello(ctx, next) {
  console.log(Object.keys(ctx));
  next();
}
