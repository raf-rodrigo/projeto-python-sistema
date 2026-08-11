$('#salvarMenu').click(function(e){

    var acessar = $('#formMenu');

    $.ajax({
        url: acessar.attr('action'),
        type: 'post',
        data: acessar.serialize(),           
        success: function(response){

            var response = jQuery.parseJSON(response);            

                if (response.success == true) {               
                    swal({
                        title:"O menu foi vinculado ao módulo com sucesso.",
                        text: "Clique em ok para continuar",
                        type: "success"
                    },
                    function() {
                        location.reload();
                    });

                    $('.form-group').removeClass('has-error');
                    $('.text-danger').remove();

                    acessar[0].reset();  
                    subir();                  
                }
                else{
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

function subir(){
    $('body').animate({scrollTop: 0},800);                    
}

$('#moduloId').change(function(){
   categoriaPagina();   
   $('#radioTipo').show('slow');
   $("#radio1").attr('checked', 'checked');
});

$("input[name='tipo']").click(function(){
    categoriaPagina();
});

$('#moduloId').select2();

function categoriaPagina(){

    var moduloId = $('#moduloId').val();
    var dados = {moduloId:moduloId};

    if($("input:radio[name=tipo]:checked").val()=="C"){
        var url ="menu/categorias";
    }
    else{
        var url ="menu/paginas";
    }               
        
    $.ajax({
        url: url,
        type:'post',
        data: dados,           
        success: function(response){            
            $('#categoriaModulo').show('slow');
            $('#categoriaModulo').html(response);
            $('#itemId').select2({width: 'resolve'});
        },
        error:function(){             
            swal("Ops", "Falha ao atualizar dados do usuário, entre em contato com o suporte!", "warning");
        }
    });
}

$('#radioTipo').hide();
$('#categoriaModulo').hide();

function listar(menuId){
    
    var dados = {menuId:menuId};
    
    $.ajax({
        url: 'menu/listar',
        type:'post',
        data: dados,           
        success: function(response){            
            $('#verPagina').html(response);                                    
            
            $('.btnDeletarPaginaMenu').on('click',function(){
                var idPaginaMenu = $(this).attr('data-id');
                
                swal({
                    title:"Deseja realmente deletar o menu?",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#5cb85c",
                    confirmButtonText: "Sim, Deletar!",
                    cancelButtonText: "Não!",
                    closeOnConfirm: false
                },
                function(){
                    $.ajax({
                        url: 'menu/deletarPaginaMenu',
                        type:'post',
                        data: {'idPaginaMenu':idPaginaMenu},           
                        success: function(retorno){
                           var retorno = jQuery.parseJSON(retorno);

                            if (retorno.success == true) {
                                swal({
                                    title:"O menu foi excluido com sucesso.",
                                    text: "",
                                    type: "success"
                                },
                                function() {
                                    location.reload();
                                });
                            }
                        },
                        error:function(){
                                swal("Ops", "Falha ao deletar menu, entre em contato com o suporte!", "warning");
                            }
                    });
                });                
            });
        },
        error:function(){             
             swal("Ops", "Falha ao deletar menu, entre em contato com o suporte!", "warning");
        }
    });
}

function adicionar(menuId){
    
    var dados = {menuId:menuId};

    $.ajax({
        url: 'menu/adicionar',
        type:'post',
        data: dados,           
        success: function(response){
            $('#adicionarPagina').show('slow');
            $('#adicionarPagina').html(response);
            $('#itemIdModal').select2({width: 'resolve'});
            
            $('#salvarAdicionarMenu').click(function(e){
                var acessar = $('#formAdicinonarMenu');

                $.ajax({
                    url: acessar.attr('action'),
                    type: 'post',
                    data: acessar.serialize(),           
                    success: function(response){
                        var response = jQuery.parseJSON(response);

                        if (response.success == true) {
                            swal({
                                title:"O Página foi vinculado ao menu com sucesso.",
                                text: "Clique em ok para continuar",
                                type: "success"
                            },
                            function() {
                                location.reload();
                            });

                            $('.form-group').removeClass('has-error');
                            $('.text-danger').remove();

                            acessar[0].reset();  
                            subir();                            
                        }
                        else{
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
        },
        error:function(){             
            swal("Ops", "Falha ao atualizar dados do usuário, entre em contato com o suporte!", "warning");
        }
    });
}

function deletar(menuId){    
    var dados = {menuId:menuId};
   
    swal({
        title:"Deseja realmente deletar o menu?",
        text: "por gentileza confirme está ação",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5cb85c",
        confirmButtonText: "Sim, Deletar!",
        cancelButtonText: "Não!",
        closeOnConfirm: false
        },
        function(){
            $.ajax({
                url: 'menu/deletar',
                type: 'post',
                data: dados,           
                success: function(retorno){ 
                   var retorno = jQuery.parseJSON(retorno);

                    if (retorno.success == true) {

                        swal({
                            title:"O menu foi excluido com sucesso.",
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

$('#salvarAdicionarPagina').click(function(e){
    var acessar = $('#formAdicinonarMenu');

    $.ajax({
        url: acessar.attr('action'),
        type: 'post',
        data: acessar.serialize(),           
        success: function(response){
            var response = jQuery.parseJSON(response);

            if (response.success == true) {

                swal({
                   title:"O pagina foi vinculado ao menu com sucesso.",
                   text: "Clique em ok para continuar",
                   type: "success"
                },
                function() {
                   location.reload();
                });

                $('.form-group').removeClass('has-error');
                $('.text-danger').remove();

                acessar[0].reset();  
                subir();                              
            }
            else{
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