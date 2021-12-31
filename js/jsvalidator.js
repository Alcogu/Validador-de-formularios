class JSValidator{

    //Mecanismo para controlar que el formulario se a validado correctamente
    status = true;

    //Mecanismo de control, pila de errores
    errors = [];

    via='http';

    validators ={

        minLength:3,
        maxLength:25,
    }

    msg = {
        required: `Este campo es requerido`,
        minLength: `Longitud no valida. Minimo __minLength__ caracteres`,
        maxLength: `Longitud no valida. Maximo __maxLength__ caracteres`,
        email: `Este campo de email es no valido`,
        integer: `Este campo debe tener un numero entero`,
        alphanumeric: `Solo se permiten letras y numeros sin espacios`,
        digit: `Este campo debe ser un digito`,
        url: `Este campo debe ser una URL valida`,
    }

    constructor (formId){

        this.setForm(formId);
        this.setInputs();
        this.parseInputs();

    }

    setForm(formId){

        this.form = document.getElementById(formId);

    }

    setInputs(){

        this.inputs = document.querySelectorAll(`#${this.form.id} .jsValidator`)

    }
    //Analisa cada uno de los inputs
    parseInputs(){

        this.inputs.forEach(input=>{

            this.appendErrorsTag(input);

        });

    }

    setAjax(){

        this.via = 'ajax';

        return this;

    }

    setHttp(){

        this.via = 'http';

        return this;

    }

    appendErrorsTag (input){

        //Identifica el elemento padre
        let parent = input.parentNode;
        //se crea etiqueta span
        let span = document.createElement('span');
        //se le da atributo class con el valor error-msg a la etiqueta
        span.setAttribute("class", "error-msg");
        //lo adjunta al elemento padre como elemento hijo
        parent.appendChild(span);

    }

    //Cuando el cliente le de en el boton enviar se ejecuta validateForm
    validateForm(){
        /*crear una escucha al evento
        addEventListener necesita dos aprametros que son tipo de evento(submit) y una
        funcion anonima que recibe como parametro el evento y se encarga de ejecutar una
        o varias acciones cuando se ejecute el evento*/
        this.form.addEventListener('submit', (e) => {

            //Reiniciar los errores y cambiar status a true
            this.resetValidation();
            
            //Recorre cada uno de los inputs
            this.inputs.forEach(input => {

                //Se valida cada input de manera individual
                this.validateInput(input);
            });

            //Despues de validados los inputs se niega el valor de status
            if(!this.status){

                //Prevenir el envio del formulario
                e.preventDefault();

            }else{

                //Evalua si se debe enviar ajax o htto
                if(this.via == 'ajax'){

                    e.preventDefault();

                    this.submitHandler();

                }else{

                    //solo para fines demostrativos
                    e.preventDefault();

                    console.log('Formulario enviado')

                }
            }

        });
    }

    validateInputs(){

        //Se añade una escucha para cada uno de los inputs
        this.inputs.forEach(input => {

            input.addEventListener('input', (e) => {

                this.resetValidation();

                this.validateInput(input);

            });
        });

    }

    //se encargará de validar cada uno de los inputs
    //recibe como parametro el input que quiere validar
    validateInput(input){
        //recuperación de validadores
        let validators = input.dataset.validators;//require length

        if (validators !== undefined){
            //el espacio que debe ir entre el require y length, se separa cada uno de los validadores
            validators = validators.split(' ');

            //que validador debe aplicar para el input
            validators.forEach(validator => {
                /*guion bajo llama metodos de validador
                si el validador es required => su metodo de validacion seria _required(input)
                si el validador es length => su metodo de validacion seria _length(input)
                */
               //validator es un string que trae el nombre de nuestro validador
               //llamada dinamica a la función
                this[`_${validator}`](input);

            })

        }
    }

    setError(input, msg){

        //Cambiando el valor de status
        this.status = false;

        //Permite añadir a la pila de errores el error que a ocurrido
        this.setStackError(input, msg);

        //Permite mostrar el mensaje de error al usuario
        this.setErrorMessage(input, msg);
        
    }

    setStackError(input, msg){

        //push es un metodo para los arreglos que permite añadir elementos al arreglo
        //añade el error a nuestro stack de errores
        this.errors.push({input: input, msg: msg})
    }

    setErrorMessage(input, msg){

        //Mostrar un mensaje al usuario en el spma mas proximo al input
        //adjuntando el error
        let span = input.nextElementSibling;

        //Se modifica el contenido del span
        span.innerHTML += (msg + '<br />');
    }

    resetValidation(){

        //Cambiando el valor de status
        this.status = true;

        this.restStackError();
        this.resetErrorMessage();

    }

    restStackError (){

        //Pila de errores
        this.errots=[];

    }

    resetErrorMessage(){

        //Quitar mensaje de error
        let spans = document.querySelectorAll(`#${this.form.id} .error-msg`);

        spans.forEach( span => {

            //Se vacian cada uno de los span
            span.innerHTML = "";

        });

    }

    //se envia formulario
    submitHandler(){

        //se crea objeto de data del formulario con la api FormData
        //el cual recibe el formulario que se esta trabajando
        let data = new FormData(this.form);

        //fetch es un metodo basado en promesas
        fetch(this.form.action, {
            //se define metodo
            method: this.form.method,
            //se define cuerpo
            body:data
        })
        //respuesta tipo json
        .then(response => response.json())
        //data del servidor
        .then(data => {

            //se recibe formulario
            console.log(data);

        })
        .catch(error => {

            console.log(error);

        });
    }
    
    /*Este metodo se debe poner al final y se encarga de inicializar todo, este metodo se encarga de llamar
    a validateForm que se encarga de escuchar el metodo submit
    */
    init(){

        this.validateForm();

        this.validateInputs();

        return this;

    }
}

