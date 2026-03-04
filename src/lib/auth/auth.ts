import { parse } from "cookie";

// This function retrieves the session data from cookies (server-side compatible)
export async function getServerSession(req: any) {
  if (!req || !req.headers || !req.headers.cookie) {
    console.error("No cookies found in the request.");
    return null;
  }

  try {
    // Parse cookies from the request headers
    const cookies = parse(req.headers.cookie);
    const sessionData = cookies.session;

    if (!sessionData) {
      console.warn("No session found in cookies.");
      return null;
    }

    // Parse the session data
    const session = JSON.parse(sessionData);

    // Validate the structure of the session object
    if (
      session?.token &&
      session?.refreshToken &&
      session?.user?.id &&
      session?.user?.email
    ) {
      return session;
    } else {
      console.error("Invalid session structure:", session);
      return null;
    }
  } catch (error) {
    console.error("Failed to parse session data from cookies:", error);
    return null;
  }
}
