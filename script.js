class FormApp{
    constructor(formId){
        this.form = document.getElementById(formId);
        if (this.form){
            let fields = this.form.querySelectorAll(`input:not([disabled]):not([type="submit"]), textarea:not([disabled])`);
            this.fields = Array.prototype.slice.call(fields, 0).filter(x => x !== null);
            this.fields.forEach(field => {
                FormApp.checkIfFieldIsFilled(field);
            })
            this.submitButton = this.form.querySelector(`button[type="submit"]`);
        }
    }
    // Customized Error Messages compatible to ValidityState of Validation API
    static errorMsg = {
        valueMissing: "Mandatory field",
        typeMismatch: "Invalid Email address",
        patternMismatch: "Your input doesn´t match the pattern.",
        tooLong: "Your input is too long.",
        tooShort: "Your input is too short.",
        rangeUnderflow: "Your input is below the allowed range.",
        rangeOverflow: "Your input is beyond the allowed range.",
        stepMismatch: "Your input doesn´t fit the rules",
        badInput: "Browser cannot handle your input.",
        customError: "A custom error occured."
    }
    // Static methods
    static getValueFromInput(field, trim = true) {
		let input = field.value;
		if (field.type === `checkbox`) {
			input = field.checked;
		} else {
			input = trim ? input.trim() : input;
		}
		return input;
	}

    static checkIfFieldIsFilled = (field) => {
		if (field.type !== `checkbox`) {
			if (FormApp.getValueFromInput(field).length > 0) {
				field.parentElement.classList.add(`field--notempty`);
                return true;
			} else {
				field.parentElement.classList.remove(`field--notempty`);
                return false;
			}
		} else {
            return field.checked;
        }
	};

    init = () => {
        //this.disableSubmitButton();
        this.form.setAttribute('novalidate', true);
        this.registerEventListeners();
    }

    disableSubmitButton = () => {
        if (this.submitButton){
            this.submitButton.addEventListener('click', this.handleSubmitButton.bind(this));
        }
    }
    handleSubmitButton(event){
        event.preventDefault();
        this.handleSubmit();
    }
    registerEventListeners = () => {
        const currentlySupportedTypes = [`text`, `email`, `password`, `number`, `tel`, `time`, `url`, `textarea`, `checkbox`];
        const eventListeners = [
            {
                name: 'focus',
                handler: this.handleFocus,
            },
            {
                name: 'input',
                handler: this.handleInput,
            },
            {
                name: 'blur',
                handler: this.handleBlur,
            },
        ]
        this.fields.map(field => {
            const type = field.type;
            if (currentlySupportedTypes.includes(type)){
                eventListeners.map(el => {
                    field.addEventListener(el.name, el.handler);
                })
            }
        })
        if (this.form){
            this.form.addEventListener('submit', this.handleSubmit)
        }
    }

    handleFocus = (event) => {
		let evt = event || window.event;
        let field = evt.target;
        if (field !== undefined){
            field.parentElement.classList.add(`field--focused`);
        }
	};

    handleInput = (event) => {
		let evt = event || window.event;
        let field = evt.target;
        if (field !== undefined){
            FormApp.checkIfFieldIsFilled(field);
            this.validateField(field);
        }
	};

    handleBlur = (event) => {
		let evt = event || window.event;
        let field = evt.target;
        if (field !== undefined){
            field.parentElement.classList.remove(`field--focused`);
            FormApp.checkIfFieldIsFilled(field);
            this.validateField(field);
        }
	};

    handleSubmit = (event) => {
        let evt = event || window.event;
        evt.preventDefault();
        let arr = this.fields.map(field => {
            return this.validateField(field);
        }).filter(field => !field);
        if (arr.length === 0){
            window.alert("SUBMIT SUCCESSFUL");
        }
    }

    validateField = (field) => {
        const validState = field.validity;
        let err_content = '';
        if (validState){
            let error_arr = []
            for(var key in validState){
                if (validState[key]){
                    error_arr.push(key);
                }
            }
            error_arr = error_arr.filter(item => item !=='valid');
            const error = error_arr.length > 0 ? error_arr[0]:'';
            let msg = field.parentElement.querySelector(`.display-msg`);
            err_content = FormApp.errorMsg.hasOwnProperty(error) ? FormApp.errorMsg[error]:'';
            if (msg){
                msg.textContent = err_content;
            }

            if ( error_arr.length > 0 ){
                this.form.classList.add(`was-validated`);
                field.parentElement.classList.add(`field--invalid`);
            } else {
                field.parentElement.classList.remove(`field--invalid`);
            }
        }
        return err_content.length > 0 ? false : true;
    }
    /*
    validateFields = () => {
        let err = this.fields.map(field => {
            return this.validateField(field);
        }).filter(field => field);
        console.log(err);
    }*/
}

function ready(fn) {
	if (document.readyState != 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(() => {
    const init = () => {
        const myForm = new FormApp("myform");
        myForm.init();
        console.log(myForm.fields)
    }
    
    
    init();
});