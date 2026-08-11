$(document).ready(function() {

    // reset de flags que serão utilizados para alertas
    //alerta de chamados abertos
    localStorage.clear('chamado_alertado')

    // $('#aouth').click(function(){ 
    //     let usuario = $('#usuario').val()
    //     let senha = $('#senha').val()
    //     let unidade = $('#selUnidade').val()
    //     let option = null;
    //     $.ajax({
    //         url: '/ci/sist_central/Login/oauth',
    //         type: 'POST',
    //         dataType:'json',
    //         data:{'usuario':usuario, 'senha':senha, 'unidade':unidade},
    //         success: function(resposta) {
    //             console.log(resposta);

    //             if (!resposta.success) {
    //                if(!resposta.perfil) {
    //                 alert(resposta); return;
    //                }
    //                 toastr.options = {
    //                     "preventDuplicates": false,
    //                     "preventOpenDuplicates": false
    //                 };
    //                 toastr.error('Login ou senha do Vision incorretos!', 'Atenção!', { timeOut: 10000 });
    //                 return
    //              }

    //             if (resposta.unidades.length > 1) {

    //                 for (let i = 0; i < resposta.unidades.length; i++) {

    //                     var unidades = resposta.unidades[i].razao_social;

    //                     let sel = document.getElementById('selUnidade');

    //                     option += `<option value="${resposta.unidades[i].id}">${unidades}</option>`
    //                     sel.innerHTML = option
    //                 }

    //                 $('#divUnidades').show();
    //                 return
    //             }

             
               
    //              console.log(resposta.uri);
    //              window.location.href = resposta.uri;

    //         },
    //         error: function() {
    //             toastr.options = {
    //                 "preventDuplicates": false,
    //                 "preventOpenDuplicates": false
    //             };
    //             toastr.error("Erro ao tentar obter o redirecionamento", 'Atenção!', { timeOut: 10000 });
    //             return
    //         }
    //     });

    // })

    
        $('#aouth').click(function() {
            // Aqui você chama a função PHP `iniciarSsoVision` através de uma requisição HTTP.
            // Como essa função realiza um redirecionamento, você não pode chamá-la diretamente via AJAX.
            // Em vez disso, você pode simplesmente redirecionar o navegador para a URL que faria o mesmo que `iniciarSsoVision`.
            var ssoStartUrl = "/ci/sist_central/login/iniciarSsoVision";
            window.location.href = ssoStartUrl;
        });
    
    $('#aouthBetha').click(function() {
        // Aqui você chama a função PHP `iniciarSsoVision` através de uma requisição HTTP.
        // Como essa função realiza um redirecionamento, você não pode chamá-la diretamente via AJAX.
        // Em vez disso, você pode simplesmente redirecionar o navegador para a URL que faria o mesmo que `iniciarSsoVision`.
        var ssoStartUrl = "/ci/sist_central/Login/iniciarSsoBetha";
        window.location.href = ssoStartUrl;
    });


    $('#divUnidades').hide();
    $('form').on('submit', function() {
        $('#blocoLogin').hide();
        $('#carregando').removeClass('hide');
    });

    $('.conecta').click(function() {
        let usuario = $('#usuario').val();
        let senha = $('#senha').val();
        let option = null;
        let unidade = $("#selUnidade option:selected").val();
        $.ajax({
            url: '/ci/sist_central/Login/verificarUnidadeUsuario',
            type: 'POST',
            dataType: 'json',
            data: { 'usuario': usuario },
            success: function(resposta) {
                if (resposta.unidades.length > 1) {
                    $('#divUnidades').show();

                    for (let i = 0; i < resposta.unidades.length; i++) {

                        var unidades = resposta.unidades[i].razao_social;

                        let sel = document.getElementById('selUnidade');

                        option += `<option value="${resposta.unidades[i].id}">${unidades}</option>`
                        sel.innerHTML = option
                    }

                    if (unidade != undefined) {
                        verificarLogin()
                    } else {
                        toastr.options = {
                            "preventDuplicates": false,
                            "preventOpenDuplicates": false
                        };
                        toastr.warning("Este usuário está cadastrado em mais de uma unidade. Por gentileza, selecione a unidade desejada.", "Multiplas unidades", { timeOut: 10000 });
                    }

                } else if (resposta.unidades.length == 1) {
                    unidade = resposta.unidades[0].unidades;
                    verificarLogin()
                }

            },
            error: function() {
                toastr.options = {
                    "preventDuplicates": false,
                    "preventOpenDuplicates": false
                };
                toastr.error("Verifique se o digitou corretamente o nome de usuário.", "Usuário não encontrado", { timeOut: 10000 });
            }
        });

        function verificarLogin() {
            $.ajax({
                url: '/ci/sist_central/Login/VerificarLogin',
                type: 'POST',
                dataType: 'json',
                data: { 'usuario': usuario, 'senha': senha, 'unidade': unidade },
                success: function(resposta) {
                    console.log(resposta)
                    if (resposta == false) {
                        toastr.options = {
                            "preventDuplicates": false,
                            "preventOpenDuplicates": false
                        };
                        toastr.error("Usuário ou senha incorretoooo!", { timeOut: 10000 });
                    } else {
                        verifica_senha();

                    }
                }
            });
        }

        function verifica_senha() {
            $.ajax({
                url: '/ci/sist_central/Senhas/getExpiracao',
                type: 'POST',
                dataType: 'json',
                success: function(resposta) {
                    if (resposta.expirado == true) {
                        swal({
                            title: 'Sua senha expirou!',
                            text: 'Por gentileza,antes de continuar utilizando o sistema,' +
                                'redefina sua senha.',
                            icon: 'warning',
                            dangerMode: true,
                            buttons: {
                                confirm: {
                                    text: 'Redefinir Senha',
                                    value: true,
                                    visible: true,
                                    className: "btn-primary",
                                    closeModal: true
                                }
                            }
                        }).then((willReset) => {
                            if (willReset) {
                                window.location.href = '/ci/sist_central/ResetSenha/novaSenhaSistema';
                            }
                        });
                    }else if (resposta.alerta == true && resposta.expirado == false) {
                        swal({
                            title: 'Sua senha irá expirar em ' + resposta.dias + ' dia(s)!',
                            text: 'Deseja Redefinir agora?',
                            icon: 'warning',
                            dangerMode: true,
                            buttons: {
                                cancel: {
                                    text: 'Não',
                                    value: null,
                                    visible: true,
                                    className: "btn-danger",
                                    closeModal: true
                                },
                                confirm: {
                                    text: 'Sim, desejo redefinir!',
                                    value: true,
                                    visible: true,
                                    className: "btn-primary",
                                    closeModal: true
                                }
                            }
                        }).then((willReset) => {
                            if (willReset) {
                                window.location.href = '/ci/sist_central/ResetSenha/novaSenhaSistema';
                            } else {
                                window.location.href = '/ci/sist_social/DashBoardSocial';
                            }
                        });
                    }
                    else {
                        window.location.href = '/ci/sist_central/Login';
                    }
                }
            });
        }

    })
})