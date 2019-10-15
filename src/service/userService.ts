import { BaseService } from "./baseService";

class UserService extends BaseService {
    index() {
        return 2 + 3;
    }
}

module.exports = UserService;