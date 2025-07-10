import { createServerFileRoute } from "@tanstack/react-start/server";
import { getUserIdFromAuthHeader, AuthError } from "../../../lib/auth/jwt";
import { json } from "@tanstack/react-start";
import { PostgresJSConnection, PushProcessor, ZQLDatabase } from "@rocicorp/zero/pg";
import postgres from "postgres";
import { schema } from "../../../lib/zero/schema";
import { createMutators } from "../../../lib/zero/mutators";

const pgURL = process.env.ZERO_UPSTREAM_DB;
if (!pgURL) throw new Error('ZERO_UPSTREAM_DB is required');

const processor = new PushProcessor(
  new ZQLDatabase(new PostgresJSConnection(postgres(pgURL)), schema),
);

export const ServerRoute = createServerFileRoute('/api/zero/push').methods({
  POST: async ({request}) => {
    try {
      // Verify the token and get the user ID
      const authHeader = request.headers.get('authorization');
      const userID = await getUserIdFromAuthHeader(authHeader);
      
      const result = await processor.process(
        createMutators(userID ? {sub: userID} : undefined),
        request,
      );
      return json(result);
    } catch (error) {
      // Handle errors
      if (error instanceof AuthError) {
        return json({ error: error.message }, { status: error.statusCode });
      }
      
      // For server errors
      console.error('Server error:', error);
      return json({ error: 'Internal server error' }, { status: 500 });
    }
  },
});