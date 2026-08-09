// Without an explicit timeZone, Intl.DateTimeFormat falls back to the
// runtime's default - UTC on Vercel's servers, not the customer's local
// time. Ruvaya only serves India, so pin formatting to IST explicitly
// rather than trusting the server's default.
const IST = "Asia/Kolkata";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: IST,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: IST,
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}
