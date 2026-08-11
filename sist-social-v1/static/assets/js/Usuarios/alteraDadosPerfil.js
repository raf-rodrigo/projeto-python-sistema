$(document).ready(function(){

    //Atualiza Senha.
    $('#botaoAlteraSenha').click(function(event){

        $('#novaSenha').removeClass('inputForm error')
        $('#confirmSenha').removeClass('inputForm error')
        $('#senhaAtual').removeClass('inputForm error')
        
        senha = $('#novaSenha').val().trim()
        confirmSenha = $('#confirmSenha').val().trim()

        if(senha.length < 6) {
            swal({
                title:"Informação",
                text: "A senha precisa ter no minimo 6 caracteres.",
                type: "error"
            });
            $('#novaSenha').addClass('inputForm error')
            return
        }

        if(senha !== confirmSenha){
            swal({
                title:"Informação",
                text: "A senha não foi confirmada corretamente.",
                type: "error"
            });
            $('#confirmSenha').addClass('inputForm error')
            return
        }



        $.ajax({
            url: 'atualizarSenha',
            type: 'POST',
            data: {
                senhaAtual:$('#senhaAtual').val(),
                novaSenha:$('#novaSenha').val(),
                confirmSenha:$('#confirmSenha').val()
            }
        })
        .done(function(retorno) {

            try{
                var retorno = JSON.parse(retorno)

                if(retorno.resultado){
                    swal({
                        title:"Senha atualizada com sucesso!",
                        text: "Clique em ok para continuar",
                        type: "success"
                    });
                    $('.panel-body input').val('');
                }
                else{
                    swal({
                        title:retorno.msg,
                        text: "Clique em ok para continuar",
                        type: "error"
                    });

                    if(retorno.focus) {
                        $('#'+retorno.focus).addClass('inputForm error')
                    }
                }
            }
            catch(err){
                swal("Ops", "Falha ao atualizar senha, entre em contato com o suporte!", "warning");
            }

        })
        .fail(function() {
            swal("Ops", "Falha ao atualizar senha, entre em contato com o suporte!", "warning");
        })
    });

    //Atualiza dados do perfil.
    $('#botaoSalvarPerfis').click(function(){
        $.ajax({
            url: 'atualizarDadosPerfil',
            type: 'POST',
            data: {nome:$('#nome').val(),email:$('#email').val()},
        })
        .done(function(retorno) {

            var retorno  = JSON.parse(retorno);

            if(retorno){
                swal({
                    title:"Dados atualizados com sucesso!!!",
                    text:"Clique em ok para continuar",
                    type:"success"
                });
            }
            else{
                swal({
                    title:"Não foi possível atualizar os dados!",
                    text:"Clique em ok para continuar",
                    type:"error"
                });
            }
        })
        .fail(function() {
            swal("Ops","Falha ao atualizar dados do perfil, entre em contato com o suporte!", "warning");
        });
    });

    //Upload de imagem.
    
    //Configurações settings.
    Dropzone.options.myAwesomeDropzone = {
        dictDefaultMessage: "Put your custom message here",
        autoProcessQueue: false,
        maxFiles: 1,

        // Dropzone settings
        init: function() {

            this.on('addedfile',function(file) {
                if(this.files.length > 1){
                  this.removeFile(this.files[0]);
                }
            });

            myDropzone = this;

            $("#botaoSalvarUploadPerfil").on("click",function(e){
                e.preventDefault();
                e.stopPropagation();
                myDropzone.processQueue();
            });

            this.on("success", function(response){
                var htmlReponse = response.xhr.response;
    
                if(htmlReponse){
                    swal({
                        title:"Imagem salva com sucesso!",
                        text: "Clique em ok para continuar",
                        type: "success"
                    },
                    function(){
                        $('#modalUploadPerfil').modal('hide');
                        $('.liIniciais').children().hide();
                        $('#conteudoImagem').html(htmlReponse);
                        $('#liImgUsuario').html(htmlReponse);
                        $('.divBotaoRemoverImagem').first().remove();
                        $('.imagemPerfil').first().removeClass('pull-left');
                    });
                }
                else{
                    swal({
                        title:"Não foi possível salvar a imagem!",
                        text: "Clique em ok para continuar",
                        type: "error"
                    });
                }
            });
        }
    };

    //Limpa modal de upload.
    $('#modalUploadPerfil').on('hidden.bs.modal',function(e){
       myDropzone.removeAllFiles(true);
    });

    //Exibe modal
    $(document).on('click','.imagemPerfil',function(){
        $('#modalUploadPerfil').modal('show');                
    });

    //Remove imagem de perfil.
    $(document).on('click','#botaoRemoveImagem',function(){
        $.ajax({
            url: 'removeImagemPerfil',
            type: 'POST'
        })
        .done(function(retorno) {

            if(retorno){
                swal({
                    title:"Imagem removida com sucesso!",
                    text: "Clique em ok para continuar",
                    type: "success"
                });
                $('#liImgUsuario').children().remove();
                $('.liIniciais').children().show();
                $('#conteudoImagem').html(retorno);
                $('.liImgMenuSuperior').children().remove();
                $('.liImgMenuSuperior').html(retorno);
                $('.imagemPerfil').first().removeClass('pull-left');
            }
            else{
                swal({
                    title:"Não foi possível remover imagem de perfil!",
                    text: "Clique em ok para continuar",
                    type: "error"
                });
            }
        })
        .fail(function() {
            swal("Ops","Falha ao atualizar dados do perfil, entre em contato com o suporte!", "warning");
        })
    });
});