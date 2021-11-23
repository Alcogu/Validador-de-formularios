class JSValidator{

    //Mecanismo para controlar que el formulario se a validado correctamente
    status = true;

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
            
            //se validan cada uno de los campos
            this.inputs.forEach(input => {
                //Se valida cada input de manera individual
                this.validateInput(input);
            });

            //Despues de validados los inputs se niega el valor de status
            if(!this.status){

                //Prevenir el envio del formulario
                e.preventDefault();

                console.log('Ha ocurrido un error de validacion');

            }else{
                console.log('El formulario se ha enviado')
            }

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
    
    /*Este metodo se debe poner al final y se encarga de inicializar todo, este metodo se encarga de llamar
    a validateForm que se encarga de escuchar el metodo submit
    */
    init(){

        this.validateForm();

        return this;

    }

}

JSValidator.prototype._required = function (input){

    //Logica de la validacion

    errors = true

    if(errors){

        this.status = false;

    }

};

JSValidator.prototype._length = function (input){

};
