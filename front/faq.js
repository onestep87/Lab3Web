//var base_url = "http://127.0.0.1:5000/"
var base_url = "https://luckyrydar.pythonanywhere.com/"
var cfg_var = "config_id_local_storage"

function do_get(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function create_config(num_of_btns) {
    let url = base_url + "config/create/" + num_of_btns
    let res = do_get(url)
    console.log(res)
    return JSON.parse(res).id
}

function get_number_by_config(cfg_id) {
    let url = base_url + "config/by_num_btns_by_id/" + cfg_id
    let res = do_get(url)
    console.log(res)
    return JSON.parse(res).number_of_rows
}

function insert_button(cfg_id, num_of_fields) {
    let url = base_url + "button/insert/" + cfg_id + "/" + num_of_fields
    let res = do_get(url)
    console.log(res)
    return JSON.parse(res)
}

function update_field(field_id, content) {
    let url = base_url + "field/update/" + field_id + "/" + content
    let res = do_get(url)
    console.log(res)
    return JSON.parse(res)
}

function get_config(cfg_id) {
    let url = base_url + "config/get/" + cfg_id
    let res = do_get(url)
    console.log(res)
    return JSON.parse(res)
}

window.onload = main;

function create_button(btn_id, fields) {
    let center = document.querySelector('.center-menu')
    center.appendChild(document.createElement('br'))
    center.appendChild(document.createElement('br'))

    let drop_down_div = document.createElement('div')
    let drop_down_class = 'dropdown'
    drop_down_div.setAttribute('class', drop_down_class)

    // create an object
    let button = document.createElement('button')
    button.innerText = "press me"
    let button_class = 'dropbtn'
    button.setAttribute('class', button_class)
    button.onmouseover = () => create_structure(btn_id);

    let options = document.createElement('div')
    options.setAttribute('class', 'dropdown-content')
    options.setAttribute('id', 'dropdown-content' + btn_id)

    drop_down_div.appendChild(button)
    drop_down_div.appendChild(options)

    return drop_down_div
}

let cfg_id;

function main() {
    // get cfg id from local storage
    cfg_id = window.localStorage[cfg_var]
    // get fields array
    cfg = get_config(cfg_id)
    let center = document.querySelector('.center-menu')
    for(let i = 0; i < cfg.btns.length; i++) {
        let btn_info = cfg.btns[i]
        console.log(btn_info)
        center.appendChild(create_button(btn_info.btn_id, btn_info.fields))
    }
}

function create_structure(btn_id)
{
    let cfg = get_config(cfg_id)
    let btn
    for(let i = 0; i < cfg.btns.length; i++) {
        if(cfg.btns[i].btn_id == btn_id) {
            btn = cfg.btns[i]
        }
    }
    let fields = btn.fields

    let div_id = 'dropdown-content' + btn_id
    let select = document.getElementById(div_id);
    select.innerHTML = ''

    for (var i = 0; i < fields.length; i++){
        var opt = document.createElement('option');
        opt.innerText = fields[i].content;
        opt.className= "firstDrop";
        //opt.className= 'dropdown-content';
        select.appendChild(opt);
    }
}