$(()=> {
    getBestAdList();
})

function getBestAdList() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/ad/get_best",
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#getTableList');

            for(prop in jsonObj) {
                let domList = makeListDom(jsonObj[prop], prop);

                dataTbody.append(domList);
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function makeListDom(data) {
    let {imageUrl, addName, desc} = data;

    let domList = $(`
        <tr>
            <td>${desc}</td>
            <td>${addName}</td>
            <td>${imageUrl}</td>
        </tr>
    `.trim());

    return domList;
}