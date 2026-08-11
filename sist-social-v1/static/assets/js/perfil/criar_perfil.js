$(document).ready(function(){
    $(".chosen-select").select2();
    
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

    $('#botaoCriarPerfil').click(function(event){
        if($("#formCadastrarPerfil").valid()){
            var idModulo = $('.chosen-select').val();
            var nome = $('#nome').val();
            var consultor = $('#perfil_consultor .active').val();
            var tecnico = $('#perfil_tecnico .active').val();

            $.ajax({
                url: $('#formCadastrarPerfil').attr('action'),
                type: 'POST',
                data: {idModulo: idModulo, nome:nome, perfil_consultor:consultor, perfil_tecnico : tecnico},
            }).done(function(retorno){
                var retorno = JSON.parse(retorno);
                if(retorno.resultado){
                    swal({
                        title:"Perfil inserido com sucesso.",
                        text: "Clique em ok para continuar",
                        type: "success"
                    },
                    function() { window.location.href = caminho+'sist_central/Perfil/editar/'+retorno.chave; });
                }
                else{
                    swal({
                        title:"Não foi possível inserir perfil!",
                        text: "Clique em ok para continuar",
                        type: "error"
                    });
                }
            }).fail(function(){
                swal({
                    title:"Não foi possível inserir perfil!",
                    text: "Clique em ok para continuar",
                    type: "error"
                });
            });
        }
    });
});