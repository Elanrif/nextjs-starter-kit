export async function getServerSession() {
  // Retrieve session data from localStorage
  const sessionData = localStorage.getItem("session");

  if (!sessionData) {
    return null; // No session found
  }

  try {
    // Parse the session data
    const session = JSON.parse(sessionData);

    // Validate the structure of the session object
    if (
      session.token &&
      session.refreshToken &&
      session.user &&
      session.user.id &&
      session.user.email
    ) {
      return session;
    } else {
      console.error("Invalid session structure", session);
      return null;
    }
  } catch (error) {
    console.error("Failed to parse session data", error);
    return null;
  }
}
