$('#salvar_permissao_perfil').click(function(e){

    var acessar = $('#form_permissao_perfil');
    
    $.ajax({
        url: acessar.attr('action'),
        type: 'post',
        data: acessar.serialize(),           
        success: function(response){

            if (response.status == 1) {
                   
                swal({
                    title: "Permissões alteradas com sucesso.",
                    text: "Clique em ok para continuar",
                    type: "success"
                    },
                    function() {
                        window.location.reload();
                    });                   

            }else{
                   
                swal({
                    title: "Oops!",
                    text: response.message,
                    type: "error"
                    },
                    function() {
                        return false;
                    });
            }
        },
        error: function(response){
            swal({ 
                title: 'Oops!',
                text: 'Falha ao atualizar permissões, entre em contato com o suporte!',
                confirmButtonColor: '#f8ac59',
                confirmButtonText: 'OK',
                type: 'warning',
                html: true
            });                        
        }
    });

    return false;
});