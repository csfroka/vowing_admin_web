$(()=> {
    getNoticeList();
    modalPopupOpen();

    $('#saveBtn').click(saveBtnCheck);
    $('#deleteBtn').click(deleteNotice);
})

function getNoticeList() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/notice/get_notice",
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
    let {title, notice_date, notice_hits, notice_writer} = element;
    let indexCnt = index + 1;

    let domList = $(`
        <tr>
            <td>${indexCnt}</td>
            <td>${title}</td>
            <td>${notice_hits}</td>
            <td>${notice_writer}</td>
            <td>${notice_date}</td>
            <td><button class="btn btn-info updateBtn" type="button" data-toggle="modal"
            data-target="#newModal" data-title="${title}">수정</button></td>
        </tr>
    `.trim());

    return domList;
}

function modalPopupOpen() {
    $('#newModal').on('show.bs.modal', function(e) {
        
        let dataId = $(e.relatedTarget).data('title');

        if(dataId === undefined) {
            addNoticePop();
        } else {
            getNotice(dataId);
        }
    })
}

function saveBtnCheck() {
    let saveBtnDataType = $('#saveBtn').attr('data-type');

    if(saveBtnDataType === 'insert') {
        addNotice();
    } else {
        updateNotice();
    }
}

function addNoticePop() {
    $('#modalTitle').empty().html('공지사항 추가');
    $('#deleteBtn').css('opacity','0');
    $('#notice_hits').val('0');
    $('#saveBtn').attr('data-type','insert');
}

function addNotice() {
    let title = $('#title').val();
    let notice_writer = $('#notice_writer').val();
    let notice_image = $('#notice_image').val();
    let notice_date = $('#notice_date').val();
    let notice_content = $('#notice_content').val();
    let notice_hits = $('#notice_hits').val();
    let notice_type = $('#notice_type').val();

    if(!title) {
        alert('제목을 입력해주세요.');
        $('#title').focus();
        return;
    }

    let jsonData = {
        title,
        notice_writer,
        notice_image,
        notice_date,
        notice_content,
        notice_hits,
        notice_type
    }

    $.ajax({
        type: "POST",
        url: "http://13.125.68.73:8000/notice/insert_notice",
        data: JSON.stringify(jsonData),
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(jsonObj) {
            alert('저장되었습니다.');
            location.href = "notice.html";
        },
        error: function(xhr, status, error) {
            alert(xhr + status + error);
        }
    });
}

function getNotice(dataId) {
    $('#modalTitle').empty().html('공지사항 수정');
    $('#deleteBtn').css('opacity','1');
    $('#saveBtn').attr('data-type','update');
    let titleReadOnly = document.getElementById('title');
        titleReadOnly.readOnly = true;

    let params = {
        title : dataId,
    }

    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/notice/get_notice_title",
        data: params,
        dataType: "json",
        success: (result) => {
            let {title, notice_writer, notice_type, notice_content, notice_hits, notice_image, notice_date} = result[0];
            $('#title').val(title);
            $('#notice_writer').val(notice_writer);
            $('#notice_type').val(notice_type);
            $('#notice_content').val(notice_content);
            $('#notice_hits').val(notice_hits);
            $('#notice_image').val(notice_image);
            $('#notice_date').val(notice_date);
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function updateNotice() {
    let title = $('#title').val();
    let notice_writer = $('#notice_writer').val();
    let notice_type = $('#notice_type').val();
    let notice_content = $('#notice_content').val();
    let notice_hits = $('#notice_hits').val();
    let notice_image = $('#notice_image').val();
    let notice_date = $('#notice_date').val();

    let jsonData = {
        title,
        notice_writer,
        notice_type,
        notice_content,
        notice_hits,
        notice_image,
        notice_date
    }

    $.ajax({
		type: "POST",
		url: "http://13.125.68.73:8000/notice/update_notice",
        data: JSON.stringify(jsonData),
		dataType: "json",
        contentType: "application/json; charset=utf-8",
		success: function(jsonObj) {
            alert('저장되었습니다.');
            location.href = `notice.html`;
        },
		error: function(xhr, status, error) {
            alert(xhr + status + error);
		}
	});
}

function deleteNotice() {
    let title = $('#title').val();
    let result = confirm('삭제하시겠습니까?');

    if(result === true) {
        $.ajax({
            type: "DELETE",
            url: "http://13.125.68.73:8000/notice/delete_notice?title=" + title,
            dataType: "json",
            success:function(result) {
                alert('정상적으로 삭제되었습니다.');
                location.href = 'notice.html';
            },
            error: function(xhr, status, error) {
                alert(xhr + status + error);
            }
        });
    }
}

$(document).ready(function() {
    $('#newModal').on('hide.bs.modal', function() {
        let titleReadOnly = document.getElementById('title');
        titleReadOnly.readOnly = false;
        $('input[type="text"]').val('');
        $('textarea').val('');
    })
})