$(()=> {
    getBannerList();
    $('#saveBtn').click(insertBanner);
})

function getBannerList() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/banner/get_banner",
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#getTableList');

            for(prop in jsonObj) {
                let domList = makeListDom(jsonObj[prop], prop);
                dataTbody.append(domList);
            }

            $('.deleteBtn').click(deleteBanner);
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function makeListDom(data, prop) {
    let {target, imageUrl, title, subTitle} = data;
    let indexCnt = Number(prop) + 1;

    let domList = $(`
        <tr>
            <td>${indexCnt}</td>
            <td>${target}</td>
            <td>${title}</td>
            <td>${subTitle}</td>
            <td>${imageUrl}</td>
            <td><button class="btn btn-outline-secondary deleteBtn" data-key=${target}>삭제</button></td>
        </tr>
    `.trim());

    return domList;
}

function insertBanner() {
    let target = $('#target').val();
    let title = $('#title').val();
    let subTitle = $('#subTitle').val();
    let imageUrl = $('#imageUrl').val();

    let jsonData = {
        target,
        title,
        subTitle,
        imageUrl
    }

    $.ajax({
        type: "POST",
        url: "http://13.125.68.73:8000/banner/insert_banner",
        data: JSON.stringify(jsonData),
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(jsonObj) {
            alert('저장되었습니다.');
            location.href = "banner.html";
        },
        error: function(xhr, status, error) {
            alert(xhr + status + error);
        }
    });
}

function deleteBanner() {
    let dataTarget = $(this).attr('data-key');

    let result = confirm('삭제하시겠습니까?');

    if(result === true) {
        $.ajax({
            type: "DELETE",
            url: "http://13.125.68.73:8000/banner/delete_banner?target=" + dataTarget,
            dataType: "json",
            success:function(jsonObj) {
                alert('정상적으로 삭제되었습니다.');
                location.href = 'banner.html';
            },
            error: function(xhr, status, error) {
                alert(xhr + status + error);
            }
        });
    }     
}