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
    // Customized Error Messages. Keys compatible to ValidityState of Validation API
    static errorMsg = {
        valueMissing: "Please enter the mandatory input fields.",
        typeMismatch: "Please enter a valid Email address.",
        patternMismatch: "Your input doesn´t match the pattern.",
        tooLong: "Your input is too long.",
        tooShort: "Your input is too short.",
        rangeUnderflow: "Your input is below the allowed range.",
        rangeOverflow: "Your input is beyond the allowed range.",
        stepMismatch: "Your input doesn´t fit the rules.",
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
        this.form.setAttribute('novalidate', true);
        this.registerEventListeners();
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
            let str = this.fields.map(field => {
                let key = field.labels[0].textContent;
                let value = FormApp.getValueFromInput(field)
                return `${key}: ${value}`;
            }).join(`\n`);
            window.alert("SUBMIT SUCCESSFUL\n\n" + str);
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
            let msgClist = msg.classList;
            err_content = FormApp.errorMsg.hasOwnProperty(error) ? FormApp.errorMsg[error]:'';
            let durationNumber = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--durationNumber'));
            let cList = field.parentElement.classList;

            if ( error_arr.length > 0 ){
                this.form.classList.add(`was-validated`);
                if (!msgClist.contains(`slide-out`)){
                    msg.textContent = err_content;
                    cList.add(`field--invalid`);
                } else {
                    setTimeout(function(){
                        msg.textContent = err_content;
                        cList.add(`field--invalid`);
                    }, 180);
                }
            } else {
                msgClist.add(`slide-out`);
                setTimeout(function(){
                    cList.remove(`field--invalid`);
                    msgClist.remove(`slide-out`);
                }, 180)
            }
        }
        return err_content.length > 0 ? false : true;
    }
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
    }    
    
    init();

});