class JSValidator{

    //Mecanismo para controlar que el formulario se a validado correctamente
    status = true;

    //Mecanismo de control, pila de errores
    errors = [];

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

                console.log('ERROR: Ha ocurrido un error de validacion');

            }else{
                console.log('ÉCITO: El formulario se ha enviado')
            }

        });
    }

    validateInputs(){

        //Se añade una escucha para cada uno de los inputs
        this.inputs,forEach(input => {

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
    let msg = 'Este campo es requerido';

    //Validacion si es true es porque esta vacio
    //trim elimina espacios en los extremos
    if(value.trim() === "" || value.length < 1){

        //Envia el input y el mensaje que se esta validando
        this.setError(input, msg);
    }

};

JSValidator.prototype._length = function (input){


};
