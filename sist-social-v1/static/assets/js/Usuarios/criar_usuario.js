$(document).ready(function ($) {
  $("#pagina_inicial").select2();

  $.validator.addMethod(
    "passwordMatch",
    function (value, element) {
      return value === $("#senha").val();
    },
    "Passwords do not match."
  );

  // Initialize the validation plugin
  $("#formCadastrarUsuario").validate({
    rules: {
      senha: {
        required: true,
        minlength: 6,
      },
      confirmacaoSenha: {
        required: true,
        minlength: 6,
        passwordMatch: true,
      },
    },
    messages: {
      senha: {
        required: "Por favor, digite a senha.",
        minlength: "A senha precisa ter no minimo 6 caracteres.",
      },
      confirmacaoSenha: {
        required: "Por favor, confirme a senha.",
        minlength: "A senha precisa ter no minimo 6 caracteres.",
        passwordMatch: "A senha não foi confirmada corretamente.",
      },
    },
  });

  // Inserir Usuário
  $("#usuario").blur(function () {
    var usuario = this.value;
    if (usuario != "") {
      $.post("../verificarUsuario", { usuario: usuario })
        .done(function (response) {
          var objResp = JSON.parse(response);
          console.log(objResp.usuarioInativo);
          if (objResp.status) {
            if (objResp.usuarioInativo == 2) {
              swal(
                {
                  title: "Usuário Inativo Encontrado",
                  text:
                    "O nome de usuário digitado já existe e encontra-se inativo no sistema. Deseja reativar o usuário: " +
                    objResp.detalhesUsuario.nome +
                    "?",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Reativar",
                  cancelButtonText: "Cancelar",
                  closeOnConfirm: false,
                },
                function (isConfirm) {
                  if (isConfirm) {
                    reativarUsuario(objResp.detalhesUsuario.id);
                  } else {
                    mostrarSugestoesUsuario(usuario);
                  }
                }
              );
            }
            if (objResp.usuarioInativo == 1) {
              swal(
                {
                  title: "Usuário Ativo Existente",
                  text:
                    "O nome de usuário '" +
                    usuario +
                    "' já está em uso e ativo no sistema.",
                  type: "error",
                  confirmButtonText: "Ok",
                },
                function () {
                  mostrarSugestoesUsuario(usuario);
                }
              );
            }
          }
        })
        .fail(function () {
          alert("Falha na comunicação com o servidor ao verificar o usuário.");
        });
    }
  });

  $("#botaoInserirUsuario").click(function (e) {
    if ($("#formCadastrarUsuario").valid()) {
      var form = $("#formCadastrarUsuario");
      $.ajax({
        url: form.attr("action"),
        type: "POST",
        data: form.serialize(),
        success: function (response) {
          try {
            var response = JSON.parse(response);
            if (response.successo) {
              swal(
                {
                  title: "Usuário inserido com sucesso.",
                  text: "Clique em ok para continuar",
                  type: "success",
                },
                function () {
                  window.location.href =
                    caminho + "sist_central/Usuario/editar/" + response.chave;
                }
              );
            } else {
              var msg = "";

              $(response.mensagens).each(function (chave, item) {
                msg += item;
              });
              swal({
                title: "Não foi possível inserir usuário!",
                text: msg,
                type: "error",
                html: true,
              });
            }
          } catch (err) {
            swal(
              "Ops",
              "Falha ao tentar inserir usuário, entre em contato com o suporte!",
              "warning"
            );
          }
        },
        error: function (response) {
          swal(
            "Ops",
            "Falha ao atualizar dados do usuário, entre em contato com o suporte!",
            "warning"
          );
        },
      });
    }
  });
});

// ...

function reativarUsuario(idUsuario) {
  var nomeUsuario = $("#usuario").val(); // Captura o nome de usuário
  $.post("../reativarUsuario", { usuario: idUsuario })
    .done(function (response) {
      try {
        var resp = JSON.parse(response);
        if (resp.success) {
          reativarRecursoHumano(resp.chave, nomeUsuario); // Não precisa passar resp.chave aqui
        } else {
          swal("Erro", "Não foi possível reativar o usuário.", "error");
        }
      } catch (e) {
        swal("Erro", "Resposta do servidor inválida.", "error");
      }
    })
    .fail(function () {
      swal("Erro", "Falha ao se comunicar com o servidor.", "error");
    });
}

