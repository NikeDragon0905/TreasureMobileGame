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
    var leadsRef = database.ref('deposits');
    leadsRef.once('value', function(snapshot) {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot) {
                var depositKey = childSnapshot.child('depositKey').val();
                var userName = childSnapshot.child('userName').val();
                var userEmail = childSnapshot.child('userEmail').val();
                var depositAmount = childSnapshot.child('depositAmount').val();
                var depositDate = childSnapshot.child('depositDate').val();

                addRow(userID, userName, userEmail, depositAmount, depositDate, depositKey);
                userID++;
            });
        }
    });
}

function addRow(userID, userName, userEmail, depositAmount, depositDate, depositKey){
    var row = document.createElement('tr');

    var mID = document.createElement('td');
    mID.innerHTML = userID;

    var mName = document.createElement('td');
    mName.innerHTML = userName;
    
    var mEmail = document.createElement('td');
    mEmail.innerHTML = userEmail;

    var mPass = document.createElement('td');
    mPass.innerHTML = '$' + depositAmount;

    var mBalance = document.createElement('td');
    mBalance.innerHTML = depositDate;

    var mDelete = document.createElement('td');
    var deleteButton = document.createElement('button');
    deleteButton.id = 'dltButton';
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = function(){
        var confirm = window.confirm('Are you sure about deleting this record ?');
        if(confirm){
            var database = firebase.database();
            var pathRef = database.ref('deposits').child(depositKey);
            pathRef.remove();
            alert('Record has been deleted from the server');
            fetchData();
        }
    }

    mDelete.append(deleteButton);

    row.append(mID);
    row.append(mName);
    row.append(mEmail);
    row.append(mPass);
    row.append(mBalance);
    row.append(mDelete);

    myTable.append(row);
}
