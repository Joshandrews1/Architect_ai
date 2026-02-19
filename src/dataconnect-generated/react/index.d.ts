import { CreateBusinessProfileData, CreateBusinessProfileVariables, ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables, UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables, GetUserByEmailData, GetUserByEmailVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateBusinessProfile(options?: useDataConnectMutationOptions<CreateBusinessProfileData, FirebaseError, CreateBusinessProfileVariables>): UseDataConnectMutationResult<CreateBusinessProfileData, CreateBusinessProfileVariables>;
export function useCreateBusinessProfile(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBusinessProfileData, FirebaseError, CreateBusinessProfileVariables>): UseDataConnectMutationResult<CreateBusinessProfileData, CreateBusinessProfileVariables>;

export function useListRecommendationsForGrowthAudit(vars: ListRecommendationsForGrowthAuditVariables, options?: useDataConnectQueryOptions<ListRecommendationsForGrowthAuditData>): UseDataConnectQueryResult<ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables>;
export function useListRecommendationsForGrowthAudit(dc: DataConnect, vars: ListRecommendationsForGrowthAuditVariables, options?: useDataConnectQueryOptions<ListRecommendationsForGrowthAuditData>): UseDataConnectQueryResult<ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables>;

export function useUpdateStrategySessionClientNotes(options?: useDataConnectMutationOptions<UpdateStrategySessionClientNotesData, FirebaseError, UpdateStrategySessionClientNotesVariables>): UseDataConnectMutationResult<UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables>;
export function useUpdateStrategySessionClientNotes(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateStrategySessionClientNotesData, FirebaseError, UpdateStrategySessionClientNotesVariables>): UseDataConnectMutationResult<UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables>;

export function useGetUserByEmail(vars: GetUserByEmailVariables, options?: useDataConnectQueryOptions<GetUserByEmailData>): UseDataConnectQueryResult<GetUserByEmailData, GetUserByEmailVariables>;
export function useGetUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: useDataConnectQueryOptions<GetUserByEmailData>): UseDataConnectQueryResult<GetUserByEmailData, GetUserByEmailVariables>;
