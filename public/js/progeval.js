var editor = ace.edit("editor");
editor.setTheme("ace/theme/textmate");
editor.getSession().setMode("ace/mode/python");

var uploadCode = function(code) {
    $.ajax({
        url: 'http://916d0378.ngrok.io/evaluate',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ code: code, lang: 'python', problem_id: 'LFU_CACHE' }),
        timeout: 300000
    }).done(function(res) {
        alert(res.result);
    }).fail(function(err) {
        alert('Something went wrong, Sorry!');
    }).always(function() {
        $('#ps-submit-btn').attr('disabled', false);
    });
};

$('#ps-submit-btn').on('click', function() {
    $(this).attr('disabled', true);
    var code = editor.getValue().split('\n');
    uploadCode(code);
});

