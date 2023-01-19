const authControllers = require('./authControllers');
const userControllers = require('./userControllers');
const tenantControllers = require('./tenantControllers');
const refreshTokenController = require('./refreshTokenController');
const logoutController = require('./logoutController');
const RegisterAsTenant = require('./registerAsTenantController');
const pagesControllers = require("./pagesControllers")
const roomControllers = require("./roomsControllers")

module.exports = {
  authControllers,
  userControllers,
  tenantControllers,
  refreshTokenController,
  logoutController,
  RegisterAsTenant,
  pagesControllers,
  roomControllers
};
