$(()=> {
    getAllUser();
    userDetail();
    $('#searchBtn').click(searchType);
})

function getAllUser() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/get_all_user",
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#getAllUser');

            if(jsonObj.length > 0) {
                for(let i = 0; i<jsonObj.length; i++) {
                    let domList = makeListDom(jsonObj[0]);

                    dataTbody.append(domList);
                }
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function makeListDom(data) {
    let {userID, name, point, engine, gender, birthday, date, mail} = data;

    let domList = $(`
        <tr>
            <td>${userID === undefined ? '' : userID}</td>
            <td>${name === undefined ? '' : name}</td>
            <td>${point === undefined ? '' : point}</td>
            <td>${engine === undefined ? '' : engine}</td>
            <td>${gender === undefined ? '' : gender}</td>
            <td>${birthday === undefined ? '' : birthday}</td>
            <td>${date === undefined ? '' : date}</td>
            <td><button class="btn btn-info" type="button" data-toggle="modal"
                data-target="#newModal" data-id="${mail}">상세</button></td>
        </tr>
    `.trim());

    return domList;
}

function userDetail() {
    $('#newModal').on('show.bs.modal', function(e) {
        let dataId = $(e.relatedTarget).data('id');

        $.ajax({
            type: "GET",
            url: "http://13.125.68.73:8000/user/get_user_data",
            data: {
                mail : dataId,
            },
            dataType: "json",
            success: (result) => {
                let {userID, name, image, realName, phone, language, engine, gender, mail, address, detailAddress, 
                    date, point, monthlyPoint, wing} = result[0];

                $('#userID').val(userID);
                $('#name').val(name);
                $('#image').attr('src',image);
                $('#realName').val(realName);
                $('#phone').val(phone);
                $('#language').val(language);
                $('#engine').val(engine);
                $('#gender').val(gender);
                $('#mail').val(mail);
                $('#address').val(address);
                $('#detailAddress').val(detailAddress);
                $('#date').val(date);
                $('#point').val(point);
                $('#monthlyPoint').val(monthlyPoint);
                $('#wing').val(wing);

                saveUserDetail(result[0]);
                $('#pointMoalBtn').click(getPointList(userID));
                $('#adMoalBtn').click(getAdList(userID));
            },
            error: (err) => {
                console.log(err);
            }
        });
        
        $('#deleteImage').click(function() {
            $('#image').attr('src','');
        })
    })
}

function searchType() {
    if(!($('#uidSearch').val() === '')) {
        searchUidUser();
    } else if(!($('#emailSearch').val === '')) {
        searchEmailUser();
    } 
}

function searchUidUser() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/get_user_data/userid",
        data: {
            userID : $('#uidSearch').val(),
        },
        dataType: "json",
        success: (result) => {
            $('#getAllUser').empty();

            if(!(result === null)) {
                let domList = makeListDom(result);

                $('#getAllUser').append(domList);
            } else {
                $('#getAllUser').append(`<td colspan="8">검색된 데이터가 없습니다.</td>`);
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function searchEmailUser() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/get_user_data",
        data: {
            mail : $('#emailSearch').val(),
        },
        dataType: "json",
        success: (result) => {
            $('#getAllUser').empty();

            if(result.length > 0) {
                for(let i = 0; i < result.length; i++) {
                    let domList = makeListDom(result[i]);

                    $('#getAllUser').append(domList);
                }
            } else {
                $('#getAllUser').append(`<td colspan="8">검색된 데이터가 없습니다.</td>`);
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

async function saveUserDetail(result) {
    $('#saveBtn').click(function() {
        let userID = result.userID;
        let name = $('#name').val();
        let image = $('#image').attr('src');
        let realName = $('#realName').val();
        let phone = $('#phone').val();
        let language = $('#language').val();
        let engine = $('#engine').val();
        let gender = $('#gender').val();
        let mail = $('#mail').val();
        let address = $('#address').val();
        let detailAddress = $('#detailAddress').val();
        let date = $('#date').val();
        let point = Number($('#point').val());
        let monthlyPoint = Number($('#monthlyPoint').val());
        let wing = Number($('#wing').val());
        
        let auth = result.auth;
        let birthday = result.birthday;
        let isChallengeRequestAllowed = result.isChallengeRequestAllowed;
        let isOnline = result.isOnline;
        let isSoundAllowed = result.isSoundAllowed;
        let job = result.job;
        let phoneId = result.phoneId;
        let previousMonthPoint = result.previousMonthPoint;
        let recommendCode = result.recommendCode;
        let searchKeyWord = result.searchKeyWord;
        let win = result.win;
        let wingTime = result.wingTime;
    
        let jsonData = {
            userID,
            name,
            image,
            realName,
            phone,
            language,
            engine,
            gender,
            mail,
            address,
            detailAddress,
            date,
            point,
            monthlyPoint,
            wing,
            auth,
            birthday,
            isChallengeRequestAllowed,
            isOnline,
            isSoundAllowed,
            job,
            phoneId,
            previousMonthPoint,
            recommendCode,
            searchKeyWord,
            win,
            wingTime,
        }

        $.ajax({
            type: "POST",
            url: "http://13.125.68.73:8000/user/update_user_data",
            data: JSON.stringify(jsonData),
            async: false,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(jsonObj) {
                alert('저장되었습니다.')
                location.href = `user.html`;
            },
            error: function(xhr, status, error) {
                console.log(xhr + status + error);
            }
        });
    })
}

function getPointList(userID) {
    let params = {
        userID : userID,
    }

    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/get_point_for_user",
        data: params,
        async: false,
        dataType: "json",
        success: function(jsonObj) {
            let {title, maintitle, date, imageUrl, point} = jsonObj;

            let domList = $(`
                <tr>
                    <td>${title}</td>
                    <td>${maintitle}</td>
                    <td>${date}</td>
                    <td><img src="${imageUrl}" class="point-thumbnail" onerror="this.src = 'images/thumbnail.jpg'"></td>
                    <td>${point}</td>
                </tr>
            `);

            $('#pointTableBody').append(domList);
        },
        error: function(xhr, status, error) {
            console.log(xhr + status + error);
        }
    });
}

function getAdList(userID) {
    let params = {
        userID : userID,
    }

    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/get_ad_for_user",
        data: params,
        async: false,
        dataType: "json",
        success: function(jsonObj) {
            let {title, maintitle, attend, type} = jsonObj;

            let domList = $(`
                <tr>
                    <td>${title}</td>
                    <td>${maintitle}</td>
                    <td>${attend}</td>
                    <td>${type === true ? '포인트' : '상품'}</td>
                </tr>
            `);

            $('#adTableBody').append(domList);
        },
        error: function(xhr, status, error) {
            console.log(xhr + status + error);
        }
    });
}