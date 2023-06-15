export default function generateRandomString() {
  return Math.random().toString(36).substr(2, 11);
}
