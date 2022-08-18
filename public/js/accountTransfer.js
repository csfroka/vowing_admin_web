$(()=> {
    getAccountList();
    accountDetail();
})

function getAccountList() {
    $.ajax({
        type: "GET",
        url: "http://13.125.68.73:8000/user/with_drawal_record",
        dataType: "json",
        success: (jsonObj) => {
            let dataTbody = $('#getAccountList');

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
    let {amount, bank, name, accountNumber, uid, state, date, target} = data;

    let domList = $(`
        <tr>
            <td>${state === undefined ? '' : state}</td>
            <td>${bank === undefined ? '' : bank}</td>
            <td>${accountNumber === undefined ? '' : accountNumber}</td>
            <td>${amount === undefined ? '' : amount}</td>
            <td>${name === undefined ? '' : name}</td>
            <td>${date === undefined ? '' : date}</td>
            <td>${uid === undefined ? '' : uid}</td>
            <td><button class="btn btn-info updateBtn" type="button" data-toggle="modal" data-target="#newModal" data-id="${target}">수정</button></td>
        </tr>
    `.trim());

    return domList;
}

function accountDetail() {
    $('#newModal').on('show.bs.modal', function(e) {
        let target = $(e.relatedTarget).data('id');

        let params = {
            target
        }

        $.ajax({
            type: "GET",
            url: "http://13.125.68.73:8000/user/with_drawal_record/detail",
            data: params,
            dataType: "json",
            success: (result) => {
                let {state, bank, imageUrl, accountNumber, amount, name, date} = result;

                $(`#state option[value=${state}]`).prop('selected',true);
                $('#bank').val(bank);
                $('#imageUrl').val(imageUrl);
                $('#accountNumber').val(accountNumber);
                $('#amount').val(amount);
                $('#name').val(name);
                $('#date').val(date);

                saveAccountList(result);
            },
            error: (err) => {
                console.log(err);
            }
        });
    })
}

function saveAccountList(result) {
    $('#saveBtn').click(function() {
        let state = $('#state option:selected').val();
        let bank = $('#bank').val();
        let imageUrl = $('#imageUrl').val();
        let accountNumber = $('#accountNumber').val();
        let amount = $('#amount').val();
        let name = $('#name').val();
        let date = $('#date').val();
        let uid = result.uid;
        let target = result.target;

        let jsonData = {
            state,
            bank,
            imageUrl,
            accountNumber,
            amount,
            name,
            date,
            uid,
            target
        }

        $.ajax({
            type: "POST",
            url: "http://13.125.68.73:8000/user/update_with_drawal_record",
            data: JSON.stringify(jsonData),
            dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function(jsonObj) {
                alert('저장되었습니다.');
                location.href = "accountTransfer.html";
            },
            error: function(xhr, status, error) {
                alert(xhr + status + error);
            }
        });
    })
}