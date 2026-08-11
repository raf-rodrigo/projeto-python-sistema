var vinculado = false;

function defineBotoesAcoes(){
    $(document).on('click', '.botaoExluirUsuario',function(){
        var chave = $(this).attr('data-id');
        var user = $(this).attr('data-name');
        console.log(user);
        swal({
            title: "Deseja realmente deletar este usuário?",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#ed5565 ',
            confirmButtonText: 'Sim, deletar registro!',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: false },
            function(){deletarUsuarioRecursosHumanos(user); 
                deletarUsuario(chave); }
        );
    });

    //Modal Perfil 
    $(document).on('click','.botaoVincularPerfil',function(){
        var chave = $(this).attr('data-id');
        $.ajax({
            url:caminho+'sist_central/Perfil/buscarPorUsuario',
            type:'POST',
            data:{chave:chave}
        })
        .done(function(retorno){
            var resposta = jQuery.parseJSON(retorno);
            
            $('#spanUsuario').html(resposta.nomeUsuario);
            $('.modal-body-perfis').html(resposta.htmlTela);
            $('#modalSelecionaPerfil').modal('show');

            $(".buscaRapida").keyup(function(){
                var tabela = $(this).attr('alt');
                var nomeFiltro = $.trim($(this).val().toLowerCase());
                $('#'+tabela).find('tbody tr').each(function() {
                    var conteudoCelula = $.trim($(this).find('td').text());
                    var corresponde = conteudoCelula.toLowerCase().indexOf(nomeFiltro) >= 0;
                    if(corresponde){
                        $(this).show();
                    }
                    else{
                        $(this).hide();
                    }
                });
            }); 
        })
        .fail(function(data){
            swal({ 
                title: 'Oops!',
                text: 'Falha ao carregar o perfil, entre em contato com o suporte!',
                confirmButtonColor: '#f8ac59',
                confirmButtonText: 'OK',
                type: 'warning',
                html: true
            });
        }
        );
    });
    
    //Verifica se o módulo selecionado é do social.
    $(document).on('click','.opcoesPerfil',function(){
        $.ajax({
            url:caminho+'sist_central/Modulo/verificarModulo',
            type:'POST',
            data:{
                usuario:$('#usuario').val(),
                idUsuario:$('input[name="chaveUsuario"]').val(),
                idModulo:$(this).attr('data-id'),
                textPerfil:$(this).parent().children().last().children().text()
            }
        })
        .done(function(retorno){
            var retorno = JSON.parse(retorno);
            if(retorno.status){
                $('#modalSelecionaPerfil').modal('hide');
                $('#modalPerfilUsuarioSemRH').modal('show');
                $('#botaoSalvarNovoUsuarioCriadoRh').hide();
                $('#modalBodyUsuarioSemRH').html(retorno.html);
                $('#btnCriarNovoUsuarioRH').show();
                $('.i-checks').iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green',
                });

                formataTableParaDataTable($('#tabelaModalUsuarioSemRh'));

                $('.optionVincular').on('ifClicked',function(event){
                    var idRH = $(this).first().parent().closest('.trTableUsuarioSemRh').attr('id');
                    var usuario = $('#usuario').val();
                    vinculaUsuarioAoRh(idRH,usuario);
                });
            }
        })
        .fail(function(data){
            swal({
                title: 'Oops!',
                text: 'Falha ao carregar dados do perfil, entre em contato com o suporte!',
                confirmButtonColor: '#f8ac59',
                confirmButtonText: 'OK',
                type: 'warning',
                html: true
            });
        });
    });

    //Quando um perfil do módulo for selecionado, ele é exibido canto superior direito do menu!
    $(document).on('change','.checkbox_buttom',function(){
        definirPerfilExibicao($(this));
    });

    function definirPerfilExibicao(obj){
        var html = '<span class="perfilAtual">Perfil atual</span>';
        if(obj.val() == ''){
            html += ' '+obj.attr('data-text');
        }else {
            html += ' <a href="' + caminhoBase + 'Perfil/editar/' + obj.val() + '" target="_blank">' + obj.attr('data-text') + '</a>';
        }
        $('.infoPerfil').html(html);
    }

    $(document).on('click','#btnCriarNovoUsuarioRH',function(){
        $.ajax({
            url:caminho+'sist_central/complemento/social/usuario/formCadastroRH',
            type:'POST',
            data:{
                usuario:$('#usuario').val(),
                usuarioNome:$('#usuarioNome').val(),
                usuarioEmail:$('#usuarioEmail').val()
            }
        })
        .done(function(retorno){
            var retorno = JSON.parse(retorno);
            $('#modalBodyUsuarioSemRH').html(retorno.html);
            $('#botaoSalvarNovoUsuarioCriadoRh').show();
            $('#btnCriarNovoUsuarioRH').hide();
            $('.radiosCriarUsuarioRh').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
            $('#selectCriarUsuarioRh').select2({placeholder: "Selecione uma Função"});
            $('#selectUnidadeCriarUsuarioRh').select2({placeholder: "Selecione uma Unidade"});
        })
        .fail(function(){
            swal({
                title: 'Oops!',
                text: 'Falha ao carregar dados do novo cadastro, entre em contato com o suporte!',
                confirmButtonColor: '#f8ac59',
                confirmButtonText: 'OK',
                type: 'warning',
                html: true
            });    
        });
    });
    
    //Salva novo usuario RH
    $(document).on('click','#botaoSalvarNovoUsuarioCriadoRh',function(){
        if($("#formCadastrarUsuarioRh").valid()){
            $.ajax({
            url:caminho+'sist_central/complemento/social/Usuario/criarUsuarioRH',
            type:'POST',
            data:{
                usuario: $('#usuarioRH').val(),
                usuarioNome: $('#nomeRH').val(),
                usuarioEmail: $('#emailRH').val(),
                usuarioSexo: $('.usuarioSexoRH:checked').val(),
                usuarioResponsavelOrgao: $('.usuarioResponsavelRH:checked').val(),
                usuarioFuncao: $('#selectCriarUsuarioRh').val(),
                usuarioUnidade: $('#selectUnidadeCriarUsuarioRh').val()
            }
        })
        .done(function(retorno){
            var retorno = JSON.parse(retorno);
    
            if(retorno.resultado){
                vinculado = true;
                swal({
                    title:"Usuário Criado com sucesso!",
                    text:"Clique em ok para continuar",
                    type:"success"
                },
                function(){$('#modalPerfilUsuarioSemRH').modal('hide');});
            }
            else{
                swal({ 
                    title: 'Oops!',
                    text: 'Falha ao criar usuário, entre em contato com o suporte!',
                    confirmButtonColor: '#f8ac59',
                    confirmButtonText: 'OK',
                    type: 'warning',
                    html: false
                });
            }
        })
        .fail(function(data){
            swal({ 
                title: 'Oops!',
                text: 'Falha ao criar usuário, entre em contato com o suporte!',
                confirmButtonColor: '#f8ac59',
                confirmButtonText: 'OK',
                type: 'warning',
                html: false
            });
        });
    }
    });
    
    $(document).on('click','#botaoCancelarRH',function(){
        $('#tableModalPerfil3').children().children().first().children().children().attr('checked',true);
    });
    
    $('#modalPerfilUsuarioSemRH').on('hidden.bs.modal',function(e){
        $('#modalSelecionaPerfil').modal('toggle');

        if(vinculado){
            vinculado = false;
            $('#botaoSalvarPerfis').click();
            $('#modalSelecionaPerfil').modal('hide');
        }
    });
    
    //Modal Upload de imagem.
    $('.botaoVincularImagem').click(function(event){
        $('#modalUpload').modal('show');
        $('#chave').val($(this).attr('data-id'));
    });

    //Alterar Aba modulo
    $(document).on('click','.alterarAbaModulo',function(){
        var id = $(this).attr('data-id');
        var idAtivo = $('#divTableModuloModal').val();
        
        $('#divTableModuloModal_'+idAtivo).hide();
        $('#divTableModuloModal_'+id).show();
        $('#divTableModuloModal').hide();
        $('#divTableModuloModal').val(id);

        var vinculo = false;
        $('#divTableModuloModal_'+id).children().find('.checkbox_buttom').each(function(index){
            if($(this).is(':checked')){
                definirPerfilExibicao($(this));
                vinculo = true;
            }
        });

        if(!vinculo){
            $('#divTableModuloModal_'+id).children().find('.semPerfil').prop('checked',true);
            $('.infoPerfil').html('<span class="perfilAtual">Perfil atual</span> Sem perfil no Módulo');
        }
    });

    //Vincular Perfil ao Usuário.
    $('#botaoSalvarPerfis').click(function(event) {
        var acessar = $('#formPerfil');
        var perfilSelecionado = $('input[type="radio"].opcoesPerfil:checked').data('text');
        var chaveUsuario = $('input[name="chaveUsuario"]').val(); // Assumindo que o campo chaveUsuario está no formulário
    
        if (!chaveUsuario) {
            console.error("Chave do usuário não encontrada no formulário.");
            return false;
        }
    
        if (perfilSelecionado === 'Instituições') {
            $.ajax({
                url: caminho + 'sist_vagas/Instituicoes/listarInstituicoes',
                type: 'get',
                success: function(resposta) {
                    var instituicoes = resposta;
    
                    var options = '';
                    instituicoes.forEach(function(instituicao) {
                        options += '<option value="' + instituicao.id + '">' + instituicao.nome + '</option>';
                    });
    
                    swal({
                        title: "Selecione uma Instituição",
                        text: '<select id="instituicaoSelecionada" class="form-control">' + options + '</select>',
                        html: true,
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Salvar',
                        cancelButtonText: 'Cancelar'
                    }, function(isConfirm) {
                        if (isConfirm) {
                            var instituicaoId = $('#instituicaoSelecionada').val();
                            console.log("Instituição selecionada: " + instituicaoId);
                            $('<input>').attr({
                                type: 'hidden',
                                id: 'instituicaoIdInput',
                                name: 'instituicaoId',
                                value: instituicaoId
                            }).appendTo(acessar);
                            salvarPerfilComInstituicao(chaveUsuario, instituicaoId); // Passar chaveUsuario e id_instituicao
                            salvarPerfil();
                        }
                    });
                },
                error: function(data) {
                    swal({
                        title: 'Oops!',
                        text: 'Falha ao carregar instituições, entre em contato com o suporte!',
                        confirmButtonColor: '#f8ac59',
                        confirmButtonText: 'OK',
                        type: 'warning',
                        html: true
                    });
                }
            });
        } else {
            salvarPerfil(); // Chama a função para salvar o perfil diretamente
        }
        
        function salvarPerfilComInstituicao(chaveUsuario, instituicaoId) {
            console.log("Salvando perfil com instituição...");
            var formData = acessar.serializeArray();
            formData.push({ name: 'chaveUsuario', value: chaveUsuario });
            formData.push({ name: 'instituicaoId', value: instituicaoId });
    
            $.ajax({
                url: caminho + 'sist_central/Usuario/vincularPerfilCV',
                type: 'post',
                data: $.param(formData),
                success: function(resposta) {
                    var resposta = jQuery.parseJSON(resposta);
                    if (resposta.status == 'Sucesso') {
                        console.log("Perfil e instituição vinculados com sucesso.");
                        swal({
                            title: "Perfis vinculados com sucesso.",
                            text: "",
                            type: "success"
                        }, function() {
                            $('#modalSelecionaPerfil').modal('hide');
                            acessar[0].reset();
                            $('body').css('overflow', 'auto'); // Restaurar o scroll da página
                        });
    
                        return false;
                    } else {
                        swal({
                            title: 'Oops!',
                            text: 'Falha ao vincular perfil, entre em contato com o suporte!',
                            confirmButtonColor: '#f8ac59',
                            confirmButtonText: 'OK',
                            type: 'warning',
                            html: true
                        });
                    }
                },
                error: function(data) {                                                
                    swal({ 
                        title: 'Oops!',
                        text: 'Falha ao vincular perfil, entre em contato com o suporte!',
                        confirmButtonColor: '#f8ac59',
                        confirmButtonText: 'OK',
                        type: 'warning',
                        html: true
                    });
                }
            });
        }
    
        function salvarPerfil() {
            console.log("Salvando perfil...");
            $.ajax({
                url: caminho + 'sist_central/Usuario/vincularPerfil',
                type: 'post',
                data: acessar.serialize(),
                success: function(resposta) {
                    var resposta = jQuery.parseJSON(resposta);
                    if (resposta.status == 'Sucesso') {
                        console.log("Perfil vinculado com sucesso.");
                        swal({
                            title: "Perfis vinculados com sucesso.",
                            text: "",
                            type: "success"
                        }, function() {
                            $('#modalSelecionaPerfil').modal('hide');
                            acessar[0].reset();
                            $('body').css('overflow', 'auto'); // Restaurar o scroll da página
                        });
    
                        return false;
                    } else {
                        swal({
                            title: 'Oops!',
                            text: 'Falha ao vincular perfil, entre em contato com o suporte!',
                            confirmButtonColor: '#f8ac59',
                            confirmButtonText: 'OK',
                            type: 'warning',
                            html: true
                        });
                    }
                },
                error: function(data) {                                                
                    swal({ 
                        title: 'Oops!',
                        text: 'Falha ao vincular perfil, entre em contato com o suporte!',
                        confirmButtonColor: '#f8ac59',
                        confirmButtonText: 'OK',
                        type: 'warning',
                        html: true
                    });
                }
            });
        }
    
        return false;
    });
    

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
            $("#botaoSalvarUpload").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                myDropzone.processQueue();
            });
            this.on("success", function(response) {
                if(response.accepted){
                    swal({
                        title:"Imagem salva com sucesso!",
                        text: "Clique em ok para continuar",
                        type: "success"
                    },
                    function() { $('#modalUpload').modal('hide'); window.location.href=''; });
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
    $('#modalUpload').on('hidden.bs.modal',function(e){
       myDropzone.removeAllFiles(true);
    });
    $('#imgDropzone .dz-message').css('background-image','none');

    //Modal RedefinirSenha 
    $(document).on('click','.botaoRedefinirSenha',function(){
        var chave = $(this).attr('data-id');
        $('#chaveSenha').val($(this).attr('data-id'));
        $('#modalRedefinirSenha').modal('show');
        return true;
        $.ajax({
            url: caminho+'sist_central/Usuario/redefinirSenha',
            type:'POST',
            data:{chave:chave}
        })
        .done(function(retorno){
            $('#modalRedefinirSenha').modal('show');
        });
    });

    $(document).on('click','.botaoGerarSenha',function(){
        var senha = gerarSenha(8);
        $('#senha').val(senha);
        $('#confirmarSenha').val(senha);
    });
    
    $(document).on('click','.botaoSalvarSenha',function(){
        if($('#senha').val() == ''){
            swal({
                title: 'Oops!',
                text: 'Senha não pode estar em branco!',
                confirmButtonColor: '#f8ac59',
                confirmButtonText: 'OK',
                type: 'warning',
                html: true
            });
            return false;
        }
        else if($('#senha').val() != $('#confirmarSenha').val() ){
            swal({
                title: 'Oops!',
                text: 'A Senha e Confirmação devem ser iguais!',
                confirmButtonColor: '#f8ac59',
                confirmButtonText: 'OK',
                type: 'warning',
                html: true
            });
            return false;
        }
        
        var acessar = $('#formRedefinirSenha');
        $.ajax({
            url: caminhoBase+'Usuario/redefinirSenha',
            type: 'post',
            data: acessar.serialize(),           
            success: function(resposta){
                var resposta = jQuery.parseJSON(resposta);
                if(resposta.status == 'Sucesso'){
                    swal({
                        title: "Senha reefinida com sucesso.",
                        text: $('#senha').val(),
                        type: "success"
                    });

                    $('#modalRedefinirSenha').modal('hide');
                    acessar[0].reset();
                    return false;
                }
                else{
                    swal({
                        title: 'Oops!',
                        text: 'Falha ao redefinir senha, entre em contato com o suporte!',
                        confirmButtonColor: '#f8ac59',
                        confirmButtonText: 'OK',
                        type: 'warning',
                        html: true
                    });
                }
            },
            error: function(data){                                                
                swal({ 
                    title: 'Oops!',
                    text: 'Falha ao redefinir senha, entre em contato com o suporte!',
                    confirmButtonColor: '#f8ac59',
                    confirmButtonText: 'OK',
                    type: 'warning',
                    html: true
                });
            }
        });
        return false;
    });
}

function gerarSenha(quantidade){
    if(typeof(quantidade) === 'undefined'){
        quantidade = 6;
    }

    var senha = "";
    var ascii = [[48, 57],[65,90]];
    
    for (var i= 0; i<quantidade; i++) {
        var randon = Math.floor(Math.random()*ascii.length);
        senha +=  String.fromCharCode(Math.floor(Math.random()*(ascii[randon][1]-ascii[randon][0]))+ascii[randon][0]);
    }
    return senha;
}

function deletarUsuario(chave){
    paginaLista = caminho+'sist_central/Usuario';

    $.ajax({
        url:caminho+'sist_central/Usuario/excluir',
        type:'POST',	
        data:{chave:chave},
        success:function(response){
            try{
                retorno = JSON.parse(response);

                if(retorno.resultado){
                    swal({
                        title:"Usuário excluido com sucesso!",
                        text: "Clique em ok para continuar",
                        type: "success"
                    },
                    function() { window.location.href = paginaLista; });
                }
                else{
                    swal({
                        title:"Não foi possível excluir usuário!",
                        text: "Clique em ok para continuar",
                        type: "error"
                    });
                }
            }
            catch(err){
                swal("Ops", "Falha ao excluir dados do usuário, entre em contato com o suporte!", "warning");
            }
        },
        error:function(){
            swal("Ops", "Falha ao excluir dados do usuário, entre em contato com o suporte!", "warning");
        }
    });
}

function deletarUsuarioRecursosHumanos(user){
    $.ajax({
        url:caminho+'sist_social/RecursosHumanos/inativarRecursoHumano',
        type:'POST',	
        data:{usuario: user},
        success:function(response){
            try{
                retorno = JSON.parse(response);
            }
            catch(err){
                swal("Ops", "Falha ao excluir dados do usuário em recursos humanos, entre em contato com o suporte!", "warning");
            }
        },
        error:function(){
            // swal("Ops", "Falha ao excluir dados do usuário em recursos humanos, entre em contato com o suporte!", "warning");
        }
    });
}

function vinculaUsuarioAoRh(idRH,usuario){
    $.ajax({
        url:caminho+'sist_central/Usuario/atualizarMemberIdRh',
        type:'POST',
        data:{idRh:idRH,usuario:usuario}
    })
    .done(function(retorno){
        var retorno = JSON.parse(retorno);
        
        if(retorno.resultado){
            vinculado = true;
            swal({
                title:"Usuário Vinculado com sucesso!",
                text:"Clique em ok para continuar",
                type:"success"
            },
            function(){$('#modalPerfilUsuarioSemRH').modal('hide');});
        }
        else{
            swal({
                title:"Não foi possível vincular usuário, consulta o suporte!",
                text: "Clique em ok para continuar",
                type: "error"
            });
        }
    })
    .fail(function(){
        swal({
            title:"Não foi possível vincular usuário, consulta o suporte!",
            text: "Clique em ok para continuar",
            type: "error"
        });
    });
}
