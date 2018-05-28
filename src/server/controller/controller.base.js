export class ControllerBase {
    constructor(configuration) {
        this.configuration = configuration;
    }
    get configuration() {
        return this._configuration;
    }
    set configuration(configuration) {
        this._configuration = configuration;
    }
}
