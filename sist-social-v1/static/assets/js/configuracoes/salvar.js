$('#salvarConfiguracoes').click(function(e) {
    if ($("#formConfiguracoes").valid()) {
        var acessar = $('#formConfiguracoes');
        $.ajax({
            url: acessar.attr('action'),
            type: 'post',
            data: acessar.serialize(),
            success: function(resposta) {

                var resposta = jQuery.parseJSON(resposta);

                if (resposta.sucesso == true) {

                    swal({
                            title: "Configuração salva com sucesso.",
                            text: "Clique em ok para continuar",
                            type: "success"
                        },
                        function() {
                            window.location.href = 'editar/' + resposta.configuracaoId;
                        });

                    $('.form-group').removeClass('has-error');
                    $('.text-danger').remove();

                    acessar[0].reset();

                } else {

                    swal("Campos obrigatórios", " Por gentileza, preencha o campo obrigatório.", "error");

                    $.each(resposta.mensagem, function(key, value) {
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
            error: function() {

                swal("Ops", "A chave já está cadastrada.", "warning");
            }
        });
        return false;
    }
});

$('#fecharConfiguracao').click(function(e) {
    window.location.href = '../';
    return false;
});

$('#fecharConfiguracaoCadastro').click(function(e) {
    window.location.href = 'javascript:window.history.go(-1)';
    return false;
});

$(document).ready(function() {
    $('.tabelaModulo').DataTable();
});