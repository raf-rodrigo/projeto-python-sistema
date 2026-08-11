$(document).ready(function(){       
    defineBotoesAcoes();
    $(".chosen-select").select2();
	//Alterna entre ativo e inativo.
    $('.btn-toggle').click(function() {
        $(this).find('.btn').toggleClass('active');  

        if ($(this).find('.btn-primary').size()>0) {
        $(this).find('.btn').toggleClass('btn-primary');
        }
        if ($(this).find('.btn-danger').size()>0) {
        $(this).find('.btn').toggleClass('btn-danger');
        }
        if ($(this).find('.btn-success').size()>0) {
        $(this).find('.btn').toggleClass('btn-success');
        }
        if ($(this).find('.btn-info').size()>0) {
        $(this).find('.btn').toggleClass('btn-info');
        }

        $(this).find('.btn').toggleClass('btn-default');
    });

    $('#salvarEdicaoPerfil').click(function(){
        if($("#formEditarPerfil").valid()){
            $.ajax({
                url: '../../Perfil/atualizar',
                type: 'POST',	
                data: {
                    id: $('#chave').val(),
                    modulo_id: $('.chosen-select').val(),
                    nome: $('#nome').val(),
                    status: $('#status_perfil .active').val(),
                    perfil_consultor: $('#perfil_consultor .active').val(),
                    perfil_tecnico: $('#perfil_tecnico .active').val()
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
                            function() { window.location.href = '../../Perfil'; });
                        }
                        else{
                            swal({
                                title:"Não foi possível atualizar os dados do perfil!",
                                text: "Clique em ok para continuar",
                                type: "error"
                            });
                        }
                    }
                    catch(err){
                        swal("Ops", "Falha ao atualizar dados do perfil, entre em contato com o suporte!", "warning");
                    }
                },
                error:function(){
                    swal("Ops", "Falha ao atualizar dados do usuário, entre em contato com o suporte!", "warning");
                }
            });
        }
    });
});