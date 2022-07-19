'use strict'

const AppValidator = use('App/Validators/AppValidator')
class CandidaturaExternaValidator {

    async fails(errorMessages) {
        return AppValidator.fails(this, errorMessages);
    }

    get rules() {
        let id = AppValidator.getParam(this, 'id');
        return {
            // validation rules 
            nome: `required`,

            ndi: `required`,
            base_genero_id: `required`,
            base_estado_civil_id: `required`,

            data_nascimento: `required`,
            data_emissao: `required`,
            data_expiracao: `required`,
            base_provincia_id: `required`,
            base_municipio_id: `required`,
            base_provincia_residencia_id: `required`,
            base_municipio_residencia_id: `required`,

            telefone_principal: `required`,
            endereco: `required`,


            pai: `required`,
            mae: `required`,
            base_pais_formacao_concluida_id: `required`,
            base_provincia_formacao_concluida_id: `required`,


            base_nivel_formacao_concluida_id: `required`,

            ano_ingresso: `required`,
            ano_conclusao: `required`,

            media: `required`,

            edu_instituicao_concluida_id: `required`,
            edu_curso_concluido_id: `required`,



            base_nivel_formacao_id: `required`,

            edu_curso_id: `required`,




        }
    }

    get messages() {
        return {
            'nome.required': 'Nome  é obrigatório.',
            'ndi.required': 'BI   é obrigatório.',
            'data_nascimento.required': 'Data de Nascimento  é obrigatório.',
            'data_emissao.required': 'Data Emissão Documento  é obrigatório.',
            'data_expiracao.required': 'data Expiração Documento  é obrigatório.',
            'pai.required': 'Nome  do Pai  é obrigatório.',
            'mae.required': 'Nome Da Mae  é obrigatório.',
            'telefone_principal.required': 'telefone  é obrigatório.',
            'endereco.required': 'endereço  é obrigatório.',
            'base_genero_id.required': 'genero  é obrigatório.',
            'base_estado_civil_id.required': 'Estado civil  é obrigatório.',

            'base_provincia_id.required': 'Provincia  é obrigatório.',
            'base_municipio_id.required': 'Municipio  é obrigatório.',
            'base_provincia_residencia_id.required': 'Provincia de residencia  é obrigatório.',
            'base_municipio_residencia_id.required': 'Municipio de residencia  é obrigatório.',


            'base_pais_formacao_concluida_id.required': 'Pais de Formação Concluida é obrigatório.',
            'base_provincia_formacao_concluida_id.required': 'Provincia de Formação  Concluida é obrigatório.',

            'edu_curso_id.required': ' Curso é  obrigatório.',
            'ano_ingresso.required': `Ano de Ingresso é obrigatório`,
            'ano_conclusao.required': `Ano de Conclusão é obrigatório`,


            'media.required': 'Media é Obrigaotorio.',
            'base_nivel_formacao_concluida_id.required': `nivel de Formação Concluida é obrigatório`,

            'base_nivel_formacao_id.required': `nivel de Formação Concluida é obrigatório`,

            'edu_curso_concluido_id.required': `curso de Formação Concluida é obrigatório`,

            'edu_instituicao_concluida_id.required': `instituição de Formação Concluida é obrigatório`,







        }
    }
}

module.exports = CandidaturaExternaValidator