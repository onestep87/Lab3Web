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

function main() {
    create_root_interface()
}

function create_root_interface() {
    // use this feature to control elements showing except of these
    //let root = document.querySelector('.div-root-choose-what-to-do-buttons')
    //center.removeChild(root)
    let center = document.querySelector(".center-menu")

    // create buttons to choose if create new config or edit existing
    let root_buttons = document.createElement('div')
    root_buttons.setAttribute('class', 'div-root-choose-what-to-do-buttons')

    let create_new_btn = document.createElement('button')
    create_new_btn.innerText = 'create new'
    create_new_btn.onclick = on_create_new

    let edit_conf_btn = document.createElement('button')
    edit_conf_btn.innerText = 'edit config'
    edit_conf_btn.onclick = on_root_edit
    
    root_buttons.appendChild(create_new_btn)
    root_buttons.appendChild(edit_conf_btn)

    center.appendChild(root_buttons)
    center.appendChild(document.createElement('br'))
}

create_conf_menu_elems = []

already_shown_create_menu = false
function on_create_new() {
    let center = document.querySelector(".center-menu")

    if(already_shown_create_menu) {
        let to_remove = document.querySelector('.create-conf-menu-elems')
        center.removeChild(to_remove)
        already_shown_create_menu = false
    } else {
        already_shown_create_menu = true
        let create_conf_menu = document.createElement('div')
        create_conf_menu.setAttribute('class', 'create-conf-menu-elems')

        /**
         * here create menu for entering:
         *  how many buttons
         *   use one line text edit
         *  how many fields for buttons
         *   use textarea
         *  
         *  and also create button to accept everything
         */
        let input_num_of_buttons = document.createElement('input')
        input_num_of_buttons.setAttribute('class', 'input-num-of-buttons')
        input_num_of_buttons.setAttribute('type', 'number')
        create_conf_menu.appendChild(input_num_of_buttons)
        create_conf_menu.appendChild(document.createElement('br'))

        let input_fields_number = document.createElement('textarea')
        input_fields_number.setAttribute('class', 'input-fields-number')
        create_conf_menu.appendChild(input_fields_number)
        create_conf_menu.appendChild(document.createElement('br'))

        let create_config_btn = document.createElement('button')
        create_config_btn.setAttribute('class', 'create-config-btn')
        create_config_btn.innerText = 'create config'
        create_config_btn.onclick = on_create_config_btn 
        create_conf_menu.appendChild(create_config_btn)

        center.appendChild(create_conf_menu)
    }
    
}

function on_create_config_btn() {
    // do create config with button initialization
    let number_of_btns = document.querySelector('.input-num-of-buttons').value
    let buttons_fields = document.querySelector('.input-fields-number').value.split('\n')
    console.log(number_of_btns)
    console.log(buttons_fields)

    let cfg_id = create_config(number_of_btns)
    for(let i = 0; i < buttons_fields.length; i++) {
        console.log(buttons_fields[i])
        insert_button(cfg_id, buttons_fields[i])
    }
    console.log(cfg_id)

    window.localStorage[cfg_var] = cfg_id
}

already_shown_edit_menu = false
function on_root_edit() {
    /**
     * show the edit menu 
     */

    let center = document.querySelector(".center-menu")
    if(already_shown_edit_menu) {
        // do delete
        let to_remove = document.querySelector('.edit-conf-menu-elems')
        center.removeChild(to_remove)
        already_shown_edit_menu = false
    } else {
        already_shown_edit_menu = true
        let edit_conf_menu = document.createElement('div')
        edit_conf_menu.setAttribute('class', 'edit-conf-menu-elems')
        
        let input_which_button_edit = document.createElement('input')
        input_which_button_edit.setAttribute('class', 'button-number-to-edit')
        input_which_button_edit.setAttribute('type', 'number')
        edit_conf_menu.appendChild(input_which_button_edit)
        
        let accept_button_to_edit = document.createElement('button')
        accept_button_to_edit.innerText = 'choose button'
        accept_button_to_edit.onclick = on_choose_button_number
        edit_conf_menu.appendChild(accept_button_to_edit)
        
        edit_conf_menu.appendChild(document.createElement('br'))
        edit_conf_menu.appendChild(document.createElement('br'))
        
        let textarea_for_button_fields = document.createElement('textarea')
        textarea_for_button_fields.setAttribute('class', 'textarea-button-fields')
        textarea_for_button_fields.setAttribute('cols', 40)
        textarea_for_button_fields.setAttribute('rows', 5)
        edit_conf_menu.appendChild(textarea_for_button_fields)
        edit_conf_menu.appendChild(document.createElement('br'))
        
        let accept_edit_button = document.createElement('button')
        accept_edit_button.innerText = 'accept changes'
        accept_edit_button.onclick = on_edit_fields_accept
        edit_conf_menu.appendChild(accept_edit_button)
        
        center.appendChild(edit_conf_menu)
        // center add menu
    }
}

let btn_to_edit_id = 0
let config_info

let cfg
let btn
function on_choose_button_number() {
    /**
     * load info about button 'n'
     * 
     * n from class 'button-number-to-edit'
     */

    btn_to_edit_number = document.querySelector('.button-number-to-edit').value
    // here load info from server about button
    let cfg_id = window.localStorage[cfg_var]
    if(cfg_id == undefined)
        throw "No config id"

    cfg = get_config(cfg_id)
    console.log(JSON.stringify(cfg))
    btn = get_btn_by_id(cfg.btns, btn_to_edit_number)
    console.log(JSON.stringify(btn))
    
    document.querySelector('.textarea-button-fields').value = ''
    for(let i = 0; i < btn.fields.length; i++) {
        document.querySelector('.textarea-button-fields').value += btn.fields[i].content + '\n'
    }
}

function get_btn_by_id(btns, num) {
    if(num > btns.length - 1) {
        throw "No such button"
    } else {
        return btns[num]
    }
}

function on_edit_fields_accept() {
    let fields_to_update = document.querySelector('.textarea-button-fields').value.split('\n')

    console.log(JSON.stringify(btn))

    for(let i = 0; i < fields_to_update.length; i++) {
        update_field(btn.fields[i].field_id, fields_to_update[i])
    }

    document.querySelector('.textarea-button-fields').value = ''

    // here for each field do update
}
