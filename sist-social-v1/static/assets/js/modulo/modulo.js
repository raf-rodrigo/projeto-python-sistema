$('#salvar_prioridade').click(function(e){

    var acessa = $('#form_prioridade');
    $.ajax({
    url: acessa.attr('action'),
    type: 'post',
    data: acessa.serialize(),           
        success: function(response){

            var response = jQuery.parseJSON(response);

            if (response.success == true) {
               
                     swal({
                        title:"Prioridade salva com sucesso.",
                        text: "Clique em ok para continuar",
                        type: "success"
                    },
                    function() {
                        window.location.href = 'editar/'+response.prioridade_id;
                    });

                $('.form-group').removeClass('has-error');
                $('.text-danger').remove();

                acessa[0].reset();  
                       
            }else{

                swal("Campos obrigatórios", " Por gentileza, preencha o campo obrigatório.", "error");

                $.each(response.messages, function(key, value) {
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

});

$('#fechar_prioridade').click(function(e){
    window.location.href = '../';
    return false;
});

$('#fechar_prioridade_cadastro').click(function(e){
    window.location.href = 'javascript:window.history.go(-1)';
    return false;
});

$('#editar_prioridade').click(function(e){

    var acessa = $('#form_prioridade_editar');
       
         $.ajax({
            url: acessa.attr('action'),
            type: 'post',
            data: acessa.serialize(),           
            success: function(response){

                var response = jQuery.parseJSON(response);

                if (response.success == true) {
            
                    swal({
                            title:"Prioridade atualiazada com sucesso.",
                            text: "Clique em ok para continuar",
                            type: "success"
                    },
                    function() {
                            window.location.href = response.prioridade_id;
                    });

                   $('.form-group').removeClass('has-error');
                   $('.text-danger').remove();

                   subir();

                }else{
                                       
                    swal("Campos obrigatórios", " Por gentileza, preencha o campo obrigatório.", "error");

                    $.each(response.messages, function(key, value) {
                        var element = $('#' + key);
                        element.closest('div.form-group')
                        .removeClass('has-error')
                        .addClass(value.length > 0 ? 'has-error' : '')
                        .find('.text-danger')
                        .remove();
                        element.after(value)
                    });

                    subir();

                }
            },
            error:function(){
                 
                 swal("Ops", "Falha ao atualizar dados do usuário, entre em contato com o suporte!", "warning");
            }
        });
        return false;
});

function excluir(prioridade_id){
    
    var dados = {prioridade_id:prioridade_id};
   
    swal({
          title:"Deseja realmente excluir a prioridade?",
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
                    url: 'excluir',
                    type: 'post',
                    data: dados,           
                    success: function(retorno){ 

                       var retorno = jQuery.parseJSON(retorno);

                        if (retorno.success == true) {
                    
                            swal({
                                    title:"Prioridade excluida com sucesso.",
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
} 

$(document).ready(function(){
    $(document).on("input keyup", "#descricao", function(){
        var limite = 500;
        var caracteresDigitados = $(this).val().length;
        var caracteresRestantes = limite - caracteresDigitados;
         
        if(caracteresRestantes <= 0){
            $(".caracteres").html('Limite de caracteres atingido!'); 
        }else{
            $(".caracteres").html('<b>'+ caracteresRestantes + '</b> Caracteres restantes');
        }
    });
});  