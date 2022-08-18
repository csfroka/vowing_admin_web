$(()=> {
    //상단 탭메뉴(참여 리뷰, 상품 리뷰)
    $('#joinReview').click(joinReviewEvent);
    $('#productReview').click(productReviewEvent);

    $('#searchBtn').click(searchReviewType);
})

function joinReviewEvent() {
    $('#productReviewTable').css('display','none');
    $('#ParticipationReviewTable').css('display','table');
    $('#searchBtn').attr('data-target','participation');
    $('#getProductList').empty();
}

function productReviewEvent() {
    $('#ParticipationReviewTable').css('display','none');
    $('#productReviewTable').css('display','table');
    $('#searchBtn').attr('data-target','product');
    $('#getParticipationList').empty();
}

function searchReviewType() {
    if($('#searchBtn').attr('data-target') === 'participation') {
        getReviewParticipation();
    } else {
        getReviewProduct();
    }
}

function getReviewParticipation() {
    let maintitle = $('#maintitle').val();

    let params = {
        maintitle
    }

    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/review/get_review_p",
        data: params,
        dataType: "json",
        success: (result) => {
            let resultList = $('#getParticipationList');
            resultList.empty();

            if(result.length > 0) {
                for(let i = 0; i < result.length; i++) {
                    let domList = makeParticipationDom(result[i],i);

                    resultList.append(domList);
                }
            } else {
                resultList.append(`<td colspan="7">검색된 데이터가 없습니다.</td>`);
            }

            $(".deleteBtn").attr('data-type','participation').click(deleteParticipationReview);
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function makeParticipationDom(data, i) {
    let {profileUserName, review_text, date, rating, like, uid} = data;
    indexCnt = i + 1;

    let domList = $(`
        <tr>
            <td>${indexCnt}</td>
            <td>${profileUserName}</td>
            <td>${review_text}</td>
            <td>${date}</td>
            <td>${rating}</td>
            <td>${like}</td>
            <td><button class="btn btn-outline-secondary deleteBtn" data-type="participation" data-uid="${uid}">삭제</button></td>
        </tr>
    `.trim());

    return domList;
}

function getReviewProduct() {
    let maintitle = $('#maintitle').val();
    
    let params = {
        maintitle
    }

    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/review/get_review_g",
        data: params,
        dataType: "json",
        success: (result) => {
            let resultList = $('#getProductList');
            resultList.empty();

            if(result.length > 0) {
                for(let i = 0; i < result.length; i++) {
                    let domList = makeProductDom(result[i],i);

                    resultList.append(domList);
                }
            } else {
                resultList.append(`<td colspan="8">검색된 데이터가 없습니다.</td>`);
            }

            $(".deleteBtn").attr('data-type','product').click(deleteProductReview);
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function makeProductDom(data,i) {
    let {profileUserName, review_text, date, rating, profileImageUrl, like, uid} = data;

    let domList = $(`
        <tr>
            <td>${i+1}</td>
            <td>${profileUserName === undefined ? '' : profileUserName}</td>
            <td>${review_text === undefined ? '' : review_text}</td>
            <td>${date === undefined ? '' : date}</td>
            <td>${rating === undefined ? '' : rating}</td>
            <td><img src="${profileImageUrl}" class="review-img"  onerror="this.src = 'images/review.jpg'"></td>
            <td>${like}</td>
            <td><button class="btn btn-outline-secondary deleteBtn" data-type="product" data-uid="${uid}">삭제</button></td>
        </tr>
    `.trim());

    return domList;
}

function deleteParticipationReview() {
    let maintitle = $('#maintitle').val();
    let userID = $(this).attr('data-uid');

    let result = confirm('삭제하시겠습니까?');

    if(result === true) {
        $.ajax({
            type: "DELETE",
            url: "http://13.125.68.73:8000/review/delete_review_p?maintitle=" + maintitle + "&userID=" + userID,
            dataType: "json",
            success:function(jsonObj) {
                alert('정상적으로 삭제되었습니다.');
                location.href = 'review.html';
            },
            error: function(xhr, status, error) {
                alert(xhr + status + error);
            }
        });
    }
}

function deleteProductReview() {
    let maintitle = $('#maintitle').val();
    let userID = $(this).attr('data-uid');

    let result = confirm('삭제하시겠습니까?');

    if(result === true) {
        $.ajax({
            type: "DELETE",
            url: "http://13.125.68.73:8000/review/delete_review_g?maintitle=" + maintitle + "&userID=" + userID,
            dataType: "json",
            success:function(jsonObj) {
                alert('정상적으로 삭제되었습니다.');
                location.href = 'review.html';
            },
            error: function(xhr, status, error) {
                alert(xhr + status + error);
            }
        });
    } 
}