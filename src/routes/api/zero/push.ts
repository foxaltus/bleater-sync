import { createServerFileRoute } from "@tanstack/react-start/server";
import { jwtVerify } from "jose";

// Custom error for authentication failures
class AuthError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

export const ServerRoute = createServerFileRoute('/api/zero/push').methods({
  POST: async ({request}) => {
    try {
      // Get the authorization header
      const authHeader = request.headers.get('authorization');
      
      // Check if the header exists and starts with "Bearer "
      if (!authHeader?.startsWith('Bearer ')) {
        throw new AuthError('Missing or invalid authorization header');
      }
      
      // Extract the token (remove "Bearer " prefix)
      const token = authHeader.substring(7);
      
      // Get the JWT secret from environment variables
      const jwtSecret = process.env.ZERO_AUTH_SECRET || import.meta.env.ZERO_AUTH_SECRET;
      
      if (!jwtSecret) {
        throw new Error('JWT secret is not configured. Set ZERO_AUTH_SECRET in your environment.');
      }
      
      // Verify the JWT token using jose
      const { payload } = await jwtVerify(
        token, 
        new TextEncoder().encode(jwtSecret)
      );
      
      if (!payload.sub) {
        throw new AuthError('Invalid JWT token: missing user ID');
      }
      
      // Return the user ID from the token
      const userId = payload.sub;
      
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