JSValidator.prototype._required = function (input){

    //Recuperar el valor del input y lo captura
    let value = input.value;

    //mensaje de error al usuario
    let msg = this.msg.required;

    //Validacion si es true es porque esta vacio
    //trim elimina espacios en los extremos
    if(value.trim() === "" || value.length < 1){

        //Envia el input y el mensaje que se esta validando
        this.setError(input, msg);
    }

};

JSValidator.prototype._length = function (input){

    //se recupera el valor del imput
    let value = input.value;

    //Longitud del input
    let inputLength = value.length;

    //se define minLength
    let minLength = (input.dataset.validators_minlength !== undefined)? Number(input.dataset.
        validators_minlength): this.validators.minLength;

    //se define maxLength
    let maxLength = (input.dataset.validators_maxlength !== undefined)? Number(input.dataset.
        validators_maxlength): this.validators.maxLength;

    //se verifica minLength
    if(inputLength < minLength){

        msg = this.msg.minLength.replace('__minLength__', minLength);

        this.setError(input,msg);

    }

    //se verifica maxLength
    if(inputLength > maxLength){

        msg = this.msg.maxLength.replace('__maxLength__', maxLength);

        this.setError(input,msg);

    }

};

JSValidator.prototype._email = function (input){

    //Se recupera el valor del input
    let value = input.value;

    //Se define el mensaje de error
    let msg = this.msg.email;

    //Expresion regular para validar el email
    let pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);

    //En caso de que la validacion falle mandar error
    if(!pattern.test(value) && value.trim() !=""){

        this.setError(input, msg);

    }

};

JSValidator.prototype._integer = function (input){

    //Se recupera el valor del input
    let value = input.value;

    //Se define el mensaje de error
    let msg = this.msg.integer;

    let pattern = new RegExp(/^[0-9]+$/);

    if(!pattern.test(value) && value.trim() !=""){

        this.setError(input, msg);

    }

};

JSValidator.prototype._alphanumeric = function(input) {
	
	// En primer lugar vamos a recuperar el valor del input
	let value = input.value;
 
	// Definir el mensaje de error
	let msg = this.msg.alphanumeric;
 
	// expresión regular para validar digit
	let pattern = new RegExp(/^[a-zA-Z0-9]+$/);
 
	// En caso de que la validación falle mandar error.
    if (!pattern.test(value) && value.trim() != "") {
 
    	this.setError(input, msg);
 
    }
 
};

JSValidator.prototype._url = function(input) {
	
	// En primer lugar vamos a recuperar el valor del input
	let value = input.value;
 
	// Definir el mensaje de error
	let msg = this.msg.url;
 
	// expresión regular para validar url
	var pattern = new RegExp(/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i);
 
	// En caso de que la validación falle mandar error.
    if (!pattern.test(value) && value.trim() != "") {
 
    	this.setError(input, msg);
 
    }
 
};
