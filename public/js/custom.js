$(document).ready(function() {

    // Gestionar contactes
    (function() {
        $.getJSON('/contacts', function(data) {
            $.each(data, function(id, contacto) {
                if ($('#user').attr('data-user-id') != id) {
                    $.getJSON(`/message/last/${$('#user').attr('data-user-id')}/${id}`, function(data2) {
                        $('#contacts').append(contactTemplate({userId : id, photo : contacto.image, username : contacto.username, lasttimestamp : data2.timestamp, lasttext : data2.text}));
                        $('.contact').click(apretarContacto);
                    });
                }
            });
        });

    })();

    // Enviar missatges
    (function() {

        $('.message-send').keydown(function(evento) {
            if(evento.keyCode == 13) {
                evento.preventDefault();
                if($(this).text().length <= 255) {
                $.post(`/message/toUser/${$('.active').attr('data-id')}`, $(this).serialize());
                $(this).val('');
                }
            }
        });

    })();

    // connexió websocket i actualitzar
    (function() {
        //Open a WebSocket connection.
        websocket = new WebSocket("ws://localhost:9000/");
        
        //Connected to server
        websocket.onopen = function(ev) {
            console.log('Connected to server ');
            let msg = {
                type : 'chatData',
                fromUserId : $('#user').attr('data-user-id'),
                toUserId : 1
            };
            websocket.send(JSON.stringify(msg));
        }
        
        //Connection close
        websocket.onclose = function(ev) { 
            console.log('Disconnected');
        };
        websocket.onmessage = function(evt) { 
            let scroll = document.getElementById('scroll');
            var response = JSON.parse(evt.data).message; //PHP sends Json data
            if(response.type == "chatmsg"){
                if (response.fromUserId == $('#user').attr('data-user-id')) {
                    $('#messages').append(messageTemplateMe({text : response.text, timestamp : response.timestamp.date.split('.')[0]}));
                    scroll.scrollIntoView();
                } else if(response.toUserId == $('#user').attr('data-user-id')){
                    $('div[data-id='+ response.fromUserId +']').children('.contact-info-container').children('.contact-info').children('.text-xs').children('.contact--lastTimestamp').text(response.timestamp.date.split('.')[0]);
                    $('div[data-id='+ response.fromUserId +']').children('.contact-info-container').children('.text-grey-dark').text(response.text);
                    if(response.fromUserId == $('.active').attr('data-id')){
                        $('#messages').append(messageTemplateOther({text : response.text, timestamp : response.timestamp.date.split('.')[0]}));
                        scroll.scrollIntoView();
                    } else {
                        $('div[data-id='+ response.fromUserId +']').children('.contact-info-container').children('.contact-info').children('.text-xs').children('.contact-numMessages').removeClass('hidden');
                        let nMessages = parseInt($('div[data-id='+ response.fromUserId +']').children('.contact-info-container').children('.contact-info').children('.text-xs').children('.contact-numMessages').text());
                        $('div[data-id='+ response.fromUserId +']').children('.contact-info-container').children('.contact-info').children('.text-xs').children('.contact-numMessages').text(++nMessages);
                    }
                }
            }
            //hacer lo que corresponda con response
        };
        
        //Error
        websocket.onerror = function(ev) { 
            console.log('Error '+ev.data);
        };
    })();
});

const contactTemplate =  ({userId, photo, username, lasttimestamp = '', lasttext = ''}) => `
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
                    ${lasttimestamp}
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

const messageTemplateMe = ({text, timestamp}) => `
    <div class="message-me flex justify-end mb-2">
        <div class="rounded py-2 px-3" style="background-color: #E2F7CB">
            <p class="text-message text-sm mt-1">
                ${text}
            </p>
            <p class="text-timestamp text-right text-xs text-grey-dark mt-1">
                ${timestamp}
            </p>
        </div>
    </div>
`;

const messageTemplateOther = ({text, timestamp}) => `
    <div class="message-other flex mb-2">
        <div class="rounded py-2 px-3" style="background-color: #F2F2F2">
            <p class="text-message text-sm mt-1">
                ${text}
            </p>
            <p class="text-timestamp text-right text-xs text-grey-dark mt-1">
                ${timestamp}
            </p>
        </div>
    </div>
`;

function apretarContacto() {
    $('.active').removeClass('active');
    $(this).addClass("active");
    $(this).children('.contact-info-container').children('.contact-info').children('.text-xs').children('.contact-numMessages').text('0');
    $(this).children('.contact-info-container').children('.contact-info').children('.text-xs').children('.contact-numMessages').addClass('hidden');
    $('#convImg').html(
        `<img class="w-10 h-10 rounded-full" src="${$('.active').children('.contact-img-container').children('.contact-img').attr('src')}">`
    );
    $('#convUsername').text($('.active').children('.contact-info-container').children('.contact-info').children('.username').text());
    $.get(`/messages/${$('#user').attr('data-user-id')}/${$(this).attr('data-id')}`, function(data) {
        $('#messages').html('');
        $.each(data, function(index, message) {
            if (message.id == $('#user').attr('data-user-id')) {
                $('#messages').append(messageTemplateMe({text : message.text, timestamp : message.timestamp}));
            } else {
                $('#messages').append(messageTemplateOther({text : message.text, timestamp : message.timestamp}));
            }
        });
    });
}
