$(function () {
    $.ajax({
        url: caminho + 'sist_central/api/UploadImagem/htmlUpImg',
        type: 'POST',
        data: img,
        success: function(html){
            $('#uploadImagem').html(html).promise().done(function(){
                $.get(caminho+'sist_central/assets/js/plugins/dropzone/dropzone.js').done(function () {
                    habilitaRemoveImagem();
                    uploadImagem();
                });
            });
        }
    });

    function uploadImagem() {
        Dropzone.options.myAwesomeDropzone = {
            url: caminho + 'sist_central/api/UploadImagem/upload/',
            params: {'idUpload' : idUpload},
            autoProcessQueue: false,
            maxFiles: 1,
            acceptedFiles: "image/jpeg,image/png,image/gif",


            // Dropzone settings
            init: function() {
                this.on('addedfile',function(file) {
                    if(this.files.length > 1){
                        this.removeFile(this.files[0]);
                    }

                    if(converterBytes(this.files[0].size,3)){
                        swal({
                            title: "Somente imagens de até 2MB são permitidas",
                            text:  "",
                            type:  "error"
                        });
                        this.removeFile(this.files[0]);
                    };
                });

                myDropzone = this;
                $('#botaoSalvarUploadImagem').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    myDropzone.processQueue();
                });

                //Limpa modal de Upload.
                $('#modalUploadImagem').on('hidden.bs.modal', function (e) {
                    myDropzone.removeAllFiles(true);
                });

                this.on('success', function (response) {
                    var htmlReponse = response.xhr.response;
                    if(response.accepted){
                        swal({
                            title: 'Imagem salva com sucesso!',
                            text: 'Clique em ok para continuar',
                            type: 'success'
                        }, function () {
                            $('#modalUploadImagem').modal('hide');
                            $('#conteudoImagem').html(htmlReponse);
                            habilitaRemoveImagem();
                            habilitaClickExibirModal();
                            $('#descImagem').attr('readonly', false);
                            $.ajax({
                                type: 'POST',
                                dataType: 'JSON',
                                url: caminho + 'sist_central/api/UploadImagem/insereImagem/',
                                data: {
                                    'descricao' : $('#descImagem').val(),
                                    'idUpload' : idUpload
                                }
                            }).done(function (retorno) {
                                console.log(retorno);
                            });
                        });
                    }else{
                        swal({
                            title:'Não foi possível salvar a imagem!',
                            text:'Clique em OK para continuar',
                            type:'error'
                        });
                    }
                });
            }
        };

        habilitaClickExibirModal();
    }
});

function habilitaClickExibirModal() {
    //Exibe modal
    $('#imagem').on('click', function () {
        try{
            Dropzone.discover();
        }catch (e){}
        $('#modalUploadImagem').modal('show');
    });
}

function converterBytes(bytes,casasDecimais){
    if(0==bytes)return"0 Bytes";
    var c=1024,d=casasDecimais||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(bytes)/Math.log(c));
    var result = parseFloat((bytes/Math.pow(c,f)).toFixed(d));
    if(e[f] == "KB" || e[f] == "Bytes"){
        return false;
    }else if(e[f] == "MB" && result <= 2){
        return false;
    }else{
        return true;
    }
}

function habilitaRemoveImagem() {
    $('.fechaImg').on('click',function () {
        removeImagem();
        return false;
    });
}

function removeImagem() {
    $.ajax({
        url: caminho+'sist_central/api/UploadImagem/removeImagemSession/'+nomeController,
        type: 'GET'
    }).done(function(){
        $('#imagem').attr('src','http://localhost/ci/sist_central/assets/img/semImagem.jpg?chache='+Date.now());
        $('#descImagem').val('');
        $('#descImagem').attr('readonly', true);
        $('.fechaImg').hide();
        resetaContagem();
    });
}