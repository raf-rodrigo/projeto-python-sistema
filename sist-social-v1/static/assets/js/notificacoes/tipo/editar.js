$(document).ready(function(){

    $('.btn-toggle').click(function(){
        $(this).find('.btn').toggleClass('active');

        if($(this).find('.btn-primary').size()>0){
            $(this).find('.btn').toggleClass('btn-primary');
        }
        if($(this).find('.btn-danger').size()>0){
            $(this).find('.btn').toggleClass('btn-danger');
        }
        if($(this).find('.btn-success').size()>0){
            $(this).find('.btn').toggleClass('btn-success');
        }
        if($(this).find('.btn-info').size()>0){
            $(this).find('.btn').toggleClass('btn-info');
        }
        $(this).find('.btn').toggleClass('btn-default');
    });

    function ajax(url,dados){
        if(typeof(dados) == undefined ){
            dados = {};
        }
        return $.ajax({
            url:url,
            type:'post',
            dataType:'json',
            data:dados
        })
            .fail(function() {
                alert('falha no ajax');
            });
    }

    $('#formNotificacaoTipo').submit(function(event){
        event.preventDefault();
        if($(this).valid()){
            var dados = $(this).serialize();
            dados += '&status='+$('#formNotificacaoTipo .active').val();
            ajax($(this).attr('action'),dados).done(function(retorno){
                try{
                    if(retorno){
                        swal({
                                title:retorno.msg,
                                text: retorno.subMsg,
                                type: retorno.tipo
                            },
                            function(){
                                if(retorno.url != null){
                                    window.location.href = retorno.url;
                                }
                            });
                    }
                }
                catch(err){
                    swal("Ops", "Falha ao tentar cadastrar Tipo, entre em contato com o suporte!", "warning");
                }
            });
        }
    });
});
