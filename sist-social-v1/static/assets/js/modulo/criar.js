$(document).ready(function(){
        
    function somenteNumero(e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
            return false;
        }
    }        
    
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
   
    $('#formCadastrarModulo').submit(function(){
        var dados = $(this).serialize();            
        $.ajax({
                type: 'POST',
                url: '../modulo/inserir',
                data: dados,
                success: function(data){
                    var obj         = JSON.parse(data);
                    var redirect    = false;
                    
                    if(obj.success == false){     
                        
                        swal("Campos obrigatórios", " Por gentileza, preencha os campos obrigatórios.", "error");

                        $.each(obj.messages, function(key, value) {
                            var element = $('#' + key);
                            element.closest('div.form-group')
                            .removeClass('has-error')
                            .addClass(value.length > 0 ? 'has-error' : 'has-success')
                            .find('.text-danger')
                            .remove();
                            element.after(value)
                        });
                        return false;
                    
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
                error: function(data){                                                
                    swal({ 
                        title: 'Oops!',
                        text: 'Falha ao cadastrar módulo, entre em contato com o suporte!',
                        confirmButtonColor: '#f8ac59',
                        confirmButtonText: 'OK',
                        type: 'warning',
                        html: true
                      });                        
                }
        });           
            return false;
    });       
});