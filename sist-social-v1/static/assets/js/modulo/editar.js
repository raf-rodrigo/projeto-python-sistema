$(document).ready(function(){
    
    $('#idHide').hide();
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
    
    function somenteNumero(e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    }              
    
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

    $('#salvarEdicaoModulo').click(function(event){
        event.preventDefault();
        var nome      = $('#nome').val();
        var caminho   = $('#caminho').val();
        var descricao = $('#descricao').val();
        var ativo     = $('#formEditarModulo .active').val();
        var id        = $('#chave').val();
        $.ajax({
            type: 'POST',
            url: '../atualizar/'+id,
            data: {'nome':nome,'caminho':caminho,'descricao':descricao,'ativo':ativo},                    
            success: function(data){
                var obj = JSON.parse(data);
                var redirect = false;
                var btnText = 'Corrigir!';
                var btnCor = '#DD6B55';
                
                if(obj.success === false){
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
                    title: obj.msg,
                    text: '',
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
                    text: 'Falha ao tentar atualizar dados do módulo, entre em contato com o suporte!',
                    confirmButtonColor: '#f8ac59',
                    confirmButtonText: 'OK',
                    type: 'warning',
                    html: true
                  });                        
            }
        });           
    });
});