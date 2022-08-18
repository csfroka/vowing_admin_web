$(()=> {
    gerRewards();
    printUserId();
})

function gerRewards() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/reward/get_reward",
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#getRewards');

            jsonObj.forEach(function(element, index) {
                let domList = makeListDom(element, index);

                dataTbody.append(domList);
            })
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function makeListDom(element, index) {
    let {date, imageUrl, name, point, title, userList} = element;
    let indexCnt = index + 1;

    let domList = $(`
        <tr>
            <td>${indexCnt}</td>
            <td>${date}</td>
            <td><img src=${imageUrl} class="thumbnail" onerror="this.src = 'images/thumbnail.jpg'"></td>
            <td>${title}</td>
            <td>${name}</td>
            <td>${point}P</td>
            <td>${userList.length}</td>
        </tr>
    `.trim());

    return domList;
}

var userArray = new Array();

function printUserId() {
    $('#addUserId').click(function() {
        let userName = document.getElementById('userId');
        
        if(userName === '' || userName === undefined) {
            return;
        }
        
        userArray.push(userName.value);
        
        let lastUserName = userArray[userArray.length - 1];

        let userData = makeRewardUserList(lastUserName);
        
        $('#userIdResult').append(userData);
    })

    insertReward(userArray);
}

function makeRewardUserList(lastUserName) {
    let userinnerText = $(`
        <li style="text-align:center;">${lastUserName}</li>
    `);

    return userinnerText;
}

function insertReward(userArray) {
    $('#saveReward').click(function() {
        let imageUrl = $('#imageUrl').val();
        let title = $('#title').val();
        let name = $('#name').val();
        let point = Number($('#point').val());
        let userList = userArray;

        let jsonData = {
            imageUrl,
            title,
            name,
            point,
            userList
        }

        $.ajax({
            type: "POST",
            url: "http://13.125.68.73:8000/reward/insert_reward",
            data: JSON.stringify(jsonData),
            dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function(jsonObj) {
                alert('저장되었습니다.');
                location.href = "rewards.html";
            },
            error: function(xhr, status, error) {
                alert(xhr + status + error);
            }
        });
    })
}

$(document).ready(function() {
    $('.modal').on('hide.bs.modal', function(e) {
        $('input').val('');
        $('#userIdResult li').remove();
        userArray.length = 0;
    })
})