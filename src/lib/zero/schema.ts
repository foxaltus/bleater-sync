import {
  createSchema,
  definePermissions,
  number,
  relationships,
  string,
  table,
  type ExpressionBuilder,
  type PermissionsConfig,
} from "@rocicorp/zero";

const post = table("post")
  .columns({
    id: string(),
    user_id: string(),
    created_at: number(),
    message: string(),
  })
  .primaryKey("id");

const profiles = table("profiles")
  .columns({
    id: string(),
    name: string(),
    picture: string(),
  })
  .primaryKey("id");

const likes = table("likes")
  .columns({
    post_id: string(),
    user_id: string(),
  })
  .primaryKey("post_id", "user_id");

const postRelationships = relationships(post, ({ one, many }) => ({
  user: one({
    sourceField: ["user_id"],
    destField: ["id"],
    destSchema: profiles,
  }),
  likes: many({
    sourceField: ["id"],
    destField: ["post_id"],
    destSchema: likes,
  }),
}));

export const schema = createSchema({
  tables: [post, profiles, likes],
  relationships: [postRelationships],
});

export type Schema = typeof schema;

type AuthData = {
  // The logged-in user.
  sub: string;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  // Checks if the user exists in a related organization
  const allowIfLoggedIn = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<Schema, keyof Schema["tables"]>
  ) => cmpLit(authData.sub, "IS NOT", null);

  return {
    post: {
      row: {
        select: [allowIfLoggedIn],
      },
    },
  } satisfies PermissionsConfig<AuthData, Schema>;
});
