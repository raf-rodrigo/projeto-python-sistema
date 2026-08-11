$(document).ready(function(){
        
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });

        
    function somenteNumero(e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    }
    
    $('#icone').hide(); 
    
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
    
    $(document).on("input keyup", "#descricao", function () {
        var limite = 500;
        var caracteresDigitados = $(this).val().length;
        var caracteresRestantes = limite - caracteresDigitados;
         
        if(caracteresRestantes <= 0){
            $(".caracteres").html('Limite de caracteres atingido!'); 
        }else{
            $(".caracteres").html('<b>'+ caracteresRestantes + '</b> Caracteres restantes');
        }
    });                      
    
    $('input').on('ifToggled', function(event){
        if($(this).val() == 1){            
                $(this).val(0);
        }
        else{
            $(this).val(1);
        }      
    });                    
   
   var acoes = [];
   $('#btnSalvar').on('click',function(){
        acoes = [];
        $('#tabelaListaPagina tbody tr').each(function(index, val){
            var checkBox = $(this).children().children().children().children().children().children();
            if(checkBox.is(':checked') === true){
                var id = checkBox.attr('data-id');
                acoes.push(id);
            }
       }); 
    swal({ 
        title: 'Ações salvas com sucesso!',
        text: '',
        confirmButtonColor: '#1ab394',
        confirmButtonText: 'OK',
        type: 'success',
        html: true
      });             
   }); 

   
    $('#formCriarPagina').submit(function(){
        var dados = $(this).serialize()+'&acoes='+acoes.join('|');
        $.ajax({
                type: 'POST',
                url: 'inserir',
                data: dados,
                success: function(retorno){
                    console.log(retorno);
                    var obj         = JSON.parse(retorno);
                    var redirect    = false;
                    var btnText     = 'Corrigir!';
                    var btnCor      = '#DD6B55';
                    var type        = 'error';

                    if(obj.status === false){
                        var msg = obj.msg;                        
                    }else if(obj.erro === true){
                        var msg = obj.msg;
                    }else{
                        var msg = obj.msg;;
                        type     = 'success';
                        btnText  = 'OK';
                        btnCor   = '#1ab394';
                        redirect = true;
                    }
                    swal({ 
                        title: '',
                        text: '<b>'+obj.msg+'<b>',
                        confirmButtonColor: btnCor,
                        confirmButtonText: btnText,
                        type: type,
                        html: true
                      },
                      function(){
                          if(redirect === true){
                              window.location.href = obj.url;
                          }                        
                    });                                                                                                             
                },
                error: function(data){                                                
                    swal({ 
                        title: 'Oops!',
                        text: 'Falha ao criar página, entre em contato com o suporte!',
                        confirmButtonColor: '#f8ac59',
                        confirmButtonText: 'OK',
                        type: 'warning',
                        html: true
                      });                        
                }
        });             
            return false;
    });
    
    $("#tabelaListaPagina").DataTable({
        "language":{
            "sEmptyTable": "Nenhum registro encontrado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "_MENU_ resultados por página",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "Pesquisar",
        "oPaginate":{
            "sNext": "Próximo",
            "sPrevious": "Anterior",
            "sFirst": "Primeiro",
            "sLast": "Último"
        },
        "oAria":{
            "sSortAscending": ": Ordenar colunas de forma ascendente",
            "sSortDescending": ": Ordenar colunas de forma descendente"
        }
        }
    });    
    
});