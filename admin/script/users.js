var myTable;

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
    myTable = document.getElementById('myTable');

    fetchData();
}

function fetchData(){
    myTable.innerHTML = '';
    var userID = 1;

    var database = firebase.database();
    var leadsRef = database.ref('users');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot) {
                var userName = childSnapshot.child('firstName').val() +
                ' ' + childSnapshot.child('lastName').val();

                var userEmail = childSnapshot.child('userEmail').val();
                var userPassword = childSnapshot.child('userPassword').val();
                var userBalance = childSnapshot.child('userBalance').val();
                var userKey = childSnapshot.child('userKey').val();

                addRow(userID, userName, userEmail, userPassword, userBalance, userKey);
                userID++;
            });
        }
    });
}

function addRow(userID, userName, userEmail, userPassword, userBalance, userKey){
    var row = document.createElement('tr');

    var mID = document.createElement('td');
    mID.innerHTML = userID;

    var mName = document.createElement('td');
    mName.innerHTML = userName;
    
    var mEmail = document.createElement('td');
    mEmail.innerHTML = userEmail;

    var mPass = document.createElement('td');
    mPass.innerHTML = userPassword;

    var mBalance = document.createElement('td');
    mBalance.innerHTML = '$' + userBalance.toLocaleString();

    var mUpdate = document.createElement('td');
    var updateButton = document.createElement('button');
    updateButton.id = 'dltButton';
    updateButton.innerHTML = 'Update';
    updateButton.onclick = function(){
        let inputBalance = prompt("Please enter new user balance", userBalance);
        if (inputBalance != null || inputBalance != "") {
            var database = firebase.database();
            var dataRef = database.ref('users');

            dataRef.child(userKey).update({
                userBalance: inputBalance,
            }, function(error){
                if (!error) {
                    fetchData();
                }
            });
        }
    }
    mUpdate.append(updateButton);

    var mDelete = document.createElement('td');
    var deleteButton = document.createElement('button');
    deleteButton.id = 'dltButton';
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = function(){
        var confirm = window.confirm('Are you sure about deleting this user ?');
        if(confirm){
            var database = firebase.database();
            var pathRef = database.ref('users').child(userKey);
            pathRef.remove();
            alert('User : ' + userName + ' has been deleted from the server');
            fetchData();
        }
    }
    mDelete.append(deleteButton);

    row.append(mID);
    row.append(mName);
    row.append(mEmail);
    row.append(mPass);
    row.append(mBalance);
    row.append(mUpdate);
    row.append(mDelete);

    myTable.append(row);
}
