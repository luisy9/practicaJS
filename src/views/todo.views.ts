/**
 * 
 * Class TodoView
 */

import { ModelTodo, todo } from '../models/todo.models';
import '../styles.css';

export interface categories {
    id: number;
    name: string;
}

export class TodoView {
    public app: HTMLElement;
    public root: HTMLElement;
    public titleApp: HTMLElement;
    public form: HTMLElement;
    public divForm: HTMLElement;
    public divTodo: HTMLElement;
    public divControl: HTMLElement;
    public divInput: HTMLElement;
    public input: HTMLInputElement;
    public divButton: HTMLElement;
    public buttonSubmit: HTMLElement;
    public buttonFilter: HTMLElement;
    public list: HTMLElement;
    public tableContainer: HTMLElement;
    public table: HTMLElement;
    public formFilter: HTMLElement;
    public divFormFilter: HTMLElement;
    public h1Title: HTMLElement;
    public exitFilter: HTMLElement;
    public divFilterForm: HTMLElement;
    public divInputFilter: HTMLElement;
    public divButtonFilter: HTMLElement;
    public inputFilter: HTMLElement;
    public submitFilter: HTMLButtonElement;
    public ul: HTMLElement;
    public todos: todo[];
    public buttonDelete: HTMLElement;
    public divButtonsControl: HTMLElement;
    public divButtonsControlFilter: HTMLElement;
    public buttonCategoria: HTMLInputElement;
    public buttonCategoriaFilter: HTMLElement;
    public categorieName: string = '';

    //Array de objetos de Categorias
    public categorias: categories[] = [
        {
            id: 1,
            name: 'Programación'
        },
        {
            id: 2,
            name: 'Libros'
        },
        {
            id: 3,
            name: 'Deportes'
        }
    ]


    constructor() {
        //Inicializar Elementos
        this.initializedElements();
        //Configuramos el UI
        this.setupUI();
        //Inicializamos los eventos
        this.bindEventsHandlers();
        this.todos = (JSON.parse(localStorage.getItem('todos')) || []);
    }

    //Inicializar Elementos
    initializedElements() {
        this.app = document.getElementById('root');
        this.root = this.createElement('div', 'div-app');
        this.form = this.createElement('form', 'form-app');
        this.divForm = this.createElement('div', 'divForm');
        this.titleApp = this.createElement('h1', 'titleApp');
        this.titleApp.textContent = 'App Todo';
        this.divTodo = this.createElement('div', 'divTodo');
        this.divControl = this.createElement('div', 'div-control');
        this.divInput = this.createElement('div', 'div-input');
        this.input = this.createElement('input', 'input-note') as HTMLInputElement;
        this.input.type = 'text';
        this.divButton = this.createElement('div', 'div-button');
        this.buttonSubmit = this.createElement('button', 'buttonForm');
        this.buttonSubmit.textContent = 'Submit';
        this.buttonFilter = this.createElement('button', 'buttonFilter');
        this.buttonFilter.textContent = 'Filtro';
        this.divButtonsControl = this.createElement('div', 'divButtonsControls');
        this.divButtonsControlFilter = this.createElement('div', 'divButtonsControlsFilter');
        this.categorias.forEach(e => {
            this.buttonCategoria = document.createElement('input');
            this.buttonCategoria.type = 'checkbox';
            this.buttonCategoria.checked = false;
            this.buttonCategoria.classList.add('checkCategorie');
            this.buttonCategoria.id = e.name as any;
            let nameCategoria = document.createElement('li');
            nameCategoria.classList.add('liCategorias');
            nameCategoria.textContent = e.name;
            nameCategoria.append(this.buttonCategoria);
            this.divButtonsControl.append(nameCategoria);
        })
        this.divFormFilter = this.createElement('div', 'divFormFilter');
        this.formFilter = this.createElement('form', 'form-filter');
        this.h1Title = this.createElement('h1', 'titleApp');
        this.h1Title.textContent = 'Filter Todos';
        this.exitFilter = this.createElement('button', 'buttonExit');
        this.exitFilter.textContent = 'Atras';
        this.divInputFilter = this.createElement('div', 'divInputFilter');
        this.divButtonFilter = this.createElement('div', 'divButtonFilter');
        this.inputFilter = this.createElement('input', 'input-filter');
        this.submitFilter = this.createElement('button', 'button-filter') as HTMLButtonElement;
        this.submitFilter.textContent = 'Filtrar';
        this.submitFilter.type = 'submit';
        this.divFilterForm = this.createElement('div', 'div-filter-form');
        this.ul = this.createElement('ul', 'listTodos');
        this.list = this.createElement('li', 'listTODOS');
        this.tableContainer = this.createElement('div', 'tableContainer');
        this.table = this.createElement('table', 'table');
    }

