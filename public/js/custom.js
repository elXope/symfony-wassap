$(document).ready(function() {

    // PROVAR A FER-HO AMB TEMPLATE EN JS
    (function() {
        $('#contacts').html('');
        $.getJSON('/contacts', function(data) {
            $.each(data, function(id, contacto) {
                // if(true) {// id != app.user.id) {
                    $('#contacts').append($('#templateContact').html());
                    let i = $('.contact').length;
                    // $('.contact--id:first-child').attr('data-id', id);
                    // $('.contact--image:first-child').attr('src', "img/" + contacto.image);
                    // $('.contact--userName:first-child').text(contacto.username);
                    // $('.contact--info:first-child').text('');
                // }
            });
        });
    })();

});