var idForm = $("#" + nomeForm);
$(idForm).validate().cancelSubmit = true;

var cod;
var ambiente;
cod = idForm.attr('data-cod');

var metodo = 'POST';
if (typeof(cod) !== "undefined") {
    metodo = 'PUT';
}

$(idForm).submit(salvar);

$(function(){
    $('#salvar-modal').on('click',function (event) {
        salvar(event);
    })
});

function salvar(e){
    e.preventDefault();

    var objCampos = $(idForm).serializeObject();
    objCampos.id = cod;

    $.ajax({
        url: caminhoApi,
        type: metodo,
        dataType: 'json',
        data: objCampos
    }).done(function (retorno) {
        if (retorno.httpCode == 200) {
            if(typeof v2 !== 'undefined'){
                swal(retorno.sweet).then(() => {
                    if(ambiente == 'modal'){
                        fecharModal(nomeController);
                        return;
                    }
                    funcValidaRedirecionamento(retorno);
                });
                return;
            }
            swal(retorno.sweet, function () {
                if(ambiente == 'modal'){
                    fecharModal(nomeController);
                    return;
                }
                funcValidaRedirecionamento(retorno);
            });
        }
    }).fail(function (retorno) {
        limparErros();
        var temAbas = mostraErros(retorno.responseJSON);
        var text = 'Existem campos obrigatórios a serem preenchidos.'
        if (temAbas){
            text += 'Verifique as abas com o ícone <i style="margin-left: 5px;" class="fa fa-exclamation-circle text-danger erro-form-icon"></i>';
        }
        if(typeof v2 !== 'undefined'){
            swal({
                title: 'Erro ao Salvar',
                text: text,
                type: 'error',
                confirmButtonColor: "#ed5565",
                confirmButtonText: "OK"
            });
            return;
        }
        swal({
            html: true,
            title: 'Erro ao Salvar',
            text: text,
            type: 'error',
            confirmButtonColor: "#ed5565",
            confirmButtonText: "OK",
            closeOnConfirm: false
        });
    });
}

function mostraErros(campos){
    var resp = true;
    var msg = '<label class="text-danger erro-form" style="position: relative; top: 3px; margin-left: 5px;"> Este campo é obrigatório</label>';

    var alert = '';
    for(var i = 0; i < campos.length; i++){
        var input = $('input[name='+campos[i]+'],select[name='+campos[i]+'],textarea[name='+campos[i]+']').first();
        var id = input.closest('.tab-pane').attr('id');

        if(id == null){
            resp = false;
        }

        if(alert != id){
            $('#'+nomeForm+' a[href="#'+id+'"]').append('<i style="margin-left: 5px;" class="fa fa-exclamation-circle text-danger erro-form-icon"></i>');
            alert = id;
        }

        if(input.attr('type') == 'radio'){
            input.parent().parent().parent().append(msg);
            continue;
        }
        input.parent().append(msg);
    }
    return resp;
}

function setAmbiente(amb) {
    ambiente = amb;
}

function limparErros(){
    $('.erro-form').remove();
    $('.erro-form-icon').remove();
}

function funcValidaRedirecionamento(resposta, localBtn){
    if (typeof localBtn !== 'undefined') {
        var caminhoTabela = caminhoApi.replace('/api','');
        caminhoTabela = caminhoTabela.replace('/tab','');
        window.location.href = caminhoTabela;
    } else if (typeof resposta.caminhoRedirecionar!== 'undefined' && resposta.caminhoRedirecionar!== "") {
        window.location.href = resposta.caminhoRedirecionar;
    } else if (typeof resposta.id!== 'undefined' && resposta.id !== "") {
        var caminhoEditar = caminhoApi.replace('/api', '') + '/editar/';
        caminhoEditar = caminhoEditar.replace('/tab', '');
        window.location.href = caminhoEditar + resposta.id;
    }
    else{
        var caminhoEditar = caminhoApi.replace('/api', '') + '';
        window.location.href = caminhoEditar;
    }
}


