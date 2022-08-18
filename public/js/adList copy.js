$(()=> {
    getAdList();
    openPopup();
})

function getAdList() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/ad/get_ad",
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
    let {imageUrl, title, date, name, player, percent, type} = element;
    let indexCnt = index + 1;

    let domList = $(`
        <tr>
            <td>${indexCnt}</td> //순번
            <td></td> //진행중
            <td>${type === true ? '포인트' : '상품'}</td>
            <td><img src="${imageUrl}" class="thumbnail" onerror="this.src = 'images/thumbnail.jpg'"></td>
            <td>${title === undefined ? '' : title}</td>
            <td>${name === undefined ? '' : name}</td>
            <td>${date === undefined ? '' : date}</td>
            <td>${player === undefined ? '' : player}</td>
            <td>${percent === undefined ? '' : percent}</td>
            <td><button class="btn btn-info" type="button" data-toggle="modal" data-target="#newModal" data-name="${name}" data-type="update">수정</button></td>
        </tr>
    `.trim());

    return domList;
}

function openPopup() {
    $('#newModal').on('show.bs.modal', function(e) {
        $('#modalTitle').empty().html('광고 수정');

        let dataId = $(e.relatedTarget).data('name');

        $.ajax({
            type: "GET",
            url: "http://13.125.68.73:8000/ad/get_ad_title?maintitle="+dataId,
            dataType: "json",
            success: (result) => {
                let {type, title, link, name, engineArray, imageArray, descArray, ageArray, imageUrl, videoUrl, 
                    reward, level, date, dateEnd, point, cnt, player, sold} = result;

                $(`input[name="adType"][value="${type}"]`).prop('checked',true);
                $('#title').val(title);
                $('#link').val(link);
                $('#name').val(name);
                engineArray.forEach(element => {
                    $(`input[name="area"][value="${element}"]`).prop('checked',true);
                });
                $('#imageArray').val(imageArray);
                $('#descArray').val(descArray);
                ageArray.forEach(element => {
                    $(`input[name="age"][value="${element}"]`).prop('checked',true);
                });
                $('#imageUrl').val(imageUrl);
                $('#videoUrl').val(videoUrl);
                $('#reward').val(reward);
                $(`#level option[value="${level}"]`).prop('selected',true);
                $('#date').val(date);
                $('#dateEnd').val(dateEnd);
                if(type === true) {
                    $('#point').val(point);
                } else {
                    $('#point').val(0);
                }
                $('#cnt').val(cnt);
                $('#player').val(player);
                $('#sold').val(sold);

                $('#saveBtn').click(updateAdPop);
            },
            error: (err) => {
                console.log(err);
            }
        });
    })
}

function updateAdPop() {
    let type = $('input[name="adType"]:checked').val();
	let title = $("#title").val();
	let link = $("#link").val();
	let name = $("#name").val();
    let engineArray = $('input[name="area"]:checked').val(); //배열
	let imageArray = $("#imageArray").val(); //배열
	let descArray = $("#descArray").val(); //배열
    let ageArray = $('input[name="age"]:checked').val(); //배열
	let imageUrl = $("#imageUrl").val();
	let videoUrl = $("#videoUrl").val();
	let reward = $("#reward").val();
    let level = $('#level option:selected').val();
	let date = $("#date").val();
	let dateEnd = $("#dateEnd").val();
	let point = $("#point").val();
	let cnt = $("#cnt").val();
	let player = $("#player").val();
	let sold = $("#sold").val();

    let params = {
        type,
        title,
        link,
        name,
        engineArray,
        imageArray,
        descArray,
        ageArray,
        imageUrl,
        videoUrl,
        reward,
        level,
        date,
        dateEnd,
        point,
        cnt,
        player,
        sold
    }

    // $.ajax({
	// 	type: "post",
	// 	url: "http://13.125.68.73:8000/ad/update_ad",
	// 	data: params,
	// 	dataType: "json",
	// 	success: function(jsonObj) {
	// 		if(jsonObj.result == "true"){
	// 			alert('수정되었습니다.');
	// 			location.href = 'adList.html';
	// 		} else {
	// 		}
	// 	},
	// 	error: function(xhr, status, error) {
	// 		alert(xhr + status + error);
	// 	}
	// });
}

function updateArray(myArray, oldValue, newValue) {
    if(!myArray instanceof Array) {
        return;
    }

    const index = myArray.indexOf(oldValue);
    if(index !== -1) {
        myArray[index] = newValue;
    }
}