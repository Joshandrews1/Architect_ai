import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-central1'
};

export const createBusinessProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBusinessProfile', inputVars);
}
createBusinessProfileRef.operationName = 'CreateBusinessProfile';

export function createBusinessProfile(dcOrVars, vars) {
  return executeMutation(createBusinessProfileRef(dcOrVars, vars));
}

export const listRecommendationsForGrowthAuditRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListRecommendationsForGrowthAudit', inputVars);
}
listRecommendationsForGrowthAuditRef.operationName = 'ListRecommendationsForGrowthAudit';

export function listRecommendationsForGrowthAudit(dcOrVars, vars) {
  return executeQuery(listRecommendationsForGrowthAuditRef(dcOrVars, vars));
}

export const updateStrategySessionClientNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStrategySessionClientNotes', inputVars);
}
updateStrategySessionClientNotesRef.operationName = 'UpdateStrategySessionClientNotes';

export function updateStrategySessionClientNotes(dcOrVars, vars) {
  return executeMutation(updateStrategySessionClientNotesRef(dcOrVars, vars));
}

export const getUserByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByEmail', inputVars);
}
getUserByEmailRef.operationName = 'GetUserByEmail';

export function getUserByEmail(dcOrVars, vars) {
  return executeQuery(getUserByEmailRef(dcOrVars, vars));
}