function deletar(id, localBtn, ctrl, title=""){

    var botao = localBtn;
    var url = caminhoApi;
    if(ctrl != null){
        url = caminho+'sist_social/api/'+ctrl;
    }

    title = title==="" ? 'Deseja realmente deletar o registro?' : title;

    metodo = 'DELETE';
    swal({
        title: title,
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#5cb85c",
        confirmButtonText: "Sim, deletar!!",
        cancelButtonText: "Não, cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },function(isConfirm){
        if (isConfirm) {
            var promiseDeletar = $.ajax({
                url: url,
                type: metodo,
                dataType: 'json',
                data: {id: id}
            });
            
            if (tipoAmbiente == 'modal') {
                promiseDeletar
                .done(function(retorno)
                {
                    //lógica sucesso
                })
                .fail(function(xhr)
                {
                    //lógica erro
                });
            } else {
                promiseDeletar.done(function(retorno){
                    if (retorno.httpCode == 200) {
                        if (typeof botao !== 'undefined') {
                            swal(retorno.sweet,function(){
                                funcValidaRedirecionamento(retorno, botao);
                            });
                        } else {
                            window['tabela'+ctrl].ajax.reload(null, false);
                            swal(retorno.sweet);
                        }
                    } else {
                        swal(retorno.sweet);
                    }
                }).fail(function(retorno){
                    swal(retorno.sweet);
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

function criarBotoes(id, ctrl) {
    if(ctrl != null) {
        return '<a href="#" class="btnEditar'+ctrl+' btn btn_editar_rh btn-default btn-sm">' +
                    '<i class="fa fa-edit" data-toggle="tooltip" title="Editar"></i>' +
                '</a>'+
                '<a href="#" data-id="'+id+'" class="btnDeletar'+ctrl+' btn btn-default btn-sm">'+
                    '<i class="fa fa-trash" data-toggle="tooltip" title="Deletar"></i>'+
                '</a>';
    }else{
        return '<a href="'+caminhoBase+nomeController+'/editar/'+id+'" class="btn btn-default btn-sm">'+
                    '<i class="fa fa-edit" data-toggle="tooltip" title="Editar"></i>'+
                '</a>'+
                '<button class="btnDeletar btn btn-default btn-sm">'+
                    '<i class="fa fa-trash" data-toggle="tooltip" title="Deletar"></i>'+
                '</button>';
    }
}

function abrirModal(ctrl, id,  arrExtra) {
    return new Promise(function(resolve, reject) {
    var url;
    id != null ? url = caminhoBase+ctrl+'/modalEditar/'+id : url = caminhoBase+ctrl+'/modalCriar/';

    var ca = caminhoApi;
    var nf = nomeForm;
    var nc = nomeController;

    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: arrExtra
    }).done(function(retorno){
        $('.form-body').html(retorno.html);
        $('.form-modal').attr('id',retorno.form);
        $('.form-modal').attr('data-cod',id);

        setAmbiente('modal');

        $('#js').html(retorno.js);

        $('#modalForm').modal('show');
        $('#modalForm').on('hidden.bs.modal', function () {
            $('#js').html('');
            setAmbiente('tela');
            resetarVariaveis(nc, nf, ca);
        });
        resolve();
    });

});
};

function resetarVariaveis(nc, nf, ca){
    nomeController = nc;
    nomeForm = nf;
    caminhoApi = ca;

    idForm = $("#" + nomeForm);

    cod = idForm.attr('data-cod');
    metodo = 'POST';
    if (typeof(cod) !== "undefined") {
        metodo = 'PUT';
    }
}

function fecharModal(ctrl) {
    if($('#datatable'+ctrl).length){
        $('#datatable'+ctrl).DataTable().ajax.reload();
    }
    $('#modalForm').modal('hide');
}

function adicionaSelected(data, select) {
    if(data.text == "") return;

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

$('#btnAcoesDeletar').on('click', function(){
    deletar($(this).attr('data-cod'), 'acaoDeletar');
});
