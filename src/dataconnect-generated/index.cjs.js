const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createBusinessProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBusinessProfile', inputVars);
}
createBusinessProfileRef.operationName = 'CreateBusinessProfile';
exports.createBusinessProfileRef = createBusinessProfileRef;

exports.createBusinessProfile = function createBusinessProfile(dcOrVars, vars) {
  return executeMutation(createBusinessProfileRef(dcOrVars, vars));
};

const listRecommendationsForGrowthAuditRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListRecommendationsForGrowthAudit', inputVars);
}
listRecommendationsForGrowthAuditRef.operationName = 'ListRecommendationsForGrowthAudit';
exports.listRecommendationsForGrowthAuditRef = listRecommendationsForGrowthAuditRef;

exports.listRecommendationsForGrowthAudit = function listRecommendationsForGrowthAudit(dcOrVars, vars) {
  return executeQuery(listRecommendationsForGrowthAuditRef(dcOrVars, vars));
};

const updateStrategySessionClientNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStrategySessionClientNotes', inputVars);
}
updateStrategySessionClientNotesRef.operationName = 'UpdateStrategySessionClientNotes';
exports.updateStrategySessionClientNotesRef = updateStrategySessionClientNotesRef;

exports.updateStrategySessionClientNotes = function updateStrategySessionClientNotes(dcOrVars, vars) {
  return executeMutation(updateStrategySessionClientNotesRef(dcOrVars, vars));
};

const getUserByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByEmail', inputVars);
}
getUserByEmailRef.operationName = 'GetUserByEmail';
exports.getUserByEmailRef = getUserByEmailRef;

exports.getUserByEmail = function getUserByEmail(dcOrVars, vars) {
  return executeQuery(getUserByEmailRef(dcOrVars, vars));
};
