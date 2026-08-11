var idForm = $("#" + nomeForm);
var cod;
cod = idForm.attr('data-cod');

var metodo = 'POST';
if (typeof(cod) !== "undefined") {
    metodo = 'PUT';
}
//alert("CRUDAPI.js");
//alert(tipoAmbiente);

$(idForm).submit(salvar);

function salvar(e) {
    e.preventDefault();

    if ($(idForm).valid()) {
        let objCampos = $(idForm).serializeObject();
        objCampos.id = cod;
        
        var promiseSalvar = $.ajax({
            url: caminhoApi,
            type: metodo,
            dataType: 'json',
            data: objCampos
        });

        if (tipoAmbiente == 'modal') {
            promiseSalvar
                .done(function(retorno) {
                    //lógica sucesso
                })
                .fail(function(xhr) {
                    //lógica erro
                });
        } else {
            promiseSalvar
                .done(function(retorno) {
                    if (retorno.httpCode == 200) {
                        var delayInMilliseconds = 2000;

                        setTimeout(function() {
                            if (nomeForm == "formOrgaosRecursos") {
                                window.history.back();
                            }
                        }, delayInMilliseconds);


                        if (nomeForm == "formEncaminhamento" || nomeForm == "formPaifPaefi") {

                            //$("#EncPrint").css("display", "block");

                            swal(retorno.sweet, function() {
                                window.parent.closeModal();
                            });

                        } else {
                            swal(retorno.sweet, function() {
                                funcValidaRedirecionamento(retorno);
                            });
                        }

                    } else if (retorno.httpCode == 201) {
                        /** este foi add para pegar retorno sem redirecionar */
                        swal(retorno.sweet);
                    }
                })
                .fail(function(retorno) {
                    swal({
                        title: 'Operação cancelada',
                        text: 'Não foi possível realizar o processo!\nVerifique se o registro já existe!',
                        type: 'error',
                        confirmButtonColor: "#ed5565",
                        confirmButtonText: "OK",
                        closeOnConfirm: false
                    });
                    if (retorno.sweet != null) {
                        swal(retorno.sweet);
                    }
                });
        }
    }
}

function funcValidaRedirecionamento(resposta, localBtn) {
    if (typeof localBtn !== 'undefined') {
        var caminhoTabela = caminhoApi.replace('/api', '');
        caminhoTabela = caminhoTabela.replace('/tab', '');
        window.location.href = caminhoTabela;
    } else if (resposta.caminhoRedirecionar !== "" && typeof resposta.caminhoRedirecionar !== 'undefined') {
        window.location.href = resposta.caminhoRedirecionar;
    } else if (resposta.id !== "") {
        var caminhoEditar = caminhoApi.replace('/api', '') + '/editar/';
        caminhoEditar = caminhoEditar.replace('/tab', '');
        window.location.href = caminhoEditar + resposta.id;
    }
    /* else {
           window.parent.closeModal();
       } */
}

function funcRetornaOrigem() {

    window.parent.closeModal();


}

