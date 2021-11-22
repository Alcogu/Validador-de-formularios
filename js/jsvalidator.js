class JSValidator{

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

            //adjuntar etiquetas con la clase error
            let parent = input.parentNode;
            //se crea etiqueta
            let span = document.createElement('span');
            //se le da atributo a la etiqueta
            span.setAttribute("class", "error-msg");
            //se le dice a parent que la indexe al final
            parent.appendChild(span);

        });

    }

}