import { jwtVerify } from "jose";

// Custom error for authentication failures
export class AuthError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Verifies a JWT token from an authorization header and returns the user ID
 * @param authHeader The Authorization header value from the request
 * @returns The user ID extracted from the JWT token
 * @throws AuthError if the token is invalid or missing
 */
export async function getUserIdFromAuthHeader(authHeader: string | null): Promise<string> {
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
  return payload.sub;
}
