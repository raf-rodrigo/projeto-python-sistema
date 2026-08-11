$(document).ready(function(){
       
    var id = $('#chave').val();    
    
    function somenteNumero(e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    }                      
    
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
            var boolMarcado = 0;
        }
        else{
            $(this).val(1);
            var boolMarcado = 1;            
        }
        var objCheck = $(this);
        var acaoId = $(this).attr('data-id');
        $.ajax({
            type: 'POST',
            url: '../vincularAcao',
            data: {'id':id,'acaoId':acaoId,'boolMarcado':boolMarcado},
            success: function(retorno){
                var obj = JSON.parse(retorno);
                if(obj.status === false){
                    swal({ 
                        title: obj.alerta.titulo,
                        text: obj.alerta.texto,
                        confirmButtonColor: obj.alerta.corBtn,
                        confirmButtonText: obj.alerta.textoBtn,
                        type: obj.alerta.tipoModal,
                        html: obj.alerta.html
                        },
                        function(){                          
                           $(objCheck).iCheck('check');
                    });                                            
                }
                else{
                    $('#btnSalvar').on('click',function(){
                        swal({ 
                            title: obj.alerta.titulo,
                            text: obj.alerta.texto,
                            confirmButtonColor: obj.alerta.corBtn,
                            confirmButtonText: obj.alerta.textoBtn,
                            type: obj.alerta.tipoModal,
                            html: obj.alerta.html
                            }); 
                    });                    
                }
            },
            error:function(){
                swal({ 
                    title: 'Oops!',
                    text: 'Falha ao vincular ação, entre em contato com o suporte!',
                    confirmButtonColor: '#f8ac59',
                    confirmButtonText: 'OK',
                    type: 'warning',
                    html: true
                  });
            }
        });                         
    });                            

    $('#formEditarPagina').submit(function(){  
        var url = $('#formEditarPagina').attr('action');
        var dados = $(this).serialize();
        var ativo = $('#formEditarPagina .active').val();
        dados += '&ativo='+ativo;
        $.ajax({
            type: 'POST',   
            url: url+id,
            data: dados,                    
            success: function(data){
                var obj = JSON.parse(data);
                var redirect = false;
                var btnText = 'Corrigir!';
                var btnCor = '#DD6B55';
                
                if(obj.status === false){
                    var msg = obj.msg;
                    var type = 'error';
                }else if(obj.erro === true){
                    var msg = obj.msg;
                    var type = 'error'; 
                }else{
                    var msg = obj.msg;;
                    var type = 'success';
                    btnText = 'OK';
                    btnCor = '#1ab394';
                    redirect = true;
                }
                swal({ 
                    title: '',
                    text: obj.msg,
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
            error:function(data){
                swal({ 
                    title: 'Oops!',
                    text: 'Falha ao tentar atualizar dados da página, entre em contato com o suporte!',
                    confirmButtonColor: '#f8ac59',
                    confirmButtonText: 'OK',
                    type: 'warning',
                    html: true
                  });                        
            }
        }); 
            return false;
    });
    
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
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