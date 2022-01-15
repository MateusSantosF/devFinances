const Modal = {

    openModal(){

        document.
        querySelector('.modal-overlay').
        classList.
        add('active');
      
    },
    closeModal(){
    
        document.
        querySelector('.modal-overlay').
        classList.
        remove('active');
    }
}


function getAllItems(){
    
    let transactions = []

    for(  var i = 1; i < Number(localStorage.getItem(0)) + 1; i++){

        transact = Storage.getItem(i);
        if( transact != undefined || transact != null){
            transactions[i] = JSON.parse(Storage.getItem(i));
        }
        
    }
    return transactions;
}


const Storage = {

    addItem(transaction){
        Storage.updateMaxLength();
        transaction.id = Number(localStorage.getItem(0));
        const json = JSON.stringify(transaction);
        localStorage.setItem(transaction.id, json);
        
    },

    removeItem(key){
        localStorage.removeItem(key);
        App.reload();
    },

    updateMaxLength(){
        localStorage.setItem(0, Storage.length() + 1);
    },

    length(){
       return localStorage.length;
    },

    getItem(key){
        return localStorage.getItem(key);
    }
}


const Transaction = {
    
    all: getAllItems(),

    add(transaction){
        
        Storage.addItem(transaction)
       
    },
    removeTransact(key){
        console.log(key)
        if(confirm("Realmente deseja excluir esta transação?")){
            Storage.removeItem(key);
        }
       
    },

    incomes(){
        let sum = 0;
        Transaction.all.forEach( t=> {
            if (t.amount > 0){
                sum += Number(t.amount)
            }
        })
     
        return sum
    },
    expenses(){
        let sum = 0;
        Transaction.all.forEach( t=> {
            if (t.amount < 0){
                sum += Number(t.amount);
            }
        })
        return sum;
    },

    total(){
        return Transaction.incomes() + Transaction.expenses();
    },
    updateAll(){
        Transaction.all = getAllItems();
    }
    
}

const DOM = {

    transactionContainer: document.querySelector("#data-table-transactions tbody"),

    addTransaction(transaction){
        

        const cssClass = transaction.amount > 0 ? "income" : "expense";
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td class="description">${transaction.description}</td>
        <td class="${cssClass}">${Utils.formatCurrency(transaction.amount)}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="Transaction.removeTransact(${transaction.id})" src="/public/assets/minus.svg" alt="remover transação"></td>
        `
       DOM.transactionContainer.appendChild(tr)
 
    },
    clearTransactions(){
        DOM.transactionContainer.innerHTML = "";
    },
    updateBalance(){
        const incomesDisplay = document.getElementById('incomesDisplay')
        const expensesDisplay = document.getElementById('expensesDisplay')
        const totalDisplay = document.getElementById('totalDisplay')

        Transaction.updateAll()
        incomesDisplay.innerText = Utils.formatCurrency(Transaction.incomes())
        expensesDisplay.innerText = Utils.formatCurrency(Transaction.expenses())
        totalDisplay.innerText = Utils.formatCurrency(Transaction.total())
    },
}


const Utils = {

    formatCurrency(value){

        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g,"");

        value = Number(value) / 100;

        value = value.toLocaleString("pt-br", {
            style: "currency",
            currency:"BRL"
        })

        value = signal + value;

        return value;
    },
    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        
        return value
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
}
const App = {

    init(){
        
        var transactions = getAllItems();
        transactions.forEach(t => {
            DOM.addTransaction(t)
        })
        
        DOM.updateBalance();
    },
    reload(){

        DOM.clearTransactions();
        var transactions = getAllItems();
        transactions.forEach(t => {
            DOM.addTransaction(t)
        })
        
        DOM.updateBalance();
    }
}

const Form = {

    description: document.querySelector('input#in-description'),
    amount: document.querySelector('input#in-value'),
    date: document.querySelector('input#in-date'),
  
    
    getValues() {
        return {
            id: undefined,
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateFields() {
        const { description, amount, date } = Form.getValues()
        
        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "" ) {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    addTransaction(event){
        event.preventDefault()

        try{
            Form.validateFields()
            let transaction = Form.formatValues()
            console.log(transaction)
            Transaction.add(transaction)
            App.reload()
            Form.clearForm()
            Modal.closeModal()
        }catch(error){

            alert(error.message)
        }
        
    },
    formatValues() {

        let { id, description, amount, date } = Form.getValues()
        
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
      
        return {
            id,
            description,
            amount,
            date
        }
    },

    clearForm(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    }

}


App.init();






