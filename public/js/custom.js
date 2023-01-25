$(document).ready(function() {

    (function() {
        $('#contacts').html('');
        $.getJSON('/contacts', function(data) {
            let i 
            $.each(data, function(id, contacto) {
                if(true) {// id != app.user.id) {
                    $('#contacts').append($('#templateContact').html());
                    $('.contact--id:last-child').attr('data-id', id);
                    $('.contact--image:last-child').attr('src', "img/" + contacto.image);
                    $('.contact--userName:last-child').text(contacto.username);
                    $('.contact--info:last-child').text('');
                }
            });
        });
    })();

});