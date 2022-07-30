'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use('Env')
const config = use('Config')

class Connection {
    /**
     * @param {object} ctx
     * @parConnectionam {Request} ctx.request
     * @param {Function} next
     */
    async handle({ request }, next) { 
        /* 
            let source = request.get().source
            console.log("--------------------------" + source + "-------------------------------------------.") 
            let conn = config.get('database.mysql')
            if (typeof source == 'undefined') {
                conn.connection.database = Env.get('DB_DATABASE', '')
                config.set('database.mysql', conn);
            } else {
                conn.connection.database = source
                config.set('database.mysql', conn);
            }
            //*/

        delete request.all().source
        await next()

    }
}

module.exports = Connection