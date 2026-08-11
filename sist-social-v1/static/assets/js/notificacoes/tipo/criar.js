$(document).ready(function(){
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
            ajax('inserir',dados).done(function(retorno){
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
