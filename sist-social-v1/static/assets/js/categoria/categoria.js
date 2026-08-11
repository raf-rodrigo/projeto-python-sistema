$('#salvarCategoria').click(function(e){

    var acessar = $('#formCategoria');

    $.ajax({
    url: acessar.attr('action'),
    type: 'post',
    data: acessar.serialize(),           
        success: function(response){
            console.log(response);
        	var response = jQuery.parseJSON(response);
            
            if (response.success == true) {
                     swal({
                        title:"Categoria salvo com sucesso.",
                        text: "Clique em ok para continuar",
                        type: "success"
                    },
                    function() {
                        window.location.href = 'index';
                    });

                $('.form-group').removeClass('has-error');
                $('.text-danger').remove();

                acessar[0].reset();  

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
            }
        },
        error:function(){
                 
                 swal("Ops", "Falha ao atualizar dados do usuário, entre em contato com o suporte!", "warning");
            }
    });
    return false;

});
    
    $('.boxIcone').mouseover(function() {        
        $(this).css('cursor','pointer');
    });
    
    $('.boxIcone').on('click',function() {   
        var icone = $(this).children().children().attr('class');
        var iconeId = $(this).attr('data-id');
        $('#iconeId').val(iconeId);
        $('#icone').remove();
        $('#divIcone').html("<i id='icone' class='"+icone+" fa-2x'></i>");
        $('#icone').show();
        $('#modalIcone').modal('hide');        
    });  

$('#cancelarCategoria').click(function(e){
    window.location.href = '../';
    return false;
});

$('#cancelarCategoriaCadastro').click(function(e){
    window.location.href = 'javascript:window.history.go(-1)';
    return false;
});

$('#editarCategoria').click(function(e){

    var acessar = $('#formCategoriaEditar');
        
         $.ajax({
            url: acessar.attr('action'),
            type: 'post',
            data: acessar.serialize(),           
            success: function(response){

                var response = jQuery.parseJSON(response);

                if (response.success == true) {
                    swal({
                            title:"Categoria atualiazada com sucesso.",
                            text: "Clique em ok para continuar",
                            type: "success"
                    },
                    function() {
                        window.location.href = caminhoBase+'categoria';
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

function excluir(idCategoria){
    
    var dados = {idCategoria:idCategoria};
   
    swal({
          title:"Deseja realmente excluir a categoria?",
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
                    url: 'deletar',
                    type: 'post',
                    data: dados,           
                    success: function(retorno){ 

                       var retorno = jQuery.parseJSON(retorno);

                        if (retorno.success == true) {
                    
                            swal({
                                    title:"Categoria excluida com sucesso.",
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

function subir(){
    $('body').animate({scrollTop: 0},800);                    
}
