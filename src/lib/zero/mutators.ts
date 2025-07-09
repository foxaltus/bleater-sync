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
  } as const satisfies CustomMutatorDefs<typeof schema>;
}

export type Mutators = ReturnType<typeof createMutators>;
