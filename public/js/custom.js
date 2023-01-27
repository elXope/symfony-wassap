$(document).ready(function() {

    // PROVAR A FER-HO AMB TEMPLATE EN JS
    (function() {
        const contactTemplate =  ({userId, photo, username, lasttext}) => `
            <div data-id="${userId}" class="contact px-3 flex bg-white border-2 border-gray-darker items-center cursor-pointer">
                <div>
                    <img  class="h-12 w-12 rounded-full"
                            src="/img/${photo}"/>
                </div>
                <div class="ml-4 flex-1 border-b border-grey-lighter py-4">
                    <div class="flex items-bottom justify-between">
                        <p class="text-grey-darkest">
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

        $.getJSON('/contacts', function(data) {
            $.each(data, function(id, contacto) {
                // If per a que no entre el mateix contacte que està actiu
                $('#contacts').append(contactTemplate({userId : id, photo : contacto.image, username : contacto.username, lasttext : ''}));
            });
        });
    })();
    // (function() {
    //     $('#contacts').html('');
    //     $.getJSON('/contacts', function(data) {
    //         $.each(data, function(id, contacto) {
    //             // if(true) {// id != app.user.id) {
    //                 $('#contacts').append($('#templateContact').html());
    //                 let i = $('.contact').length;
    //                 // $('.contact--id:first-child').attr('data-id', id);
    //                 // $('.contact--image:first-child').attr('src', "img/" + contacto.image);
    //                 // $('.contact--userName:first-child').text(contacto.username);
    //                 // $('.contact--info:first-child').text('');
    //             // }
    //         });
    //     });
    // })();

});