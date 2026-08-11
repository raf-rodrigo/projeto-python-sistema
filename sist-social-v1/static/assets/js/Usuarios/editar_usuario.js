$(document).ready(function()
{
    defineBotoesAcoes();
	//Alterna entre ativo e inativo.
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
    
    $('#pagina_inicial').select2();

    formataChecks($(".i-checks"));

    $('#salvarEdicaoUsuario').click(function(){
        if($("#formEditarUsuario").valid()){
            $.ajax({
                url: '../atualizar',
                type: 'POST',	
                data: {
                    chave: $('#chave').val(),
                    usuario: $('#usuario').val(),
                    nome: $('#nome').val(),
                    email: $('#email').val(),
                    pagina_inicial: $('#pagina_inicial').val(),
                    status: $('#formEditarUsuario .active').val(),
                    trocar_senha: $('#trocar_senha').is(':checked') ? 1 : ''
                },
                success: function(response){

                    try{

                        retorno = JSON.parse(response);

                        if(retorno.resultado){
                            swal({
                            title:"Dados atualizados com sucesso!",
                            text: "Clique em ok para continuar",
                            type: "success"
                            },
                            function() { window.location.href = '../../Usuario'; });
                        }
                        else{
                            swal({
                            title:"Não foi possível atualizar os dados!",
                            text: "Clique em ok para continuar",
                            type: "error"
                            });
                        }
                    }
                    catch(err){
                        swal("Ops", "Falha ao atualizar dados do usuário, entre em contato com o suporte!", "warning");
                    }
                },
                error:function(){
                    swal("Ops", "Falha ao atualizar dados do usuário, entre em contato com o suporte!", "warning");
                }
            });
        }
    });
});