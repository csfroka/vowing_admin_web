$(()=> {
    getSecessionReason();
})

function getSecessionReason() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/get_secession_reason",
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#getSecessionReason');
            
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
    let {uid, $delete, date} = data;

    let domList = $(`
        <tr>
            <td>${uid === undefined ? '' : uid}</td>
            <td>닉네임</td>
            <td>${$delete === undefined ? '' : $delete}</td>
            <td>${date === undefined ? '' : date}</td>
        </tr>
    `.trim());

    return domList;
}