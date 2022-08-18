$(()=> {
    getAdList();
    $('#newModal').on('show.bs.modal', newModalPopup);
    $('#imageModal').on('show.bs.modal', imageModalPopup);
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
            <td><button class="btn btn-info" type="button" data-toggle="modal" data-target="#newModal" data-type="update" data-value="${name}">수정</button></td>
        </tr>
    `.trim());

    return domList;
}

function newModalPopup(e) {
    let modalType = $(e.relatedTarget).data('type');
    let dataValue = $(e.relatedTarget).data('value');

    if(modalType === 'insert') {
        $('#modalTitle').html('광고 추가');
        $('#newModal').attr('data-id','insertModal');
        $('#newModalSaveBtn').attr('data-save','insert');
        $('#imageArraySearch').attr('data-array','imageArray');
        $('#descArraySearch').attr('data-array','descArray');
        $('#imageTableBody').empty();
        saveBtnCheck();
    } else {
        $('#modalTitle').html('광고 수정');
        $('#newModal').attr('data-id','updateModal');
        $('#newModalSaveBtn').attr('data-save','update');
        $('#imageArraySearch').attr('data-array','updateImageArray');
        $('#descArraySearch').attr('data-array','updateDescArray');
        getAdDetail(dataValue);
        $('#imageTableBody').empty();
    }
}

var engineArrayList = new Array();
var ageArrayList = new Array();

function areaCheckBoxTemp() {
    $('input[name="area"]:checked').each(function() {
        let areaTemp = $(this).val();

        if(areaTemp === undefined) {
            return;
        }

        engineArrayList.push(areaTemp);
    })
    
    objectTemp.engineArray = engineArrayList;

    return objectTemp.engineArray;
}

function ageCheckBoxTemp() {
    $('input[name="age"]:checked').each(function() {
        let ageTemp = $(this).val();

        if(ageTemp === undefined) {
            return;
        }

        ageArrayList.push(ageTemp);
    })

    objectTemp.ageArray = ageArrayList;

    return objectTemp.ageArray;
}

function saveBtnCheck(result) {
    $('#newModalSaveBtn').click(function() {
        let saveBtnDataType = $('#newModalSaveBtn').attr('data-save');

        if(saveBtnDataType === 'insert') {
            insertAd();
        } else {
            updateAd(result);
        }
    })
}

function insertAd() {
    let type = $('input[name="adType"]:checked').val();
    if(type === undefined) {
        alert('광고종류를 선택해주세요.');
        
        return;
    }
    let category = $('#category option:selected').val();
    let title = $('#title').val();
    if(title === '') {
        alert('타이틀을 입력해주세요.');
        $('#title').focus();

        return;
    }
    let link = $('#link').val();
    if(link === '') {
        alert('링크를 입력해주세요.');
        $('#link').focus();
        
        return;
    }
    let name = $('#name').val();
    if(name === '') {
        alert('광고명을 입력해주세요.');
        $('#name').focus();
        
        return;
    }
    let maintitle = $('#name').val();
    let engineArray = areaCheckBoxTemp();
    let imageArray = objectTemp.imageArray;
    if(imageArray === undefined) {
        imageArray = [''];
    }
    let descArray = objectTemp.descArray;
    if(descArray === undefined) {
        descArray = [''];
    }
    let ageArray = ageCheckBoxTemp();
    let imageUrl = $('#imageUrl').val();
    if(imageUrl === '') {
        alert('썸네일을 입력해주세요.');
        $('#imageUrl').focus();

        return;
    }
    let videoUrl = $('#videoUrl').val();
    if(videoUrl === '') {
        alert('영상을 입력해주세요.');
        $('#videoUrl').focus();

        return;
    }
    let reward = $('#reward').val();
    if(reward === '') {
        alert('스크립트를 입력해주세요.');
        $('#reward').focus();

        return;
    }
    let level = $('#level option:selected').val();
    if(level === '') {
        alert('난이도를 선택해주세요.');

        return;
    }
    let date = $('#date').val();
    if(date === '') {
        alert('기간을 입력해주세요.');
        $('#date').focus();

        return;
    }
    let dateEnd = $('#dateEnd').val();
    if(dateEnd === '') {
        alert('마감일을 입력해주세요.');
        $('#dateEnd').focus();

        return;
    }
    let pay = Number($('#pay').val());
    let cnt = $('#cnt').val();
    if(cnt === '') {
        alert('선착순을 입력하세요.');
        $('#cnt').focus();

        return;
    }
    let player = Number($('#player').val());
    if(player === '') {
        alert('참여자를 입력해주세요.');
        $('#player').focus();

        return;
    }
    let sold = Number($('#sold').val());
    if(sold === '') {
        alert('남은수량을 입력해주세요.');
        $('#sold').focus();

        return;
    }
    let collection;
    let percent = 0;
    let point;
    if(type === 'true') {
        collection = 'Point';
        point = $('#pay').val();
    } else {
        collection = 'Appliances';
        point = 0;
    }

    let jsonData = {
        maintitle,
        type,
        category,
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
        sold,
        pay,
        percent,
        point,
        collection,
    }

    if(type === 'false') {
        $.ajax({
            type: "POST",
            url: "http://13.125.68.73:8000/ad/insert_ad_appliances",
            data: JSON.stringify(jsonData),
            dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function(jsonObj) {
                alert('저장되었습니다.');
                location.href = "adList.html";
            },
            error: function(xhr, status, error) {
                alert(xhr + status + error);
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "http://13.125.68.73:8000/ad/insert_ad_point",
            data: JSON.stringify(jsonData),
            dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function(jsonObj) {
                alert('저장되었습니다.');
                location.href = "adList.html";
            },
            error: function(xhr, status, error) {
                alert(xhr + status + error);
            }
        });
    }
}

function imageModalPopup(e) {
    let imageType = $(e.relatedTarget).data('array');

    if(imageType === 'imageArray') {
        $('#imageModalTitle').html('대표이미지');
        $('#insertImgUrlBtn').attr('data-input','imageArray');
        $('#imageModalSaveBtn').attr('data-insert','imageArray');
        $('#insertImgUrlBtn').off('click').on('click', insertBtnCheckArray);
    } else if(imageType === 'descArray') {
        $('#imageModalTitle').html('상세이미지');
        $('#insertImgUrlBtn').attr('data-input','descArray');
        $('#imageModalSaveBtn').attr('data-insert','descArray');
        $('#insertImgUrlBtn').off('click').on('click', insertBtnCheckArray);
    } else if(imageType === 'updateImageArray') {
        $('#imageModalTitle').html('대표이미지');
    } else {
        $('#imageModalTitle').html('상세이미지');
    } 
}

function getImageArray(result) {
    $('#imageTableBody').empty();

    result.forEach(function(element, index) {
        let domList = makeImageList(element ,index);

        $('#imageTableBody').append(domList);
    })
}

function getDescArray(result) {
    $('#imageTableBody').empty();

    result.forEach(function(element, index) {
        let domList = makeImageList(element ,index);

        $('#imageTableBody').append(domList);
    })
}

var imageArrayList = new Array();
var descArrayList = new Array();

function insertBtnCheckArray() {
    if($(this).attr('data-input') === 'imageArray') {
        insertImageArray();
        $('.deleteImgUrl').attr('data-delete','imageArray');
    } else {
        insertDescArray();
        $('.deleteImgUrl').attr('data-input','descArray');
    }
}

function insertImageArray() {
    let imageArrayTxt = document.getElementById('insertImgUrl');

    if(imageArrayTxt.value === '' || imageArrayTxt.value === undefined) {
        return;
    }

    imageArrayList.push(imageArrayTxt.value);

    let lastImageArrayTxt = imageArrayList[imageArrayList.length - 1];
    let imageArrayListIndex = imageArrayList.indexOf(imageArrayTxt.value);

    let imageArrayData = makeImageList(lastImageArrayTxt, imageArrayListIndex);

    $('#imageTableBody').append(imageArrayData);

    deleteBtnCheckArray(imageArrayList);

    saveImageArrayList(imageArrayList);
}

function insertDescArray() {
    let descArrayTxt = document.getElementById('insertImgUrl');

    if(descArrayTxt.value === '' || descArrayTxt.value === undefined) {
        return;
    }

    descArrayList.push(descArrayTxt.value);

    
    let lastDescArrayTxt = descArrayList[descArrayList.length - 1];
    let imageDescListIndex = descArrayList.indexOf(descArrayTxt.value);
    
    let descArrayData = makeImageList(lastDescArrayTxt, imageDescListIndex);
    
    $('#imageTableBody').append(descArrayData);

    deleteBtnCheckArray(descArrayList);

    saveDescArrayList(descArrayList);
}

function makeImageList(element ,index) {
    let imageArrayData = $(`
        <tr>
            <td style="word-break: break-all; width:888px;">${element}</td>
            <td><button class="btn btn-outline-secondary deleteImgUrl" data-index="${index}">삭제</button></td>
        </tr>
    `);

    return imageArrayData;
}

function deleteBtnCheckArray(result) {
    $('.deleteImgUrl').off('click').on('click', function() {
        if($(this).attr('data-delete') === 'imageArray') {
            let dataIndex = $(this).attr('data-index');
            deleteImageArrayList(result, dataIndex);
        } else {
            let dataIndex = $(this).attr('data-index');
            deleteDescArrayList(result, dataIndex);
        }
    })
}

function deleteImageArrayList(result, dataIndex) {
    let resultIm = result.imageArray;

    resultIm.splice(dataIndex, 1);

    $(`button[data-index="${dataIndex}"]`).closest('tr').remove();
}

function deleteDescArrayList(result, dataIndex) {
    let resultDe = result.descArray;

    resultDe.splice(dataIndex, 1);

    $(`button[data-index="${dataIndex}"]`).closest('tr').remove();
}

function saveBtnCheckArray(result) {
    $('#imageModalSaveBtn').off('click').on('click', function() {
        if($(this).attr('data-insert') === 'imageArray') {
            saveImageArrayList(result);
        } else {
            saveDescArrayList(descArrayList);
        }
    })
}

var objectTemp = new Object();

function saveImageArrayList(imageArr) {
    let saveBtn = $('#imageModalSaveBtn').attr('data-insert','imageArray');

    saveBtn.off('click').on('click', function() {
        objectTemp.imageArray = imageArr;

        $('#imageModalClose').click();
    })
}

function saveDescArrayList(descArr) {
    let saveBtn = $('#imageModalSaveBtn').attr('data-insert','descArray');

    saveBtn.off('click').on('click', function() {
        objectTemp.descArray = descArr;

        $('#imageModalClose').click();
    })
}

function getAdDetail(dataValue) {
    $('input[name="adType"]').attr('disabled','true');
    let nameReadOnly = document.getElementById('name');
        nameReadOnly.readOnly = true;

    let maintitle = dataValue;

    let params = {
        maintitle
    }

    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/ad/get_ad_title",
        data: params,
        dataType: "json",
        success: (result) => {
            let {type, title, link, name, engineArray, ageArray, imageUrl, videoUrl, 
                reward, level, date, dateEnd, point, cnt, player, sold} = result;

            $(`input[name="adType"][value="${type}"]`).prop('checked',true);
            $('#title').val(title);
            $('#link').val(link);
            $('#name').val(name);
            engineArray.forEach(element => {
                $(`input[name="area"][value="${element}"]`).prop('checked',true);
            });
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
                $('#pay').val(point);
            } else {
                $('#pay').val(0);
            }
            $('#cnt').val(cnt);
            $('#player').val(player);
            $('#sold').val(sold);

            getImgPopupData(result);
            getDescPopupData(result);
            saveBtnCheck(result);
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function getImgPopupData(result) {
    $('#imageArraySearch[data-array="updateImageArray"]').click(function() {
        getImageArrayData(result);
        updateInsertImageArray(result);
    })
}

function getDescPopupData(result) {
    $('#descArraySearch[data-array="updateDescArray"]').click(function() {
        getDescArrayData(result);
    })
}

function getImageArrayData(result) {
    let {imageArray} = result;

    $('#imageTableBody').empty();

    imageArray.forEach(function(element, index) {
        let imageDomList = makeImageList(element ,index);

        $('#imageTableBody').append(imageDomList);
    })
}

function getDescArrayData(result) {
    let {descArray} = result;

    $('#imageTableBody').empty();

    descArray.forEach(function(element, index) {
        let descDomList = makeImageList(element ,index);

        $('#imageTableBody').append(descDomList);
    })

    updateInsertDescArray(result);
}

function updateInsertImageArray(result) {
    let {imageArray} = result;
    $('.deleteImgUrl').attr('data-delete','imageArray');

    $('#insertImgUrlBtn').off('click').on('click', function() {
        let imageArrayTxt = document.getElementById('insertImgUrl');

        if(imageArrayTxt.value === '' || imageArrayTxt.value === undefined) {
            return;
        }
    
        imageArray.push(imageArrayTxt.value);
    
        let lastImageArrayTxt = imageArray[imageArray.length - 1];
        let imageArrayListIndex = imageArray.indexOf(imageArrayTxt.value);
    
        let imageArrayData = makeImageList(lastImageArrayTxt, imageArrayListIndex);
    
        $('#imageTableBody').append(imageArrayData);
    })

    deleteBtnCheckArray(result);

    saveImageArrayList2(result);
}

function updateInsertDescArray(result) {
    let {descArray} = result;
    $('.deleteImgUrl').attr('data-delete','descArray');

    $('#insertImgUrlBtn').off('click').on('click', function() {
        let descArrayTxt = document.getElementById('insertImgUrl');

        if(descArrayTxt.value === '' || descArrayTxt.value === undefined) {
            return;
        }
    
        descArray.push(descArrayTxt.value);
    
        let lastDescArrayTxt = descArray[descArray.length - 1];
        let descArrayListIndex = descArray.indexOf(descArrayTxt.value);
    
        let descArrayData = makeImageList(lastDescArrayTxt, descArrayListIndex);
    
        $('#imageTableBody').append(descArrayData);
    })

    deleteBtnCheckArray(result);

    saveDescArrayList2(result);
}

function saveImageArrayList2(result) {
    let saveBtn = $('#imageModalSaveBtn').attr('data-insert','imageArray');
    
    saveBtn.off('click').on('click', function() {
        $('#imageModalClose').click();

        return result;
    })
}

function saveDescArrayList2(result) {
    let saveBtn = $('#imageModalSaveBtn').attr('data-insert','descArray');

    saveBtn.off('click').on('click', function() {
        $('#imageModalClose').click();

        return result;
    })
}

function updateAd(result) {
    let type = result.type;
    let category = result.category;
    let title = $('#title').val();
    if(title === '') {
        alert('타이틀을 입력해주세요.');
        $('#title').focus();

        return;
    }
    let link = $('#link').val();
    if(link === '') {
        alert('링크를 입력해주세요.');
        $('#link').focus();
        
        return;
    }
    let name = result.name;
    let maintitle = result.name;
    let engineArray = areaCheckBoxTemp2(result);
    let imageArray = result.imageArray;
    if(imageArray === undefined) {
        imageArray = [''];
    }
    let descArray = result.descArray;
    if(descArray === undefined) {
        descArray = [''];
    }
    let ageArray = ageCheckBoxTemp2(result);
    let imageUrl = $('#imageUrl').val();
    if(imageUrl === '') {
        alert('썸네일을 입력해주세요.');
        $('#imageUrl').focus();

        return;
    }
    let videoUrl = $('#videoUrl').val();
    if(videoUrl === '') {
        alert('영상을 입력해주세요.');
        $('#videoUrl').focus();

        return;
    }
    let reward = $('#reward').val();
    if(reward === '') {
        alert('스크립트를 입력해주세요.');
        $('#reward').focus();

        return;
    }
    let level = $('#level option:selected').val();
    let date = $('#date').val();
    if(date === '') {
        alert('기간을 입력해주세요.');
        $('#date').focus();

        return;
    }
    let dateEnd = $('#dateEnd').val();
    if(dateEnd === '') {
        alert('마감일을 입력해주세요.');
        $('#dateEnd').focus();

        return;
    }
    let pay = Number($('#pay').val());
    let cnt = $('#cnt').val();
    if(cnt === '') {
        alert('선착순을 입력하세요.');
        $('#cnt').focus();

        return;
    }
    let player = Number($('#player').val());
    if(player === '') {
        alert('참여자를 입력해주세요.');
        $('#player').focus();

        return;
    }
    let sold = Number($('#sold').val());
    if(sold === '') {
        alert('남은수량을 입력해주세요.');
        $('#sold').focus();

        return;
    }
    let collection = result.collection;
    let percent = result.percent;
    let point;
    if(type === 'false') {
        point = 0;
    } else {
        point = $('#pay').val();
    }

    let jsonData = {
        type,
        category,
        title,
        link,
        name,
        maintitle,
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
        pay,
        cnt,
        player,
        sold,
        collection,
        percent,
        point,
    }

    $.ajax({
		type: "POST",
		url: "http://13.125.68.73:8000/ad/update_ad",
        data: JSON.stringify(jsonData),
		dataType: "json",
        contentType: "application/json; charset=utf-8",
		success: function(jsonObj) {
            alert('저장되었습니다.');
            location.href = `adList.html`;
        },
		error: function(xhr, status, error) {
            alert(xhr + status + error);
		}
	});
}

function areaCheckBoxTemp2(result) {
    let {engineArray} = result;

    engineArray = [];

    $('input[name="area"]:checked').each(function() {
        let areaTemp = $(this).val();

        if(areaTemp === undefined) {
            return;
        }

        engineArray.push(areaTemp);
    })
    
    result.engineArray = engineArray;

    return result.engineArray;
}

function ageCheckBoxTemp2(result) {
    let {ageArray} = result;

    ageArray = [];

    $('input[name="age"]:checked').each(function() {
        let ageTemp = $(this).val();

        if(ageTemp === undefined) {
            return;
        }

        ageArray.push(ageTemp);
    })

    result.ageArray = ageArray;

    return result.ageArray;
}

//팝업 닫을때 안에 내용 초기화
$(document).ready(function() {
    $('#imageModal').on('hide.bs.modal', function() {
        $('#insertImgUrl').val('');
        $('#imageTableBody').empty();
    })

    $('#newModal').on('hide.bs.modal', function() {
        $('input[name="adType"]').prop('checked',false);
        $('input[name="adType"]').attr('disabled',false);
        $('input[type="text"]').val('');
        $('input[type="number"]').val('');
        let nameReadOnly = document.getElementById('name');
            nameReadOnly.readOnly = false;

        let areaCheck = document.querySelectorAll('input[name="area"]');
        let ageCheck = document.querySelectorAll('input[name="age"]');

        for(let i = 0; i < areaCheck.length; i++) {
            areaCheck[i].checked = false;
        }
        for(let j = 0; j < ageCheck.length; j++) {
            ageCheck[j].checked = false;
        }
        $('#level option:eq(0)').prop('selected',true);
        $('#imageTableBody').empty();
    })
})