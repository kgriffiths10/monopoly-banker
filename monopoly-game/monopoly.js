class Player {
    constructor(name) {
        this.name = name;
        this.balance = 0;
    }

    transfer(amount, receiver) {
        if (amount <= this.balance) {
            this.balance -= amount;
            receiver.balance += amount;
            return true;
        }
        return false;
    }

    setBalance(amount) {
        this.balance = amount;
    }
}

class MonopolyGame {
    constructor() {
        this.players = [];
        this.maxPlayers = 8;
    
        //Binding of UI elements
        this.newGameButton = document.getElementById('new-game-btn');
        this.addPlayerButton = document.getElementById('add-player-btn');
        this.transferButton = document.getElementById('transfer-btn');
        this.bankerEditButton = document.getElementById('banker-edit-btn');
        this.senderDropdown = document.getElementById('sender-dropdown');
        this.receiverDropdown = document.getElementById('receiver-dropdown');
        this.transferAmountInput = document.getElementById('transfer-amount');
        this.bankerBalanceDiv = document.getElementById('banker-balance');
        this.playersTable = document.getElementById('players-table');

        // Binding of event listeners
        this.newGameButton.addEventListener('click', () => this.newGame());
        this.addPlayerButton.addEventListener('click', () => this.addPlayer());
        this.transferButton.addEventListener('click', () => this.transferMoney());
        this.bankerEditButton.addEventListener('click', () => this.editBankerBalance());

        this.newGame();
    }

    newGame() {
        this.players = [];
        const banker = new Player('Banker');
        this.players.push(banker);
        this.updateUI();
    }

    addPlayer() {
        if (this.players.length >= this.maxPlayers + 1) { // Including the banker
            alert('Maximum 8 players allowed');
            return;
        }
        const playerName = prompt('Enter player name:');
        if (playerName) {
            const newPlayer = new Player(playerName);
            this.players.push(newPlayer);
            this.updateUI();
        }
    }

    transferMoney() {
        const senderName = this.senderDropdown.value;
        const receiverName = this.receiverDropdown.value;
        const amountInput = this.transferAmountInput;
        const amount = parseInt(amountInput.value);
    
        if (!amount || amount <= 0) {
            alert('Please enter a valid transfer amount.');
            return;
        }
    
        if (senderName === receiverName) {
            alert('Sender and receiver cannot be the same');
            return;
        }
    
        const sender = this.players.find(player => player.name === senderName);
        const receiver = this.players.find(player => player.name === receiverName);
    
        if (sender && receiver) {
            if (sender.transfer(amount, receiver)) {
                this.updateUI();
    
                // Vintage cash register animation
                this.animateToZero(amountInput, amount);
            } else {
                alert('Insufficient balance');
            }
        }
    }
    
    animateToZero(inputElement, startValue) {
        let currentValue = startValue;
        const decrement = Math.ceil(startValue / 50); // Controls the speed of the animation
    
        const animationInterval = setInterval(() => {
            currentValue -= decrement;
            if (currentValue <= 0) {
                currentValue = 0;
                clearInterval(animationInterval);
            }
            inputElement.value = currentValue;
        }, 10); // Adjust the interval timing for faster or slower animation
    }
    
    editBankerBalance() {
        const newBalance = parseInt(prompt('Enter new banker balance:'));
        if (!isNaN(newBalance)) {
            const banker = this.players.find(player => player.name === 'Banker');
            banker.setBalance(newBalance);
            this.updateUI();
        }
    }

    updateUI() {
    // Update banker balance
    const banker = this.players.find(player => player.name === 'Banker');
    this.bankerBalanceDiv.textContent = `$${banker.balance}`;
    
    // Clear previous content and update players table, excluding the banker
    const playersTableBody = this.playersTable.querySelector('tbody');
    playersTableBody.innerHTML = ''; // Clears previous rows

    this.players.filter(player => player.name !== 'Banker').forEach(player => {
        const row = document.createElement('tr');

        // Create a cell for the player's name
        const nameCell = document.createElement('td');
        nameCell.textContent = player.name;
        row.appendChild(nameCell);

        // Create a cell for the player's balance
        const balanceCell = document.createElement('td');
        balanceCell.textContent = `$${player.balance}`;
        balanceCell.style.fontFamily = "'Saira Semi Condensed', sans-serif"; // Optional: Apply custom font to balance
        balanceCell.style.paddingLeft = '20px'; 
        row.appendChild(balanceCell);

        playersTableBody.appendChild(row);
    });
        
        // Update dropdowns
        this.senderDropdown.innerHTML = '';
        this.receiverDropdown.innerHTML = '';
        this.players.forEach(player => {
            const senderOption = document.createElement('option');
            senderOption.value = player.name;
            senderOption.textContent = player.name;
            this.senderDropdown.appendChild(senderOption);

            const receiverOption = document.createElement('option');
            receiverOption.value = player.name;
            receiverOption.textContent = player.name;
            this.receiverDropdown.appendChild(receiverOption);
        });
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new MonopolyGame();
});


    


