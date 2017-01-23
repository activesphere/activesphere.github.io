var editor = ace.edit("editor");
editor.setTheme("ace/theme/textmate");
editor.getSession().setMode("ace/mode/javascript");

var lang = 'javascript';

var commentMap = {
    'python': '#',
    'ruby': '#',
    'javascript': '//',
    'cpp': '//',
    'java': '//'
};

var uploadCode = function(code) {
    $.ajax({
        url: 'http://localhost:5000/evaluate',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ code: code, lang: lang, problem_id: 'LFU_CACHE' }),
        timeout: 300000
    }).done(function(res) {
        alert(res.result);
    }).fail(function(err) {
        alert('Something went wrong, Sorry!');
    }).always(function() {
        $('#ps-submit-btn').attr('disabled', false);
    });
};

var setLanguage = function(lang) {
    editor.getSession().setMode("ace/mode/"+lang);
    var placeholder = commentMap[lang] + ' Your Code Goes Here.';
    editor.setValue(placeholder);
};

$(document).ready(function() {
    setLanguage(lang);
});

$('#ps-submit-btn').on('click', function() {
    $(this).attr('disabled', true);
    var code = editor.getValue().split('\n');
    uploadCode(code);
});

$('#lang-mode').change(function() {
    var lang = $(this).val();
    setLanguage(lang);
});
