import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface BusinessProfile_Key {
  id: UUIDString;
  __typename?: 'BusinessProfile_Key';
}

export interface CreateBusinessProfileData {
  businessProfile_insert: BusinessProfile_Key;
}

export interface CreateBusinessProfileVariables {
  userId: UUIDString;
  name: string;
  websiteUrl: string;
  createdAt: TimestampString;
  description?: string | null;
  targetAudience?: string | null;
}

export interface GetUserByEmailData {
  users: ({
    id: UUIDString;
    displayName: string;
    email: string;
    phoneNumber?: string | null;
    companyName?: string | null;
    industry?: string | null;
    createdAt: TimestampString;
  } & User_Key)[];
}

export interface GetUserByEmailVariables {
  email: string;
}

export interface GrowthAudit_Key {
  id: UUIDString;
  __typename?: 'GrowthAudit_Key';
}

export interface ListRecommendationsForGrowthAuditData {
  recommendations: ({
    id: UUIDString;
    category: string;
    description: string;
    effortScore?: number | null;
    impactScore?: number | null;
    priority: number;
  } & Recommendation_Key)[];
}

export interface ListRecommendationsForGrowthAuditVariables {
  growthAuditId: UUIDString;
}

export interface Recommendation_Key {
  id: UUIDString;
  __typename?: 'Recommendation_Key';
}

export interface StrategySession_Key {
  id: UUIDString;
  __typename?: 'StrategySession_Key';
}

export interface UpdateStrategySessionClientNotesData {
  strategySession_update?: StrategySession_Key | null;
}

export interface UpdateStrategySessionClientNotesVariables {
  id: UUIDString;
  clientNotes?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateBusinessProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBusinessProfileVariables): MutationRef<CreateBusinessProfileData, CreateBusinessProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBusinessProfileVariables): MutationRef<CreateBusinessProfileData, CreateBusinessProfileVariables>;
  operationName: string;
}
export const createBusinessProfileRef: CreateBusinessProfileRef;

export function createBusinessProfile(vars: CreateBusinessProfileVariables): MutationPromise<CreateBusinessProfileData, CreateBusinessProfileVariables>;
export function createBusinessProfile(dc: DataConnect, vars: CreateBusinessProfileVariables): MutationPromise<CreateBusinessProfileData, CreateBusinessProfileVariables>;

interface ListRecommendationsForGrowthAuditRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListRecommendationsForGrowthAuditVariables): QueryRef<ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListRecommendationsForGrowthAuditVariables): QueryRef<ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables>;
  operationName: string;
}
export const listRecommendationsForGrowthAuditRef: ListRecommendationsForGrowthAuditRef;

export function listRecommendationsForGrowthAudit(vars: ListRecommendationsForGrowthAuditVariables): QueryPromise<ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables>;
export function listRecommendationsForGrowthAudit(dc: DataConnect, vars: ListRecommendationsForGrowthAuditVariables): QueryPromise<ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables>;

interface UpdateStrategySessionClientNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStrategySessionClientNotesVariables): MutationRef<UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStrategySessionClientNotesVariables): MutationRef<UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables>;
  operationName: string;
}
export const updateStrategySessionClientNotesRef: UpdateStrategySessionClientNotesRef;

export function updateStrategySessionClientNotes(vars: UpdateStrategySessionClientNotesVariables): MutationPromise<UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables>;
export function updateStrategySessionClientNotes(dc: DataConnect, vars: UpdateStrategySessionClientNotesVariables): MutationPromise<UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables>;

interface GetUserByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  operationName: string;
}
export const getUserByEmailRef: GetUserByEmailRef;

export function getUserByEmail(vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;
export function getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

