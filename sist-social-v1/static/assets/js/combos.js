$(function() {
    //Declaração dos inputs
    var familiaSelect = $('#filtro_familia');
    var pessoaSelect = $('#filtro_nom_pessoa');
    var cpfSelect = $('#filtro_num_cpf_pes');
    var nisFiltro = $('#filtro_num_nis_pes');
    var tecnicoFiltro = $('#filtro_rh_profissional');
    var campo_filtro_numero_prontuario = $('#filtro_numero_prontuario');
    var tpEncaminhamentoSelect = $('#filtro_encaminhamento');
    var unidadeSelect = $('#filtro_idUnidade');
    var modalidadeSelect = $('#filtro_idModalidade');
    var tipoAtendimentoSelect = $('#filtro_idTipoAtendimento');
    var orgaosRecursosSelect = $('#filtro_unid_ext');
    var responsavelFamiliar = $('#responsavelFamiliar');
    var idFamiliaRf = $('#chaveIdFamilia');
    var rhProfissional = $('#filtro_rh_profissional');
    var rbMotivo = $('#rbMotivo');
    var rbMotivoRf = $('#rbMotivoRf');

    //------------------- //

    familiaSelect.select2({
        placeholder: 'Selecione uma família',
        selectOnClose: true,
        ajax: {
            url: caminho + 'sist_social/FamiliaDomicilio/comboFamilia',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }

                return queryParameters;
            },
        }
    });

    familiaSelect.on('change', function() {
        idFamilia = $(this).val();
    });

    pessoaSelect.select2({
        placeholder: 'Selecione uma pessoa',
        width: '90%',
        selectOnClose: true,
        // tags: true,
        ajax: {
            url: caminho + 'sist_social/Pessoas/comboPes',
            dataType: 'json',
            delay: 250,
            data: function(params, data) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1,
                }
                return queryParameters;
            },

        },
    });

    rbMotivo.select2({
        placeholder: 'Selecione o motivo.',
        width: '90%',
    });


    rbMotivoRf.select2({
        placeholder: 'Selecione o motivo.',
        width: '90%',
    });

    cpfSelect.select2({
        placeholder: 'Selecione o número do CPF.',
        width: '90%',
        selectOnClose: true,
        ajax: {
            url: caminho + 'sist_social/ProntuarioSocial/comboCpf',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }

                return queryParameters;
            },
        }
    });

    nisFiltro.select2({
        placeholder: 'Selecione o número do NIS.',
        width: '90%',
        selectOnClose: true,
        ajax: {
            url: caminho + 'sist_social/ProntuarioSocial/comboNis',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }

                return queryParameters;
            },
        }
    });

    tecnicoFiltro.select2({
        placeholder: 'Selecione o Técnico.',
        width: '90%',
        selectOnClose: true,
        ajax: {
            url: caminho + 'sist_social/AtendimentoTecnico/comboTecnico',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }

                return queryParameters;
            },
        }
    });

    campo_filtro_numero_prontuario.select2({
        placeholder: 'Selecione o número do pront.',
        width: '90%',
        selectOnClose: true,
        ajax: {
            url: caminho + 'sist_social/ProntuarioSocial/comboNumProntuario',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }

                return queryParameters;
            },
        }
    });

    tpEncaminhamentoSelect.select2({
        placeholder: 'Selecione um encaminhamento',
        selectOnClose: true,
        width: '100%',
        ajax: {
            url: caminho + 'sist_social/TipoEncaminhamentos/comboTipoEncaminhamentos',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }

                return queryParameters;
            },
        }
    });

    unidadeSelect.select2({
        placeholder: 'Selecione uma Unidade',
        selectOnClose: true,
        width: '100%',
        ajax: {
            url: caminho + 'sist_social/UnidAtendSocial/comboUnidade',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }

                return queryParameters;
            }
        }
    });


    modalidadeSelect.select2({
        placeholder: 'Selecione uma modalidade',
        minimumResultsForSearch : -1, // Sem campo de busca
        selectOnClose: true,
        width: '100%',
        ajax: {
            url: caminho + 'sist_social/UnidAtendSocial/comboModalidade',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }

                return queryParameters;
            }
        }
    });

    tipoAtendimentoSelect.select2({
        placeholder: 'Selecione um tipo de atendimento',
        selectOnClose: true,
        width: '100%',
        ajax: {
            url: caminho + 'sist_social/UnidAtendSocial/comboTipoAtendimento',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }

                return queryParameters;
            }
        }
    });

    orgaosRecursosSelect.select2({
        placeholder: 'Selecione um Órgão',
        selectOnClose: true,
        width: '90%',
        ajax: {
            url: caminho + 'sist_social/OrgaosRecursos/comboOrgaosRecursos',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }

                return queryParameters;
            }
        }
    });

    responsavelFamiliar.select2({
        placeholder: 'Selecione um responsável familiar',
        width: '90%',
        ajax: {
            url: caminho + 'sist_social/pessoas/comboResponsavelFamiliar',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1,
                    idFamilia: $('#chaveIdFamilia').val(),
                }

                return queryParameters;
            }
        }
    });


    rhProfissional.select2({
        placeholder: 'Selecione o profissional',
        width: '90%',
        ajax: {
            url: caminho + 'sist_social/Atendimento/comboProfissionais?c=1&u=1',
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var queryParameters = {
                    q: params.term,
                    page: params.page || 1
                }
                return queryParameters;
            }
        }
    });

});