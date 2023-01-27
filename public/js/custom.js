$(document).ready(function() {

    // Gestionar contactes
    (function() {

        $.getJSON('/contacts', function(data) {
            $.each(data, function(id, contacto) {
                if ($('#user').attr('data-user-id') != id) {
                    $('#contacts').append(contactTemplate({userId : id, photo : contacto.image, username : contacto.username, lasttext : ''}));
                }
            });

            $('.contact').click(function() {
                $('.active').removeClass('active');
                $(this).addClass("active");
                $('#convImg').html(
                    `<img class="w-10 h-10 rounded-full" src="${$('.active').children('.contact-img-container').children('.contact-img').attr('src')}">`
                );
                $('#convUsername').text($('.active').children('.contact-info-container').children('.contact-info').children('.username').text());

            })
        });

    })();

    // Enviar missatges
    (function() {

        $('.message-send').keydown(function(evento) {
            if(evento.keyCode == 13) {
                evento.preventDefault();
                if($(this).text().length <= 255) {
                $.post(`/message/toUser/${$('.active').attr('data-id')}`);
                $(this).text('');
                }
            }
        });

    })();

});

const contactTemplate =  ({userId, photo, username, lasttext}) => `
    <div data-id="${userId}" class="contact px-3 flex bg-white border-2 border-gray-darker items-center cursor-pointer">
        <div class='contact-img-container'>
            <img  class="contact-img h-12 w-12 rounded-full"
                    src="/img/${photo}"/>
        </div>
        <div class="contact-info-container ml-4 flex-1 border-b border-grey-lighter py-4">
            <div class="contact-info flex items-bottom justify-between">
                <p class="username text-grey-darkest">
                    ${username}
                </p>
                <div class="text-xs text-grey-darkest">
                    <p class="contact--lastTimestamp text-xs text-grey-darkest">
                    12:45 pm
                </p>
                <p class="contact-numMessages hidden text-xs text-grey-darkest" style="background-color: #04AA6D; color: white; padding: 4px 8px;text-align: center; border-radius: 5px;">
                    0
                </p> 
                </div>          
            
            </div>
            <p class="text-grey-dark mt-1 text-sm">
                ${lasttext}
            </p>
        </div>
    </div>
`;