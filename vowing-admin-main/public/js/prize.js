$(()=> {
    getPrize();
})

function getPrize() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/prize",
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#getPrize');

            if(jsonObj.length > 0) {
                for(let i = 0; i<jsonObj.length; i++) {
                    let domList = makeListDom(jsonObj[i], i);

                    dataTbody.append(domList);
                }
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function makeListDom(data, i) {
    let {imageUrl, title, name, dateEnd, cnt} = data;

    let domList = $(`               
        <tr>
            <td>${i+1}</td>
            <td><img src="${imageUrl}" class="thumbnail" onerror="this.src = 'images/thumbnail.jpg'"></td>
            <td>${title === undefined ? '' : title}</td>
            <td>${name === undefined ? '' : name}</td>
            <td>${dateEnd === undefined ? '' : dateEnd}</td>
            <td>${cnt === undefined ? '' : cnt}</td>
            <td><button class="btn btn-info updateBtn" type="button" data-toggle="modal" data-target="#newModal">당첨자 명단</button></td>
        </tr>
    `.trim());

    $('.updateBtn').click(prizePop(name));

    return domList;
}

function prizePop(name) {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/prize/detail?title="+name,
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#updateAdPop');

            if(jsonObj.length > 0) {
                for(let i = 0; i<jsonObj.length; i++) {
                    let domList = makeListData(jsonObj[i], i);

                    dataTbody.append(domList);
                }
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function makeListData(data, i) {
    let {userID, name, phone} = data;
    let indexCnt = i+1;

    let domList = $(` 
        <tr>              
            <td>${indexCnt}</td>
            <td>${userID}</td>
            <td>${name}</td>
            <td>${phone}</td>
        </tr>
    `.trim());

    return domList;
}