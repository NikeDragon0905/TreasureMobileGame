var cryptoTable;
var bankTable;

const firebaseConfig = {
    apiKey: "AIzaSyD2X3uCG2znteFlHnS27bA7DW299WnP5oQ",
    authDomain: "potluck-island.firebaseapp.com",
    databaseURL: "https://potluck-island-default-rtdb.firebaseio.com",
    projectId: "potluck-island",
    storageBucket: "potluck-island.appspot.com",
    messagingSenderId: "125634427374",
    appId: "1:125634427374:web:34608887bb546ccaa2b6ff"
};

function init(){
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }  
    cryptoTable = document.getElementById('cryptoTable');
    bankTable = document.getElementById('bankTable');


    document.getElementById('msb').onclick = function(){
        fetchCrypto();
    }

    document.getElementById('mbs').onclick = function(){
        fetchBank();
    }
    document.getElementById('msb').click();
}

function fetchCrypto(){
    cryptoTable.innerHTML = '';
    var userID = 1;

    var database = firebase.database();
    var leadsRef = database.ref('withdrawals').child('crypto');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot) {
                var withdrawKey = childSnapshot.child('withdrawKey').val();
                var userEmail = childSnapshot.child('userEmail').val();
                var cryptoNetwork = childSnapshot.child('cryptoNetwork').val();
                var walletAddress = childSnapshot.child('walletAddress').val();
                var withdrawAmount = childSnapshot.child('withdrawAmount').val();
                var recordDate = childSnapshot.child('depositDate').val();

                addCryptoRow(userID, userEmail, cryptoNetwork, walletAddress, withdrawAmount, recordDate, withdrawKey);
                userID++;
            });
        }
    });
}

function addCryptoRow(userID, userEmail, cryptoNetwork, walletAddress, withdrawAmount, recordDate, withdrawKey){
    var row = document.createElement('tr');

    var mID = document.createElement('td');
    mID.innerHTML = userID;
    
    var mEmail = document.createElement('td');
    mEmail.innerHTML = userEmail;

    var mNetwork = document.createElement('td');
    mNetwork.innerHTML = cryptoNetwork;

    var mWallet = document.createElement('td');
    mWallet.innerHTML = walletAddress;

    var mAmount = document.createElement('td');
    mAmount.innerHTML = '$' + withdrawAmount;

    var mDate = document.createElement('td');
    mDate.innerHTML = recordDate;

    var mDelete = document.createElement('td');
    var deleteButton = document.createElement('button');
    deleteButton.id = 'dltButton';
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = function(){
        var confirm = window.confirm('Are you sure about deleting this record ?');
        if(confirm){
            var database = firebase.database();
            var pathRef = database.ref('withdrawals').child('crypto').child(withdrawKey);
            pathRef.remove();
            alert('Record has been deleted from the server');
            fetchCrypto();
        }
    }

    mDelete.append(deleteButton);

    row.append(mID);
    row.append(mEmail);
    row.append(mNetwork);
    row.append(mWallet);
    row.append(mAmount);
    row.append(mDate);
    row.append(mDelete);

    cryptoTable.append(row);
}

function fetchBank(){
    bankTable.innerHTML = '';
    var userID = 1;

    var database = firebase.database();
    var leadsRef = database.ref('withdrawals').child('bank');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot) {
                var recordKey = childSnapshot.child('withdrawKey').val();
                var userEmail = childSnapshot.child('userEmail').val();
                var accountName = childSnapshot.child('accountName').val();
                var bankName = childSnapshot.child('bankName').val();
                var ibanCode = childSnapshot.child('ibanCode').val();
                var swiftCode = childSnapshot.child('swiftCode').val();
                var userCountry = childSnapshot.child('userCountry').val();
                var userCurrency = childSnapshot.child('swiftCode').val();
                var recordAmount = childSnapshot.child('withdrawAmount').val();
                var recordDate = childSnapshot.child('date').val();

                addBankRow(userID, userEmail, accountName, bankName, ibanCode,
                    swiftCode, userCountry, userCurrency, recordDate, recordKey, recordAmount);
                userID++;
            });
        }
    });
}

function addBankRow(userID, userEmail, accountName, bankName,
     ibanCode, swiftCode, userCountry, userCurrency, recordDate, recordKey, recordAmount){
    var row  = document.createElement('tr');
    
    var mID = document.createElement('td');
    mID.innerHTML = userID;

    var mEmail = document.createElement('td');
    mEmail.innerHTML = userEmail;

    var mAcount = document.createElement('td');
    mAcount.innerHTML = accountName;

    var mBank = document.createElement('td');
    mBank.innerHTML = bankName;

    var mIban = document.createElement('td');
    mIban.innerHTML = ibanCode;

    var mSwift = document.createElement('td');
    mSwift.innerHTML = swiftCode;

    var mCountry = document.createElement('td');
    mCountry.innerHTML = userCountry;

    var mCurrency = document.createElement('td');
    mCurrency.innerHTML = userCurrency;

    var mAmount = document.createElement('td');
    mAmount.innerHTML = '$' + recordAmount;

    var mDate = document.createElement('td');
    mDate.innerHTML = recordDate;

    var mDelete = document.createElement('td');
    var deleteButton = document.createElement('button');
    deleteButton.id = 'dltButton';
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = function(){
        var confirm = window.confirm('Are you sure about deleting this record ?');
        if(confirm){
            var database = firebase.database();
            var pathRef = database.ref('withdrawals').child('bank').child(recordKey);
            pathRef.remove();
            alert('Record has been deleted from the server');
            fetchBank();
        }
    }
    mDelete.append(deleteButton);

    row.append(mID);
    row.append(mEmail);
    row.append(mAcount);
    row.append(mBank);
    row.append(mIban);
    row.append(mSwift);
    row.append(mCountry);
    row.append(mCurrency);
    row.append(mAmount);
    row.append(mDate);
    row.append(mDelete);

    bankTable.append(row);
}