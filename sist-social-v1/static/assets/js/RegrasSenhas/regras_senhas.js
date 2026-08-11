$(document).ready(function () {
    $('#SalvarRegrasSenhas').click(function (e) {
        e.preventDefault();
        SaveRegrasPassword();
    });
});

function SaveRegrasPassword() {
    var formData = $('#formRegrasSenhas').serialize();

    $.ajax({
        type: 'POST',
        url: caminhoBase + 'RegrasSenhas/salvar',
        data: formData,
        success: function (response) {
            swal({
                title: 'Regras das Senhas salva com sucesso!',
                text: 'Clique em ok para continuar',
                type: 'success',
                confirmButtonColor: '#1ab394',
                confirmButtonText: 'OK'
            }, function () {
                window.location.href = caminho + 'sist_central/RegrasSenhas';
            });
        },
        error: function (xhr, status, error) {
            alert('Falha na requisição: ' + error);
        }
    });
}
