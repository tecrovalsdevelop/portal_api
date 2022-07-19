'use strict'
//const Model = use('App/Models/ModelUUID')
const Model = use('Model')
class ModelWithoutTimestamps extends Model {
    static get createdAtColumn(){
        return null;
    }

    static get updatedAtColumn(){
        return null;
    }
}

module.exports = ModelWithoutTimestamps
