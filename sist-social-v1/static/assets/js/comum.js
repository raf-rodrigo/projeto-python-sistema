$(document).ready(function () {
  // Ações pendentes que interrompem a execução de determinadas ações
  // Chamado técnico aberto
 verificarChamadosLoop() 

  //^^^^^^^^^^^^^^^^^^^^
  $("#iconeSobre").on("click", function () {
    $.getJSON(caminho + "sist_central/info/versao/HTML", function (retorno) {
      $("#modalCorpoSobre").html(retorno.html);
    });

    $("#modalSobre").modal("show");
  });

  var spMask = function (val) {
      return val.replace(/\D/g, "").length === 11
        ? "(00) 00000-0000"
        : "(00) 0000-00009";
    },
    spOptions = {
      onKeyPress: function (val, e, field, options) {
        field.mask(spMask.apply({}, arguments), options);
      },
    };

  sweet_alert_success_ok = {
    title: "Sucesso!",
    text: null,
    icon: "success",
    customClass: {
      actions: "swal2-actions-custom",
      confirmButton: "btn btn-primary", // Adicione sua classe personalizada aqui
    },
    buttonsStyling: false, // Necessário para usar classes personalizadas
  };

  sweet_alert_error_send = {
    title: "Erro!",
    text: "Ocorreu um erro na requisição!",
    icon: "error",
    customClass: {
      actions: "swal2-actions-custom",
      confirmButton: "btn btn-primary", // Adicione sua classe personalizada aqui
    },
    buttonsStyling: false, // Necessário para usar classes personalizadas
  };

  /**
   * Verifica no servidor se o e-mail informado já está cadastrado.
   *
   * @returns {void}  — A função não retorna valor diretamente.
   *                   O resultado é tratado no callback da requisição.
   */
  $("#email").on("blur", function () {
    const email = this.value.trim();

    if (email === "") return;

    $.ajax({
      url: caminho + "sist_central/Usuario/verificarEmail",
      method: "POST",
      data: { email },
      dataType: "json",
    })
      .done(function (response) {
        console.log(response);
        if (!response || typeof response.status === "undefined") {
          console.warn("Resposta inesperada do servidor:", response);
          return;
        }

        if (response.status === true) {
          $("#email").val("").focus();
          swal({
            title: "Informação",
            text: response.message,
            icon: "warning",
            buttons: {
              cancel: "Fechar",
            },
          });
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Erro ao verificar e-mail:", textStatus, errorThrown);
        swal({
          title: "Erro de conexão",
          text: "Falha na comunicação com o servidor ao verificar o e-mail.",
          icon: "error",
          button: "Ok",
        });
      });
  });
});

function verificarChamadosLoop() {

  $.ajax({
    url: caminho + "sist_social/AtendimentoTecnico/chamadoTecnicoAberto",
    dataType: "json",
    success: function(response) {

      if (response.success) {

        const agora = Date.now();
        const ultimoAlerta = parseInt(localStorage.getItem('chamado_alertado'));

        const TEMPO_ALERTA = response.tempo_alerta * 60 * 1000;

        if (!ultimoAlerta || (agora - ultimoAlerta) > TEMPO_ALERTA) {

          var config = {
            title: "Atendimento aberto",
            text: response.mensagem,
            showCancelButton: true,
            cancelButtonText: "Alertar depois",
            confirmButtonText: "Continuar atendimento"
          };

          if (typeof Swal !== "undefined") {

            config.icon = "info";

            Swal.fire(config).then((result) => {

              if (result.isConfirmed) {
                window.location.href = caminho + "sist_social/AtendimentoTecnico/editar/" + response.id;
              }

              localStorage.setItem('chamado_alertado', Date.now());
            });

          } else if (typeof swal !== "undefined") {

            config.type = "info";

            swal(config, function(isConfirm) {

              if (isConfirm) {
                window.location.href = caminho + "sist_social/AtendimentoTecnico/editar/" + response.id;
              }

              localStorage.setItem('chamado_alertado', Date.now());
            });

          } else {

            alert(response.mensagem);
            localStorage.setItem('chamado_alertado', Date.now());

          }
        }
      }
    },
    complete: function() {
      // chama novamente depois de X tempo
      setTimeout(verificarChamadosLoop, 10000); // 10 segundos
    }
  });
}
