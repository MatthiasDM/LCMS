$(function () {

    //check password for admin
//StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
//String encryptedPassword = passwordEncryptor.encryptPassword(userPassword);

    $("#form-new-note").submit(function (event) {
        event.preventDefault();
        //var title = $("input[id=input-title]").val();
        notes_newNote($("#row-notes"), JSON.stringify($(this).serializeObject()));
        
    });
    
    $("#div-list-notes a").click(function(event){              
        notes_getNote($("#card-edit-note-body"), $(this).attr("id"));
    });
        
    

});

//function listNotes(){
//        notes_listNotes($("#card-browse-notes-body"));
//}

function loadNote(){
        notes_getNote($("#card-create-note-body"));
}