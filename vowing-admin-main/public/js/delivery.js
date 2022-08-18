$(()=> {
    getUserDelivery();
    getUserDeliveryDetail();
})

function getUserDelivery() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/delivery",
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#getUserDelivery');

            if(jsonObj.length > 0) {
                for(let i = 0; i<jsonObj.length; i++) {
                    let domList = makeListDom(jsonObj[i]);

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
    let {title} = data;

    let domList = $(`
        <tr>
            <td>${title === undefined ? '' : title}</td>                    
            <td><button class="btn btn-info detailBtn" type="button" data-toggle="modal" data-target="#newModal">배송 명단</button></td>
        </tr>
    `.trim());

    $('.detailBtn').click(getUserDeliveryDetail(title));

    return domList;
}

function getUserDeliveryDetail(title) {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/delivery/detail?maintitle=" + title,
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#getUserDeliveryDetail');

            if(jsonObj.length > 0) {
                for(let i = 0; i<jsonObj.length; i++) {
                    let domList = makeListData(jsonObj[i]);

                    dataTbody.append(domList);
                }
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function makeListData(data) {
    let {userID, today, name, phone, address} = data;

    let domList = $(`
        <tr>
            <td>${today}</td>
            <td>${userID}</td>
            <td>${name}</td>
            <td>${phone}</td>
            <td>${address}</td>
        </tr>
    `.trim());

    return domList;
}