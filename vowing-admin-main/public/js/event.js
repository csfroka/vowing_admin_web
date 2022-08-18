$(()=> {
    getEventList();
    modalPopupOpen();

    $('#saveBtn').click(saveBtnCheck);
    $('#deleteBtn').click(deleteEvent);
})

function getEventList() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/event/get_event",
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#getTableList');

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
    let {event_title, event_name, event_desc, event_date, imageUrl} = element;
    let indexCnt = index + 1;

    let domList = $(`
        <tr>
            <td>${indexCnt}</td>
            <td>${event_title}</td>
            <td>${event_name}</td>
            <td>${event_desc}</td>
            <td>${event_date}</td>
            <td>${imageUrl}</td>
            <td><button class="btn btn-info" type="button" data-toggle="modal" data-target="#newModal" data-name="${event_title}">수정</button></td>
        </tr>
    `.trim());

    return domList;
}

function modalPopupOpen() {
    $('#newModal').on('show.bs.modal', function(e) {
        
        let dataId = $(e.relatedTarget).data('name');

        if(dataId === undefined) {
            addEventPop();
        } else {
            getEvent(dataId);
        }
    })
}

function saveBtnCheck() {
    let saveBtnDataType = $('#saveBtn').attr('data-type');

    if(saveBtnDataType === 'insert') {
        addEvent();
    } else {
        updateEvent();
    }
}

function addEventPop() {
    $('#modalTitle').empty().html('이벤트 추가');
    $('#deleteBtn').css('opacity','0');
    $('#saveBtn').attr('data-type','insert');
}

function addEvent() {
    let maintitle = $('#event_title').val();
    let event_title = $('#event_title').val();
    let event_name = $('#event_name').val();
    let event_desc = $('#event_desc').val();
    let event_date = $('#event_date').val();
    let imageUrl = $('#imageUrl').val();

    if(!event_title) {
        alert('제목을 입력해주세요.');
        $('#event_title').focus();
        return;
    }

    let jsonData = {
        maintitle,
        event_title,
        event_name,
        event_desc,
        event_date,
        imageUrl,
    }

    $.ajax({
        type: "POST",
        url: "http://13.125.68.73:8000/event/insert_event",
        data: JSON.stringify(jsonData),
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(jsonObj) {
            alert('저장되었습니다.');
            location.href = "event.html";
        },
        error: function(xhr, status, error) {
            alert(xhr + status + error);
        }
    });
}

function getEvent(dataId) {
    $('#modalTitle').empty().html('이벤트 수정');
    $('#deleteBtn').css('opacity','1');
    $('#saveBtn').attr('data-type','update');

    let params = {
        title : dataId
    }

    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/event/get_event/title",
        data: params,
        dataType: "json",
        success: (result) => {
            let {event_title, event_name, event_desc, event_date, imageUrl} = result;

            $('#event_title').val(event_title);
            $('#event_name').val(event_name);
            $('#event_desc').val(event_desc);
            $('#event_date').val(event_date);
            $('#imageUrl').val(imageUrl);
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function updateEvent() {
    let maintitle = $('#event_title').val();
    let event_title = $('#event_title').val();
    let event_name = $('#event_name').val();
    let event_desc = $('#event_desc').val();
    let event_date = $('#event_date').val();
    let imageUrl = $('#imageUrl').val();

    let jsonData = {
        maintitle,
        event_title,
        event_name,
        event_desc,
        event_date,
        imageUrl,
    }

    $.ajax({
		type: "POST",
		url: "http://13.125.68.73:8000/event/update_event",
        data: JSON.stringify(jsonData),
		dataType: "json",
        contentType: "application/json; charset=utf-8",
		success: function(jsonObj) {
            alert('저장되었습니다.');
            location.href = `event.html`;
        },
		error: function(xhr, status, error) {
            alert(xhr + status + error);
		}
	});
}

function deleteEvent() {
    let maintitle = $('#event_title').val();
    let result = confirm('삭제하시겠습니까?');

    if(result === true) {
        $.ajax({
            type: "DELETE",
            url: "http://13.125.68.73:8000/event/delete_event?maintitle=" + maintitle,
            dataType: "json",
            success:function(result) {
                alert('정상적으로 삭제되었습니다.');
                location.href = 'event.html';
            },
            error: function(xhr, status, error) {
                alert(xhr + status + error);
            }
        });
    }
}

$(document).ready(function() {
    $('#newModal').on('hide.bs.modal', function() {
        $('input[type="text"]').val('');
        $('textarea').val('');
    })
})