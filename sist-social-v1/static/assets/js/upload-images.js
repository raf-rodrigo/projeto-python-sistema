
$('.uploadForm').submit(function(e) {
  
    e.preventDefault(); // Evita o envio normal do formulário

    var formData = new FormData(this); // Cria o FormData a partir do formulário
    var tipo = $(this).data('tipo')
    var preview_ = $(this).data('img');
  
    var form = $(this); // Seleciona o formulário atual como referência
    var progressBar = form.find('.progress-bar');
    var progressBarDiv = form.find('.progress');
    $('#btn_'+preview_).prop('disabled',true).text('Enviando...')
    var div_imagem = $('#div_'+preview_).html();
  

    $('#div_'+preview_).html( `
    <svg width="80" height="80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="0" fill="#1ab394">
            <animate
            attributeName="r"
            calcMode="spline"
            dur="1.2s"
            values="0;11"
            keySplines=".52,.6,.25,.99"
            repeatCount="indefinite"
            />
            <animate
            attributeName="opacity"
            calcMode="spline"
            dur="1.2s"
            values="1;0"
            keySplines=".52,.6,.25,.99"
            repeatCount="indefinite"
            />
        </circle>
    </svg>`)
   

    formData.append('tipo',tipo)

    $(progressBarDiv).css('display','block')

    $.ajax({
        url: site_url+'/imagens/upload', // Endpoint que irá receber o arquivo
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                // Para monitorar o progresso do upload
                myXhr.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                         // Calcula o progresso em porcentagem
            const percentComplete = Math.round((e.loaded / e.total) * 100);

            // Atualiza a barra de progresso do Bootstrap
            $(progressBar).show(); // Exibe o container, se estiver oculto
            $(progressBar)
                .css('width', percentComplete + '%') // Ajusta a largura
                .attr('aria-valuenow', percentComplete) // Atualiza o valor de acessibilidade
                .text(percentComplete + '%'); // Mostra o texto do progresso
                    }
                }, false);
            }
            return myXhr;
        },
        success: function(data) {
            if (!data.success) {
                swal(
                    "", 
                    data.message, 
                    "warning"
                    );
                return;
            }

            swal(
                "", 
                "Imagen enviada!", 
                "success"
                );

           
        },
        error: function(xhr, status, error) {
            swal(
                "", 
                "Ocorreu um erro ao tentar enviar a imagem.", 
                "warning"
                );
        },
        complete: function(xhr, status, error) {
           $(progressBarDiv).css('display','none')
           $(progressBar).css('width','0%')
           $('#btn_'+preview_).prop('disabled',true)
           .text('Aguardando seleção de arquivo...')
           .removeClass('btn-success')
           .addClass('btn-warning')
           $('#div_'+preview_).html(div_imagem)
           $('#btn_cancelar_' + preview_).css('display', 'none');
        }
    });
});

$('.btn-cancelar').on('click', function (e) {
    e.preventDefault();     
    e.stopPropagation();   
    const id = $(this).attr('id').replace('btn_cancelar_', '');
    const preview = $('#' + id); 
    const imagemOriginal = localStorage.getItem('src_' + id);

    if (imagemOriginal) {
        preview.fadeTo(500, 0, function () {
            this.src = imagemOriginal; // 'this' aqui ainda é DOM puro
            $(this).fadeTo(500, 1);     // então envolvemos de novo em $()
        });
    }

    // Desativa o botão de enviar e esconde o cancelar
    $('#btn_' + id).prop('disabled', true)
        .text('Aguardando seleção de arquivo...')
        .removeClass('btn-success')
        .addClass('btn-warning');

    $('#btn_cancelar_' + id).css('display', 'none');
    console.log('#btn_cancelar_' + id +'_')
});


// $('.btn-cancelar').click(function(){
//     let id = $(this).data('id');
//     $(this).css('visibility', 'hidden')
//     console.log(id)
//     $('#btn_'+id+'_').prop('disabled',true)
//     .text('Aguardando seleção de arquivo...')
//     .removeClass('btn-success')
//     .addClass('btn-warning')
    
//     let div_imagem = localStorage.getItem('div_imagem')
//     $('#div_'+id+'_').html(div_imagem)
// })


$(document).on('click', 'img', function () {
    let src = $(this).attr('src').replace('/thumbs', '');
    let id_input_file = $(this).prop('id').replace('_', '');
    console.log(id_input_file);

    let img = new Image();
    img.src = src;

    img.onload = function () {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        swal({
            title: `Dimensões: ${width}x${height}px`,
            text: "<img src='" + src + "' style='max-width: 250px;'>",
            html: true,
            confirmButtonText: "Alterar",
            cancelButtonText: "Fechar",
            showCancelButton: true
        }, function () {
            $('#' + id_input_file).click();
        });
    };

    img.onerror = function () {
        swal("Erro!", "Não foi possível carregar a imagem.", "error");
    };
});
