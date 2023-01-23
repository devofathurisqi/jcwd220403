const tenantRouters = require('./tenantRouters');
const refresh = require('./refresh');
const logout = require('./logout');
const authRouters = require('./authRouters');
const userRouters = require('./userRouters');
const RegisterAsTenant = require('./registerAsTenantRouter');
const pagesRouters = require("./pagesRouters")
const roomsRouters = require("./roomsRouters")
const tenantTransactionRouter = require("./transactionTenantRouters")

module.exports = {
  userRouters,
  tenantRouters,
  refresh,
  logout,
  authRouters,
  RegisterAsTenant,
  pagesRouters,
  roomsRouters,
  tenantTransactionRouter
};
