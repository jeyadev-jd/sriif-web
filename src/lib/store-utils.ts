// Pure helpers shared by the browser store and the server.
export function nowStamp() {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;
}
