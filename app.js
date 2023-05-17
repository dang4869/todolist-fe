let areaListTask = $('#area-list-task')
let areaForm = $('#area-form')
let btnToggleForm = $('#btn-toggle-form')
let inputID = $('#input-id')
let inputName = $('#input-name')
let inputStatus = $('#input-status')
let sortDisplay = $('#sort-display')
let params = []
let API_URL = 'http://localhost:3000/'
params.orderBy = 'name',
    params.orderDir = 'asc'

const ITEM_STATUS = [
    { name: 'Small', status: 'small', class: 'dark' },
    { name: 'Medium', status: 'medium', class: 'info' },
    { name: 'High', status: 'high', class: 'danger' },
]


$(document).ready(function () {
    showItems(params)
})
$('.sort-value').click(function () {
    params.orderBy = $(this).data('order-by')
    params.orderDir = $(this).data('order-dir')
    let display = `${params.orderBy.toUpperCase()} - ${params.orderDir.toUpperCase()}`
    showItems(params)
    sortDisplay.html(display)
})
$('#btn-search').click(function () {
    params.keyword = $('#input-search').val()
    showItems(params)
})
$(btnToggleForm).click(function () {
    let isShow = $(this).data('toggle-form')
    $(this).data('toggle-form', !isShow)
    toggleForm(!isShow)
})
$('#btn-submit').click(function () {
    if (inputID.val()) {
        startEditItem(inputID.val())
    } else {
        addItem()
    }
})
$('#btn-cancel').click(function () {
    toggleForm(false)
    $(btnToggleForm).data('toggle-form', false)
    resetInput()
})
function showItems(params = null) {
    let url = ''
    if (params && params.orderBy) {
        url += `orderBy=${params.orderBy}&orderDir=${params.orderDir}`
    }
    if (params && params.keyword) {
        url += `&keyword=${params.keyword}`
    }
    $.getJSON(API_URL + "items?" + url, function (data) {
        let content = '';
        if (data && data.success) {
            $.map(data.data, function (item, index) {
                // console.log(item)
                let idx = index + 1;
                let id = item._id
                let name = item.name
                let status = showItemStatus(item.status)
                if (params && params.keyword) {
                    name = name.replace(new RegExp(params.keyword, 'ig'), (searchResult) => {
                        return `<mark>${searchResult}</mark>`
                    })
                }
                content += `
            <tr>
                  <th scope="row">${idx}</th>
                  <td>${name}</td>
                  <td>${status}</td>
                  <td>
                    <button class="btn btn-warning" onclick="javascript:editItem('${id}')">Edit</button>
                    <button class="btn btn-danger" onclick="javascript:deleteItem('${id}')">Delete</button>
                  </td>
                </tr>
            `
            })
        }
        $(areaListTask).html(content)
    });
}
addItem = async () => {
    if (inputName.val().trim()) {
        let name = inputName.val()
        let status = inputStatus.val()
        const response = await fetch(API_URL + 'items/add', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                name,
                status
            }), // body data type must match "Content-Type" header
        });
        showItems()
        toggleForm(false)
        resetInput()
    } else {
        alert('Vui lòng nhập Task name')
    }
}
deleteItem = async (id) => {
    let yes = confirm('Bạn có muốn xóa')
    if (yes) {
        const response = await fetch(API_URL + 'items/delete/' + id, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        showItems()
    }

}

editItem = (id) => {
    // console.log(id)
    toggleForm()
    $.getJSON(API_URL + "items/" + id, function (data) {
        // console.log(data)
        if (data) {
            inputID.val(id)
            inputName.val(data.data.name)
            inputStatus.val(data.data.status)
        }
    })
}
startEditItem = async (id) => {
    if (inputName.val().trim()) {
        let name = inputName.val()
        let status = inputStatus.val()
        const response = await fetch(API_URL + 'items/edit/' + id, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                name,
                status
            }), // body data type must match "Content-Type" header
        });
        showItems()
        toggleForm(false)
        resetInput()
    } else {
        alert("Vui lòng nhập Task Name")
    }
}
function showItemStatus(status) {
    let itemLevel = ITEM_STATUS.find((element) => element.status == status);
    return `<span class="badge bg-${itemLevel.class} text-white">${itemLevel.name}</span>`
}
function toggleForm(isShow = true) {
    if (isShow) {
        $(areaForm).removeClass('d-none')
        $(btnToggleForm).html('Close')
        $(btnToggleForm).removeClass('btn-info')
        $(btnToggleForm).addClass('btn-danger')
    } else {
        $(areaForm).addClass('d-none')
        $(btnToggleForm).html('Add Task')
        $(btnToggleForm).addClass('btn-info')
        $(btnToggleForm).removeClass('btn-danger')
    }
}
function resetInput() {
    inputID.val('')
    inputName.val('')
    inputStatus.val('small')
}