function deletar(id, localBtn) {
    //e.preventDefault();
    var botao = localBtn;
    metodo = 'DELETE';
    event.preventDefault();
    swal({
            title: 'Deseja realmente deletar o registro?',
            text: '',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#5cb85c",
            confirmButtonText: "Sim, deletar!",
            cancelButtonText: "Não, cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {

            if (isConfirm) {
                var promiseDeletar = $.ajax({
                    url: caminhoApi,
                    type: metodo,
                    dataType: 'json',
                    data: { id: id }
                });

                if (tipoAmbiente == 'modal') {
                    promiseDeletar
                        .done(function(retorno) {
                            //lógica sucesso
                            swal({
                                title: 'Registro deletado com sucesso',
                                text: '',
                                type: 'success',
                                confirmButtonColor: "#1ab394",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });
                            if (typeof tabela === "undefined") {
                                window.parent.closeModal();
                            } else {
                                tabela.ajax.reload(null, false);
                            }
                        })
                        .fail(function(xhr) {
                            //lógica erro
                            swal({
                                title: 'Falha ao tentar deletar registro',
                                text: 'Entre em contato com o suporte.',
                                type: 'error',
                                confirmButtonColor: "#ed5565",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });
                        });
                } else {
                    promiseDeletar
                        .done(function(retorno) {
                            if (retorno.httpCode == 200) {
                                swal({
                                    title: 'Registro deletado com sucesso',
                                    text: '',
                                    type: 'success',
                                    confirmButtonColor: "#1ab394",
                                    confirmButtonText: "OK",
                                    closeOnConfirm: false
                                });

                                if (typeof tabela === "undefined") {
                                    window.parent.closeModal();
                                } else {
                                    tabela.ajax.reload(null, false);
                                }

                                //Verificação FormEncaminhamentos
                                if (nomeForm == "formEncaminhamentos" || nomeForm == "formPaifPaefi") {
                                    //$("#EncPrint").css("display", "block");
                                    swal(retorno.sweet, function() {
                                        retorno.id = "";
                                        funcValidaRedirecionamento(retorno);
                                    });

                                } else if (typeof botao !== 'undefined') {
                                    swal(retorno.sweet, function() {
                                        funcValidaRedirecionamento(retorno, botao);
                                    });
                                } else {
                                    swal(retorno.sweet);
                                    if (typeof tabela === "undefined") {
                                        window.parent.closeModal();
                                    } else {
                                        tabela.ajax.reload(null, false);
                                    }
                                }
                            } else {
                                swal({
                                    title: 'Falha ao tentar deletar registro',
                                    text: 'Entre em contato com o suporte.',
                                    type: 'error',
                                    confirmButtonColor: "#ed5565",
                                    confirmButtonText: "OK",
                                    closeOnConfirm: false
                                });
                            }
                        })
                        .fail(function(retorno) {
                            swal({
                                title: 'Falha ao tentar deletar registro',
                                text: 'Entre em contato com o suporte.',
                                type: 'error',
                                confirmButtonColor: "#ed5565",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });
                        });
                }
            } else {
                swal({
                    title: 'Operação cancelada',
                    text: '',
                    type: 'error',
                    confirmButtonColor: "#ed5565",
                    confirmButtonText: "OK",
                    closeOnConfirm: false
                });
            }
        });
}

function criarBotoes(id) {
    // debugger;
    if(nomeController == 'EncaminhamentoInterno'){
        return `
        <a href="` + caminhoBase + nomeController + `/editar/${id}" class="btn btn-default btn-sm">
            <i class="fa fa-eye" data-toggle="tooltip" title=""></i>
        </a>&nbsp;
        <button class="btnDeletar btn btn-default btn-sm" data-id="${id}">
            <i class="fa fa-trash" data-toggle="tooltip" title="Deletar"></i>
        </button>`;
    }else{
        return `
        <a href="` + caminhoBase + nomeController + `/editar/${id}" class="btn btn-default btn-sm">
            <i id="iconEdit" class="fa fa-edit" data-toggle="tooltip" title="Editar"></i>
        </a>&nbsp;
        <button class="btnDeletar btn btn-default btn-sm" data-id="${id}">
            <i class="fa fa-trash" data-toggle="tooltip" title="Deletar"></i>
        </button>`;
    }
  
}

function adicionaSelected(data, select) {
    //alert(data[0].id);
    // alert(data[0].text);

    if ('length' in data) {
        if (data.length > 0) {
            select.append(new Option(data[0].text, data[0].id, true, true)).trigger('change');
            select.trigger({
                type: 'select2:select',
                params: {
                    data: data[0]
                }
            });
        }
    } else if ('id' in data) {
        select.append(new Option(data.text, data.id, true, true)).trigger('change');
        select.trigger({
            type: 'select2:select',
            params: {
                data: data
            }
        });
    }
}

    function criarBotaoVizualizar(id) {
        return `
        <button class="btnVizualizar btn btn-default btn-sm" data-id="${id}">
            <i class="fa fa-eye" data-toggle="tooltip" title="Vizualizar"></i>
        </button>`;
    }

$('#btnAcoesDeletar').on('click', function() {
    deletar($(this).attr('data-cod'), 'acaoDeletar');
});