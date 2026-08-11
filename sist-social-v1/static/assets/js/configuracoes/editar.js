
$('#fecharConfiguracoes').click(function(e){
    window.location.href = '../';
    return false;
});

$('#fecharConfiguracoesCadastro').click(function(e){
    window.location.href = 'javascript:window.history.go(-1)';
    return false;
});

$('#editarConfiguracoes').click(function(e){
 if($("#formConfiguracoesEditar").valid()){
    var acessar = $('#formConfiguracoesEditar');
        
        $.ajax({
            url: acessar.attr('action'),
            type: 'post',
            data: acessar.serialize(),           
            success: function(resposta){

                var resposta = jQuery.parseJSON(resposta);

                if (resposta.sucesso == true) {
            
                    swal({
                            title:"Configuração atualiazada com sucesso.",
                            text: "Clique em ok para continuar",
                            type: "success"
                    },
                    function() {
                            window.location.href = resposta.configuracoesId;
                    });

                   $('.form-group').removeClass('has-error');
                   $('.text-danger').remove();

                }else{
                                       
                    swal("Campos obrigatórios", " Por gentileza, preencha o campo obrigatório.", "error");

                    $.each(resposta.mensagem, function(key, value) {
                        var element = $('#' + key);
                        element.closest('div.form-group')
                        .removeClass('has-error')
                        .addClass(value.length > 0 ? 'has-error' : '')
                        .find('.text-danger')
                        .remove();
                        element.after(value)
                    });

                }
            },
            error:function(){
                 
                 swal("Ops", "Falha ao atualizar dados do usuário, entre em contato com o suporte!", "warning");
            }
        });
        return false;
   }      
});


       
