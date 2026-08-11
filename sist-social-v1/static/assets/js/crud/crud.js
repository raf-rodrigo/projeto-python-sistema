/**
 * Created by fjunior on 04/05/17.
 */
$(document).ready(function(){

    $('#salvar').click(function (e) {
        var acessar = $('#' + nomeForm);
        if ($("#" + nomeForm).valid()) {
            $.ajax({
                url: acessar.attr('action'),
                type: 'post',
                data: acessar.serialize(),
                success: function (response) {
                    try {
                        var retorno = jQuery.parseJSON(response);
                        if (retorno.success == true) {
                            var resposta = jQuery.parseJSON(response);
                            if (resposta.success == true) {
                                swal({
                                        title: nomeTela + " salvo com sucesso.",
                                        text: "Clique em ok para continuar",
                                        type: "success"
                                    },
                                    function () {
                                        funcValidaRedirecionamento(resposta);
                                    });
                                $('.form-group').removeClass('has-error');
                                $('.text-danger').remove();
                                acessar[0].reset();
                                subir();
                            }
                        }
                        else {
                            exibirCamposObrigatorios(response.messages);
                        }
                    }
                    catch (e){
                        swal("Ops", "Falha ao salvar dados, entre em contato com o suporte!\n\n"+e, "error");
                    }
                },
                error: funcErro
            });
        }
    });

    $('.botaoExcluir').click(function (e) {
        var dados = {id:$(this).attr('data-id')};
        swal({
                title:"Deseja realmente excluir "+nomeTela+"?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#5CB85C",
                confirmButtonText: "Sim, Excluir!",
                cancelButtonText: "Não!",
                closeOnConfirm: false
            },
            function(){
                $.ajax({
                    url: window.location.href+'/deletar',
                    type: 'post',
                    data: dados,
                    success: function(retorno){
                        try {
                            var retorno = jQuery.parseJSON(retorno);
                            if (retorno.success == true) {
                                swal({
                                        title: nomeTela +" excluida com sucesso.",
                                        text: "Clique em ok para continuar",
                                        type: "success"
                                    },
                                    function () {
                                        location.reload();
                                    });
                            }
                        }
                        catch (e){
                            swal("Ops", "Falha ao salvar dados, entre em contato com o suporte!\n\n"+e, "error");
                        }
                    },
                    error:funcErro
                });
            });
    });

    $('#cancelar').click(function (e) {
        window.location.href = funcRetornaUrlLista();
        return false;
    });
});

function exibirCamposObrigatorios(objMensagens){
    swal("Campos obrigatórios", " Por gentileza, preencha o campo obrigatório.", "error");
    $.each(objMensagens, function(chave, item) {
        var element = $('#' + chave);
        element.closest('div.form-group')
            .removeClass('has-error')
            .addClass(item.length > 0 ? 'has-error' : '')
            .find('.text-danger')
            .remove();
        element.after(item)
    });
    subir();
}


var funcErro = function () {
    swal("Ops", "Falha ao salvar dados, entre em contato com o suporte!", "warning");
};

function funcValidaRedirecionamento(resposta){
    if(typeof(resposta.id) != "undefined"){
        var id = $('#id').val();
        var complementoAcao = '';
        if(typeof(id)=='undefined'){
            complementoAcao = 'editar/';
        }
        window.location.href = complementoAcao+resposta.id;
    }
    else{
        window.location.href = funcRetornaUrlLista();
    }
}

function funcRetornaUrlLista() {
    var url = window.location.href;
    var id = $('#id').val();
    if(id!=''){
        url = url.replace('/'+id,'');
    }
    var pos = url.lastIndexOf('/');
    url =  url.substring(0,pos);
    return url;
}

function subir(){
    $('body').animate({scrollTop: 0},800);
}