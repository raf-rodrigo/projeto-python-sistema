$(document).ready(function(){
    $('form').on('submit', function (event) {
        event.preventDefault();
        var senha = $('#senha').val();
        var senha_confirma = $('#senha_confirma').val();

        $.ajax({
            url: caminho + 'sist_central/ResetSenha/redefinirSenha',
            type: 'POST',
            data: {
                id: id,
                senha: senha,
                senha_confirma: senha_confirma
            }
        }).done(function(response) {
            var retorno = JSON.parse(response);

            if (retorno.sucesso == 200) {
                var redirecionamento = 'Login';
                if (retorno.usuarioLogado == true) {
                    redirecionamento = 'inicio';
                }
                swal({
                    title: "Senha alterada com sucesso!",
                    text: "Clique em ok para continuar",
                    type: "success"
                }, function() {
                    window.location.href = caminho + 'sist_central/' + redirecionamento;
                });
            } else if (retorno.sucesso == 400) {
                $('.error').hide();

                var mensagensErro = '';
                if (retorno.errors.senha) {
                    mensagensErro += retorno.errors.senha + '<br>';
                }
                if (retorno.errors.senha_confirma) {
                    mensagensErro += retorno.errors.senha_confirma + '<br>';
                }
                if (retorno.errors.general) {
                    mensagensErro += retorno.errors.general + '<br>';
                }
                $('#errorSenhaConfirma').html(mensagensErro).show();
            } else {
                swal("Ops", "Falha ao alterar a senha, entre em contato com o suporte!", "warning");
            }

        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log("AJAX error:", textStatus, errorThrown);
            $('#errorSenhaConfirma').html("Erro ao processar a requisição. Por favor, tente novamente.").show();
        });
    });
});
