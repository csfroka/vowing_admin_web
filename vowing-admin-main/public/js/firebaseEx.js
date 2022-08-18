
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var db = firebase.firestore();


var docid;
var catDocId;
var downloadUri;
var isImageUploaded = false;
var counter;
var initialCategoryTitle;

$(document).ready(function () {

    db.collection("QuizList").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            catDocId = doc.id;
        });
        var dataSet = new Array();
        var query = db.collection('QuizList/' + catDocId + '/Categories').where("type","==","parent");
        let observer = query.onSnapshot(snapshot => {

            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added') {
                    dataSet.push([change.doc.data().sn,
                    '<img src="' + change.doc.data().image + '" width="32dp" height="32dp" />',
                    change.doc.data().title,
                    change.doc.data().desc,
                    change.doc.data().points_multiplier,
                    change.doc.data().published,
                    change.doc.id,
                    change.doc.data().image]);
                    counter = change.doc.data().sn;
                    
                }

            })


            const dataTable = $('#dataTable').DataTable({
                retrieve: true,
                data: dataSet,
                order: [0, 'asc'],
                "columnDefs": [{
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='btn btn-warning' style='font-size : 12px; width: 100%' type='button' data-toggle='modal' data-target='#categoryModal'>Modify</button>"
                }]

            });


            dataTable.clear();
            dataTable.rows.add(dataSet);
            dataTable.draw();
            $('#dataTable_body').on('click', 'button', function () {
                var data = dataTable.row($(this).parents('tr')).data();
                inputSn.value = data[0];
                inputTitle.value = data[2];
                inputDesc.value = data[3];
                inputPointMultiplier.value = data[4];
                inputPublished.value = data[5];
                docid = data[6];
                initialCategoryTitle=data[2];
                if (data[7] != null) {
                    $("#selectedImage").attr('src', data[7]);
                }


            });
        });

    });
})

$("#btn-update-confirm").on('click', function () {
    const sn = parseInt(document.querySelector("#inputSn").value);
    const title = document.querySelector("#inputTitle").value;
    const desc = document.querySelector("#inputDesc").value;
    const xpoint = parseInt(document.querySelector("#inputPointMultiplier").value);
    const ispublished = document.querySelector("#inputPublished").value;
    const image = document.querySelector("#selectedImage").src;
    var boolPublish = (ispublished == "true");

    if (isImageUploaded) {
        const image = downloadUri;
    }

    if (title != "" && desc != "" && xpoint != "" && sn != "") {
        db.collection("QuizList/" + catDocId + "/Questions").where("category","==",initialCategoryTitle).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                isExist = true;
                db.collection("QuizList/" + catDocId + "/Questions").doc(doc.id).update({
                    category: inputTitle.value,
                });
            });
        });
        db.collection("QuizList/" + catDocId + "/Categories").doc(docid).update({
            sn: sn,
            title: title,
            image: image,
            desc: desc,
            points_multiplier: xpoint,
            published: boolPublish,
            type: "parent",
            parent: "",
        })
            .then(function () {
            
                console.log("Document succesfully written");
                $('#categoryModal').modal('toggle');
                location.reload();
                updateProgress.style.display = "none";
            })
            .catch(function (error) {
                console.log("Error writing document: ", error)
            });

        
        } else {
            $('#infoModal').modal('show');
            infoText.innerHTML = "Please fill out all fields!";
        }

});

$("#btn-add-new-category").on('click', function () {
    inputNewSn.value = counter + 1;
});

$("#btn-add-new").on('click', function () {
    const sn = parseInt(document.querySelector("#inputNewSn").value);
    const title = document.querySelector("#inputNewTitle").value;
    const desc = document.querySelector("#inputNewDesc").value;
    const xpoint = parseInt(document.querySelector("#inputNewPointMultiplier").value);
    const ispublished = document.querySelector("#inputNewPublished").value;
    const image = downloadUri;
    var boolPublish = (ispublished == "true");

    if (title != "" && desc != "" && xpoint != null && image != null && sn != null) {
        db.collection('QuizList/' + catDocId + "/Categories").add({
            sn: sn,
            title: title,
            image: image,
            desc: desc,
            points_multiplier: xpoint,
            published: boolPublish,
            type: "parent",
            parent: "",
        })
            .then(function () {
                console.log("Document succesfully written");
                inputNewTitle.value = "";
                inputNewPointMultiplier.value = "1";
                inputNewDesc.value = "";
                counter = sn;
                $('#newCategoryModal').modal('toggle');
                $("#inputTitle").removeData();
                $("#inputDesc").removeData();
                newProgress.style.display = "none";
                updateProgress.style.display = "none";
                $("#selectedNewImage").attr('src', 'images/add-photo.png');

            })
            .catch(function (error) {
                console.log("Error writing document: ", error)

            });
    } else {
        $('#infoModal').modal('show');
        infoText.innerHTML = "Please fill out all fields and chose an image!";
    }


});


$("#btn-delete-confirm").on('click', function () {

    db.collection('QuizList/' + catDocId + "/Categories").doc(docid).delete().then(function () {
        console.log("Document successfully deleted!");
        $('#DeleteConfirmationModal').modal('toggle');
        $('#categoryModal').modal('toggle');
        location.reload();

    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });

});


$("#btn-logout").on('click', function () {
    firebase.auth().signOut();
});

function previewImage(image_category, action, title) {

    if (image_category.files && image_category.files[0]) {

        var reader = new FileReader();

        reader.onload = function (e) {
            if (action == 0) {
                $("#selectedImage").attr('src', e.target.result);
                $("#selectedImage").fadeIn();
            } else {
                $("#selectedNewImage").attr('src', e.target.result);
                $("#selectedNewImage").fadeIn();
            }


        }

        reader.readAsDataURL(image_category.files[0]);
        uploadImage(image_category.files[0], title);
    }
}

function uploadImage(imgUri, title) {

    var file = imgUri;
    const storageRef = firebase.storage().ref();
    var uploadTask = storageRef.child('category_images/' + title).put(file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        newProgress.style.display = "inline";
        newProgress.value = progress;
        updateProgress.style.display = "inline";
        updateProgress.value = progress;
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        // Handle unsuccessful uploads
    }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            downloadUri = downloadURL;
            $("#btn-add-new").show();
            console.log('File available at', downloadURL);
        });
    });
}

$("#inputImage").on('change', function () {
    if (inputTitle.value == "") {
        $('#infoModal').modal('show');
        infoText.innerHTML = "Image name is stored with category title. \nFirst determine category title.";
    } else {
        isImageUploaded = true;
        previewImage(this, 0, inputTitle.value);
    }
});

$("#inputNewImage").on('change', function () {
    if (inputNewTitle.value == "") {
        $('#infoModal').modal('show');
        infoText.innerHTML = "Image name is stored with category title. \nFirst determine category title.";
    } else {
        $("#btn-add-new").hide();
        isImageUploaded = true;
        previewImage(this, 1, inputNewTitle.value);
    }
});