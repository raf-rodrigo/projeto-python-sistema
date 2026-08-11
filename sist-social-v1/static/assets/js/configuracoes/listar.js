$('.btnDeletar').click(function(event){
    
    var configuracoesId = $(this).attr('data-id');
  
    var dados = {configuracoesId:configuracoesId};
        swal({
          title:"Deseja realmente excluir a configuração?",
          text: "por gentileza confirme está ação",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#5CB85C",
          confirmButtonText: "Sim, Excluir!",
          cancelButtonText: "Não!",
          closeOnConfirm: false
        },
        function(){

                $.ajax({
                    url: 'deletar',
                    type: 'post',
                    data: dados,           
                    success: function(retorno){ 

                       var retorno = jQuery.parseJSON(retorno);

                        if (retorno.sucesso == true) {
                    
                            swal({
                                    title:"Configuração excluida com sucesso.",
                                    text: "Clique em ok para continuar",
                                    type: "success"
                            },
                            function() {
                                    location.reload();
                            });
                        }
                    },
                    error:function(){
                             
                        swal("Ops", "Falha ao atualizar dados do usuário, entre em contato com o suporte!", "warning");
                    }

                });
        });

    return false;
});

$(document).ready(function(){
   $('.tabelaModulo').DataTable();
});
