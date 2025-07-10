import {CustomMutatorDefs} from '@rocicorp/zero';
import {schema, AuthData} from './schema';

export function createMutators(authData: AuthData | undefined) {
  return {
    likes: {
      add: async (
        tx,
        post_id: string,
      ) => {
        if (!authData) {
          throw new Error('Not authenticated');
        }
        const like = await tx.query.likes
          .where('user_id', authData.sub)
          .where('post_id', post_id)
          .one();
        if (like) {
          return;
        }
        try {
          await tx.mutate.likes.insert({
            user_id: authData.sub,
            post_id: post_id,
          });
        } catch (err) {
          console.error('error liking post', err);
          throw err;
        }
      },

      remove: async (tx, post_id: string) => {
        if (!authData) {
          throw new Error('Not authenticated');
        }
        const like = await tx.query.likes
          .where('user_id', authData.sub)
          .where('post_id', post_id)
          .one();
        if (!like) {
          return;
        }
        await tx.mutate.likes.delete(like);
      },
    },
    post: {
      add: async (
        tx,
        {id, message} : { id: string, message: string }
      ) => {
        if (!authData) {
          throw new Error('Not authenticated');
        }
        if (!message) {
          throw new Error('Message cannot be empty');
        }
        if (message.length > 280) {
          throw new Error('Message exceeds 280 characters');
        }
        try {
          await tx.mutate.post.insert({
            id: id,
            user_id: authData.sub,
            message: message,
            created_at: Date.now(),
          });
        } catch (err) {
          console.error('error posting', err);
          throw err;
        }
      },
    }
  } as const satisfies CustomMutatorDefs<typeof schema>;
}

export type Mutators = ReturnType<typeof createMutators>;
