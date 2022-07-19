'use strict'
const ResponseHelper = use('App/Helpers/ResponseHelper')

class ValidacaoController {

    async validar({ params, response }) {
        try {
            //console.log(params.model)
            const Model = use(`App/Validators/${params.model}Validator`)
            const _model = new Model;
            let result = {};
            for (let index in _model.rules) {
                result[index] = _model.rules[index].split('|');
                // //console.log(_model.rules[index].split('|'));
            }
            // result['fx'] = '() => return null';
            return ResponseHelper.getOnlyDataResponse({
                rules: result,
                messages: _model.messages
            })
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados de Validação Não Encontrado")
        }
    }

    validarCampo(campo, valor) {

    }

}

module.exports = ValidacaoController