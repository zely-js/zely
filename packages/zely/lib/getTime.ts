function transform(t: number): string {
  let time = String(t);

  if (time.length === 1) {
    time = `0${time}`;
  }

  return time;
}

export function getTime() {
  const date = new Date();

  const hours = transform(date.getHours() % 12 ? date.getHours() % 12 : 12);
  const min = transform(date.getMinutes());
  const sec = transform(date.getSeconds());
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  return `[${hours}:${min}:${sec} ${ampm}]`;
}