    //Configuramos Interfaz de usuario
    setupUI() {
        this.divInput.append(this.input);
        this.divButton.append(this.buttonSubmit, this.buttonFilter);
        this.divControl.append(this.divInput, this.divButton);
        this.divTodo.append(this.divControl, this.divButtonsControl);
        this.divInputFilter.append(this.inputFilter);
        this.divButtonFilter.append(this.submitFilter);
        this.divFilterForm.append(this.divInputFilter, this.divButtonFilter);
        this.divForm.append(this.titleApp, this.divTodo);
        this.form.append(this.divForm);
        this.root.append(this.form);
        this.app.append(this.root);
    }

    //Inicializamos los eventos
    bindEventsHandlers() {
        this.bindDisplayButtonsCategory();
        this.bindDisplayFilter();
        this.bindFilterTodos();
        this.closeFilter();
    }

    public isFilter: boolean = false;

    get _inputValue() {
        return this.input.value;
    }

    get _categoryName() {
        return this.categorieName;
    }

    _resetInput() {
        return this.input.value = '';
    }

    _resetCheckBox() {
        return this.buttonCategoria.checked = false;
    }

    createElement(elemnt: string, className: string) {
        const newElement = document.createElement(elemnt);
        if (className) {
            newElement.classList.add(className);
        }
        return newElement;
    }