function reativarRecursoHumano(memberID, nomeUsuario) {
  $.post("/ci/sist_social/RecursosHumanos/reativarRecursoHumano", {
    usuario: nomeUsuario,
  })
    .done(function (response) {
      var resp = response;
      if (typeof response === "string") {
        try {
          resp = JSON.parse(response);
        } catch (e) {
          swal("Erro", "Resposta do servidor inválida.", "error");
          return;
        }
      }
      if (resp.success) {
        swal(
          {
            title: "Reativado!",
            text: resp.mensagem,
            type: "success",
          },
          function () {
            window.location.href =
              caminho + "sist_central/Usuario/editar/" + memberID;
          }
        );
      } else {
        swal(
          {
            title: "Atenção",
            text: resp.mensagem,
            type: "warning",
          },
          function () {
            window.location.href =
              caminho + "sist_central/Usuario/editar/" + memberID;
          }
        );
      }
    })
    .fail(function () {
      swal(
        "Erro",
        "Falha ao se comunicar com o servidor para recursos humanos.",
        "error"
      );
    });
}

function gerarSugestoesUsuario(nomeBase, quantidade) {
  var sugestoes = [];
  var i = 1;
  while (sugestoes.length < quantidade) {
    var sugestao = nomeBase + i;
    sugestoes.push(sugestao);
    i++;
  }
  return sugestoes;
}

function mostrarSugestoesUsuario(nomeBase) {
  // Gerar um número maior de sugestões para garantir que teremos o suficiente
  var todasSugestoes = gerarSugestoesUsuario(nomeBase, 10);
  var sugestoesValidas = [];

  function verificarProximaSugestao(index) {
    if (index < todasSugestoes.length && sugestoesValidas.length < 3) {
      verificarUsuarioExistente(todasSugestoes[index], function (existe) {
        if (!existe) {
          sugestoesValidas.push(
            '<a href="#" class="sugestao-usuario">' +
              todasSugestoes[index] +
              "</a>"
          );
        }
        verificarProximaSugestao(index + 1); // Verificar a próxima sugestão
      });
    } else {
      // Mostrar as sugestões válidas quando tivermos 3 ou tivermos verificado todas
      if (sugestoesValidas.length > 0) {
        $("#sugestoesUsuario")
          .html("<b>Sugestões:</b> " + sugestoesValidas.join(" "))
          .show();
        $(".sugestao-usuario").click(function (e) {
          e.preventDefault();
          $("#usuario").val($(this).text()).trigger("blur");
        });
      } else {
        $("#sugestoesUsuario")
          .html("<b>Não há sugestões disponíveis.</b>")
          .show();
      }
    }
  }

  verificarProximaSugestao(0); // Iniciar a verificação pela primeira sugestão
}

function verificarUsuarioExistente(usuario, callback) {
  $.post("/ci/sist_central/Usuario/verificarUsuarioExistente", {
    usuario: usuario,
  })
    .done(function (response) {
      // Se a resposta já for um objeto JavaScript, não precisamos analisá-la
      if (typeof response === "object") {
        callback(response.existe, response.ativo);
      } else {
        // Se a resposta for uma string, tentamos analisá-la como JSON
        try {
          var resp = JSON.parse(response);
          callback(resp.existe, resp.ativo);
        } catch (e) {
          console.error(
            "Não foi possível analisar a resposta como JSON:",
            response,
            e
          );
        }
      }
    })
    .fail(function () {
      console.error(
        "Erro ao comunicar com o servidor para verificar o usuário."
      );
    });
}

// function mostrarSugestoesUsuario(nomeBase) {
//     var sugestoes = gerarSugestoesUsuario(nomeBase);
//     var sugestoesHtml = sugestoes.map(function(sugestao) {
//         return '<a href="#" class="sugestao-usuario">' + sugestao + '</a>';
//     }).join(' ');

//     $('#sugestoesUsuario').html('<b>Sugestões:</b> ' + sugestoesHtml).show();

//     $('.sugestao-usuario').click(function(e) {
//         e.preventDefault();
//         $('#usuario').val($(this).text()).trigger('blur');
//     });
// }
