import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type FullName = {
  __typename?: 'FullName',
  firstName: Scalars['String'],
  surname: Scalars['String'],
};

export type Mutation = {
  __typename?: 'Mutation',
  updateFullname: User,
};


export type MutationUpdateFullnameArgs = {
  firstName: Scalars['String'],
  surname: Scalars['String']
};

export type Permission = {
  __typename?: 'Permission',
  type: PermissionType,
};

export enum PermissionType {
  WriteComments = 'WRITE_COMMENTS',
  ChangeName = 'CHANGE_NAME',
  CancelPremium = 'CANCEL_PREMIUM',
  Cry = 'CRY',
  KickChildren = 'KICK_CHILDREN'
}

export type Query = {
  __typename?: 'Query',
  user: User,
  self: User,
};


export type QueryUserArgs = {
  id: Scalars['String']
};

export enum Status {
  Active = 'ACTIVE',
  Unactive = 'UNACTIVE',
  Blocked = 'BLOCKED'
}

export type Subscription = {
  __typename?: 'Subscription',
  type: SubscriptionType,
};

export enum SubscriptionType {
  None = 'NONE',
  Basic = 'BASIC',
  Premium = 'PREMIUM'
}

export type User = {
  __typename?: 'User',
  id: Scalars['String'],
  status: Status,
  subscription: Subscription,
  permissions: Array<Maybe<Permission>>,
  name: FullName,
};


export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  String: ResolverTypeWrapper<Scalars['String']>,
  User: ResolverTypeWrapper<User>,
  Status: Status,
  Subscription: ResolverTypeWrapper<{}>,
  SubscriptionType: SubscriptionType,
  Permission: ResolverTypeWrapper<Permission>,
  PermissionType: PermissionType,
  FullName: ResolverTypeWrapper<FullName>,
  Mutation: ResolverTypeWrapper<{}>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  String: Scalars['String'],
  User: User,
  Status: Status,
  Subscription: {},
  SubscriptionType: SubscriptionType,
  Permission: Permission,
  PermissionType: PermissionType,
  FullName: FullName,
  Mutation: {},
  Boolean: Scalars['Boolean'],
};

export type FullNameResolvers<ContextType = any, ParentType extends ResolversParentTypes['FullName'] = ResolversParentTypes['FullName']> = {
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  surname?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  updateFullname?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateFullnameArgs, 'firstName' | 'surname'>>,
};

export type PermissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Permission'] = ResolversParentTypes['Permission']> = {
  type?: Resolver<ResolversTypes['PermissionType'], ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>,
  self?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  type?: SubscriptionResolver<ResolversTypes['SubscriptionType'], "type", ParentType, ContextType>,
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>,
  subscription?: Resolver<ResolversTypes['Subscription'], ParentType, ContextType>,
  permissions?: Resolver<Array<Maybe<ResolversTypes['Permission']>>, ParentType, ContextType>,
  name?: Resolver<ResolversTypes['FullName'], ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  FullName?: FullNameResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Permission?: PermissionResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