    //Pasamos los datos de el form para crear un Todo
    bindSubmitForm(handler: Function = () => { }) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            if ((this._inputValue.length > 0) && (this._categoryName.length > 0)) {
                handler({ text: this._inputValue, categoria: this._categoryName });
                this._resetInput();
                this._resetCheckBox();
            }
        })
    }

    bindDisplayButtonsCategory() {
        this.divButtonsControl.addEventListener('change', (event) => {
            const isInputCheck = (event.target as HTMLInputElement).type;
            if (isInputCheck === 'checkbox') {
                const isChecked = ((event.currentTarget as HTMLInputElement).type === 'checkbox');
                if (!isChecked) {
                    const categorie = (event.target as HTMLInputElement).id;
                    this.categorieName = categorie;
                } else {
                    this.categorieName = '';
                }
            }
        })
    }


    //Hacemos click en el button para mostrar el filtrado y esconder la funcionalidad de agregar Todos
    //Hay que repasarlo
    buildButtonsfilter() {

        //Resetear un div con los botones
        while(this.divButtonsControlFilter.firstChild){
            this.divButtonsControlFilter.firstChild.remove();
        }

        this.categorias.forEach(e => {
            this.buttonCategoriaFilter = this.createElement('button', 'button-filter-categories') as HTMLElement;
            this.buttonCategoriaFilter.textContent = e.name;
            this.buttonCategoriaFilter.id = e.name;
            let nameCategoria = this.createElement('li', 'liCategorias');
            nameCategoria.append(this.buttonCategoriaFilter);
            this.divButtonsControlFilter.append(nameCategoria);
        })
        this.formFilter.append(this.divButtonsControlFilter);
        this.divFormFilter.append(this.exitFilter, this.h1Title, this.formFilter);
    }

    /*****  Primero hare el filtrado por botones de las categorias  *****/
    /**** Luego hare el filtrado por input ****/
    bindDisplayFilter() {
        //Funcion para mostrar todos los todos actuales
        this.form.addEventListener('click', (event) => {
            // this.bindShowAllTodosFilter();
            const buttonFilter = (event.target as HTMLElement).className === 'buttonFilter';
            if (buttonFilter) {
                this.buildButtonsfilter();
                this.form.classList.add('displayDivTodo');
                this.divFormFilter.style.display = 'block';

                // this.formFilter.append(this.h1Title, this.divFilterForm);
                this.root.append(this.divFormFilter);
            }
        });
    }

    //Funcion para ejecutar el filter
    bindFilterTodos() {
        this.divButtonsControlFilter.addEventListener('click', (event) => {
            event.preventDefault();
            const _categoryId = (event.target as HTMLElement).id;
            const filterTodos = this.todos.filter(e => e.categoria === _categoryId) as [];
            this.displayTodo(filterTodos);
        });
    }

    closeFilter(){
        this.exitFilter.addEventListener('click', (event) => {
            this.form.classList.remove('displayDivTodo');
            this.divFormFilter.style.display = 'none';
        })
    }


    //Display TODOS
    displayTodo(todos?: ModelTodo[]) {
        const newTbody = this.createElement('tbody', 'tbody');
        this.table.innerHTML = '';
        if (todos?.length > 0) {
            var thead = document.createElement('thead');

            /* Reeorganizar el array */
            //Array con los nuevos indices
            let nuevoArrTodos = ['complete', 'categoria', 'text', 'id', 'delete'];

            //Nuevo array donde se guardaran los objetos
            let arr = [];

            //Hacemos un foreach para recorrer cada objeto en el array por defecto de todos 'categoria', 'text', 'complete', 'id'
            todos.forEach(e => {
                //Objeto donde se guardara la informacion
                let newObject = {};
                //for of para coger el indice de el array estos indices seran 
                for (const index of nuevoArrTodos) {
                    //guardamos en el indice de nuevoArrTodos 
                    //que es el que tendra newObject con el valor asignado
                    //con el valor de los objetos de los todos, pero con siguiendo los indices de el array nuevoArrTodos
                    newObject[index] = e[index];
                }
                //Crea un nuevo arr y agregamos los nuevos valores al 
                //array de arr mas lo que tenia anteriormente y los guarda en arr.
                arr = [...arr, newObject];
            });

            /* thead indices categorias   */
            let tr = document.createElement('tr');
            thead.append(tr);

            Object.keys(arr[0]).forEach(index => {
                if ((index != 'id')) {
                    if (index != 'delete') {
                        let th = document.createElement('th');
                        th.textContent = index;
                        tr.appendChild(th);
                    }
                }
            })

            //Creamos la tabla
            arr.forEach((e) => {
                let trBody = document.createElement('tr');
                for (let clave in e) {
                    if (clave != 'id') {
                        let td = document.createElement('td');
                        let input = document.createElement('input') as HTMLInputElement;
                        if (clave === 'complete') {
                            input.type = 'checkbox';
                            input.checked = e[clave];
                            input.id = e.id;
                            td.append(input);
                        } else if (clave === 'delete' && !this.isFilter) {
                            console.log(this.isFilter);
                            let buttonDelete = document.createElement('button') as HTMLButtonElement;
                            buttonDelete.type = 'submit';
                            buttonDelete.textContent = 'delete';
                            buttonDelete.classList.add('btn', 'btn-delete');
                            buttonDelete.id = e.id;
                            td.append(buttonDelete);
                        } else if (clave === 'text') {
                            td.textContent = e[clave];
                            td.contentEditable = 'true';
                            td.id = e.id;
                            if (e.complete) {
                                td.classList.add('completed');
                            }
                        } else {
                            td.textContent += e[clave];
                        }
                        trBody.append(td);
                        newTbody.append(trBody);
                    }
                }
            })

            this.table.innerHTML = '';
            this.table.append(thead, newTbody);
            this.tableContainer.append(this.table);
            this.app.append(this.tableContainer);
        }


    }

    bindDeleteTodo(handle: Function) {
        this.tableContainer.addEventListener('click', (event: Event) => {
            if ((event.target as any).className === 'btn btn-delete') {
                const _id = (event.target as any).id;
                handle(_id);
            }
        })
    }

    bindUpdateTodos(handle: Function) {
        this.tableContainer.addEventListener('focusout', (event: Event) => {
            const id = (event.target as HTMLElement).id;
            const textEdit = (event.target as HTMLElement).innerText;
            handle(id, textEdit);
        });
    }

    bindTodoChecked(handle: Function) {
        this.tableContainer.addEventListener('change', (event: Event) => {
            const checkBox = (event.target as any).type === 'checkbox';
            if (checkBox) {
                const id = (event.target as HTMLInputElement).id;
                handle(id);
            }
        })
    }
}