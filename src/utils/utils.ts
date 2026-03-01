import { NextRequest } from "next/server";

export const emailRegex =
  /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{6,30}$/; // at least 6 characters, at least one lowercase letter, at least one uppercase letter, at least one digit
export function ensureRequestID(request: NextRequest) {
  const headers = request.headers;
  let reqId = headers.get("X-Request-ID");
  if (!reqId) {
    reqId = crypto.randomUUID();
    headers.set("X-Request-ID", reqId);
  }
  const { pathMethod } = getRequestPath(request);
  return `${reqId} ${pathMethod}`;
}

export function getRequestPath(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams.toString();
  const [method, path] = [
    request.method.toUpperCase(),
    `${pathName}${searchParams ? `?${searchParams}` : ""}`,
  ];
  return {
    method,
    path,
    pathMethod: `${method}: ${path}`,
  };
}

export function getProtectedPathsStarting() {
  return [`/accounts/`];
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

export function formattedDate(date: Date | string, lang: string = "fr") {
  const dateToFormat = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return dateToFormat.toLocaleDateString(lang, options);
}

export function formattedDateTime(date: Date | string, lang: string = "fr") {
  const dateToFormat = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return dateToFormat.toLocaleDateString(lang, options);
}

export function formatNumberInText(text: string, lang = "fr"): string {
  // Step 1: Use a regular expression to find the number in the text
  const regex = /\d+/;
  const found = text.match(regex);

  if (!found) return text; // Return original text if no number found

  // Step 2: Convert the found number into a readable format
  const number = Number.parseInt(found[0], 10);
  const readableNumber = number.toLocaleString(lang);

  // Replace the original number in the text with the readable number
  return text.replace(regex, readableNumber);
}

export function makeTitleToDOMId(title: string) {
  return title.toLowerCase().split(" ").join("_");
}
