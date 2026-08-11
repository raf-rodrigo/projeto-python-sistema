 /*
* Translated default messages for the jQuery validation plugin.
* Locale: PT_BR
*/
jQuery.extend(jQuery.validator.messages, {
    required: "O campo é obrigatório.",
    remote: "Corrija este campo.",
    email: "O campo deve conter um Endereço e-mail válido.",
    url: "O campo deve uma URL válida.",
    date: "O campo deve conter uma data válida.",
    dateISO: "O campo deve conter uma data válida (ISO).",
    number: "O campo deve conter apenas números.",
    digits: "O campo deve conter apenas números.",
    equalTo: "O valor deve ser igual",
    maxlength: jQuery.validator.format("O campo não deve conter mais de {0} caracteres."),
    minlength: jQuery.validator.format("O campo deve conter pelo menos {param} caracteres."),
    rangelength: jQuery.validator.format("O campo deve conter um valor entre {0} e {1} caracteres de comprimento."),
    range: jQuery.validator.format("O campo deve ter um valor entre {0} e {1}."),
    max: jQuery.validator.format("O campo deve ter um valor menor ou igual a {0}."),
    min: jQuery.validator.format("O campo deve ter um valor maior ou igual a {0}.")
});