const ROLL_NO = "22F-3672"; 
const MULTIPLIER = parseInt(ROLL_NO.slice(-1)); 
const INITIAL_BALANCE = MULTIPLIER * 1000; 

console.log(INITIAL_BALANCE); 


class BankAccount {
    constructor() {
        this.accountNumber = this.generateAccountNumber();
        this.transactions = [{
            type: 'Initial Deposit',
            amount: INITIAL_BALANCE,
            date: new Date()
        }];
    }

    generateAccountNumber = () => 
        ROLL_NO.split('').reverse().join('') + 
        Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    get balance() {
        return this.transactions.reduce((acc, curr) => 
            curr.type === 'Withdrawal' ? acc - curr.amount : acc + curr.amount, 0);
    }

    deposit = amount => {
        if(amount % MULTIPLIER !== 0) throw new Error(`Amount must be multiple of ${MULTIPLIER}`);
        this.transactions.push({
            type: 'Deposit',
            amount,
            date: new Date()
        });
    }

    withdraw = amount => {
        const maxWithdraw = this.balance * 0.8;
        if(amount > maxWithdraw) throw new Error(`Cannot withdraw more than ${maxWithdraw.toFixed(2)}`);
        this.transactions.push({
            type: 'Withdrawal',
            amount,
            date: new Date()
        });
    }

    getTransactionHistory = () => 
        this.transactions.map(t => ({
            ...t,
            date: t.date.toLocaleString()
        }));
}

// UI Controller
const account = new BankAccount();
const DOM = {
    accNumber: document.getElementById('accNumber'),
    balance: document.getElementById('balance'),
    transactionList: document.getElementById('transactionList'),
    depositForm: document.getElementById('depositForm'),
    withdrawForm: document.getElementById('withdrawForm'),
    downloadBtn: document.getElementById('downloadBtn')
};

const formatCurrency = amount => 
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount);

const updateUI = () => {
    DOM.accNumber.textContent = account.accountNumber;
    DOM.balance.textContent = formatCurrency(account.balance);
    
    DOM.transactionList.innerHTML = account.getTransactionHistory()
        .reverse()
        .map(t => `
            <li>
                <span>${t.date}</span>
                <span style="color: ${t.type === 'Withdrawal' ? 'var(--danger)' : 'var(--success)'}">
                    ${t.type}: ${formatCurrency(t.amount)}
                </span>
            </li>
        `).join('');
};

const handleTransaction = async (type, amount) => {
    try {
        if(type === 'deposit') account.deposit(amount);
        if(type === 'withdraw') account.withdraw(amount);
        updateUI();
        return true;
    } catch(error) {
        alert(`Transaction Failed: ${error.message}`);
        return false;
    }
};

// Event Listeners
DOM.depositForm.addEventListener('submit', async e => {
    e.preventDefault();
    await handleTransaction('deposit', +e.target.depositAmount.value);
    e.target.reset();
});

DOM.withdrawForm.addEventListener('submit', async e => {
    e.preventDefault();
    await handleTransaction('withdraw', +e.target.withdrawAmount.value);
    e.target.reset();
});

DOM.downloadBtn.addEventListener('click', () => {
    const history = account.getTransactionHistory()
        .map(t => `${t.date} - ${t.type}: ${t.amount} PKR`)
        .join('\n');
    
    const blob = new Blob([history], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank_statement_${account.accountNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
});

// Initial UI Update
updateUI();