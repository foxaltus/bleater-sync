import { createServerFileRoute } from "@tanstack/react-start/server";
import { getUserIdFromAuthHeader, AuthError } from "../../../lib/auth/jwt";

export const ServerRoute = createServerFileRoute('/api/zero/push').methods({
  POST: async ({request}) => {
    try {
      // Get the authorization header
      const authHeader = request.headers.get('authorization');
      
      // Verify the token and get the user ID
      const userId = await getUserIdFromAuthHeader(authHeader);
      
      // Now you can use the userId for further operations
      return {
        userId,
        message: 'Authentication successful'
      };
    } catch (error) {
      // Handle errors
      if (error instanceof AuthError) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: error.statusCode,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // For server errors
      console.error('Server error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  },
});